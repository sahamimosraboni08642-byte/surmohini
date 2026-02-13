/* ========= CONFIG (INSERT YOUR API KEYS) ========= */
const HF_API_KEY = "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";
const REPLICATE_API_KEY = "r8_XJcZ999Msmil5p0Pl0uCyAfiSY6mRcd4IaB9C";

/* ========= DOM ELEMENTS ========= */
const audioUpload = document.getElementById("audioUpload");
const taskSelect = document.getElementById("taskSelect");
const conversionBox = document.getElementById("conversionBox");
const processBtn = document.getElementById("processBtn");
const results = document.getElementById("results");

/* ========= SHOW / HIDE CONVERSION FIELDS ========= */
taskSelect.addEventListener("change", () => {
  if (taskSelect.value === "convert") {
    conversionBox.classList.remove("hidden");
  } else {
    conversionBox.classList.add("hidden");
  }
});

/* ========= MAIN PROCESS FUNCTION ========= */
processBtn.addEventListener("click", async () => {
  const file = audioUpload.files[0];

  if (!file) {
    alert("Please select an audio file first!");
    return;
  }

  results.innerHTML = `
    <p style="font-weight:600; color:#2476ff;">Processing... please wait ⏳</p>
  `;

  const task = taskSelect.value;

  if (task === "vocals") {
    processVocals(file);
  } else if (task === "stems") {
    processStems(file);
  } else if (task === "convert") {
    processInstrumentConversion(file);
  }
});

/* ========= HUGGINGFACE: VOCAL REMOVAL ========= */
async function processVocals(file) {
  const endpoint =
    "https://api-inference.huggingface.co/models/lj1995/VoiceFixer";

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${HF_API_KEY}`,
    },
    body: file,
  });

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);

  showResultUI([
    {
      label: "Processed Audio",
      url: url,
      filename: "vocal_removed.wav",
    },
  ]);
}

/* ========= HUGGINGFACE: DEMUCS STEM SEPARATION ========= */
async function processStems(file) {
  const endpoint =
    "https://api-inference.huggingface.co/models/facebook/demucs";

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${HF_API_KEY}`,
    },
    body: file,
  });

  const output = await response.json();

  if (!output.audio) {
    results.innerHTML = `<p>Error: Could not process audio.</p>`;
    return;
  }

  const stems = [
    { label: "Vocals", data: output.audio[0] },
    { label: "Drums", data: output.audio[1] },
    { label: "Bass", data: output.audio[2] },
    { label: "Other", data: output.audio[3] },
  ];

  const resultItems = stems.map((stem, i) => ({
    label: stem.label,
    url: stem.data,
    filename: `${stem.label}.wav`,
  }));

  showResultUI(resultItems);
}

/* ========= REPLICATE: INSTRUMENT → INSTRUMENT CONVERSION ========= */
async function processInstrumentConversion(file) {
  const fromInstrument = document.getElementById("fromInstrument").value;
  const toInstrument = document.getElementById("toInstrument").value;

  if (!fromInstrument || !toInstrument) {
    alert("Please enter both instruments.");
    return;
  }

  const reader = new FileReader();
  reader.onload = async function () {
    const audioBase64 = reader.result.split(",")[1];

    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${REPLICATE_API_KEY}`,
      },
      body: JSON.stringify({
        version:
          "c4873b9d24c64261b2c6ca7c684d5d48f957cf2e8b6a3d0b2713e5a3dd2218fa",
        input: {
          audio: `data:audio/wav;base64,${audioBase64}`,
          prompt: `${fromInstrument} played as ${toInstrument}`,
        },
      }),
    });

    const prediction = await response.json();

    results.innerHTML = `
      <p style="color:#2476ff;">Converting instruments... ⏳</p>
    `;

    // Wait for completion
    let output;
    while (
      prediction.status === "starting" ||
      prediction.status === "processing"
    ) {
      await new Promise((r) => setTimeout(r, 2000));
      const check = await fetch(
        `https://api.replicate.com/v1/predictions/${prediction.id}`,
        {
          headers: {
            Authorization: `Token ${REPLICATE_API_KEY}`,
          },
        }
      );
      output = await check.json();
      if (output.status === "succeeded") break;
    }

    showResultUI([
      {
        label: `Converted (${fromInstrument} → ${toInstrument})`,
        url: output.output.audio,
        filename: "converted.wav",
      },
    ]);
  };

  reader.readAsDataURL(file);
}

/* ========= PROFESSIONAL RESULT UI ========= */
function showResultUI(items) {
  results.innerHTML = "";

  items.forEach((item) => {
    const box = document.createElement("div");
    box.style.background = "#f2f7ff";
    box.style.padding = "15px";
    box.style.border = "1px solid #cfe0ff";
    box.style.borderRadius = "8px";
    box.style.marginBottom = "20px";

    box.innerHTML = `
      <h3 style="color:#2476ff; margin-bottom:8px;">${item.label}</h3>

      <audio controls style="width:100%; margin-bottom:10px;">
        <source src="${item.url}" type="audio/wav">
      </audio>

      <a href="${item.url}" download="${item.filename}">
        <button class="button" style="width:100%;">Download</button>
      </a>
    `;

    results.appendChild(box);
  });
}
