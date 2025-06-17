# Deployment Guide

## 🚀 Deploy to Vercel (Recommended)

### Option 1: One-Click Deploy
1. Click the button below:
   
   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/daily-english-topic/tree/main/daily-english-nextjs)

2. Connect your GitHub account
3. Clone the repository
4. Deploy!

### Option 2: Manual Deploy
1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Follow the prompts to:
   - Connect to your Vercel account
   - Set up the project
   - Deploy to production

### Option 3: GitHub Integration
1. Push your code to GitHub
2. Visit [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your GitHub repository
5. Configure:
   - Framework: Next.js
   - Root Directory: `daily-english-nextjs`
   - Build Command: `npm run build`
   - Output Directory: `.next`
6. Click "Deploy"

## 🌐 Deploy to Netlify

1. Build the project:
   ```bash
   npm run build
   ```

2. Install Netlify CLI:
   ```bash
   npm i -g netlify-cli
   ```

3. Deploy:
   ```bash
   netlify deploy --prod
   ```

## 🐳 Deploy with Docker

1. Create `Dockerfile`:
   ```dockerfile
   FROM node:18-alpine AS deps
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production

   FROM node:18-alpine AS builder
   WORKDIR /app
   COPY . .
   COPY --from=deps /app/node_modules ./node_modules
   RUN npm run build

   FROM node:18-alpine AS runner
   WORKDIR /app
   ENV NODE_ENV production
   COPY --from=builder /app/public ./public
   COPY --from=builder /app/.next ./.next
   COPY --from=builder /app/node_modules ./node_modules
   COPY --from=builder /app/package.json ./package.json
   COPY --from=builder /app/content ./content

   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. Build and run:
   ```bash
   docker build -t daily-english-nextjs .
   docker run -p 3000:3000 daily-english-nextjs
   ```

## 📝 Environment Variables

For production deployment, set these environment variables:

- `NEXT_PUBLIC_SITE_URL`: Your production URL (e.g., https://daily-english.vercel.app)

## 🔄 Continuous Deployment

### GitHub Actions
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]
    paths:
      - 'daily-english-nextjs/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        working-directory: ./daily-english-nextjs
        run: npm ci
        
      - name: Build
        working-directory: ./daily-english-nextjs
        run: npm run build
        
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./daily-english-nextjs
```

## 🎯 Post-Deployment Checklist

- [ ] Verify all pages load correctly
- [ ] Test slide navigation
- [ ] Check responsive design on mobile
- [ ] Verify all topics are accessible
- [ ] Test mode switching (slides ↔ article)
- [ ] Monitor Core Web Vitals
- [ ] Set up error tracking (e.g., Sentry)