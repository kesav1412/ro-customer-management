# Build and Deployment Guide

## Prerequisites

Before building and deploying the application, ensure you have:

- **Node.js** 18 or higher installed
- **npm** (comes with Node.js) or **yarn**
- **Docker** (optional, for containerized deployment)
- **Git** for version control

## Environment Configuration

### 1. Set Up Environment Files

Create environment-specific configuration files:

```bash
# Copy the example environment file
cp .env.example .env.production

# Edit the production environment file
# Add your Supabase credentials and other settings
```

**Required Environment Variables:**

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_anon_key
VITE_APP_NAME=RO Customer Management
VITE_APP_VERSION=1.0.0
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_TRACKING=true
```

## Local Development Build

### Standard Build Process

```bash
# Install dependencies
npm ci --prefer-offline

# Run type checking
npm run typecheck

# Run linting
npm run lint

# Build for production
npm run build:prod

# Preview the production build
npm run preview
```

### Using Deployment Scripts

#### Windows (PowerShell)

```powershell
# Run the automated deployment script
.\deploy.ps1
```

#### Linux/macOS (Bash)

```bash
# Make the script executable
chmod +x deploy.sh

# Run the automated deployment script
./deploy.sh
```

## Production Deployment Options

### Option 1: Docker Deployment (Recommended)

#### Using Docker Compose

```bash
# Build and start the application
docker-compose up -d --build

# Check container status
docker-compose ps

# View logs
docker-compose logs -f ro-customer-frontend

# Stop the application
docker-compose down
```

#### Manual Docker Build

```bash
# Build the Docker image
docker build -t ro-customer-management:latest .

# Run the container
docker run -d \
  -p 80:80 \
  --name ro-customer-app \
  --restart unless-stopped \
  ro-customer-management:latest

# View logs
docker logs -f ro-customer-app

# Stop and remove container
docker stop ro-customer-app
docker rm ro-customer-app
```

### Option 2: Static Hosting Platforms

#### Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

#### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build:prod
netlify deploy --prod --dir=dist
```

#### GitHub Pages

```bash
# Build for production
npm run build:prod

# Deploy to GitHub Pages (requires gh-pages package)
npm install -g gh-pages
gh-pages -d dist
```

### Option 3: Traditional VPS/Server

#### Using Nginx

1. **Build the application:**
   ```bash
   npm run build:prod
   ```

2. **Copy files to server:**
   ```bash
   scp -r dist/* user@your-server:/var/www/ro-customer-app/
   ```

3. **Configure Nginx:**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /var/www/ro-customer-app;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       # Enable gzip compression
       gzip on;
       gzip_types text/plain text/css application/json application/javascript text/xml;
   }
   ```

4. **Restart Nginx:**
   ```bash
   sudo systemctl restart nginx
   ```

## Build Optimization

### Production Build Features

The production build includes:

- ✅ **Minification**: Code is minified using Terser
- ✅ **Tree Shaking**: Unused code is removed
- ✅ **Code Splitting**: Vendor chunks for better caching
- ✅ **Console Removal**: All console.log statements removed
- ✅ **Source Maps**: Disabled for security
- ✅ **Asset Optimization**: Images and fonts optimized

### Bundle Analysis

To analyze the bundle size:

```bash
# Install bundle analyzer
npm install -g vite-bundle-visualizer

# Build and analyze
npm run build:prod
npx vite-bundle-visualizer
```

## Continuous Integration/Deployment

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Type check
      run: npm run typecheck
      
    - name: Lint
      run: npm run lint
      
    - name: Build
      run: npm run build:prod
      env:
        VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
        VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
      
    - name: Deploy to Server
      # Add your deployment steps here
```

## Verification Checklist

Before deploying to production, verify:

- [ ] All environment variables are set correctly
- [ ] TypeScript compilation succeeds without errors
- [ ] ESLint passes without errors
- [ ] Application runs correctly in preview mode
- [ ] All features work as expected
- [ ] Performance is acceptable (Lighthouse score)
- [ ] Security headers are configured
- [ ] SSL certificate is installed (if applicable)
- [ ] Database connections are working
- [ ] Error tracking is enabled

## Post-Deployment

### Health Checks

```bash
# Check if the application is running
curl -I http://your-domain.com

# Check Docker container health
docker inspect --format='{{.State.Health.Status}}' ro-customer-frontend
```

### Monitoring

- Monitor application logs
- Set up error tracking (e.g., Sentry)
- Monitor server resources (CPU, memory)
- Set up uptime monitoring

## Rollback Procedure

If deployment fails:

### Docker Rollback

```bash
# Stop current deployment
docker-compose down

# Restore from backup
docker-compose up -d --build <previous-version>
```

### Static File Rollback

```bash
# Restore from backup
cd /var/www/ro-customer-app
rm -rf *
tar -xzf ../backups/dist_backup_TIMESTAMP.tar.gz
```

## Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
npm run clean
rm -rf node_modules
npm install
npm run build:prod
```

### Docker Build Issues

```bash
# Clear Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

### Environment Variables Not Loading

- Ensure `.env.production` exists
- Check file permissions
- Verify variable names start with `VITE_`
- Restart the build process

## Performance Tips

1. **Enable CDN**: Use a CDN for static assets
2. **Implement Caching**: Configure browser caching headers
3. **Compress Assets**: Enable gzip/brotli compression
4. **Optimize Images**: Use WebP format when possible
5. **Lazy Load**: Implement lazy loading for routes

## Security Recommendations

1. **HTTPS Only**: Always use SSL/TLS in production
2. **Security Headers**: Configure CSP, HSTS, X-Frame-Options
3. **Rate Limiting**: Implement API rate limiting
4. **Regular Updates**: Keep dependencies up to date
5. **Secret Management**: Use environment variables for secrets

## Support

For build and deployment issues:
1. Check the logs: `docker-compose logs -f`
2. Review error messages carefully
3. Consult the README.md for additional information
4. Contact the development team

---

**Last Updated**: December 2025
**Version**: 1.0.0
