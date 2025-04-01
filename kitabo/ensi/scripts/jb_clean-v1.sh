#!/bin/bash

# Define source directories and corresponding destination directories
declare -A DIRS=(
    ["figures"]="_build/html/figures"
    ["pdfs"]="_build/html/pdfs"
    ["media"]="_build/html/media"
    ["act1/app"]="_build/html/act1/app"
    ["data"]="_build/html/data"
    ["testbin"]="_build/html/testbin"
    ["testbin_dec2024"]="_build/html/testbin_dec2024"
    ["nis"]="_build/html/nis"
)

# Iterate over defined directories, ensuring they are created in _build/html
for src in "${!DIRS[@]}"; do
    dest="${DIRS[$src]}"
    
    # Always create the destination directory
    mkdir -p "$dest"
    echo "Created directory: $dest"

    # If source exists, copy files (even if empty)
    if [ -d "$src" ]; then
        cp -r "$src"/* "$dest/" 2>/dev/null || echo "No files to copy from $src"
    else
        echo "Warning: Source directory $src does not exist!"
    fi
done



# Older version of the script

# mkdir -p _build/html/pdfs _build/html/figures _build/html/media _build/html/data _build/html/testbin _build/html/testbin_dec2024 _build/html/nis
# cp -r figures/* _build/html/figures/
# cp -r pdfs/* _build/html/pdfs/
# cp -r media/* _build/html/media/
# cp -r act1/app/* _build/html/act1/app
# cp -r data/* _build/html/data
# cp -r testbin/* _build/html/testbin
# cp -r testbin_dec2024/* _build/html/testbin_dec2024
# cp -r nis/* _build/html/nis



