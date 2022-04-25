#### Stage 1: Build the react application
FROM node:14-alpine as build

WORKDIR /app

# Copy the package.json as well as the package-lock.json and install 
COPY package.json package-lock.json ./
RUN npm install

# Copy the main application
COPY . ./

# Build the application
RUN npm run build

#### Stage 2: Serve the React application from Nginx 
FROM nginx:1.17.0-alpine

# Copy the react build from Stage 1
COPY --from=build /app/build /var/www

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 3000 to the Docker host
EXPOSE 80

ENTRYPOINT ["nginx","-g","daemon off;"]
