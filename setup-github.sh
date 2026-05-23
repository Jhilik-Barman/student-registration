#!/bin/bash

# ============================================================
# GitHub Repository Setup Script
# Run this from INSIDE the student-registration folder
# ============================================================

echo ""
echo "🎓 Student Registration — GitHub Setup"
echo "======================================="
echo ""

# Step 1: Initialize git
git init
echo "✅ Git initialized"

# Step 2: Create .gitignore if not present (safety)
if [ ! -f .gitignore ]; then
  echo "node_modules/" > .gitignore
  echo ".env" >> .gitignore
  echo "dist/" >> .gitignore
fi

# Step 3: Add all files
git add .
git commit -m "Initial commit: Student Registration (React + Node + MongoDB)"
echo "✅ Files committed"

# Step 4: Ask for GitHub username and repo name
echo ""
read -p "Enter your GitHub username: " GH_USER
read -p "Enter the repository name (e.g. student-registration): " REPO_NAME

# Step 5: Set remote origin
git remote add origin "https://github.com/$GH_USER/$REPO_NAME.git"
git branch -M main

echo ""
echo "📋 Next steps:"
echo "  1. Go to https://github.com/new"
echo "  2. Create a repo named: $REPO_NAME"
echo "  3. Do NOT add README, .gitignore, or license (we already have them)"
echo "  4. Then run:  git push -u origin main"
echo ""
echo "Or use GitHub CLI (gh) if installed:"
echo "  gh repo create $REPO_NAME --public --source=. --remote=origin --push"
echo ""
