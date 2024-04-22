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
        content: `Carefully review the user's message and create a JSON listing every food item mentioned. 
                  Use standard terms like 'chicken breast' instead of 'chopped chicken breast' and convert all quantities to grams if possible.
                  For each mentioned item, even if it is unclear, include it in the list with your best guess. 
                  If the user mentions a quantity in another unit, convert it to grams using standard conversion rates (e.g., 1 piece of avocado approximately equals 230 grams).
                  Include brands only if the user specifies. Ensure no food item is omitted, regardless of how briefly it's mentioned.

                  Example format for the JSON:
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
                            "quantityGrams": 230,
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
