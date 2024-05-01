import express, { Request, Response } from "express";
import { getMealAnalysis } from "./lib/analysis";
import { getDb } from "./lib/database";
import { inferenceMealFromTranscription } from "./lib/inference";
import { audioUpload } from "./lib/storage";
import { transcribeAudioFile } from "./lib/transcribe";
import cors from "cors";

const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json()); // Add this line to parse JSON bodies

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

app.post(
  "/meal-analysis",
  audioUpload.single("audio"),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        res.status(400).send("No file uploaded");
        return;
      }

      const db = await getDb();

      const transcription = await transcribeAudioFile(req.file);
      const inferencedMeal = await inferenceMealFromTranscription(
        transcription
      );
      const mealAnalysis = await getMealAnalysis(db, inferencedMeal);

      res.send(mealAnalysis);
    } catch (error) {
      res.status(500).send("An error occurred while processing the meal data");
    }
  }
);

app.post("/transcript-analysis", async (req: Request, res: Response) => {
  try {
    const db = await getDb();

    const transcription = req.body.transcription;
    const inferencedMeal = await inferenceMealFromTranscription(transcription);
    const mealAnalysis = await getMealAnalysis(db, inferencedMeal);

    res.send(mealAnalysis);
  } catch (error) {
    res.status(500).send("An error occurred while processing the meal data");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
