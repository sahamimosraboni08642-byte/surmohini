const audioInput = document.getElementById("audioInput");
const resultBox = document.getElementById("result");

const backend = "https://surmohini.onrender.com";

// TEMPORARY SUBSCRIBER TOKEN
const SUB_TOKEN = "SUBSCRIBER123";

// -------------------------
// Helper: Call backend API
// -------------------------
async function sendAudio(endpoint, extra = null, fullAccess = false) {
  if (!audioInput.files[0]) {
    alert("Please upload an audio file first.");
    return;
  }

  const form = new FormData();
  form.append("audio", audioInput.files[0]);

  if (extra) {
    Object.keys(extra).forEach(k => form.append(k, extra[k]));
  }

  resultBox.textContent = "Processing… Please wait.";

  const options = {
    method: "POST",
    body: form
  };

  // Only add token for full-download routes
  if (fullAccess) {
    options.headers = { Authorization: "Bearer " + SUB_TOKEN };
  }

  const res = await fetch(`${backend}/${endpoint}`, options);

  if (res.status === 403) {
    alert("You must subscribe to use this feature.");
    resultBox.textContent = "Subscription required.";
    return;
  }

  const blob = await res.blob();

  // Preview needs to play audio, not download
  if (endpoint === "preview") {
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.play();
    resultBox.textContent = "Playing 30-second preview…";
    return;
  }

  // Full downloads
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = endpoint + ".wav";
  link.click();

  resultBox.textContent = "Done! File downloaded.";
}

// -------------------------
// Button handlers
// -------------------------

// FREE preview
document.getElementById("previewBtn").onclick = () =>
  sendAudio("preview");

// FULL DOWNLOAD (subscription protected)
document.getElementById("separateBtn").onclick = () =>
  sendAudio("separate", null, true);

document.getElementById("convertBtn").onclick = () =>
  sendAudio("convert", null, true);

// Volume scaling
document.getElementById("scaleBtn").onclick = () =>
  sendAudio("scale", { gain: 1.2 }, true);

// Pitch shifting
document.getElementById("pitchBtn").onclick = () => {
  const pitch = document.getElementById("pitchSlider").value;
  sendAudio("pitch", { pitch }, true);
};
