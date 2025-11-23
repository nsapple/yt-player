import express from "express";
import bodyParser from "body-parser";
import { exec, spawn } from "child_process";
import fs from "fs";
import path from "path";

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static("public"));

// Convert video route
app.post("/api/convert", (req, res) => {
    const videoUrl = req.body.url;

    if (!videoUrl) {
        return res.json({ success: false, error: "No URL provided." });
    }

    // Extract file-safe name
    const id =
        videoUrl.split("v=")[1]?.split("&")[0] ||
        videoUrl.split("/").pop()?.split("?")[0] ||
        "video";

    const output = `${id}.mp4`;

    console.log("Downloading:", videoUrl);

    // yt-dlp command
    const command = `yt-dlp -f "bestvideo+bestaudio" --merge-output-format mp4 -o "${output}" "${videoUrl}"`;

    exec(command, (err, stdout, stderr) => {
        if (err) {
            console.error("yt-dlp error:", stderr);
            return res.json({ success: false, error: "yt-dlp failed." });
        }

        console.log("yt-dlp finished.");

        res.json({
            success: true,
            stream: `/api/video/${output}`,
            original: videoUrl
        });
    });
});

// Stream from YouTube URL directly
app.get("/api/video", (req, res) => {
    const videoUrl = req.query.url;
    const proxy = req.query.proxy; // Optional proxy parameter

    if (!videoUrl) {
        return res.status(400).send("No URL provided. Use ?url=YOUR_YOUTUBE_URL&proxy=YOUR_PROXY");
    }

    // Create temp filename
    const tempFile = `temp_${Date.now()}.mp4`;
    
    console.log("Downloading video from:", videoUrl);
    if (proxy) {
        console.log("Using proxy:", proxy);
    }
    console.log("Please wait while the video is being processed...\n");

    // Check if cookies.txt exists in the current directory
    const cookieFile = path.join(process.cwd(), "cookies.txt");
    const hasCookieFile = fs.existsSync(cookieFile);

    if (hasCookieFile) {
        console.log("🍪 Found cookies.txt file - using it for authentication\n");
        
        const ytdlpArgs = [
            "--cookies", cookieFile,
            "--extractor-args", "youtube:player_client=android,web;po_token=web+https://www.youtube.com",
            "-f", "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best",
            "--merge-output-format", "mp4",
            "-o", tempFile,
            videoUrl
        ];

        // Add proxy if provided
        if (proxy) {
            ytdlpArgs.splice(0, 0, "--proxy", proxy);
        }

        // Use cookies.txt directly without trying browsers
        const ytdlp = spawn("yt-dlp", ytdlpArgs);

        let lastProgress = '';

        ytdlp.stderr.on("data", (data) => {
            const line = data.toString();
            
            if (line.includes('[download]') && line.includes('%')) {
                const match = line.match(/\[download\]\s+(\d+\.\d+%)/);
                if (match && match[1] !== lastProgress) {
                    lastProgress = match[1];
                    process.stdout.write(`\r📥 Downloading... ${match[1]}`);
                }
            } else if (line.includes('[info]')) {
                console.log('\n' + line.trim());
            } else if (line.includes('ERROR')) {
                console.error('\n❌', line.trim());
            }
        });

        ytdlp.on("error", (err) => {
            console.error("\n❌ Process error:", err);
            if (!res.headersSent) {
                res.status(500).send("Streaming failed");
            }
        });

        ytdlp.on("close", (code) => {
            if (code !== 0) {
                console.error(`\n❌ yt-dlp exited with code ${code}`);
                console.error('Cookie file may be invalid or expired. Try getting fresh cookies.');
                if (!res.headersSent) {
                    res.status(500).send("Download failed. Check console for details.");
                }
                return;
            }

            if (!fs.existsSync(tempFile)) {
                console.error('\n❌ Video file not created');
                if (!res.headersSent) {
                    res.status(500).send("Video file not created");
                }
                return;
            }

            const stats = fs.statSync(tempFile);
            console.log(`\n✅ Download complete! Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
            console.log("📤 Sending video to browser...\n");

            res.setHeader("Content-Type", "video/mp4");
            res.setHeader("Content-Length", stats.size);
            
            const stream = fs.createReadStream(tempFile);
            stream.pipe(res);

            stream.on("close", () => {
                fs.unlink(tempFile, (err) => {
                    if (err) console.error("Error deleting temp file:", err);
                });
            });
        });

        req.on("close", () => {
            ytdlp.kill();
            console.log("\n⚠️  Client disconnected");
            if (fs.existsSync(tempFile)) {
                fs.unlink(tempFile, () => {});
            }
        });

        return; // Exit early, don't try browser cookies
    }

    // If no cookies.txt, continue with browser cookie attempts
    console.log("⚠️  No cookies.txt found, trying browser cookies...\n");

    // Detect which browser to use for cookies
    let browser = "edge"; // Default to edge
    const userAgent = req.headers['user-agent'] || '';
    
    if (userAgent.includes('Edg/')) {
        browser = "edge";
    } else if (userAgent.includes('Chrome/') && !userAgent.includes('Edg/')) {
        browser = "chrome";
    } else if (userAgent.includes('Firefox/')) {
        browser = "firefox";
    } else if (userAgent.includes('Safari/') && !userAgent.includes('Chrome/')) {
        browser = "safari";
    }
    
    console.log(`🌐 Attempting to use cookies from: ${browser}`);

    // Try with detected browser first, then fallback to others
    const browsersToTry = [browser, "chrome", "firefox", "edge"];
    const uniqueBrowsers = [...new Set(browsersToTry)]; // Remove duplicates
    let currentBrowserIndex = 0;

    function tryDownload() {
        const currentBrowser = uniqueBrowsers[currentBrowserIndex];
        const useCookies = currentBrowserIndex < uniqueBrowsers.length;
        
        const ytdlpArgs = [
            "--extractor-args", "youtube:player_client=android,web",
            "-f", "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best",
            "--merge-output-format", "mp4",
            "-o", tempFile,
            videoUrl
        ];

        // Add proxy if provided
        if (proxy) {
            ytdlpArgs.splice(0, 0, "--proxy", proxy);
        }

        // Add cookie flag for browser cookies
        if (useCookies) {
            ytdlpArgs.unshift("--cookies-from-browser", currentBrowser);
        } else {
            console.log("⚠️  Trying without cookies with Android client...");
        }

        const ytdlp = spawn("yt-dlp", ytdlpArgs);
        let lastProgress = '';
        let hasError = false;
        let errorMessages = [];

        ytdlp.stderr.on("data", (data) => {
            const line = data.toString();
            
            // Collect all lines for debugging
            errorMessages.push(line);
            
            // Show download progress
            if (line.includes('[download]') && line.includes('%')) {
                const match = line.match(/\[download\]\s+(\d+\.\d+%)/);
                if (match && match[1] !== lastProgress) {
                    lastProgress = match[1];
                    process.stdout.write(`\r📥 Downloading... ${match[1]}`);
                }
            } else if (line.includes('[info]')) {
                console.log('\n' + line.trim());
            } else if (line.includes('ERROR')) {
                // Show all errors when not using cookies to see what's wrong
                if (!useCookies || !line.includes('cookie')) {
                    console.error('\n❌', line.trim());
                }
                if (line.includes('cookie')) {
                    hasError = true;
                }
            }
        });

        ytdlp.on("error", (err) => {
            console.error("\n❌ Process error:", err);
            if (!res.headersSent) {
                res.status(500).send("Streaming failed");
            }
        });

        ytdlp.on("close", (code) => {
            if (code !== 0 && hasError && currentBrowserIndex < uniqueBrowsers.length) {
                // Try next browser
                currentBrowserIndex++;
                if (currentBrowserIndex < uniqueBrowsers.length) {
                    console.log(`\n⚠️  Retrying with ${uniqueBrowsers[currentBrowserIndex]} cookies...`);
                    tryDownload();
                } else {
                    // Try without cookies as last resort
                    console.log("\n⚠️  All browsers failed, trying without cookies...");
                    currentBrowserIndex = uniqueBrowsers.length; // Signal to skip cookies
                    tryDownload();
                }
                return;
            }

            if (code !== 0) {
                console.error(`\n❌ yt-dlp exited with code ${code}`);
                
                // Show last few error lines for debugging
                if (!useCookies) {
                    console.error('\nFull error output:');
                    console.error(errorMessages.join(''));
                }
                
                console.error('Could not download video. YouTube may be blocking requests.');
                if (!res.headersSent) {
                    res.status(500).send("Download failed. Check console for details.");
                }
                return;
            }

            // Check if file exists
            if (!fs.existsSync(tempFile)) {
                console.error('\n❌ Video file not created');
                if (!res.headersSent) {
                    res.status(500).send("Video file not created");
                }
                return;
            }

            const stats = fs.statSync(tempFile);
            console.log(`\n✅ Download complete! Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
            console.log("📤 Sending video to browser...\n");

            // Send the file
            res.setHeader("Content-Type", "video/mp4");
            res.setHeader("Content-Length", stats.size);
            
            const stream = fs.createReadStream(tempFile);
            stream.pipe(res);

            // Delete temp file after streaming
            stream.on("close", () => {
                fs.unlink(tempFile, (err) => {
                    if (err) console.error("Error deleting temp file:", err);
                });
            });
        });

        // Handle client disconnect
        req.on("close", () => {
            ytdlp.kill();
            console.log("\n⚠️  Client disconnected");
            // Clean up temp file if exists
            if (fs.existsSync(tempFile)) {
                fs.unlink(tempFile, () => {});
            }
        });
    }

    // Start download attempt
    tryDownload();
});

// Stream MP4 file (for already downloaded videos)
app.get("/api/video/:file", (req, res) => {
    const fileName = req.params.file;
    const filePath = path.join(process.cwd(), fileName);

    if (!fs.existsSync(filePath)) {
        return res.status(404).send("Video not found");
    }

    res.setHeader("Content-Type", "video/mp4");

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);

    // Delete video when done streaming
    stream.on("close", () => {
        fs.unlink(filePath, () => {});
    });
});

app.listen(PORT, () =>
    console.log(`Server running → http://localhost:${PORT}`)
);
