#!/bin/bash

# MemeScout Showcase - Deployment Script for GitHub Pages
# This script helps deploy the showcase website to GitHub Pages

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║   🚀 MemeScout Showcase - GitHub Pages Deployment           ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Check if we're in the showcase directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: Please run this script from the showcase directory"
    echo "   cd showcase && ./deploy.sh"
    exit 1
fi

echo "Please choose a deployment option:"
echo ""
echo "1) Deploy to a new repository (meme-coin-showcase)"
echo "2) Deploy to gh-pages branch of existing repo"
echo "3) Copy to docs/ folder in main repo"
echo ""
read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo ""
        echo "📦 Option 1: New Repository Deployment"
        echo "----------------------------------------"
        echo ""
        echo "Steps to follow:"
        echo "1. Create a new repository on GitHub named 'meme-coin-showcase'"
        echo "2. Run these commands:"
        echo ""
        echo "   git init"
        echo "   git add ."
        echo "   git commit -m 'Initial showcase website'"
        echo "   git branch -M main"
        echo "   git remote add origin https://github.com/prateeekphukar/meme-coin-showcase.git"
        echo "   git push -u origin main"
        echo ""
        echo "3. Go to repository Settings → Pages"
        echo "4. Set Source to: main branch / root"
        echo "5. Your site will be live at: https://prateeekphukar.github.io/meme-coin-showcase/"
        echo ""
        read -p "Do you want to initialize git now? (y/n): " init_git
        if [ "$init_git" = "y" ]; then
            git init
            git add .
            git commit -m "Initial showcase website"
            git branch -M main
            echo ""
            echo "✅ Git repository initialized!"
            echo "⚠️  Remember to add the remote and push:"
            echo "   git remote add origin https://github.com/prateeekphukar/meme-coin-showcase.git"
            echo "   git push -u origin main"
        fi
        ;;
    
    2)
        echo ""
        echo "📦 Option 2: gh-pages Branch Deployment"
        echo "----------------------------------------"
        echo ""
        read -p "Do you want to create gh-pages branch and push? (y/n): " create_branch
        if [ "$create_branch" = "y" ]; then
            git init
            git add .
            git commit -m "Add showcase website"
            git checkout -b gh-pages
            echo ""
            echo "✅ gh-pages branch created!"
            echo "⚠️  Remember to add the remote and push:"
            echo "   git remote add origin https://github.com/prateeekphukar/meme-coin-backend.git"
            echo "   git push origin gh-pages"
            echo ""
            echo "Then enable GitHub Pages with: gh-pages branch / root"
        fi
        ;;
    
    3)
        echo ""
        echo "📦 Option 3: docs/ Folder Deployment"
        echo "-------------------------------------"
        echo ""
        cd ..
        if [ -d "docs" ]; then
            echo "⚠️  docs/ folder already exists"
            read -p "Do you want to replace it? (y/n): " replace
            if [ "$replace" = "y" ]; then
                rm -rf docs
                mv showcase docs
                echo "✅ Moved showcase to docs/"
            else
                echo "❌ Cancelled"
                exit 0
            fi
        else
            mv showcase docs
            echo "✅ Moved showcase to docs/"
        fi
        
        echo ""
        echo "Now run:"
        echo "   git add docs"
        echo "   git commit -m 'Add showcase website'"
        echo "   git push"
        echo ""
        echo "Then go to repository Settings → Pages"
        echo "Set Source to: main branch / docs"
        ;;
    
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║   ✅ Deployment prepared!                                    ║"
echo "║                                                              ║"
echo "║   Don't forget to:                                          ║"
echo "║   1. Push your changes to GitHub                            ║"
echo "║   2. Enable GitHub Pages in repository settings             ║"
echo "║   3. Wait 1-2 minutes for deployment                        ║"
echo "║                                                              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
