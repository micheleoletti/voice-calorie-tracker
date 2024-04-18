setup-whisper:
	git submodule add https://github.com/ggerganov/whisper.cpp.git whisper
	sh ./whisper/models/download-ggml-model.sh base.en
	cd whisper && make

start-whisper:
	cd whisper && ./server 

setup-ollama:
	brew install ollama
	ollama pull llama2

start-ollama:
	ollama serve

setup-server:
	mkdir node-server

start-server:
	docker-compose up server --build

# the volume name is strictly defined by the compose file, {project_name}_{service_name}
build-database-volume:
	docker build -t build-duckdb-database ./data
	docker volume create voice-calorie-tracker_duckdb-database
	docker run -v voice-calorie-tracker_duckdb-database:/data build-duckdb-database
	docker run --rm -v voice-calorie-tracker_duckdb-database:/data busybox find /data ! -name 'products.db' -type f -exec rm -f {} +

start-devcontainer:
	docker build -t server-devcontainer ./server
	docker run -it -v ./server:/app -w /app -p 3000:3000 server-devcontainer
