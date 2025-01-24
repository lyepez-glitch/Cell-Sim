# Use official Node.js image as base
FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your app's code
COPY . .

# Expose the port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
