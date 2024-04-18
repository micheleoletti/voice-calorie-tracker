import express, { Request, Response } from "express";
import { transcribeAudioFile } from "./lib/transcribe";
import { parseMealTranscription } from "./lib/meal-parser";
import { audioUpload } from "./lib/storage";

const app = express();
const PORT = 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

app.post(
  "/meal",
  audioUpload.single("audio"),
  async (req: Request, res: Response) => {
    if (!req.file) {
      res.status(400).send("No file uploaded");
      return;
    }

    const transcription = await transcribeAudioFile(req.file);
    const data = await parseMealTranscription(transcription);

    res.send(data);
  }
);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
