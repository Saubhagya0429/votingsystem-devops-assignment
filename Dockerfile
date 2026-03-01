# Use small nginx image for minimal size and security
FROM nginx:alpine

# Create non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Remove default nginx website to replace with our app
RUN rm -rf /usr/share/nginx/html/*

# Copy project files to nginx folder
COPY . /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx in foreground
CMD ["nginx", "-g", "daemon off;"]