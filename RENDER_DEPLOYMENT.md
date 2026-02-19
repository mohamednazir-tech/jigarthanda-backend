# 🌐 Deploy Jigarthanda Backend to Render.com

## 📋 Prerequisites
- Render.com account (free tier available)
- GitHub account
- Backend files ready

## 🚀 Step-by-Step Deployment

### 1. **Create GitHub Repository**
```bash
# Create new repo on GitHub: jigarthanda-backend
# Upload backend files to GitHub
```

### 2. **Setup Render Service**
1. Go to [Render.com](https://render.com)
2. Sign up/login with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Select "jigarthanda-backend" repo

### 3. **Configure Service**
```
Name: jigarthanda-backend
Environment: Node
Build Command: npm install
Start Command: node render-server.js
Instance Type: Free
Region: Oregon (or nearest)
```

### 4. **Environment Variables**
```
NODE_VERSION: 18
PORT: 3000
```

### 5. **Database Setup**
1. Click "New +" → "PostgreSQL"
2. Name: jigarthanda-db
3. Plan: Free
4. Region: Same as backend

### 6. **Connect Database**
Add these environment variables to your backend service:
```
DATABASE_URL: [Get from PostgreSQL service]
DB_HOST: [Get from PostgreSQL service]
DB_PORT: 5432
DB_NAME: jigarthanda_db
DB_USER: [Get from PostgreSQL service]
DB_PASSWORD: [Get from PostgreSQL service]
```

### 7. **Update Mobile App URL**
After deployment, update your mobile app:
```
New URL: https://jigarthanda-backend.onrender.com/trpc
```

## 📱 Update Mobile App
Update `utils/trpc.ts`:
```typescript
export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "https://jigarthanda-backend.onrender.com/trpc",
      transformer: superjson,
    }),
  ],
});
```

## 🔄 Rebuild APK
```bash
eas build --platform android --profile preview --clear-cache
```

## ✅ Benefits
- **24/7 Uptime**: Backend always running
- **Free Tier**: No cost for basic usage
- **SSL**: HTTPS automatically
- **Global CDN**: Fast worldwide access
- **Auto-scaling**: Handles traffic spikes

## 🎯 Testing
1. Backend: `https://jigarthanda-backend.onrender.com/health`
2. Mobile app: Should connect without server errors
3. Features: All POS functionality working

## 📞 Support
- Render docs: https://render.com/docs
- Database: PostgreSQL with pgAdmin
- Logs: Available in Render dashboard
