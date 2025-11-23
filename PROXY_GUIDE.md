# Proxy Setup Guide

Your IP is temporarily blocked by YouTube. Using a proxy will let you download videos through a different IP address.

## How to Use a Proxy

The server now supports proxies! Just add `&proxy=` to your URL:

```
http://localhost:3000/api/video?url=YOUTUBE_URL&proxy=PROXY_ADDRESS
```

## Proxy Format

Proxies can be in these formats:
- `http://proxy.example.com:8080`
- `socks5://proxy.example.com:1080`
- `http://username:password@proxy.example.com:8080`

## Finding Free Proxies

### Option 1: Free Proxy Lists (Quick but unreliable)

Visit these sites for free proxies:
- https://www.sslproxies.org/
- https://free-proxy-list.net/
- https://www.proxy-list.download/

Look for:
- HTTPS proxies (more reliable)
- High uptime percentage
- Low response time

**Example:**
If you find a proxy `123.45.67.89:8080`, use it like:
```
http://localhost:3000/api/video?url=YOUR_YOUTUBE_URL&proxy=http://123.45.67.89:8080
```

### Option 2: Paid Proxy Services (Recommended for reliability)

These are more reliable but cost money:
- Bright Data (formerly Luminati)
- Smartproxy
- Oxylabs
- ScraperAPI

### Option 3: Use a VPN

Instead of a proxy, you can:
1. Connect to a VPN on your computer
2. Use the server without the proxy parameter
3. Your entire connection goes through the VPN

Free VPNs:
- ProtonVPN (free tier)
- Windscribe (10GB/month free)

## Testing a Proxy

To test if a proxy works, try this in Command Prompt:

```bash
yt-dlp --proxy http://YOUR_PROXY:PORT https://www.youtube.com/watch?v=jNQXAC9IVRw
```

If it downloads, the proxy works!

## Important Notes

- **Free proxies are slow and unreliable** - They may fail frequently
- **Don't use proxies for sensitive data** - Free proxies can see your traffic
- **YouTube may block proxy IPs too** - Popular proxies get blocked quickly
- **Your IP ban is temporary** - Usually lifts in 24-48 hours

## Alternative: Wait it Out

YouTube's bot detection usually clears after 1-2 days of not making requests. The easiest solution might be to just wait!
