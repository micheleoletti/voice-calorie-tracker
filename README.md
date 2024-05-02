# Voice Calorie Tracker

Calorie tracker that allows to input meals with a voice message like you would tell a friend, instead of having to manually select each item and quantity.

Because the user will just describe in words what they ate, the app will look up foods in a generic way and precision may suffer, but I believe that the convenience of having an easy and fast way to log a meal will outweight the loss in precision.

The goal is to reduce the friction in building and maintaining the habit of calorie tracking.

## Plan

<img width="1089" alt="image" src="https://github.com/micheleoletti/voice-calorie-tracker/assets/61937589/af74783a-fc80-435e-9559-84d9a7f09aba">

The overrall plan is pretty simple:

1. AUDIO
2. TTS (Whisper)
3. TEXT
4. NLP (ollama + phi3)
5. JSON with all meal items
6. check nutrients for each meal item on the Open Food Data DB
7. JSON with nutrients
8. display data

## Current status

The endpoint is working quite well with simple organic foods and specific quantity in grams.

Example:
`"I ate 100 grams of white rice, 130 grams of chicken breast, 30g of avocado and 60g of nuts"`

| Source                      | Kcal     | Prot   | Carbs  | Fat    |
| --------------------------- | -------- | ------ | ------ | ------ |
| MyFitnessPal (manual input) | 1025     | 55     | 89     | 51     |
| **voice-based endpoint**    | **1012** | **50** | **92** | **50** |

The next goals are:

- support the quantity being expressed in a more natural way, like "2 apples and 1lt of coke", without having to specify the exact grams
- support branded food (right now the model is not able to set the "brand" field correctly, improve prompt or change data shape)
- GROQ support for production... 🤔

## TODO

- [x] setup TTS (Whisper.cpp)
- [x] setup NLP (ollama + phi3)
- [x] setup main endpoint (Express.js)
- [x] create script to download data and recreate DB
- [x] setup Open Food Data dump locally (go for DuckDB, for read only db is enough)
- [x] prototype whole pipeline
- [x] optimize latency by running whisper and ollama locally
- [x] clean food data/find a better query to avoid incomplete records
- [x] create benchmark and optimize accuracy.
      Currently simple queries like "chicken breast" do not get the raw simple chicken breast values, but get pre-packaged chopped chicken breast instead.
      Analyze the database and create a query that defaults to simple food in case of ambiguity
      (used nova_group=1 for aim for organic unbranded products)
- [ ] unit/e2e tests
- [ ] supports other units of measure othen than "grams".
      I already tried but the model refuses to add another field with the average weight of 1 piece of the mentioned product.
      I will try to achieve by moving to an agent-based approach, where 1 agent is responsible for enriching the food JSON with the average weight of the specified product.
