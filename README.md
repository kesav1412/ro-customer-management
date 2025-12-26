# RO Customer Management System

A modern React-based customer management system for RO (Reverse Osmosis) water purifier service providers. Built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

- 📊 **Dashboard**: Real-time customer statistics and insights
- 👥 **Customer Management**: Complete customer database with CRUD operations
- 🔍 **Advanced Search**: Filter and search customers by multiple criteria
- 📄 **Data Export**: Export customer data to CSV and Excel formats
- 🎨 **Modern UI**: Built with shadcn/ui components and Radix UI
- 🌙 **Dark Mode**: Toggle between light and dark themes
- 💾 **Offline Support**: Local storage integration
- 🔐 **Supabase Integration**: Cloud database with real-time sync

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Database**: Supabase
- **State Management**: React Hooks
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- Supabase account (for database)

## Getting Started

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd project1

# Install dependencies
npm install
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env.development

# Edit .env.development and add your Supabase credentials
```

Required environment variables:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

### 3. Development

```bash
# Start development server
npm run dev

# Run type checking
npm run typecheck

# Run linting
npm run lint
```

The application will open at [http://localhost:5173](http://localhost:5173)

## Building for Production

### Option 1: Local Build

```bash
# Build for production
npm run build:prod

# Preview production build
npm run preview
```

### Option 2: Using Deployment Script (Windows)

```powershell
# Run PowerShell deployment script
.\deploy.ps1
```

### Option 3: Using Deployment Script (Linux/Mac)

```bash
# Make script executable
chmod +x deploy.sh

# Run deployment script
./deploy.sh
```

## Docker Deployment

### Build and Run with Docker Compose

```bash
# Build and start the container
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
```

### Manual Docker Build

```bash
# Build the image
docker build -t ro-customer-management .

# Run the container
docker run -d -p 80:80 --name ro-customer-app ro-customer-management
```

The application will be available at [http://localhost](http://localhost)

## Project Structure

```
project1/
├── src/
│   ├── components/       # React components
│   │   ├── ui/          # shadcn/ui components
│   │   ├── CustomerForm.tsx
│   │   ├── CustomerList.tsx
│   │   └── Dashboard.tsx
│   ├── contexts/        # React contexts
│   ├── hooks/           # Custom hooks
│   ├── lib/            # Utilities and services
│   │   ├── supabase.ts
│   │   ├── storage.ts
│   │   └── export.ts
│   ├── App.tsx
│   └── main.tsx
├── public/             # Static assets
├── Dockerfile         # Docker configuration
├── docker-compose.yml # Docker Compose configuration
├── nginx.conf        # Nginx configuration
├── deploy.ps1        # Windows deployment script
├── deploy.sh         # Linux/Mac deployment script
└── vite.config.ts    # Vite configuration
```

## Environment Variables

### Development (.env.development)
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_development_key
VITE_ENABLE_ANALYTICS=false
```

### Production (.env.production)
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_key
VITE_ENABLE_ANALYTICS=true
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run build:prod` - Build for production (optimized)
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run typecheck` - Run TypeScript type checking
- `npm run clean` - Clean build directory

## Deployment Options

### 1. Static Hosting (Vercel, Netlify)
- Build the app: `npm run build:prod`
- Deploy the `dist` folder

### 2. VPS/Server
- Use the deployment scripts provided
- Or use Docker Compose

### 3. Docker
- Build and deploy using the Dockerfile
- Use docker-compose for easy orchestration

## Performance Optimization

The production build includes:
- Code splitting for optimal loading
- Minification and tree shaking
- Console log removal
- Gzip compression (nginx)
- Static asset caching
- Lazy loading of components

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is private and proprietary.

## Support

For support, please contact your system administrator or development team.
