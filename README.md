# Sistem Pengaduan Pelayanan Publik Kabupaten Badung

Aplikasi web untuk mengelola pengaduan pelayanan publik Pemerintah Kabupaten Badung menggunakan Laravel sebagai backend API dan React TypeScript sebagai frontend.

## 🚀 Fitur Utama

### Untuk Masyarakat:

- ✅ Registrasi dan login akun (langsung aktif)
- ✅ Daftar layanan yang tersedia
- ✅ Submit pengaduan dengan upload dokumen
- ✅ Tracking status pengaduan
- ✅ Riwayat pengaduan
- ✅ Notifikasi email untuk status pengaduan
- ✅ Download dokumen hasil layanan

### Untuk Admin:

- ✅ Dashboard statistik pengaduan
- ✅ Kelola layanan (CRUD)
- ✅ Kelola pengaduan (update status, upload dokumen hasil)
- ✅ Riwayat perubahan status
- ✅ Notifikasi otomatis ke pemohon

## 🛠️ Teknologi yang Digunakan

### Backend (API):

- **Laravel 11** - PHP Framework
- **SQLite** - Database (untuk development)
- **Laravel Sanctum** - API Authentication
- **Laravel Notifications** - Email & Database Notifications
- **Laravel Queue** - Background Job Processing

### Frontend:

- **React 18** - UI Library
- **TypeScript** - Type Safety
- **Material-UI (MUI)** - UI Components
- **React Router** - Navigation
- **Axios** - HTTP Client

## 📁 Struktur Proyek

```
project_test/
├── api/                    # Backend Laravel
│   ├── app/
│   │   ├── Http/Controllers/Api/
│   │   ├── Models/
│   │   ├── Notifications/
│   │   └── ...
│   ├── database/
│   │   ├── migrations/
│   │   ├── seeders/
│   │   └── database.sqlite
│   └── routes/api.php
├── frontend/               # Frontend React
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── contexts/
│   │   └── ...
│   └── public/
└── README.md
```

## 🚀 Instalasi dan Setup

### Prerequisites

- PHP 8.2+
- Composer
- Node.js 18+
- npm/yarn

### 1. Clone Repository

```bash
git clone git@github.com:mahfudz19/Sistem-pengaduan-pelayanan-publik.git
cd Sistem-pengaduan-pelayanan-publik
```

### 2. Setup Backend (Laravel API)

```bash
cd api
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate:fresh --seed
php artisan storage:link
```

### 3. Setup Frontend (React)

```bash
cd ../frontend
npm install
```

### 4. Konfigurasi Environment

#### Backend (.env):

```env
APP_NAME="Pengaduan Badung"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000

DB_CONNECTION=sqlite

MAIL_MAILER=log
QUEUE_CONNECTION=database
```

#### Frontend (.env):

```env
REACT_APP_API_URL=http://localhost:8000/api
```

## 🏃‍♂️ Menjalankan Aplikasi

### 1. Jalankan Backend (Terminal 1):

```bash
cd api
php artisan serve
# Backend akan berjalan di http://localhost:8000
```

### 2. Jalankan Queue Worker (Terminal 2):

```bash
cd api
php artisan queue:work
# Untuk memproses notifikasi email
```

### 3. Jalankan Frontend (Terminal 3):

```bash
cd frontend
npm start
# Frontend akan berjalan di http://localhost:3000
```

## 👥 User Default

Setelah menjalankan seeder, tersedia user default:

### Admin:

- **Email**: admin@badung.go.id
- **Password**: admin123

### Operator:

- **Email**: operator@badung.go.id
- **Password**: operator123

### User Test:

- **Email**: user1@test.com s/d user10@test.com
- **Password**: password

## 📊 Database Schema

### Users

- id, name, nik, email, phone, address, birth_date, job, password, role, is_active

### Services

- id, name, description, category, requirements, processing_time, cost

### Complaints

- id, registration_number, user_id, service_id, applicant_name, applicant_nik, applicant_address, applicant_phone, applicant_job, applicant_birth_date, description, status, notes, result_document

