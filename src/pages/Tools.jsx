import React, { useState } from "react";

export default function Tools() {
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);

  async function processAudio(type) {
    if (!file) return alert("Please upload an audio file!");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    setProcessing(true);

    const res = await fetch("/.netlify/functions/processAudio", {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    setResultUrl(data.url);
    setProcessing(false);
  }

  return (
    <div className="max-w-3xl mx-auto py-16">
      <h1 className="text-3xl font-bold text-center">AI Audio Tools</h1>

      <input
        type="file"
        accept="audio/*"
        className="mt-6 w-full"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <button onClick={() => processAudio("vocal_remove")} className="py-3 bg-primary text-white rounded-md">
          Remove Vocals
        </button>
        <button onClick={() => processAudio("stems")} className="py-3 bg-primary text-white rounded-md">
          Split Stems
        </button>
        <button onClick={() => processAudio("convert")} className="py-3 bg-primary text-white rounded-md">
          Convert Instrument
        </button>
      </div>

      {processing && (
        <p className="mt-6 text-center text-primary font-semibold">
          Processing your audio… Please wait.
        </p>
      )}

      {resultUrl && (
        <div className="mt-6 text-center">
          <audio controls src={resultUrl} className="mx-auto"></audio>
          <br />
          <a
            href={resultUrl}
            download
            className="mt-4 inline-block bg-primary text-white px-6 py-2 rounded-md"
          >
            Download Result
          </a>
        </div>
      )}
    </div>
  );
}
