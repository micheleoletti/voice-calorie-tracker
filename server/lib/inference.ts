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
    model: "phi3",
    stream: false,
    format: "json",
    messages: [
      {
        role: "system",
        content: `Carefully review the user's message and create a JSON listing every food item mentioned.
                  Unit can be either "g", "ml" or "piece".
                  
                  "averageWeight" is the average weight of a single piece of mentioned food item, the field is present only if "unit" is "piece".
                  It's deadly fatal to omit "averageWeight" if "unit" is "piece"!

                  Avoid duplication and only include items that are mentioned in the user's message.                  
                  For each mentioned item, even if it is unclear, include it in the list with your best guess. 

                  Include brands only if the user specifies. 
                  Ensure no food item is omitted.

                  Example format for the JSON:
                  {
                    "products": [
                        {
                            "name": "Rice",
                            "quantity": 100,
                            "unit": "g",
                            "brand": "" // if user specifies one, otherwise leave empty
                        },
                        {
                            "name": "Chicken breast",
                            "quantity": 250,
                            "unit": "g",
                            "brand": ""
                        },
                        {
                            "name": "Pepsi",
                            "quantity": 50,
                            "unit": "ml",
                            "brand": ""
                        }
                        {
                            "name": "Avocado",
                            "quantity": 1,
                            "unit": "piece",
                            "averageWeight": 500,
                            "brand": ""
                        },
                        {
                          "name": "Apple",
                          "quantity": 2,
                          "unit": "piece",
                          "averageWeight": 80,
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
