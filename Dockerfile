FROM nginx:alpine

# Remove the default Nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy your app files into the Nginx web root
COPY . /usr/share/nginx/html

# Expose port 8080
EXPOSE 8080

# Replace Nginx config to listen on port 8080
RUN sed -i 's/80/8080/g' /etc/nginx/conf.d/default.conf

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]