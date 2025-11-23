# Deploy to Render.com - Step by Step Guide

Render.com is perfect for this project! Here's why:
- ✅ Free tier available
- ✅ Supports long-running processes
- ✅ Easy Python + Node.js setup
- ✅ Automatic HTTPS
- ⚠️ Spins down after 15 minutes of inactivity (takes ~30 seconds to wake up)

## Quick Deploy (5 minutes)

### Step 1: Prepare Your Code

1. Make sure all these files are in your project folder:
   - `server.js`
   - `package.json`
   - `render.yaml` (I just created this)
   - `requirements.txt` (I created this)
   - `.gitignore` (I created this)

2. Push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

### Step 2: Deploy to Render

1. Go to https://render.com and sign up (free)

2. Click **"New +"** → **"Web Service"**

3. **Connect your GitHub repository**
   - Click "Connect account" if needed
   - Select your yt-server repository

4. **Configure the service:**
   - **Name:** `yt-server` (or whatever you want)
   - **Region:** Oregon (or closest to you)
   - **Branch:** `main`
   - **Root Directory:** Leave blank
   - **Environment:** `Node`
   - **Build Command:** 
     ```
     npm install && pip install yt-dlp
     ```
   - **Start Command:** 
     ```
     npm start
     ```
   - **Plan:** Free

5. Click **"Create Web Service"**

6. Wait 3-5 minutes for deployment ⏳

7. Your app will be live at: `https://yt-server-XXXX.onrender.com`

## Using Your Deployed Server

Once deployed, use it like:
```
https://yt-server-XXXX.onrender.com/api/video?url=YOUTUBE_URL
```

Example:
```
https://yt-server-XXXX.onrender.com/api/video?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

## Important Notes

### Free Tier Limitations

- **Spins down after 15 minutes** of no requests
- **First request after sleep** takes ~30 seconds to wake up
- **750 hours/month** free compute time (usually enough)
- **No persistent storage** (temp files are deleted on restart)

### Dealing with Spin-Down

The server will go to sleep after inactivity. When you make a request:
1. First request might timeout (waking up)
2. Try again after 30 seconds
3. Subsequent requests work normally

**Pro Tip:** To keep it awake, use a service like:
- **UptimeRobot** (free) - Pings your server every 5 minutes
- **Cron-job.org** (free) - Scheduled pings

### YouTube Bot Detection

Your server might still hit YouTube's bot detection because:
- Render's IP addresses might be flagged
- Multiple users = more requests = higher chance of blocking

**Solutions:**
- Use the proxy parameter: `&proxy=YOUR_PROXY`
- Add cookies.txt (but don't commit to git!)
- Consider upgrading to paid plan for dedicated IP

## Environment Variables (Optional)

If you need to add environment variables:

1. In Render dashboard, go to your service
2. Click **"Environment"** tab
3. Add variables:
   - `PORT` = `3000` (Render auto-sets this, usually not needed)
   - `NODE_ENV` = `production`

## Updating Your Deployment

Render auto-deploys when you push to GitHub:

```bash
git add .
git commit -m "Updated server"
git push
```

Render will automatically rebuild and redeploy!

## Monitoring

In Render dashboard you can:
- View logs (see downloads in progress)
- Monitor CPU/memory usage
- See deploy history
- View metrics

## Troubleshooting

### "yt-dlp: command not found"

Make sure your build command includes:
```
npm install && pip install yt-dlp
```

### "Permission denied" errors

Render's filesystem is read-only except for `/tmp`. The server already uses temp files in the current directory which should work.

### Videos not downloading

1. Check logs in Render dashboard
2. Test locally first
3. Verify YouTube URL works
4. Check if you're hitting rate limits

### Service keeps sleeping

Upgrade to paid plan ($7/month) for always-on service, or use UptimeRobot to ping it every 5 minutes.

## Upgrading to Paid Plan

If you need:
- No spin-down (always on)
- Better performance
- More compute time

Upgrade to **Starter plan** ($7/month):
1. Go to your service → Settings
2. Click "Upgrade Plan"
3. Select "Starter"

## Alternative: Render Background Worker

For heavy usage, consider a background worker instead:

1. Create a new **"Background Worker"** in Render
2. It processes downloads in a queue
3. Never times out
4. Better for multiple users

Let me know if you need help setting this up!

## 🎉 You're Done!

Your YouTube downloader is now live on the internet! Share the URL with friends (but be careful about YouTube's rate limits).

Need help? Check the logs in Render dashboard or let me know what's not working!
