# Contact Form Setup Guide

This guide will help you set up the contact form functionality with Resend email service.

## Prerequisites

1. A Resend account (https://resend.com)
2. A verified domain (optional, but recommended for production)

## Setup Steps

### 1. Install Dependencies

The Resend package has already been installed:
```bash
npm install resend
```

### 2. Get Your Resend API Key

1. Go to https://resend.com and create an account
2. Navigate to the API Keys section
3. Create a new API key
4. Copy the API key

### 3. Set Up Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Resend API Key - Get this from https://resend.com/api-keys
RESEND_API_KEY=your_resend_api_key_here

# Update these with your actual email and domain
CONTACT_EMAIL=your-email@example.com
FROM_EMAIL=noreply@yourdomain.com
```

**Important Notes:**
- Replace `your_resend_api_key_here` with your actual Resend API key
- Replace `your-email@example.com` with the email where you want to receive contact form submissions
- Replace `noreply@yourdomain.com` with your verified domain email (or use a Resend-provided email for testing)

### 4. Domain Verification (Recommended for Production)

For production use, you should verify your domain with Resend:

1. In your Resend dashboard, go to Domains
2. Add your domain
3. Follow the DNS verification steps
4. Once verified, update the `FROM_EMAIL` in your `.env.local` file

### 5. Testing

1. Start your development server: `npm run dev`
2. Navigate to your contact form
3. Fill out and submit the form
4. Check your email for the submission

### 6. Vercel Deployment

When deploying to Vercel:

1. Add your environment variables in the Vercel dashboard:
   - Go to your project settings
   - Navigate to Environment Variables
   - Add `RESEND_API_KEY`, `CONTACT_EMAIL`, and `FROM_EMAIL`

2. Deploy your project

## Features

The contact form includes:

- **Server-side validation** for all fields
- **Email validation** with regex pattern matching
- **Loading states** with spinner animation
- **Success/error feedback** with styled messages
- **Form reset** on successful submission
- **Responsive design** that works on all devices
- **Accessibility features** with proper labels and ARIA attributes

## API Endpoint

The contact form submits to `/api/contact` which:

- Validates all input fields
- Sends an email via Resend
- Returns JSON responses for success/error states
- Includes proper error handling

## Email Template

The email template includes:
- Professional styling with your brand colors
- All form field data
- Project type categorization
- Contact information
- Professional footer

## Troubleshooting

### Common Issues

1. **"Failed to send email" error**
   - Check your Resend API key is correct
   - Verify your domain is properly configured
   - Check Resend dashboard for any errors

2. **Environment variables not working**
   - Ensure `.env.local` is in the project root
   - Restart your development server after adding environment variables
   - Check variable names match exactly

3. **Form not submitting**
   - Check browser console for JavaScript errors
   - Verify the API route is accessible
   - Check network tab for request/response details

### Support

If you encounter issues:
1. Check the browser console for errors
2. Check the server logs for API errors
3. Verify your Resend account status
4. Test with a simple email first

## Security Notes

- The API key is stored securely in environment variables
- Server-side validation prevents malicious input
- Rate limiting is recommended for production use
- Consider adding CAPTCHA for additional spam protection 