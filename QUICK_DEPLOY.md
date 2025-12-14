# Quick Deployment Guide

## Step 1: Host Your Images Online

You need to upload your images and get URLs. Here's the easiest way:

### Upload Images to Telegra.ph:
1. Go to https://telegra.ph
2. Click "New article"
3. Upload your main profile picture: `WhatsApp Image 2025-08-16 at 00.09.18.jpeg`
4. Right-click the uploaded image → "Copy image address"
5. Save this URL - you'll need it for the `PIC` environment variable

### Upload Scroll Message:
1. Go to https://telegra.ph
2. Create a new article
3. Copy and paste the content from `local/birthday-message.txt`
4. Publish the article
5. Copy the article URL (e.g., `https://telegra.ph/your-article-name`)
6. Save this URL - you'll need it for the `SCROLL_MSG` environment variable

## Step 2: Deploy to Vercel (Recommended - Easier)

1. **Push to GitHub** (if not already):
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push
   ```

2. **Go to Vercel**:
   - Visit https://vercel.com
   - Sign up/Login with GitHub
   - Click "Add New Project"
   - Import your repository

3. **Configure**:
   - Framework: Other
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Root Directory: `./` (leave as is)

4. **Add Environment Variables**:
   Click "Environment Variables" and add:
   - `NAME` = `Ritwika` (or your preferred name)
   - `PIC` = `[URL from telegra.ph]` (the image URL you copied)
   - `SCROLL_MSG` = `[telegra.ph article URL]` (the article URL you copied)
   - `HBD_MSG` = `Wishing you a day filled with endless joy, laughter, and all the happiness you deserve! 🎉💖`

5. **Deploy!**
   - Click "Deploy"
   - Wait for build to complete
   - Your site will be live!

## Step 3: Deploy to Netlify (Alternative)

1. **Push to GitHub** (same as above)

2. **Go to Netlify**:
   - Visit https://app.netlify.com
   - Sign up/Login with GitHub
   - Click "Add new site" → "Import an existing project"
   - Select your repository

3. **Configure** (should auto-detect from netlify.toml):
   - Build command: `npm run build`
   - Publish directory: `dist`

4. **Add Environment Variables**:
   - Go to Site settings → Environment variables
   - Add the same variables as above

5. **Deploy!**

## Your Environment Variables Should Look Like:

```
NAME=Ritwika
PIC=https://telegra.ph/file/your-image-id.jpg
SCROLL_MSG=https://telegra.ph/your-article-name
HBD_MSG=Wishing you a day filled with endless joy, laughter, and all the happiness you deserve! 🎉💖
```

## Note About Photos in Gallery

The 4 photos in the gallery are already in `src/resources/img/` and will be included in the build automatically - no need to host them separately!

