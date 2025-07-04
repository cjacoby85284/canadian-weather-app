#!/bin/bash

# DigitalOcean Droplet Deployment Script
# Prerequisites: 
# 1. A DigitalOcean Droplet with Docker installed
# 2. SSH access configured
# 3. Docker Hub account (or use DO Container Registry)

# Configuration
DROPLET_IP="YOUR_DROPLET_IP"
DOCKER_IMAGE="your-dockerhub-username/canadian-weather-app"
CONTAINER_NAME="canadian-weather-app"

echo "🚀 Starting deployment to DigitalOcean Droplet..."

# Build and tag the image
echo "📦 Building Docker image..."
docker build -t $DOCKER_IMAGE:latest .

# Push to Docker Hub (or DO Container Registry)
echo "⬆️  Pushing image to registry..."
docker push $DOCKER_IMAGE:latest

# Deploy to Droplet
echo "🌊 Deploying to DigitalOcean Droplet..."
ssh root@$DROPLET_IP << EOF
  # Pull the latest image
  docker pull $DOCKER_IMAGE:latest
  
  # Stop and remove existing container
  docker stop $CONTAINER_NAME 2>/dev/null || true
  docker rm $CONTAINER_NAME 2>/dev/null || true
  
  # Run new container
  docker run -d \
    --name $CONTAINER_NAME \
    -p 80:80 \
    --restart unless-stopped \
    $DOCKER_IMAGE:latest
    
  # Verify deployment
  docker ps | grep $CONTAINER_NAME
EOF

echo "✅ Deployment complete! Your app should be available at http://$DROPLET_IP"