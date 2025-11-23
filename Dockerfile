FROM node:18-slim

# Install Python and yt-dlp dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Install yt-dlp
RUN pip3 install --break-system-packages yt-dlp

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install Node dependencies
RUN npm install --production

# Copy app files
COPY . .

# Expose port
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
