# Use a lightweight Node.js image as the build environment
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app code and build it
COPY . .
RUN npm run build

# Use a lightweight server for production
FROM nginx:alpine

# Copy the build files from the previous stage to the NGINX HTML directory
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf


# Expose the port NGINX will serve on
EXPOSE 80

# Start NGINX server
CMD ["nginx", "-g", "daemon off;"]
