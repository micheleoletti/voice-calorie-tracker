import FormData from "form-data";
import axios from "axios";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";

export const transcribeAudioFile = async (
  audio: Express.Multer.File
): Promise<string> => {
  const form = await fileAsFormData(audio);

  const result = await axios.post(
    "http://host.docker.internal:8080/inference",
    form,
    {
      headers: form.getHeaders(),
      timeout: 10000,
    }
  );

  return result.data.text;
};

const fileAsFormData = async (file: Express.Multer.File) => {
  const formData = new FormData();
  const convertedFilePath = await convertAudioFilePathToWav(file.path);
  const convertedFile = fs.createReadStream(convertedFilePath);

  formData.append("file", convertedFile, {
    filename: convertedFilePath.split("/").pop(),
    contentType: "audio/wav",
  });

  // await cleanupFiles(file.path, convertedFilePath);

  return formData;
};

const convertAudioFilePathToWav = async (filePath: string) => {
  const convertedPath = filePath.replace(/\.[^/.]+$/, "-converted.wav");

  await new Promise((resolve, reject) => {
    ffmpeg(filePath)
      .audioCodec("pcm_s16le")
      .audioFrequency(16000)
      .audioChannels(1)
      .format("wav")
      .on("end", () => {
        resolve(true);
      })
      .on("error", (err) => {
        reject(err);
      })
      .save(convertedPath);
  });

  return convertedPath;
};

const cleanupFiles = async (
  originalFilePath: string,
  convertedFilePath: string
) => {
  try {
    await fs.promises.unlink(originalFilePath);
    await fs.promises.unlink(convertedFilePath);
  } catch (error) {
    console.error("Error cleaning up files:", error);
  }
};
