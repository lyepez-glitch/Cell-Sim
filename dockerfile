# Use the official Node.js image
FROM node:16-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the app files
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Run the app
CMD ["node", "app.js"]
