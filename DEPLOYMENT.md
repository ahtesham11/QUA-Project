# TaxWise AI — Deployment Guide

This guide covers deploying both the **frontend** (on Netlify) and **backend** (multiple options) for production.

---

## Frontend Deployment (Netlify)

### 1. Prepare the Frontend

```bash
cd frontend
npm run build
```

This creates a `dist/` folder optimized for production.

### 2. Deploy to Netlify

#### Option A: Using Netlify CLI

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

#### Option B: GitHub Integration (Recommended)

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com) and sign up
3. Click **"Connect to Git"** → Select your repository
4. **Build settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Environment variables: Set `VITE_API_BASE_URL` to your backend URL
5. Click **"Deploy"**

Netlify will automatically rebuild and deploy on every push to `main`.

#### Option C: Manual Upload

1. Run `npm run build` to create the `dist/` folder
2. Drag and drop the `dist/` folder into Netlify's deploy UI at [app.netlify.com](https://app.netlify.com)

### 3. Environment Variables on Netlify

Set in **Site Settings → Build & Deploy → Environment:**

```
VITE_API_BASE_URL=https://your-backend-api.com
```

### 4. Configure Custom Domain

In **Site Settings → Domain Management:**
- Add your custom domain (e.g., `taxwiseai.com`)
- Update DNS records to point to Netlify

### 5. Enable HTTPS

Netlify provides free SSL/TLS certificates automatically. HTTPS is required for the `document.referrer` API used in some features.

---

## Backend Deployment

### Option 1: Heroku (Easiest for Small Projects)

