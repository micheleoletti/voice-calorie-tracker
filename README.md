# Voice Calorie Counter

Calorie counter that allows to input meals with a voice message like you would tell a friend, instead of having to manually select each item and quantity.

Because the user will just describe in words what they ate, the app will look up foods in a generic way and precision may suffer, but I believe that the convenience of having an easy and fast way to log a meal will outweight the loss in precision.

The goal is to reduce the friction in building and maintaining the habit of calorie tracking.

## Plan

The overrall plan is pretty simple:

1. AUDIO
2. TTS (Whisper)
3. TEXT
4. NLP (ollama + llama2)
5. JSON with all meal items
6. check nutrients for each meal item on the Open Food Data DB
7. JSON with nutrients
8. display data

## TODO

### Backend

- [x] setup TTS (Whisper)
- [x] setup NLP (ollama + llama2)
- [x] setup main endpoint (FastAPI)
- [ ] use pandas to find out which columns are the most populated
- [ ] create script to download data and recreate DB
- [ ] setup Open Food Data dump locally (go for DuckDB, for read only db is enough)
- [ ] prototype whole pipeline
- [ ] optimize latency, dockerized LLMs are way too slow, either leave Docker or prepare Dockerfiles to be deployed on Linux machines with GPUs

### Frontend

- [ ] app views mockups
- [ ] ... create React Native app 🤔
