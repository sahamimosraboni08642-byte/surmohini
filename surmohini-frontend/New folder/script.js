const audioInput = document.getElementById("audioInput");
const resultBox = document.getElementById("result");

const backend = "https://surmohini.onrender.com"; // change this

async function sendAudio(endpoint, extra = null) {
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

  const res = await fetch(`${backend}/${endpoint}`, { method: "POST", body: form });
  const blob = await res.blob();

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = endpoint + ".wav";
  link.click();

  resultBox.textContent = "Done! File downloaded.";
}

document.getElementById("separateBtn").onclick = () => sendAudio("separate");
document.getElementById("convertBtn").onclick = () => sendAudio("convert");
document.getElementById("scaleBtn").onclick = () => sendAudio("scale", { gain: 1.2 });
