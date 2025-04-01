#!/bin/bash

# List all files and directories ending with ' 2'
duplicates=$(ls | grep ' 2$')

# Loop through each duplicate and remove it
for item in $duplicates; do
    echo "Removing $item"
    rm -rf "$item"
done

echo "Cleanup completed."
