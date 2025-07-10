FROM node:18

# Set working directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy entire backend code
COPY . .

# Expose backend port
EXPOSE 3500

# Start server
CMD ["node", "server.js"]
