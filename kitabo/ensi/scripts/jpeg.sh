#!/bin/bash

# Define the source directory
SOURCE_DIR=~/desktop
OUTPUT_DIR="$SOURCE_DIR/converted_jpegs"

# Create the output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Loop through all .heic files and convert them to .jpeg
for file in "$SOURCE_DIR"/*.HEIC; do
    if [[ -f "$file" ]]; then
        filename=$(basename -- "$file")
        output_filename="${filename%.*}.jpeg"
        output_path="$OUTPUT_DIR/$output_filename"

        echo "Converting $file to $output_path..."
        convert "$file" "$output_path"
    fi
done

echo "All .heic files have been converted to .jpeg in $OUTPUT_DIR."
