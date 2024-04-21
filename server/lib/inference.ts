import axios from "axios";
import { InferencedMeal } from "./models";

export const inferenceMealFromTranscription = async (
  mealTranscription: string
): Promise<InferencedMeal> => {
  try {
    const llmMessage = buildLLMMessage(mealTranscription);
    const result = await axios.post(
      "http://host.docker.internal:11434/api/chat",
      llmMessage
    );

    return JSON.parse(result.data.message.content);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to parse meal transcription");
  }
};

const buildLLMMessage = (mealTranscription: string) => {
  return {
    model: "llama3",
    stream: false,
    format: "json",
    messages: [
      {
        role: "system",
        content: `Create a JSON with all the food that is being mentioned. 
                The JSON should be in the following format and should contain all the food that has been mentioned in the user message: 
                {
                    "products": [
                        {
                            "name": "Rice",
                            "quantity": 100,
                            "unit": "grams",
                            "quantityGrams": 100,
                            "brand": "" // if user specifies one, otherwise leave empty
                        },
                        {
                            "name": "Chicken breast",
                            "quantity": 250,
                            "unit": "grams",
                            "quantityGrams": 250,
                            "brand": ""
                        },
                        {
                            "name": "Avocado",
                            "quantity": 1,
                            "unit": "piece",
                            "quantityGrams": 230, // if user provides quantity in something else than grams, look up the average weight in grams and multiply by quantity
                            "brand": ""
                        }
                    ]
                }`,
      },
      {
        role: "user",
        content: mealTranscription,
      },
    ],
  };
};
