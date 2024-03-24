# Specify the base image
FROM node:21

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Bundle app source
COPY . .

# Build your app
RUN npm run build

# Expose the port your app runs on
EXPOSE 3000

# Define the Docker container's command
CMD ["node", "dist/main"]
