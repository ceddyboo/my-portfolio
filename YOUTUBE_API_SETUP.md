# YouTube Data API v3 Setup Guide

This guide will help you set up the YouTube Data API v3 to fetch videos from Cole the Cornstar's channel.

## Prerequisites

1. A Google Cloud Platform account
2. A project in Google Cloud Console
3. YouTube Data API v3 enabled

## Step-by-Step Setup

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note your Project ID

### 2. Enable YouTube Data API v3

1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "YouTube Data API v3"
3. Click on it and press "Enable"

### 3. Create API Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the generated API key
4. (Optional) Click "Restrict Key" to limit usage to YouTube Data API v3

### 4. Add API Key to Environment Variables

Add your YouTube API key to your `.env.local` file:

```bash
# YouTube Data API v3 Key
YOUTUBE_API_KEY=your_actual_api_key_here
```

### 5. Restart Development Server

After adding the API key, restart your Next.js development server:

```bash
npm run dev
```

## API Usage

The application will automatically:

1. **Fetch Cole's channel videos** starting from "Why I Stopped Restoring My House"
2. **Display videos in a 3x3 grid** with pagination
3. **Show video thumbnails, titles, and metadata**
4. **Enable lazy loading** for performance
5. **Provide smooth pagination** through older videos

## Features

### Video Display
- **Thumbnails**: High-quality video thumbnails
- **Titles**: Full video titles with truncation
- **Metadata**: View count, duration, and publish date
- **Hover effects**: Play button overlay and scaling

### Pagination
- **9 videos per page** (3x3 grid)
- **Next/Previous buttons** with smooth transitions
- **Page indicators** showing current page
- **Loading states** during data fetching

### Performance
- **Lazy loading** of images and data
- **Server-side API calls** for better performance
- **Error handling** with fallback states
- **Optimized animations** with Framer Motion

## Channel Information

- **Channel ID**: `UCgYz_ftT3T5hqFfLm8gQzNQ` (Cole the Cornstar)
- **Starting Video**: "Why I Stopped Restoring My House"
- **Sort Order**: Newest to oldest
- **Max Results**: 9 videos per page

## Error Handling

The application handles various error scenarios:

1. **API Key Missing**: Shows error message
2. **API Quota Exceeded**: Graceful fallback
3. **Network Errors**: Retry mechanism
4. **Invalid Channel**: Fallback to placeholder data

## Rate Limits

YouTube Data API v3 has the following limits:
- **Quota**: 10,000 units per day (free tier)
- **Requests**: ~1,000 requests per day
- **Cost**: $5 per 1,000 additional requests

## Troubleshooting

### Common Issues

1. **"API key not configured"**
   - Check that `YOUTUBE_API_KEY` is set in `.env.local`
   - Restart the development server

2. **"Failed to fetch videos"**
   - Verify API key is correct
   - Check API quota usage
   - Ensure YouTube Data API v3 is enabled

3. **"Channel not found"**
   - Verify channel ID is correct
   - Check channel privacy settings

4. **"Quota exceeded"**
   - Monitor usage in Google Cloud Console
   - Consider upgrading to paid tier

### Debug Mode

To enable debug logging, add to your `.env.local`:

```bash
DEBUG_YOUTUBE_API=true
```

## Security Notes

1. **Never commit API keys** to version control
2. **Use environment variables** for all sensitive data
3. **Restrict API keys** to specific domains/IPs
4. **Monitor usage** regularly in Google Cloud Console

## Production Deployment

For production deployment:

1. **Set environment variables** in your hosting platform
2. **Configure API key restrictions** for your domain
3. **Monitor API usage** and costs
4. **Implement caching** for better performance
5. **Add error monitoring** for API failures

## Support

If you encounter issues:

1. Check the [YouTube Data API v3 documentation](https://developers.google.com/youtube/v3)
2. Review [Google Cloud Console](https://console.cloud.google.com/) for quota and usage
3. Check the application logs for detailed error messages 