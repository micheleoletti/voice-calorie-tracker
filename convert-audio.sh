#!/bin/bash

# Check if exactly one argument is provided
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <input_file>"
    exit 1
fi

# Extract the input file name without its extension
input_file="$1"
output_file="${input_file%.*}.wav"

# Convert the file using Docker
docker run --rm -v "$(pwd):/workspace" jrottenberg/ffmpeg -i "/workspace/$input_file" -ar 16000 -ac 1 -c:a pcm_s16le "/workspace/$output_file"

# Convert the file locally, goes from ~400ms to ~100ms
# ffmpeg -i "$input_file" -ar 16000 -ac 1 -c:a pcm_s16le "$output_file"

echo "Converted $input_file to $output_file"

rm "$output_file"
echo "Removed output file $output_file"
