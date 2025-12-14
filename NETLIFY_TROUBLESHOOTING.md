# Netlify Build Troubleshooting

## Common Build Errors and Solutions

### Error: "Command failed with exit code 1"

This usually means one of these issues:

#### 1. Missing Environment Variables
**Solution**: Make sure you've set ALL required environment variables in Netlify:
- Go to Site settings → Environment variables
- Add:
  - `NAME` = `Ritwika` (or your name)
  - `PIC` = `https://telegra.ph/file/your-image-id.jpg` (full URL)
  - `SCROLL_MSG` = `https://telegra.ph/your-article-name` (optional, but if set, must be valid)
  - `HBD_MSG` = `Your message here` (optional)

#### 2. Invalid Image URL
**Solution**: 
- Make sure `PIC` is a valid, accessible URL
- Test the URL in your browser - it should directly show/download the image
- Use HTTPS URLs (not HTTP)
- Make sure the image is publicly accessible (not behind authentication)

#### 3. Sharp Native Dependencies Issue
**Solution**: 
- Netlify should handle this automatically, but if it fails:
  - The build uses Node 18 (set in `.nvmrc`)
  - Sharp should install correctly with `--legacy-peer-deps` flag

#### 4. Network Timeout
**Solution**:
- Make sure your image URLs are accessible
- If using telegra.ph, make sure the links are correct
- The build script now has 30-second timeouts

## How to Debug

1. **Check Build Logs**:
   - Go to Netlify dashboard → Deploys → Click on failed build
   - Look for error messages in the logs
   - The improved error handling will show where it fails

2. **Test Locally First**:
   ```bash
   # Set environment variables
   export NAME="Ritwika"
   export PIC="https://your-image-url.jpg"
   export SCROLL_MSG="https://telegra.ph/your-article"
   
   # Test build
   npm run build
   ```

3. **Verify Environment Variables**:
   - In Netlify dashboard, go to Site settings → Environment variables
   - Make sure all variables are set correctly
   - Check for typos in variable names (they're case-sensitive)

## Quick Fix Checklist

- [ ] All environment variables are set in Netlify
- [ ] `PIC` URL is valid and accessible
- [ ] `SCROLL_MSG` URL is valid (if set)
- [ ] Image URLs use HTTPS
- [ ] No typos in environment variable names
- [ ] Build command is: `npm install && npm run build`

## Alternative: Use Vercel

If Netlify continues to have issues, Vercel might work better:
- Vercel has better Sharp support
- Similar setup process
- See `QUICK_DEPLOY.md` for Vercel instructions