### Complaint Documents

- id, complaint_id, document_name, document_type, file_path, file_size

### Complaint Status Histories

- id, complaint_id, status, notes, user_id, created_at

### Notifications

- id, type, notifiable_type, notifiable_id, data, read_at, created_at

## 🔧 API Endpoints

### Public Routes:

- `POST /api/register` - Registrasi user
- `POST /api/login` - Login
- `GET /api/services` - Daftar layanan
- `POST /api/complaints/track` - Tracking pengaduan

### Protected Routes:

- `GET /api/user` - Info user login
- `GET /api/complaints` - Daftar pengaduan
- `POST /api/complaints` - Submit pengaduan
- `PUT /api/complaints/{id}/status` - Update status (admin)
- `GET /api/notifications` - Notifikasi user
- `GET /api/complaints/{id}/documents/{docId}/download` - Download dokumen
- `GET /api/complaints/{id}/result/download` - Download hasil

## 📧 Notifikasi Email

Sistem mengirimkan notifikasi email otomatis untuk:

1. **Pengaduan Baru** - Konfirmasi penerimaan pengaduan
2. **Perubahan Status** - Update status pengaduan

Email menggunakan queue system untuk performa yang lebih baik.

## 📱 Fitur Frontend

### Halaman Public:

- **Login** - Halaman login
- **Register** - Registrasi akun baru
- **Home** - Halaman utama dengan info layanan
- **Services** - Daftar layanan tersedia
- **Track Complaint** - Tracking pengaduan dengan nomor registrasi

### Halaman User (Login Required):

- **My Complaints** - Daftar pengaduan milik user
- **Create Complaint** - Form submit pengaduan baru
- **Complaint Detail** - Detail pengaduan dan riwayat status

### Halaman Admin:

- **Dashboard** - Statistik dan overview pengaduan
- **Admin Complaints** - Kelola semua pengaduan
- **Admin Services** - Kelola layanan (CRUD)

## 🔒 Keamanan

- Authentication menggunakan Laravel Sanctum
- Protected routes dengan middleware auth
- Role-based access (user/admin)
- File upload validation
- Input validation dan sanitization

## 📂 Upload Files

File yang diupload disimpan di:

- **Documents**: `storage/app/public/documents/`
- **Results**: `storage/app/public/results/`

## 🐛 Debugging

### Melihat Log:

```bash
# Laravel logs
tail -f api/storage/logs/laravel.log

# Email logs (jika menggunakan mail log driver)
tail -f api/storage/logs/laravel.log | grep -i mail
```

### Melihat Database SQLite:

Database SQLite tersimpan di: `api/database/database.sqlite`

Bisa dibuka dengan tools seperti:

- SQLite Browser
- DBeaver
- VS Code SQLite extension

## 🚀 Deployment

### Production Setup:

1. Gunakan MySQL/PostgreSQL untuk database production
2. Setup proper mail driver (SMTP, Mailgun, etc.)
3. Configure queue dengan Redis/database
4. Setup supervisor untuk queue worker
5. Use production build untuk React

### Environment Production:

```env
APP_ENV=production
APP_DEBUG=false
DB_CONNECTION=mysql
MAIL_MAILER=smtp
QUEUE_CONNECTION=redis
```

## 📋 To-Do / Pengembangan Selanjutnya

- [ ] Multi-language support (Bahasa Indonesia)
- [ ] Real-time notifications dengan WebSocket
- [ ] Export data pengaduan (Excel/PDF)
- [ ] Advanced reporting dan analytics
- [ ] Mobile app dengan React Native
- [ ] Integration dengan sistem lain (SIMPEG, dll)

## 🤝 Kontribusi

Silakan buat issue atau pull request untuk improvement.

## 📝 Lisensi

Proyek ini dibuat untuk keperluan pemerintahan Kabupaten Badung.

---

**Developer**: AI Assistant  
**Tanggal**: Juli 2025  
**Versi**: 1.0.0
