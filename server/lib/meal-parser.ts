import axios from "axios";

export const parseMealTranscription = async (mealTranscription: string) => {
    const llmMessage = buildLLMMessage(mealTranscription);
    const result = await axios.post("http://host.docker.internal:11434/api/chat", llmMessage);
    
    return result.data.message.content
};

const buildLLMMessage = (mealTranscription: string) => {
    return {
        model: "llama2",
        stream: false,
        format: "json",
        messages: [
            {
                role: "system",
                content: `Create a JSON with all the food that is being mentioned. 
                The JSON should be in the following format and should contain all the food that has been mentioned in the user message: 
                {
                    "foods": [
                        {
                            "name": "Rice",
                            "quantity": 100,
                            "unit": "grams",
                            "brand": "" // if user specifies one, otherwise leave empty
                        },
                        {
                            "name": "Chicken breast",
                            "quantity": 250,
                            "unit": "grams",
                            "brand": ""
                        }
                    ]
                }`
            },
            {
                role: "user",
                content: mealTranscription
            }
        ]
    }
}
