FROM python:3.9-slim
RUN apt-get update && apt-get install -y wget gzip libglib2.0-0
RUN pip install duckdb
WORKDIR /data
COPY . .
VOLUME /data
CMD sh build.sh