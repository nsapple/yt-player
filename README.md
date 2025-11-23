# YouTube Downloader Server

A Node.js server that downloads YouTube videos using yt-dlp with proxy support and cookie authentication.

## 📦 What's Included

- `server.js` - Main Express server with YouTube download functionality
- `package.json` - Node.js dependencies
- `requirements.txt` - Python dependencies (yt-dlp)
- `Dockerfile` - Docker container configuration
- `Procfile` - Heroku/Railway deployment config
- `render.yaml` - Render.com deployment config
- `railway.json` - Railway.app deployment config
- `.gitignore` - Git ignore rules

## 📚 Documentation

- `RENDER_DEPLOY.md` - **START HERE** - Complete Render.com deployment guide
- `DEPLOYMENT_GUIDE.md` - Deployment options for all platforms
- `PROXY_GUIDE.md` - How to use proxies to avoid IP blocks
- `COOKIE_SETUP.md` - How to set up YouTube authentication

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+ installed
- Python 3 installed
- yt-dlp installed: `pip install yt-dlp`

### Installation

1. Extract this zip file
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
4. Open in browser:
   ```
   http://localhost:3000/api/video?url=YOUTUBE_URL
   ```

## 🌐 Deploy to the Cloud

### Option 1: Render.com (Recommended - Free Tier)

1. Push this folder to GitHub
2. Follow instructions in `RENDER_DEPLOY.md`
3. Takes 5 minutes to deploy!

### Option 2: Railway.app

1. Push to GitHub
2. Go to https://railway.app
3. Click "Deploy from GitHub"
4. Select your repo - done!

### Option 3: Other Platforms

See `DEPLOYMENT_GUIDE.md` for:
- DigitalOcean
- Heroku
- VPS deployment
- Docker deployment

## 📖 Usage

### Basic Usage
```
http://localhost:3000/api/video?url=YOUTUBE_URL
```

### With Proxy (to avoid IP blocks)
```
http://localhost:3000/api/video?url=YOUTUBE_URL&proxy=http://proxy:port
```

### Examples
```
http://localhost:3000/api/video?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ

http://localhost:3000/api/video?url=https://www.youtube.com/watch?v=jNQXAC9IVRw&proxy=http://123.45.67.89:8080
```

## 🍪 Cookie Authentication

If you get "Sign in to confirm you're not a bot" errors:

1. See `COOKIE_SETUP.md` for detailed instructions
2. Export your browser cookies to `cookies.txt`
3. Place in the same folder as `server.js`
4. Server will automatically use them

## 🔧 Features

- ✅ Downloads YouTube videos as MP4
- ✅ Automatic cookie detection
- ✅ Browser cookie support (Edge, Chrome, Firefox)
- ✅ Proxy support to avoid IP blocks
- ✅ Progress tracking in console
- ✅ Automatic cleanup of temp files
- ✅ Multiple format support
- ✅ Fallback strategies for authentication

## ⚠️ Troubleshooting

### "Sign in to confirm you're not a bot"
- Your IP is temporarily blocked by YouTube
- Solutions:
  1. Wait 24-48 hours
  2. Use a proxy (see `PROXY_GUIDE.md`)
  3. Set up cookies (see `COOKIE_SETUP.md`)

### "yt-dlp not found"
```bash
pip install yt-dlp
```

### Videos not downloading
1. Update yt-dlp: `pip install --upgrade yt-dlp`
2. Check console logs for errors
3. Try a different video
4. Check if you're behind a firewall

## 📝 Package.json

Don't have `package.json`? Create it:

```json
{
  "name": "yt-server",
  "version": "1.0.0",
  "description": "YouTube downloader server",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "engines": {
    "node": "18.x"
  },
  "dependencies": {
    "express": "^4.18.2",
    "body-parser": "^1.20.2"
  }
}
```

Then run `npm install`

## 🤝 Contributing

Feel free to improve this server! Common improvements:
- Queue system for multiple downloads
- Web UI for easier usage
- Download history
- Format selection
- Playlist support

## ⚡ Performance Tips

- Use a proxy to avoid rate limits
- Deploy to a cloud platform for better uptime
- Use cookies for authenticated access
- Monitor logs to catch issues early

## 📞 Support

Check the documentation files:
- Deployment issues → `DEPLOYMENT_GUIDE.md`
- IP blocks → `PROXY_GUIDE.md`
- Authentication → `COOKIE_SETUP.md`
- Render deployment → `RENDER_DEPLOY.md`

## 🎉 Ready to Deploy?

**Easiest: Render.com**
1. Read `RENDER_DEPLOY.md`
2. Push to GitHub
3. Connect to Render
4. Done in 5 minutes!

**Best Performance: Railway.app**
1. Push to GitHub
2. Deploy from https://railway.app
3. Automatic setup!

Good luck! 🚀
