# Biloki Admin - Product & Stock Management

A modern Laravel + React + Inertia.js application for managing products, clients, and inventory. Built as a technical assessment project.

## 🎯 Quick Start

### Requirements
- PHP 8.2+
- Node.js 18+
- Composer
- SQLite (included)

### Installation (5 minutes)

```bash
# 1. Install dependencies
composer install
npm install --legacy-peer-deps

# 2. Setup environment
cp .env.example .env
php artisan key:generate

# 3. Create database and seed data
php artisan migrate:fresh
php artisan db:seed

# 4. Build frontend
npm run build

# 5. Start server
php artisan serve
```

Visit `http://localhost:8000` with:
- **Email**: `admin@biloki.local`
- **Password**: `password`

## 📋 Features

### ✅ Product Management
- CRUD operations with validation
- Search by name or SKU
- Status management (active/inactive)
- Automatic stock record creation
- Image URL support

### ✅ Client Management
- Full CRUD operations
- Search by name or email
- Support for individuals and companies
- Contact information tracking
- Status filtering

### ✅ Stock Management
- Real-time inventory tracking
- Low stock alerts
- Stock adjustment with reasons
- Warehouse location tracking
- Reorder level configuration

### ✅ UI/UX
- Dark mode with Tailwind CSS
- Responsive design (mobile-friendly)
- Pagination on all lists
- Real-time search filtering
- Form validation with error messages
- Success/error notifications

## 🏗️ Tech Stack

| Category | Technology |
|----------|-----------|
| Backend | Laravel 11, PHP 8.2+ |
| Frontend | React 18, Inertia.js, Tailwind CSS |
| Database | SQLite with migrations |
| Auth | Laravel Breeze |
| Styling | Tailwind CSS (dark mode) |

## 📁 Project Structure

```
Biloki/
├── app/Http/Controllers/Api/     # RESTful API controllers
├── app/Models/                    # Eloquent ORM models
├── database/seeders/              # Database fixtures
├── resources/js/Pages/Admin/      # React admin pages
├── routes/                        # Web & API routes
└── storage/                       # SQLite database
```

## 🔌 API Endpoints

All endpoints require authentication and use JSON:

```
Products:   GET/POST /api/products, PUT/DELETE /api/products/{id}
Clients:    GET/POST /api/clients, PUT/DELETE /api/clients/{id}
Stock:      GET/POST /api/stocks, PUT/DELETE /api/stocks/{id}
Adjust:     POST /api/stocks/{id}/adjust
```

## 🧪 Development

```bash
# Watch for React/CSS changes
npm run dev

# Build for production
npm run build

# Run tests
php artisan test
```

## 📹 Recording for Assessment

Use OBS Studio (recommended):
1. Add a Display Capture source
2. Start recording before opening the application
3. Navigate through Products → Clients → Stock modules
4. Demonstrate CRUD operations and search functionality
5. Stop recording after testing all features

## 📦 Database Structure

```sql
-- Products
CREATE TABLE products (
    id, name (unique), sku (unique), price, status, ...
);

-- Clients
CREATE TABLE clients (
    id, name, email (unique), type, status, ...
);

-- Stock
CREATE TABLE stocks (
    id, product_id (FK), quantity, reserved, available, ...
);
```

## 🚀 Deployment Ready

- Built with production best practices
- Optimized queries with eager loading
- Input validation and sanitization
- CSRF protection
- Authentication middleware
- Error handling

## 📝 License

Proprietary - Biloki Technical Assessment 2026

Boost provides your agent 15+ tools and skills that help agents build Laravel applications while following best practices.

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
