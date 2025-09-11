# Twitter API Setup Guide

## Getting Twitter API Access

### Step 1: Apply for Twitter Developer Account
1. Go to [https://developer.twitter.com/](https://developer.twitter.com/)
2. Sign in with your Twitter account
3. Apply for a developer account
4. Fill out the application form explaining your use case

### Step 2: Create a Twitter App
1. Once approved, go to the [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Click "Create App" or "New Project"
3. Fill in the app details:
   - App name: "NECTR Token Ecosystem"
   - App description: "A decentralized application for healthcare rewards using blockchain technology"
   - Website URL: Your app URL or localhost for development
   - Callback URL: Not required for this use case

### Step 3: Get API Keys
1. In your app dashboard, go to "Keys and Tokens"
2. Generate a **Bearer Token** (this is what we need)
3. Copy the Bearer Token

### Step 4: Configure Environment Variables
1. Add the Bearer Token to your `.env` file:
```bash
NEXT_PUBLIC_TWITTER_BEARER_TOKEN=your_bearer_token_here
```

### Step 5: Test the Integration
1. Restart your development server: `npm run dev`
2. Navigate to the Social Feed section
3. You should see real tweets containing "NECTR" or related terms

## API Endpoints Used

### Recent Tweet Search
- **Endpoint**: `https://api.twitter.com/2/tweets/search/recent`
- **Query**: `NECTR OR #NECTR OR "NECTR Token" OR "NECTR ecosystem"`
- **Fields**: `created_at,public_metrics,author_id`
- **Expansions**: `author_id`
- **User Fields**: `username,name,verified,profile_image_url`

## Rate Limits

### Twitter API v2 Free Tier
- **Tweet Search**: 300 requests per 15-minute window
- **User Lookup**: 300 requests per 15-minute window

### Optimization Tips
1. The app fetches tweets every 30 seconds
2. Caches results to minimize API calls
3. Falls back to mock data if API fails
4. Only searches for relevant NECTR-related content

## Troubleshooting

### Common Issues

1. **"Twitter Bearer Token not found"**
   - Make sure `NEXT_PUBLIC_TWITTER_BEARER_TOKEN` is set in your `.env` file
   - Restart your development server after adding the token

2. **"Twitter API error: 401 Unauthorized"**
   - Check if your Bearer Token is correct
   - Ensure your Twitter app has the right permissions

3. **"Twitter API error: 429 Too Many Requests"**
   - You've hit the rate limit
   - The app will automatically fall back to mock data
   - Wait 15 minutes before trying again

4. **"No tweets found"**
   - This is normal if there are no recent tweets about NECTR
   - The app will show mock data as fallback

### Testing Without Twitter API
If you don't have Twitter API access yet, the app will automatically use mock data that simulates real Twitter behavior.

## Security Notes

1. **Never commit your Bearer Token to version control**
2. **Use environment variables for all API keys**
3. **The Bearer Token is safe to use in frontend code** (it's read-only)
4. **Consider using a backend proxy** for production to hide API keys

## Production Considerations

For production deployment:
1. Set up a backend API to proxy Twitter requests
2. Implement proper error handling and retry logic
3. Consider using Twitter's streaming API for real-time updates
4. Implement caching to reduce API calls
5. Monitor rate limits and usage

## Alternative: Twitter Embed Widget

If you prefer not to use the API, you can also embed Twitter widgets:

```html
<a class="twitter-timeline" 
   href="https://twitter.com/NECTRToken" 
   data-tweet-limit="5">
   Tweets by NECTRToken
</a>
<script async src="https://platform.twitter.com/widgets.js"></script>
```

This approach doesn't require API keys but is less customizable.
