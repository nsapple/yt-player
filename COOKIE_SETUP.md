# YouTube Cookie Setup Guide

YouTube is requiring authentication to download videos. Here's how to fix this:

## Option 1: Close Edge Completely (Easiest)

1. Close ALL Edge windows
2. Open Task Manager (Ctrl+Shift+Esc)
3. Find any "Microsoft Edge" processes and end them
4. Restart your server - it should now be able to read Edge cookies

## Option 2: Manually Extract YouTube Cookies (Recommended)

1. Open Edge and go to youtube.com (make sure you're logged in)

2. Press F12 to open Developer Tools

3. Go to the "Application" tab (or "Storage" tab)

4. In the left sidebar, expand "Cookies" and click on "https://www.youtube.com"

5. Find these cookies and copy their values:
   - Look for any cookie (we need the format)

6. Create a file called `cookies.txt` in `C:\Users\nsapple\Documents\yt-server\`

7. Use this format (Netscape cookie format):

```
# Netscape HTTP Cookie File
.youtube.com	TRUE	/	TRUE	0	CONSENT	YES+
.youtube.com	TRUE	/	FALSE	1234567890	VISITOR_INFO1_LIVE	YOUR_VALUE_HERE
.youtube.com	TRUE	/	TRUE	1234567890	__Secure-YEC	YOUR_VALUE_HERE
```

**Easier method:**

Just create `cookies.txt` with this minimal format:
```
# Netscape HTTP Cookie File
.youtube.com	TRUE	/	FALSE	2147483647	CONSENT	PENDING+987
.youtube.com	TRUE	/	FALSE	2147483647	VISITOR_INFO1_LIVE	PASTE_YOUR_VISITOR_INFO_VALUE
```

To get VISITOR_INFO1_LIVE:
- F12 → Application → Cookies → https://www.youtube.com
- Find "VISITOR_INFO1_LIVE" and copy its Value
- Paste it in the cookies.txt file

## Option 3: Use yt-dlp Cookie Export Tool

Run this command in your terminal:
```bash
yt-dlp --cookies-from-browser edge --cookies cookies.txt --skip-download https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

This will create cookies.txt automatically!

## Verification

After following any option, restart the server and try again.
The server will show: "🍪 Using cookies from cookies.txt file" if the file is detected.

