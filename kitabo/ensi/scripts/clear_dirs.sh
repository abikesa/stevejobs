#!/bin/bash

# Change to the morality directory
# cd morality

# Loop through all items in the directory
for item in *; do
    # Check if the item is a directory and not "kitabo"
    if [ -d "$item" ] && [ "$item" != "kitabo" ]; then
        # Remove all contents of the directory
        rm -rf "$item"/*
        echo "Deleted contents of $item"
    fi
done

echo "Finished deleting directory contents"
