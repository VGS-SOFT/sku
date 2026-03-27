# Hostinger Business Hosting — Deployment Guide

## Stack
- **Node.js** 20 LTS (via Hostinger Node.js app manager)
- **MySQL 8** (Hostinger managed DB)
- **Redis** (optional: use upstash.io free tier if Hostinger doesn't include Redis)
- **PM2** for process management

---

## 1. Initial Server Setup

```bash
# SSH into your Hostinger VPS
ssh root@YOUR_SERVER_IP

# Install Node 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt-get install -y nodejs

# Install PM2 globally
npm install -g pm2

# Install build tools
apt-get install -y git build-essential
```

## 2. Clone & Install

```bash
cd /var/www
git clone https://github.com/VGS-SOFT/sku.git sku-api
cd sku-api
npm install --production
```

## 3. Environment Variables

Create `/var/www/sku-api/.env` (NEVER commit this file):

```env
NODE_ENV=production
PORT=3001
DATABASE_URL=mysql://DB_USER:DB_PASS@localhost:3306/sku_engine_prod
REDIS_URL=redis://localhost:6379
JWT_SECRET=<run: openssl rand -hex 64>
JWT_REFRESH_SECRET=<run: openssl rand -hex 64>
JWT_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
BCRYPT_ROUNDS=12
THROTTLE_TTL=60
THROTTLE_LIMIT=100
CORS_ORIGINS=https://your-frontend-domain.com
SEED_ADMIN_EMAIL=admin@yourdomain.com
SEED_ADMIN_PASSWORD=<STRONG_PASSWORD_MIN_16_CHARS>
SEED_ADMIN_NAME=Administrator
```

**Generate secrets:**
```bash
openssl rand -hex 64  # Run twice — once for JWT_SECRET, once for JWT_REFRESH_SECRET
```

## 4. Database Setup

```bash
# Run migrations
npx prisma migrate deploy

# Seed initial data (admin user + masters + variants)
npm run prisma:seed
```

## 5. Build & Start

```bash
# Build TypeScript
npm run build

# Start with PM2
pm2 start dist/main.js --name sku-api --max-memory-restart 512M
pm2 save
pm2 startup  # Auto-restart on reboot
```

## 6. Nginx Reverse Proxy (Hostinger Panel or manual)

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    # Force HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name api.yourdomain.com;

    ssl_certificate     /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
    }
}
```

## 7. SSL (Let's Encrypt)

```bash
apt install certbot python3-certbot-nginx
certbot --nginx -d api.yourdomain.com
```

## 8. Updating (CI/CD Manual Flow)

```bash
cd /var/www/sku-api
git pull origin main
npm install --production
npm run build
npx prisma migrate deploy
pm2 restart sku-api
```

## 9. Monitoring

```bash
pm2 status          # Check process status
pm2 logs sku-api    # View live logs
pm2 monit           # CPU/memory dashboard
```

For uptime monitoring, add `https://api.yourdomain.com/api/v1/health/ping` to:
- UptimeRobot (free)
- Hostinger built-in monitoring

## Security Checklist

- [ ] `.env` file is NOT in git (`.gitignore` covers it)
- [ ] JWT secrets generated with `openssl rand -hex 64`
- [ ] Admin password is 16+ chars with symbols
- [ ] CORS_ORIGINS set to exact frontend domain only
- [ ] Nginx HTTPS enforced with HSTS
- [ ] MySQL user has only SELECT/INSERT/UPDATE/DELETE (no DROP/CREATE)
- [ ] Firewall: only ports 22, 80, 443 open
- [ ] PM2 max-memory-restart set
- [ ] `bcryptRounds=12` in production
