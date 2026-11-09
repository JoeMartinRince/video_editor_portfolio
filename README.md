# Anamorph™ — Noah Reyes, Video Editor Portfolio


A cinematic, high-performance website template exported from Framer.

## Overview

- **Design**: Dark cinematic video editor portfolio with film typography, reel counters, responsive video loops, client reviews, interactive "Film Runner" game board, and booking callout.
- **Pages**:
  - `/` (Home): Hero with live showreel background, services, selected work, short-form reels, rates, client testimonials, booking form, and footer.
  - `/work/citadel/`: Nomad Stays Campaign case study page.
  - `/work/meridian/`: Meridian Launch Film case study page.
  - `/work/karama/`: Lumen Field Titles case study page.
- **Framework & Technology**: React 18, Framer Motion, Lenis Smooth Scroll, Rolldown ES Modules, HTML5 Video Streaming (HTTP 206 Byte Ranges).

## Running Locally

To start the local development server:

```bash
npm run dev
# or
npm start
```

Open your browser at [http://localhost:3000](http://localhost:3000).

## Building / Verifying for Production

```bash
npm run build
```

## Deployment to Vercel

The project is fully pre-configured for Vercel deployment via `vercel.json`:

1. **Framework Preset**: Other / None (Static Site)
2. **Build Command**: `npm run build` (or leave default)
3. **Output Directory**: `.` (Root directory)

Deploy using the Vercel CLI:

```bash
vercel
```

Or connect the repository to your Vercel Dashboard for continuous automatic deployments.
