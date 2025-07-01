# Manual Test Checklist untuk Sistem Pengaduan Kabupaten Badung

## ✅ Backend Tests (Laravel API)

### Authentication & User Management

- [ ] POST `/api/register` - Registrasi user baru
- [ ] POST `/api/login` - Login user
- [ ] GET `/api/user` - Get user profile (with auth)
- [ ] POST `/api/logout` - Logout user

### Services

- [ ] GET `/api/services` - List all services (public)
- [ ] GET `/api/services/{id}` - Get service detail (public)
- [ ] POST `/api/services` - Create service (admin only)
- [ ] PUT `/api/services/{id}` - Update service (admin only)
- [ ] DELETE `/api/services/{id}` - Delete service (admin only)

### Complaints

- [ ] GET `/api/complaints` - List complaints (own for user, all for admin)
- [ ] POST `/api/complaints` - Create new complaint
- [ ] GET `/api/complaints/{id}` - Get complaint detail
- [ ] PUT `/api/complaints/{id}/status` - Update status (admin only)
- [ ] POST `/api/complaints/track` - Track complaint by registration number
- [ ] GET `/api/complaints-statistics` - Get statistics (admin only)

### Downloads

- [ ] GET `/api/complaints/{id}/documents/{docId}/download` - Download complaint document
- [ ] GET `/api/complaints/{id}/result/download` - Download result document

### Notifications

- [ ] GET `/api/notifications` - Get user notifications
- [ ] GET `/api/notifications/unread-count` - Get unread count
- [ ] PUT `/api/notifications/{id}/read` - Mark as read
- [ ] PUT `/api/notifications/mark-all-read` - Mark all as read
- [ ] DELETE `/api/notifications/{id}` - Delete notification

## ✅ Frontend Tests (React)

### Public Pages

- [ ] `/` - Home page with service info
- [ ] `/login` - Login form
- [ ] `/register` - Registration form
- [ ] `/services` - Services list
- [ ] `/track` - Track complaint with registration number

### User Pages (Login Required)

- [ ] `/complaints/my` - My complaints list
- [ ] `/complaints/create` - Create new complaint form
- [ ] `/complaints/{id}` - Complaint detail with documents & status history

### Admin Pages

- [ ] `/admin` - Admin dashboard with statistics
- [ ] `/admin/complaints` - Manage all complaints, update status
- [ ] `/admin/services` - Manage services (CRUD)

### Notifications

- [ ] Notification icon in header (when logged in)
- [ ] Notification dropdown with list
- [ ] Unread count badge
- [ ] Mark as read functionality

### Download Features

- [ ] Download complaint documents from detail page
- [ ] Download result documents when available

## ✅ Email Notifications Tests

### Automatic Email Sending

- [ ] Email sent when new complaint is created
- [ ] Email sent when complaint status is changed by admin
- [ ] Emails contain correct complaint information
- [ ] Emails have working tracking links

### Queue Processing

- [ ] Queue worker processes email jobs
- [ ] Failed jobs are handled properly
- [ ] Email logs are recorded

## 🧪 Test Data Available

### Default Users (from seeders):

- **Admin**: admin@badung.go.id / password
- **Users**: user1@example.com to user10@example.com / password

### Default Services:

- Various government services with different categories
- Complete with requirements and processing times

### Sample Complaints:

- 50 dummy complaints with various statuses
- Documents attached to some complaints
- Status history for tracking

## 🚀 Running the Application

### Start Backend:

```bash
cd api
php artisan serve
# Runs on http://localhost:8001 (or 8000)
```

### Start Queue Worker:

```bash
cd api
php artisan queue:work
# Processes background jobs including email notifications
```

### Start Frontend:

```bash
cd frontend
npm start
# Runs on http://localhost:3000
```

## 📧 Email Configuration

Currently using `log` driver - emails are written to `api/storage/logs/laravel.log`.

To use real email:

1. Update `.env` with SMTP settings:

```env
MAIL_MAILER=smtp
MAIL_HOST=your-smtp-host
MAIL_PORT=587
MAIL_USERNAME=your-email
MAIL_PASSWORD=your-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@badung.go.id
```

## 📱 Features Status

### ✅ Completed Features:

- User registration & authentication
- Service management (CRUD for admin)
- Complaint submission with file upload
- Complaint status management
- Admin dashboard with statistics
- Email notifications (create & status change)
- Real-time notifications in frontend
- Document download (both complaint docs & results)
- Complaint tracking by registration number
- Responsive UI with Material-UI
- Role-based access control

### 🔄 Ready for Enhancement:

- Real-time WebSocket notifications
- Advanced reporting & analytics
- Multi-language support
- Mobile app with React Native
- Integration with other government systems
- Advanced file management
- Bulk operations for admin

## 🐛 Known Issues:

- None currently identified
- All major features implemented and working

## 📊 Database:

- SQLite database: `api/database/database.sqlite`
- Can be viewed with SQLite browser tools
- All tables populated with sample data via seeders
