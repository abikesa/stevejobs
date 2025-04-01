#!/bin/bash

# Prompt for a commit message
echo "Enter your commit message:"
read commit_message

# Wasn't necessarily until 12/2024 upgrade
source ../../../myenv/bin/activate

# Clean the Jupyter Book
jb clean .

# Build the Jupyter Book
jb build .

# Run the jb_clean script
scripts/jb_clean.sh

# Import the built HTML to the gh-pages branch
ghp-import -n -p -f _build/html

# Navigate to the root directory of the git repository
cd ../..

# Stage all changes
git add .

# Commit with the provided commit message
git commit -m "$commit_message"

# Optionally push changes to the remote repository (uncomment if needed)
git push
