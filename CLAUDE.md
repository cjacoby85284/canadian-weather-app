# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Docker Commands
```bash
# Build Docker image
docker build -t canadian-weather-app .

# Run container
docker run -p 3000:80 canadian-weather-app

# Use Docker Compose
docker-compose up
docker-compose down
```

### Linting and Type Checking
```bash
# Run TypeScript type checking
npm run build # This will also check types

# Check for TypeScript errors without building
npx tsc --noEmit
```

## Architecture Overview

This is a React + TypeScript application built with Vite that displays weather and time information for Canadian cities.

### Key Components

1. **Frontend Stack**
   - React 18 with TypeScript
   - Vite for build tooling and dev server
   - Tailwind CSS for styling
   - shadcn/ui components (custom implementations in `src/components/ui/`)

2. **Data Management**
   - Canadian cities data in `src/data/canadian-cities.ts` with 30+ cities
   - Weather fetching from OpenWeatherMap API (with fallback to mock data)
   - Real-time clock updates using JavaScript Date API with timezone support

3. **Containerization**
   - Multi-stage Docker build (Node.js for building, Nginx for serving)
   - Nginx configuration for SPA routing and caching
   - Docker Compose for simplified deployment

### Project Structure
```
src/
├── components/
│   └── ui/           # shadcn/ui components (Select, Card)
├── data/
│   └── canadian-cities.ts  # City data with coordinates and timezones
├── lib/
│   └── utils.ts      # Utility functions (cn for className merging)
├── App.tsx           # Main application component
├── App.css           # Component styles (empty, using Tailwind)
└── index.css         # Global styles and Tailwind imports
```

### Environment Variables
- `VITE_OPENWEATHER_API_KEY`: OpenWeatherMap API key (optional, falls back to mock data)

### Deployment Considerations
- The app is containerized and ready for deployment to any Docker-compatible platform
- Static assets are served with proper caching headers
- SPA routing is configured in Nginx
- No backend required - all data fetching happens client-side