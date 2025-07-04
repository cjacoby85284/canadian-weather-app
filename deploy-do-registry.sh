#!/bin/bash

# DigitalOcean Container Registry Deployment
# Prerequisites:
# 1. doctl CLI installed and authenticated
# 2. Container Registry created in DO

# Configuration
REGISTRY_NAME="your-registry-name"
IMAGE_NAME="canadian-weather-app"
TAG="latest"

echo "🚀 Deploying to DigitalOcean Container Registry..."

# Login to DO Container Registry
echo "🔐 Logging into DO Container Registry..."
doctl registry login

# Get registry endpoint
REGISTRY_ENDPOINT=$(doctl registry get --format Endpoint --no-header)

# Build and tag
echo "📦 Building and tagging image..."
docker build -t $REGISTRY_ENDPOINT/$IMAGE_NAME:$TAG .

# Push to registry
echo "⬆️  Pushing to DO Container Registry..."
docker push $REGISTRY_ENDPOINT/$IMAGE_NAME:$TAG

echo "✅ Image pushed successfully!"
echo "📋 Image URL: $REGISTRY_ENDPOINT/$IMAGE_NAME:$TAG"
echo ""
echo "Next steps:"
echo "1. Create a new App in DO App Platform"
echo "2. Select 'DigitalOcean Container Registry' as source"
echo "3. Choose this image: $IMAGE_NAME:$TAG"