#### Prerequisites
- [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
- GitHub/GitLab account linked to Heroku

#### Steps

1. **Create a Heroku app:**
   ```bash
   heroku create taxwise-api
   ```

2. **Add MySQL add-on:**
   ```bash
   heroku addons:create cleardb:ignite -a taxwise-api
   ```
   This creates a MySQL database and sets `CLEARDB_DATABASE_URL` environment variable.

3. **Set environment variables:**
   ```bash
   heroku config:set SECRET_KEY="your-secret-key" -a taxwise-api
   heroku config:set DEBUG="False" -a taxwise-api
   heroku config:set ALLOWED_HOSTS="taxwise-api.herokuapp.com,yourdomain.com" -a taxwise-api
   heroku config:set GROQ_API_KEY="your-groq-api-key" -a taxwise-api
   heroku config:set CORS_ALLOWED_ORIGINS="https://yourdomain.com" -a taxwise-api
   heroku config:set DB_ENGINE="mysql" -a taxwise-api
   ```

4. **Create Procfile** in backend root:
   ```
   web: gunicorn config.wsgi --log-file -
   release: python manage.py migrate
   ```

5. **Update requirements.txt** to include gunicorn:
   ```
   gunicorn
   ```

6. **Deploy:**
   ```bash
   git push heroku main
   ```

   Heroku will run migrations automatically on deploy.

### Option 2: AWS (EC2 + RDS)

#### Prerequisites
- AWS account
- EC2 instance (Ubuntu 20.04+)
- RDS MySQL instance

#### Steps

1. **SSH into EC2 instance:**
   ```bash
   ssh -i your-key.pem ec2-user@your-instance-ip
   ```

2. **Install dependencies:**
   ```bash
   sudo apt update
   sudo apt install python3-pip python3-venv mysql-client-core-8.0 supervisor nginx git
   ```

3. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/taxwise-ai.git
   cd taxwise-ai/backend
   ```

4. **Create virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   pip install gunicorn
   ```

5. **Configure Django settings (.env):**
   ```
   SECRET_KEY=your-secret-key
   DEBUG=False
   ALLOWED_HOSTS=your-domain.com,www.your-domain.com
   DB_ENGINE=mysql
   DB_NAME=taxwise_db
   DB_USER=admin
   DB_PASSWORD=your-strong-password
   DB_HOST=your-rds-endpoint.rds.amazonaws.com
   DB_PORT=3306
   GROQ_API_KEY=your-groq-api-key
   CORS_ALLOWED_ORIGINS=https://your-domain.com
   ```

6. **Run migrations:**
   ```bash
   python manage.py migrate
   python manage.py createsuperuser
   ```

7. **Collect static files:**
   ```bash
   python manage.py collectstatic --noinput
   ```

8. **Configure Gunicorn** (`/etc/supervisor/conf.d/taxwise.conf`):
   ```ini
   [program:taxwise]
   directory=/home/ubuntu/taxwise-ai/backend
   command=/home/ubuntu/taxwise-ai/backend/venv/bin/gunicorn config.wsgi:application --bind 127.0.0.1:8000
   autostart=true
   autorestart=true
   stderr_logfile=/var/log/taxwise/err.log
   stdout_logfile=/var/log/taxwise/out.log
   user=ubuntu
   ```

9. **Configure Nginx** (`/etc/nginx/sites-available/taxwise`):
   ```nginx
   server {
       listen 80;
       server_name your-domain.com www.your-domain.com;

       location / {
           proxy_pass http://127.0.0.1:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }

       location /static/ {
           alias /home/ubuntu/taxwise-ai/backend/staticfiles/;
       }
   }
   ```

10. **Enable and start services:**
    ```bash
    sudo ln -s /etc/nginx/sites-available/taxwise /etc/nginx/sites-enabled/
    sudo systemctl start supervisor
    sudo systemctl start nginx
    sudo systemctl enable supervisor
    sudo systemctl enable nginx
    ```

11. **Set up HTTPS with Let's Encrypt:**
    ```bash
    sudo apt install certbot python3-certbot-nginx
    sudo certbot --nginx -d your-domain.com
    ```

### Option 3: DigitalOcean App Platform

1. Push code to GitHub
2. Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
3. Click **"Create App"** → Select your GitHub repository
4. Configure:
   - **Build Command:** `pip install -r backend/requirements.txt && python backend/manage.py collectstatic`
   - **Run Command:** `gunicorn config.wsgi --bind 0.0.0.0:8080`
   - **Environment Variables:** Set `DB_ENGINE`, `SECRET_KEY`, `GROQ_API_KEY`, etc.
5. Add MySQL database from DigitalOcean Database cluster
6. Deploy

### Option 4: Docker + Any Cloud

Create [backend/Dockerfile](./backend/Dockerfile):

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn

COPY . .

RUN python manage.py collectstatic --noinput

EXPOSE 8000

CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000"]
```

Create [backend/.dockerignore](./backend/.dockerignore):

```
*.pyc
__pycache__
.venv
.env
db.sqlite3
```

Build and push to Docker Hub:

```bash
docker build -t yourusername/taxwise-api .
docker push yourusername/taxwise-api
```

Then deploy to any container service (AWS ECS, Google Cloud Run, Azure Container Instances, Render, Fly.io, etc.).

---

## Database Setup (MySQL)

### Local Development with MySQL

```bash
# Install MySQL (if not already installed)
# macOS: brew install mysql
# Ubuntu: sudo apt install mysql-server
# Windows: Download from mysql.com

# Create database and user
mysql -u root -p
CREATE DATABASE taxwise_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'taxwise_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON taxwise_db.* TO 'taxwise_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Update .env
DB_ENGINE=mysql
DB_NAME=taxwise_db
DB_USER=taxwise_user
DB_PASSWORD=strong_password
DB_HOST=localhost
DB_PORT=3306

# Run migrations
python manage.py migrate
```

### Production MySQL Setup

For cloud MySQL services:
- **AWS RDS:** Configure security groups to allow inbound traffic on port 3306
- **Azure Database for MySQL:** Enable "Allow access to Azure services"
- **DigitalOcean Managed Databases:** Add app to trusted sources
- **Google Cloud SQL:** Configure Cloud SQL Auth Proxy or IP whitelist

---

## Monitoring & Logging

### Backend Logs

**Heroku:**
```bash
heroku logs -t -a taxwise-api
```

**AWS EC2:**
```bash
tail -f /var/log/taxwise/out.log
tail -f /var/log/taxwise/err.log
```

### Error Tracking (Optional)

Add [Sentry](https://sentry.io/) for error tracking:

```bash
pip install sentry-sdk
```

Add to `settings.py`:

```python
import sentry_sdk

sentry_sdk.init(
    dsn=os.getenv("SENTRY_DSN"),
    traces_sample_rate=0.1
)
```

Set environment variable:
```
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
```

---

## Post-Deployment Checklist

- ✅ Backend API responds to requests
- ✅ Frontend successfully connects to backend API
- ✅ Admin login works (username: `admin`, password: `admin123`)
- ✅ Product recommendations generate correctly
- ✅ AI Assistant responds (or falls back gracefully)
- ✅ Database migrations completed
- ✅ HTTPS enabled for both frontend and backend
- ✅ Environment variables set correctly
- ✅ CORS origin matches frontend domain
- ✅ Error logging and monitoring configured
- ✅ Database backups configured (for production)

---

## Scaling Considerations

- **Database:** Use read replicas for high-traffic scenarios
- **Caching:** Add Redis for session/data caching
- **CDN:** Use CloudFlare or CloudFront for static assets
- **API Rate Limiting:** Add `django-ratelimit` for protection
- **Load Balancing:** Use load balancers if backend scales to multiple instances

---

## Support

For issues during deployment:
1. Check logs (see Monitoring section above)
2. Verify environment variables are set correctly
3. Ensure database connectivity
4. Test CORS configuration with the frontend domain
5. Review the main [README.md](../README.md) for development setup

