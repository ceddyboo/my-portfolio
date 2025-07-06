# Quick Setup Guide

## YouTube API Setup

To see real YouTube videos instead of demo data:

1. **Get a YouTube API Key:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable the YouTube Data API v3
   - Create credentials (API Key)

2. **Add to Environment:**
   - Create or edit `.env.local` in your project root
   - Add: `YOUTUBE_API_KEY=your_api_key_here`

3. **Restart the dev server:**
   ```bash
   npm run dev
   ```

## Current Status

- ✅ Demo videos showing (fallback data)
- ❌ YouTube API not configured
- ✅ Contact form working
- ✅ All pages loading correctly

## Files to Check

- `YOUTUBE_API_SETUP.md` - Detailed API setup instructions
- `.env.local` - Add your API key here
- `app/work/[client]/page.tsx` - Client work page with video grid

The demo videos will automatically be replaced with real YouTube data once the API key is configured! 