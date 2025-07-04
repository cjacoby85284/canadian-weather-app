# DigitalOcean Deployment Guide

This guide covers three ways to deploy your Canadian Weather App to DigitalOcean.

## Prerequisites

1. DigitalOcean account
2. Docker image ready (already built)
3. Payment method added to DO account

## Option 1: App Platform (Easiest)

1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/canadian-weather-app.git
   git push -u origin main
   ```

2. Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
3. Click "Create App"
4. Choose GitHub as source
5. Select your repository
6. DigitalOcean will detect the Dockerfile automatically
7. Review and deploy

**Cost**: ~$5/month for basic instance

## Option 2: Container Registry + App Platform

1. Install doctl CLI:
   ```bash
   brew install doctl  # macOS
   # or download from https://docs.digitalocean.com/reference/doctl/how-to/install/
   ```

2. Authenticate:
   ```bash
   doctl auth init
   ```

3. Create Container Registry:
   ```bash
   doctl registry create canadian-weather-registry
   ```

4. Run the deploy script:
   ```bash
   ./deploy-do-registry.sh
   ```

5. Create App Platform app using the pushed image

## Option 3: Deploy to Droplet (More Control)

1. Create a Droplet:
   - Go to [Create Droplet](https://cloud.digitalocean.com/droplets/new)
   - Choose Docker from Marketplace
   - Select Basic plan ($6/month)
   - Choose region closest to your users

2. SSH into your droplet:
   ```bash
   ssh root@YOUR_DROPLET_IP
   ```

3. Update the deploy script with your details:
   - Edit `deploy-to-droplet.sh`
   - Set your Droplet IP
   - Set your Docker Hub username

4. Run deployment:
   ```bash
   ./deploy-to-droplet.sh
   ```

## Post-Deployment

1. **Custom Domain** (optional):
   - Add domain in DO networking
   - Point DNS to your app/droplet
   - Enable HTTPS (automatic in App Platform)

2. **Environment Variables**:
   - In App Platform: Settings → App-Level Environment Variables
   - Add `VITE_OPENWEATHER_API_KEY` if not baked into image

3. **Monitoring**:
   - App Platform includes basic monitoring
   - For Droplets, set up DO Monitoring agent

## Costs Summary

- **App Platform Basic**: $5/month (512MB RAM, 1 vCPU)
- **Basic Droplet**: $6/month (1GB RAM, 1 vCPU, 25GB SSD)
- **Container Registry**: $0 (free tier includes 500MB)
- **Bandwidth**: 1TB free, then $0.01/GB

## Support

- [DigitalOcean Documentation](https://docs.digitalocean.com)
- [App Platform Docs](https://docs.digitalocean.com/products/app-platform/)
- [Container Registry Docs](https://docs.digitalocean.com/products/container-registry/)