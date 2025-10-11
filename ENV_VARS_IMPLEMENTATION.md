# 🔐 Environment Variables Implementation Guide

## ✅ What Was Fixed

### Problem
The `render.yaml` file was configured with incorrect environment variable names:
- ❌ `OWNER_PASSWORD_HASH` (incorrect)
- ❌ `ADMIN_PASSWORD_HASH` (incorrect)

But the actual code in the seed scripts expected:
- ✅ `OWNER_PASSWORD` (correct)
- ✅ `ADMIN_PASSWORD` (correct)

This mismatch caused admin and owner accounts to not be created properly during deployment.

### Solution
Updated all configuration files to use the correct variable names that match the code implementation.

---

## 📋 Required Environment Variables

### For Development (.env file)
```env
# Database Configuration (PostgreSQL)
DATABASE_URL=postgresql://username:password@host:port/database

# Session Secret (min 32 characters)
SESSION_SECRET=your-secret-key-min-32-characters-long

# Admin Credentials
OWNER_PASSWORD=YourSecureOwnerPassword123!
ADMIN_PASSWORD=YourSecureAdminPassword456!

# Optional: OpenAI API Key (for chatbot)
OPENAI_API_KEY=your-openai-api-key
```

### For Production (Render/Netlify/Vercel)
Same variables as above, but with production values.

---

## 🔧 How It Works

### 1. Owner Account Creation (`server/seed-owner.ts`)
```typescript
const ownerPassword = process.env.OWNER_PASSWORD;

if (!ownerPassword) {
  throw new Error("❌ OWNER_PASSWORD environment variable is required");
}

const hashedPassword = await bcrypt.hash(ownerPassword, 12);
// Create or update owner account with hashed password
```

**Default Owner Account:**
- Username: `MiMiBEN`
- Email: `dr.mimi.ben@gmail.com`
- Role: `owner`
- Password: Set via `OWNER_PASSWORD` env variable

### 2. Admin Account Creation (`server/seed-admin.ts`)
```typescript
const adminPassword = process.env.ADMIN_PASSWORD;

if (!adminPassword) {
  console.log("⚠️  ADMIN_PASSWORD not set in .env, skipping admin account creation");
  return;
}

const hashedPassword = await bcrypt.hash(adminPassword, 12);
// Create or update admin account with hashed password
```

**Default Admin Account:**
- Username: `admin`
- Email: `admin@medimimi.com`
- Role: `admin`
- Password: Set via `ADMIN_PASSWORD` env variable

---

## 🚀 Deployment Configuration

### Render (Backend)

1. Go to Render Dashboard → Your Service → Environment
2. Add the following environment variables:

```
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://...
SESSION_SECRET=...
OWNER_PASSWORD=YourSecureOwnerPassword123!
ADMIN_PASSWORD=YourSecureAdminPassword456!
OPENAI_API_KEY=...
```

3. Save and redeploy

**Important:** Use the plain text passwords, **NOT** hashed versions. The code will hash them automatically using bcrypt.

### Netlify/Vercel (Frontend)

Only needs:
```
VITE_API_URL=https://your-backend-url.onrender.com
```

---

## 🔍 Verification

### Check if passwords are set correctly

Run this command locally to test:
```bash
node -e "
const bcrypt = require('bcryptjs');
const password = process.env.ADMIN_PASSWORD || 'test123';
(async () => {
  const hash = await bcrypt.hash(password, 12);
  console.log('Password:', password);
  console.log('Hash:', hash.substring(0, 20) + '...');
  const isMatch = await bcrypt.compare(password, hash);
  console.log('Verify:', isMatch ? '✅ Match' : '❌ No match');
})();
" 
```

### Check backend logs after deployment

Look for these messages in Render logs:
```
✅ Owner account created successfully
   Email: dr.mimi.ben@gmail.com
   Password: (from OWNER_PASSWORD env)

✅ Admin account created successfully
   Email: admin@medimimi.com
   Password: (from ADMIN_PASSWORD env)
```

If you see:
```
⚠️  ADMIN_PASSWORD not set in .env, skipping admin account creation
```

Then the `ADMIN_PASSWORD` environment variable is not set on Render.

---

## 🐛 Troubleshooting

### Issue: Admin/Owner login returns 401 Unauthorized

**Cause:** Environment variables not set on deployment platform

**Solution:**
1. Check Render Dashboard → Environment variables
2. Ensure `OWNER_PASSWORD` and `ADMIN_PASSWORD` are set
3. Save and trigger manual redeploy
4. Check logs for confirmation messages

### Issue: "Password login not enabled for this account"

**Cause:** The user account exists but has no password hash

**Solution:**
1. Ensure environment variables are set
2. Delete the user from database (optional)
3. Redeploy to trigger seed scripts
4. The account will be recreated with correct password

### Issue: Cannot login even with correct password

**Cause:** Password in env variable doesn't match what you're typing

**Solution:**
1. Double-check the exact password in your environment variables
2. Check for extra spaces or special characters
3. Update the environment variable if needed
4. Redeploy

---

## ✅ Files Updated

1. ✅ `render.yaml` - Fixed environment variable names
2. ✅ `DEPLOIEMENT_RAPIDE.md` - Updated documentation
3. ✅ `GUIDE_DEPLOIEMENT_PRODUCTION.md` - Updated documentation
4. ✅ `.env.example` - Already correct ✨

---

## 🔒 Security Best Practices

### Password Requirements
- Minimum 8 characters
- Mix of uppercase, lowercase, numbers, and special characters
- Different passwords for owner and admin accounts
- Do NOT commit passwords to version control

### Example Strong Passwords
```
Owner: X9k#mP2$vL8@qR5!
Admin: T7j$nQ4&wB3#xC9@
```

**Note:** These are random examples. Generate your own unique passwords using a password manager or generator.

### Environment Variable Management
- ✅ Store in `.env` file locally (gitignored)
- ✅ Store in platform dashboards for production
- ❌ Never commit to GitHub
- ❌ Never share in public channels
- ❌ Never hardcode in source code

---

## 📚 Related Files

- `server/seed-owner.ts` - Owner account seeding
- `server/seed-admin.ts` - Admin account seeding
- `server/adminRoutes.ts` - Admin login routes
- `server/auth-admin.ts` - Admin authentication
- `.env.example` - Environment variable template
- `render.yaml` - Render deployment configuration

---

## 🎯 Summary

### Before (❌ Incorrect)
```yaml
# render.yaml
envVars:
  - key: OWNER_PASSWORD_HASH  # ❌ Wrong
  - key: ADMIN_PASSWORD_HASH  # ❌ Wrong
```

### After (✅ Correct)
```yaml
# render.yaml
envVars:
  - key: OWNER_PASSWORD  # ✅ Correct
  - key: ADMIN_PASSWORD  # ✅ Correct
```

**Result:** Admin and owner accounts are now created correctly with passwords from environment variables! 🎉
