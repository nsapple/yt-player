# Deployment Guide for YouTube Downloader Server

This server **cannot** be deployed to Vercel, Netlify, or similar serverless platforms because:
- Video downloads take too long (timeouts)
- Requires yt-dlp binary (not available in serverless)
- Needs persistent filesystem for temp files

## ✅ Recommended Deployment Options

### Option 1: Render.com (Easiest, Free Tier Available)

**Pros:** Free tier, automatic deployments, supports long-running processes
**Cons:** Spins down after inactivity (cold starts)

**Steps:**
1. Push your code to GitHub
2. Go to https://render.com and sign up
3. Click "New +" → "Web Service"
4. Connect your GitHub repo
5. Configure:
   - **Name:** yt-server
   - **Environment:** Node
   - **Build Command:** `npm install && pip install yt-dlp`
   - **Start Command:** `npm start`
   - **Instance Type:** Free
6. Add environment variable (optional):
   - `PORT` = `3000`
7. Click "Create Web Service"

**Important:** Add a `Dockerfile` or use their build script to install yt-dlp.

### Option 2: Railway.app (Best Performance)

**Pros:** Always-on, fast, simple deployment, $5/month free credit
**Cons:** Requires credit card after trial

**Steps:**
1. Push code to GitHub
2. Go to https://railway.app
3. Click "Start a New Project" → "Deploy from GitHub"
4. Select your repo
5. Railway auto-detects Node.js
6. Add buildpack for Python: Settings → Add buildpack → Python
7. Add start command: `npm start`
8. Deploy!

### Option 3: DigitalOcean App Platform

**Pros:** Reliable, scalable, good documentation
**Cons:** Costs $5/month minimum

**Steps:**
1. Create DigitalOcean account
2. Go to App Platform → Create App
3. Connect GitHub repo
4. Configure:
   - **Type:** Web Service
   - **Build Command:** `npm install && pip install yt-dlp`
   - **Run Command:** `npm start`
5. Deploy

### Option 4: Heroku (Classic Option)

**Pros:** Well-documented, reliable
**Cons:** No free tier anymore ($5-7/month)

**Steps:**
1. Install Heroku CLI
2. Run in your project:
   ```bash
   heroku login
   heroku create your-app-name
   heroku buildpacks:add --index 1 heroku/python
   heroku buildpacks:add --index 2 heroku/nodejs
   git push heroku main
   ```

### Option 5: VPS (Most Control)

**Platforms:** DigitalOcean Droplet, Linode, Vultr, AWS EC2
**Cost:** $5-10/month
**Setup:**

1. Create Ubuntu server
2. SSH into server
3. Install dependencies:
   ```bash
   sudo apt update
   sudo apt install nodejs npm python3-pip ffmpeg
   pip3 install yt-dlp
   ```
4. Clone your repo:
   ```bash
   git clone YOUR_REPO_URL
   cd yt-server
   npm install
   ```
5. Run with PM2 (keeps it running):
   ```bash
   npm install -g pm2
   pm2 start server.js
   pm2 save
   pm2 startup
   ```

## 📦 Required Files for Deployment

### 1. Create `Procfile` (for Heroku/Railway)
```
web: npm start
```

### 2. Update `package.json`
Add this to your package.json:
```json
{
  "engines": {
    "node": "18.x"
  },
  "scripts": {
    "start": "node server.js"
  }
}
```

### 3. Create `.buildpacks` (for platforms that support it)
```
https://github.com/heroku/heroku-buildpack-python
https://github.com/heroku/heroku-buildpack-nodejs
```

### 4. Create `requirements.txt` (for Python dependencies)
```
yt-dlp
```

### 5. Create `.gitignore`
```
node_modules/
*.mp4
temp_*.mp4
cookies.txt
.env
```

## 🔧 Environment Variables

For production, you may want to set:
- `PORT` - The port to run on (usually auto-set)
- `NODE_ENV=production`

## 🚀 Recommended: Railway.app

For your use case, I recommend **Railway.app**:
- Simple deployment (connect GitHub and done)
- Supports long-running processes
- $5 free credit per month
- No cold starts
- Easy to set up yt-dlp

## ⚠️ Important Notes

1. **YouTube blocking:** Your server's IP might still get blocked by YouTube. Consider:
   - Rate limiting requests
   - Using proxies in production
   - Rotating IP addresses

2. **Cookies:** Don't commit `cookies.txt` to git! Add it to `.gitignore`

3. **Storage:** Temp files are cleaned up automatically, but monitor disk usage

4. **Scaling:** For multiple users, consider:
   - Queue system (Bull/Redis)
   - Worker processes
   - CDN for serving videos

## 🆘 Still Need Help?

If you want step-by-step instructions for a specific platform, let me know which one you prefer!
