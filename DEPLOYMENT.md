# Deployment Guide

## Prerequisites

For remote deployment, you need to host your images online and get their URLs. Here are your options:

### Option 1: Use Telegra.ph (Free & Easy)
1. Go to https://telegra.ph
2. Upload your images one by one
3. Right-click on each uploaded image and "Copy image address"
4. Use those URLs in your environment variables

### Option 2: Use GitHub (Free)
1. Create a new GitHub repository
2. Upload your images to the repository
3. Use the raw GitHub URLs (e.g., `https://raw.githubusercontent.com/username/repo/main/image.jpg`)

### Option 3: Use Imgur or other image hosting services

## Required Environment Variables

You'll need to set these in your deployment platform:

- **NAME**: Name of the receiver (e.g., "Ritwika")
- **PIC**: URL of the main profile picture
- **NICKNAME**: (Optional) Nickname
- **HBD_MSG**: (Optional) Custom birthday message
- **SCROLL_MSG**: (Optional) URL to the scroll message text file (or telegra.ph article)
- **OPEN_DATE**: (Optional) Date in YYYY-MM-DD format

## Deploying to Netlify

1. **Push your code to GitHub** (if not already done)
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Go to Netlify**
   - Visit https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository

3. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - The `netlify.toml` file is already configured!

4. **Set Environment Variables**
   - Go to Site settings → Environment variables
   - Add all required variables (NAME, PIC, etc.)

5. **Deploy!**
   - Netlify will automatically build and deploy

## Deploying to Vercel

1. **Push your code to GitHub** (if not already done)

2. **Go to Vercel**
   - Visit https://vercel.com
   - Click "Add New Project"
   - Import your GitHub repository

3. **Configure Project**
   - Framework Preset: Other
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - The `vercel.json` file is already configured!

4. **Set Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add all required variables (NAME, PIC, etc.)

5. **Deploy!**
   - Vercel will automatically build and deploy

## Important Notes

- Make sure your images are hosted online (use URLs, not local paths)
- The scroll message file also needs to be hosted online (or use a telegra.ph article URL)
- After deployment, your site will be live at a URL like `your-site.netlify.app` or `your-site.vercel.app`

