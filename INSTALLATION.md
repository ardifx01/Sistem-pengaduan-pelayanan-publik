# 🚀 Panduan Instalasi Sistem Pengaduan Kabupaten Badung

## 📋 Requirements

### Software yang Diperlukan:

- **PHP 8.2+** dengan ekstensi:
  - BCMath
  - Ctype
  - Fileinfo
  - JSON
  - Mbstring
  - OpenSSL
  - PDO
  - Tokenizer
  - XML
  - SQLite3 (untuk development)
- **Composer** (PHP package manager)
- **Node.js 18+**
- **npm** atau **yarn**
- **Git**

### Recommended Tools:

- **SQLite Browser** untuk melihat database
- **Postman** untuk testing API
- **VS Code** dengan ekstensi PHP & React

## 📦 Langkah-langkah Instalasi

### 1. Clone Repository

```bash
git clone <repository-url>
cd project_test2
```

### 2. Setup Backend (Laravel API)

#### a. Install Dependencies

```bash
cd api
composer install
```

#### b. Environment Configuration

```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

#### c. Edit .env file:

```env
APP_NAME="Pengaduan Badung"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000

# Database (SQLite untuk development)
DB_CONNECTION=sqlite

# Email (log untuk testing, smtp untuk production)
MAIL_MAILER=log
MAIL_FROM_ADDRESS=noreply@badung.go.id
MAIL_FROM_NAME="Kabupaten Badung"

# Queue (database untuk simplicity)
QUEUE_CONNECTION=database

# Cache
CACHE_STORE=database
```

#### d. Database Setup

```bash
# Create database file
touch database/database.sqlite

# Run migrations
php artisan migrate

# Seed with sample data
php artisan db:seed

# Create storage symlink
php artisan storage:link
```

#### e. Verify Installation

```bash
# Start server
php artisan serve
# Should run on http://localhost:8000

# In another terminal, start queue worker
php artisan queue:work
```

### 3. Setup Frontend (React)

#### a. Install Dependencies

```bash
cd ../frontend
npm install
```

#### b. Environment Configuration

```bash
# Create .env file
echo "REACT_APP_API_URL=http://localhost:8000/api" > .env
```

#### c. Start Development Server

```bash
npm start
# Should run on http://localhost:3000
```

## 🧪 Verifikasi Instalasi

### 1. Test Backend API

#### Health Check:

```bash
curl http://localhost:8000/api/services
# Should return list of services
```

#### Authentication Test:

```bash
# Login as admin
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@badung.go.id","password":"password"}'
```

### 2. Test Frontend

- Buka browser ke `http://localhost:3000`
- Login dengan akun admin: `admin@badung.go.id` / `password`
- Coba buat pengaduan baru
- Cek notifikasi di header

### 3. Test Email Notifications

```bash
# Cek log email
tail -f api/storage/logs/laravel.log | grep -i mail
```

## 🔧 Konfigurasi Production

### 1. Database Production (MySQL/PostgreSQL)

#### a. Install MySQL

```bash
# Ubuntu/Debian
sudo apt install mysql-server

# macOS dengan Homebrew
brew install mysql
```

#### b. Update .env:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=pengaduan_badung
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

#### c. Create Database:

```sql
CREATE DATABASE pengaduan_badung CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Email Production (SMTP)

#### a. Update .env:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@badung.go.id
MAIL_FROM_NAME="Kabupaten Badung"
```

### 3. Queue Production (Redis)

#### a. Install Redis:

```bash
# Ubuntu/Debian
sudo apt install redis-server

# macOS dengan Homebrew
brew install redis
```

#### b. Update .env:

```env
QUEUE_CONNECTION=redis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379
```

### 4. Web Server Configuration

#### a. Nginx Configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/project_test2/api/public;

    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

#### b. Frontend Build:

```bash
cd frontend
npm run build
# Deploy build/ folder to web server
```

### 5. Process Manager (Supervisor)

#### a. Install Supervisor:

```bash
sudo apt install supervisor
```

#### b. Create config `/etc/supervisor/conf.d/pengaduan-worker.conf`:

```ini
[program:pengaduan-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /path/to/project_test2/api/artisan queue:work --sleep=3 --tries=3
autostart=true
autorestart=true
user=www-data
numprocs=1
redirect_stderr=true
stdout_logfile=/path/to/project_test2/api/storage/logs/worker.log
```

#### c. Start Supervisor:

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start pengaduan-worker:*
```

## 🔒 Security Configuration

### 1. Laravel Security

```bash
# Set proper permissions
chmod -R 755 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache

# Update .env for production
APP_ENV=production
APP_DEBUG=false
```

### 2. Database Security

- Create dedicated database user with limited privileges
- Use strong passwords
- Restrict database access by IP

### 3. Web Server Security

- Enable HTTPS with SSL certificate
- Configure firewall rules
- Regular security updates

## 🚨 Troubleshooting

### Common Issues:

#### 1. Storage Permission Error:

```bash
chmod -R 775 storage
chmod -R 775 bootstrap/cache
```

#### 2. Database Connection Error:

- Check database credentials in .env
- Ensure database server is running
- Check firewall rules

#### 3. Email Not Sending:

- Check SMTP credentials
- Verify firewall allows SMTP ports
- Check email logs in storage/logs/

#### 4. Queue Jobs Not Processing:

```bash
# Restart queue worker
php artisan queue:restart
php artisan queue:work
```

#### 5. Frontend API Connection Error:

- Check REACT_APP_API_URL in frontend/.env
- Verify CORS configuration in api/config/cors.php
- Check if backend server is running

### Debug Commands:

```bash
# Clear caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# Check logs
tail -f storage/logs/laravel.log

# Test email configuration
php artisan tinker
> Mail::raw('Test email', function($msg) { $msg->to('test@example.com')->subject('Test'); });
```

## 📞 Support

Untuk bantuan lebih lanjut:

1. Cek file TESTING.md untuk panduan testing
2. Periksa logs di storage/logs/
3. Gunakan php artisan tinker untuk debugging
4. Cek dokumentasi Laravel dan React oficial

## 🎯 Next Steps

Setelah instalasi berhasil:

1. Customize tampilan sesuai branding Kabupaten Badung
2. Setup monitoring dan backup
3. Configure SSL certificate
4. Setup domain dan DNS
5. Train users dan admin
6. Setup monitoring logs dan performance
