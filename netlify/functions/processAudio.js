import Replicate from "replicate";
import fs from "fs";
import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req, res) => {
  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    const type = fields.type;
    const audioPath = files.file.filepath;

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN
    });

    let model = "";
    if (type === "vocal_remove") model = "htdemucs/htdemucs";
    if (type === "stems") model = "htdemucs/htdemucs";
    if (type === "convert") model = "riffusion/riffusion";

    const output = await replicate.run(model, {
      input: {
        audio: fs.createReadStream(audioPath)
      }
    });

    res.status(200).json({ url: output.audio || output });
  });
};
