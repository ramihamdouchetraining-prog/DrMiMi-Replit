# 🔐 CORS Configuration Guide

## Overview

The backend server's CORS (Cross-Origin Resource Sharing) configuration has been updated to support:
- Hardcoded production and development origins
- Dynamic environment variable configuration
- Automatic support for Vercel preview deployments

## Configuration Details

### Allowed Origins

The server automatically allows requests from:

1. **Development environments:**
   - `http://localhost:5000`
   - `http://localhost:5173`

2. **Production deployments:**
   - `https://dr-mimi.netlify.app` (Netlify)
   - `https://dr-mi-mi-replit.vercel.app` (Vercel production)
   - `https://drmimi-replit.onrender.com` (Render backend)

3. **Vercel preview deployments:**
   - Any `*.vercel.app` subdomain (e.g., `https://dr-mi-mi-replit-xyz123.vercel.app`)
   - This automatically supports all Vercel preview URLs without manual configuration

4. **Environment variable:**
   - Any URL specified in the `FRONTEND_URL` environment variable

5. **No origin:**
   - Requests without an origin header (mobile apps, Postman, API clients)

### How It Works

The CORS configuration uses a dynamic origin callback function that:

```typescript
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) {
      return callback(null, true);
    }

    // Check if origin is in the allowed list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Allow any Vercel preview deployment (*.vercel.app)
    if (origin.endsWith('.vercel.app')) {
      console.log(`✅ CORS: Allowing Vercel preview URL: ${origin}`);
      return callback(null, true);
    }

    // Origin not allowed
    console.warn(`⚠️ CORS: Origin blocked: ${origin}`);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));
```

## Environment Variables

### FRONTEND_URL

You can add additional allowed origins using the `FRONTEND_URL` environment variable on Render:

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Select your backend service
3. Navigate to **Environment** tab
4. Add or edit `FRONTEND_URL` variable:
   ```
   FRONTEND_URL=https://your-custom-domain.com
   ```
5. Click **Save Changes**
6. Wait 2 minutes for the service to restart

**Note:** This is optional. The server already supports all Vercel preview URLs automatically.

## Benefits

### ✅ Automatic Vercel Preview Support

Previously, each Vercel preview deployment URL had to be manually added to the CORS configuration. Now:

- **Before:** `https://dr-mi-mi-replit-abc123.vercel.app` → ❌ CORS blocked
- **After:** `https://dr-mi-mi-replit-abc123.vercel.app` → ✅ Automatically allowed

### ✅ Improved Developer Experience

- No need to update backend configuration for each preview deployment
- Developers can test PRs immediately without CORS issues
- Production URLs remain explicitly whitelisted for security

### ✅ Security

- Random domains are still blocked
- Only legitimate Vercel deployments are allowed
- Explicit whitelist for production URLs
- Logging for monitoring blocked origins

## Troubleshooting

### CORS Error in Browser Console

If you see CORS errors:

1. **Check the origin:** Open browser console (F12) and look for the blocked origin URL
2. **Verify it's a supported pattern:**
   - Is it `localhost:5000` or `localhost:5173`?
   - Does it end with `.vercel.app`?
   - Is it in the allowed origins list?
3. **Check backend logs:** The server logs blocked origins with `⚠️ CORS: Origin blocked:`
4. **Clear cache:** Try Ctrl+Shift+R (hard refresh) in the browser

### Adding a Custom Domain

If you're using a custom domain (not Vercel, Netlify, or localhost):

1. Set the `FRONTEND_URL` environment variable on Render
2. Restart the backend service
3. Test the connection

### Vercel Preview URLs Still Blocked

This shouldn't happen with the new configuration, but if it does:

1. Verify the origin ends with `.vercel.app`
2. Check backend logs for the exact origin being blocked
3. Ensure you've deployed the latest backend code to Render

## Testing

To test the CORS configuration:

```bash
# Test with curl
curl -H "Origin: https://dr-mi-mi-replit-test123.vercel.app" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://drmimi-replit.onrender.com/api/health \
     -v
```

You should see `Access-Control-Allow-Origin` in the response headers.

## Migration Notes

### For Existing Deployments

No action required! The new configuration is backwards compatible:

- All previously hardcoded origins still work
- `FRONTEND_URL` environment variable is optional
- Vercel preview URLs now work automatically

### When to Use FRONTEND_URL

Only set `FRONTEND_URL` if:
- You're using a custom domain (not Vercel, Netlify, or localhost)
- You want to explicitly allow a specific URL not covered by the patterns
- You're migrating to a different hosting provider

Otherwise, the automatic configuration handles everything.

## Related Documentation

- [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md) - Deploying to Vercel
- [FIX_503_CORS.md](./FIX_503_CORS.md) - Troubleshooting 503 and CORS errors
- [CONFIG_CORS_PRODUCTION.md](./CONFIG_CORS_PRODUCTION.md) - Previous CORS configuration

## Summary

✅ **Development:** localhost automatically allowed  
✅ **Production:** Netlify, Vercel, Render automatically allowed  
✅ **Previews:** All Vercel preview URLs automatically allowed  
✅ **Custom:** Use FRONTEND_URL environment variable  
✅ **Security:** Only legitimate origins allowed, others blocked  
