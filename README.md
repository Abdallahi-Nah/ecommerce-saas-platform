# 🛍️ StorePro - Multi-Tenant E-commerce SaaS Platform

A comprehensive, production-ready multi-tenant e-commerce SaaS platform that enables entrepreneurs to launch and manage their online stores with ease.

![StorePro Banner](https://via.placeholder.com/1200x400/10b981/ffffff?text=StorePro+E-commerce+SaaS)

## 🌟 Live Demo

- **Frontend:** [https://ecommerce-saas-platform-mvi3.vercel.app/](https://ecommerce-saas-platform-mvi3.vercel.app/)
- **Backend API:** [https://ecommerce-saas-platform-coral.vercel.app/](https://ecommerce-saas-platform-coral.vercel.app/)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Project Structure](#-project-structure)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🏪 For Store Owners

- **Multi-Store Management**
  - Create and customize multiple online stores
  - Upload store logo and branding
  - Manage store settings and preferences

- **Product Management**
  - Add, edit, and delete products
  - Multiple product images with Cloudinary integration
  - Inventory tracking and stock management
  - Product categories and filtering

- **Order Management**
  - Real-time order tracking
  - Order status updates (Pending → Confirmed → Processing → Shipped → Delivered)
  - Customer information management
  - Order history and analytics

- **Dashboard & Analytics**
  - Sales statistics and reports
  - Revenue tracking
  - Customer insights
  - Low stock alerts

- **Subscription Plans**
  - Free, Basic ($99/month), and Pro ($299/month) tiers
  - Stripe integration for secure payments
  - Feature limits based on subscription tier

### 🛒 For Customers

- **Shopping Experience**
  - Browse products from multiple stores
  - Advanced search and filtering
  - Shopping cart with real-time updates
  - Responsive design for all devices

- **User Account**
  - Secure registration and authentication
  - Order history and tracking
  - Saved shipping addresses
  - Profile management

- **Checkout & Payments**
  - Secure checkout process
  - Multiple payment options:
    - Credit/Debit Card (Stripe)
    - Cash on Delivery
  - Order confirmation emails
  - Real-time order status updates

### 🌐 Platform Features

- **Multi-Language Support**
  - Arabic (RTL)
  - English (LTR)
  - French (LTR)
  - Easy to add more languages

- **Email Notifications**
  - Welcome emails for new users
  - Order confirmation emails
  - Order status update notifications
  - Store creation confirmations

- **Security**
  - JWT authentication
  - Password hashing with bcrypt
  - Protected routes and role-based access control
  - Secure payment processing

- **SEO Friendly**
  - Clean URLs
  - Optimized meta tags
  - Fast loading times

---

## 🚀 Tech Stack

### Frontend

- **Framework:** React 19
- **Build Tool:** Vite 6
- **Styling:** Tailwind CSS v4
- **Routing:** React Router v7
- **State Management:** Context API
- **HTTP Client:** Axios
- **Icons:** Lucide React
- **Notifications:** React Hot Toast
- **Internationalization:** i18next
- **Date Handling:** date-fns

### Backend

- **Runtime:** Node.js 18+
- **Framework:** Express.js 5
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **Image Storage:** Cloudinary
- **Payment Processing:** Stripe
- **Email Service:** Nodemailer
- **File Upload:** Multer

### DevOps & Deployment

- **Frontend Hosting:** Vercel
- **Backend Hosting:** Render
- **Database:** MongoDB Atlas
- **Version Control:** Git & GitHub
- **CI/CD:** Automatic deployments via GitHub

---

## 🏗️ Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   Landing    │  │   Customer   │  │Store Owner   │       │
│  │     Page     │  │   Dashboard  │  │  Dashboard   │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     APPLICATION LAYER                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │     Auth     │  │   Products   │  │    Orders    │       │
│  │  Controller  │  │  Controller  │  │  Controller  │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      SERVICE LAYER                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │    Email     │  │   Payment    │  │    Image     │       │
│  │   Service    │  │   Service    │  │   Service    │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                       DATA LAYER                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   MongoDB    │  │  Cloudinary  │  │    Stripe    │       │
│  │    Atlas     │  │    (CDN)     │  │  (Payments)  │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- MongoDB Atlas account
- Cloudinary account
- Stripe account
- Gmail account (for emails)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/abdallahi-nah/ecommerce-saas-platform.git
cd ecommerce-saas-platform
```

2. **Install Backend Dependencies**
```bash
cd backend
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../frontend
npm install --legacy-peer-deps
```

4. **Setup Environment Variables**

Create `.env` files in both backend and frontend directories (see [Environment Variables](#-environment-variables) section)

5. **Start Backend Server**
```bash
cd backend
npm run dev
```

Server will run on `http://localhost:5000`

6. **Start Frontend Development Server**
```bash
cd frontend
npm run dev
```

Frontend will run on `http://localhost:5173`

---

## 🔐 Environment Variables

### Backend (.env)
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=30d

# CORS
CORS_ORIGIN=http://localhost:5173

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_BASIC_PRICE_ID=price_...
STRIPE_PRO_PRICE_ID=price_...

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM_NAME=StorePro

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## 📚 API Documentation

### Base URL
```
Development: http://localhost:5000/api
Production: https://storepro-backend.onrender.com/api
```

### Authentication Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register-customer` | Register new customer | No |
| POST | `/auth/register-store` | Register new store owner | No |
| POST | `/auth/login` | Login user | No |
| GET | `/auth/me` | Get current user | Yes |
| PUT | `/auth/profile` | Update profile | Yes |

### Products Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/products` | Get all products | Owner |
| POST | `/products` | Create product | Owner |
| GET | `/products/:id` | Get product by ID | Owner |
| PUT | `/products/:id` | Update product | Owner |
| DELETE | `/products/:id` | Delete product | Owner |
| GET | `/products/stats` | Get product stats | Owner |

### Orders Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/orders` | Get store orders | Owner |
| POST | `/orders` | Create order | Customer |
| GET | `/orders/:id` | Get order by ID | Yes |
| PUT | `/orders/:id/status` | Update order status | Owner |
| GET | `/orders/my-orders` | Get customer orders | Customer |

### Public Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/public/stores` | Get all stores | No |
| GET | `/public/stores/:id` | Get store by ID | No |
| GET | `/public/stores/:id/products` | Get store products | No |
| GET | `/public/products/:id` | Get product details | No |

### Payment Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/payments/create-checkout` | Create checkout session | Customer |
| POST | `/payments/webhook` | Stripe webhook | No |

### Subscription Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/subscriptions/create-checkout` | Create subscription | Owner |
| GET | `/subscriptions/current` | Get current plan | Owner |
| POST | `/subscriptions/cancel` | Cancel subscription | Owner |
| POST | `/subscriptions/resume` | Resume subscription | Owner |

---

## 🚢 Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Configure build settings:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install --legacy-peer-deps`
4. Add environment variables
5. Deploy

### Backend (Vercel)

1. Push code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Configure build settings:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
4. Add environment variables
5. Deploy

### Database (MongoDB Atlas)

1. Create cluster on [MongoDB Atlas](https://cloud.mongodb.com)
2. Whitelist IP addresses (0.0.0.0/0 for production)
3. Get connection string
4. Add to backend environment variables

---

## 📁 Project Structure
```
storepro/
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   ├── cloudinary.js
│   │   └── stripe.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   ├── paymentController.js
│   │   └── subscriptionController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Store.js
│   │   ├── Product.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── publicRoutes.js
│   │   ├── uploadRoutes.js
│   │   ├── paymentRoutes.js
│   │   └── subscriptionRoutes.js
│   ├── services/
│   │   └── emailService.js
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── dashboard/
│   │   │   ├── landing/
│   │   │   ├── layout/
│   │   │   └── storefront/
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   ├── i18n/
│   │   │   └── locales/
│   │   │       ├── ar.json
│   │   │       ├── en.json
│   │   │       └── fr.json
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   ├── customer/
│   │   │   ├── dashboard/
│   │   │   ├── storefront/
│   │   │   ├── AboutPage.jsx
│   │   │   └── LandingPage.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── orderService.js
│   │   │   ├── productService.js
│   │   │   └── publicService.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vercel.json
│   └── vite.config.js
│
└── README.md
```

---

## 📸 Screenshots

### Landing Page
![Landing Page](./screenshots/landing-page.png)

### Store Owner Dashboard
![Dashboard](./screenshots/dashboard.png)

### Customer Shop
![Shop](./screenshots/customer-shop.png)

### Product Management
![Products](./screenshots/product-managment-2.png)
![AddProducts](./screenshots/product-managment-1.png)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Abdallahi Nah**

- GitHub: [@Abdallahi-Nah](https://github.com/Abdallahi-Nah)
- Email: abdallahi.nah.un.fst@gmail.com

---

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Stripe](https://stripe.com/)
- [Cloudinary](https://cloudinary.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vercel](https://vercel.com/)
- [Render](https://render.com/)

---

## 📞 Support

For support, email abdallahi.nah.un.fst@gmail.com or create an issue in this repository.

---

<p align="center">Made with ❤️ by Abdallahi Nah</p>
