# frontend/Dockerfile
FROM node:14

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json /app/
RUN npm install

# Copy the React application code
COPY . /app

# Build the React app
RUN npm run build

# Install serve to serve the app
RUN npm install -g serve

# Expose the port that the frontend will use
EXPOSE 3000

# Command to serve the app
CMD ["serve", "-s", "build", "-l", "3000"]
