# 🚀 StartupForge – Startup Team Builder Platform

A full-stack SaaS platform where startup founders can publish startup ideas, recruit team members, and manage applications. Developers, designers, marketers, and other professionals can browse opportunities and apply to join startups.

![StartupForge](https://img.shields.io/badge/StartupForge-Platform-6366f1?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![Express.js](https://img.shields.io/badge/Express.js-4-000000?style=for-the-badge&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)

---

## ✨ Features

### Authentication & Authorization
- ✅ Email & Password Registration/Login
- ✅ Google OAuth Login
- ✅ JWT Authentication with HTTPOnly Cookies
- ✅ Role-Based Access Control (Admin / Founder / Collaborator)
- ✅ Protected Routes
- ✅ Persistent Login After Refresh
- ✅ Redirect to Intended Route After Login

### Roles
| Role | Capabilities |
|------|-------------|
| **Admin** | Manage users (block/unblock), approve/delete startups, view transactions, analytics |
| **Founder** | Create/manage startup, post opportunities, review applications, Stripe payment |
| **Collaborator** | Browse opportunities, apply to roles, track applications, manage profile |

### Core Features
- 🏢 Startup Management (CRUD with admin approval)
- 💼 Opportunity Posting with skills, work type, commitment level
- 📝 Application System with portfolio & motivation
- 💳 Stripe Payment Gateway (premium after 3 free opportunities)
- 🖼️ ImgBB Image Upload for profiles & logos
- 📊 Recharts Analytics Dashboard
- 🌓 Dark/Light Theme Toggle
- 🎨 Modern SaaS UI with Glassmorphism
- 📱 Fully Responsive (Mobile, Tablet, Desktop)
- 🔍 Advanced Search with MongoDB Regex
- 🏷️ Filters with MongoDB $in operator
- 📄 Server-side Pagination

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| Next.js 16 (App Router) | React Framework |
| JavaScript | Programming Language |
| Tailwind CSS 4 | Styling |
| Framer Motion | Animations |
| React Hook Form | Form Handling |
| Axios | HTTP Client |
| Context API | State Management |
| Recharts | Charts & Analytics |
| React Hot Toast | Notifications |
| React Icons | Icon Library |
| Stripe.js | Payment UI |

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js | Runtime |
| Express.js | Web Framework |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| bcryptjs | Password Hashing |
| Stripe | Payment Gateway |
| Helmet | Security Headers |
| CORS | Cross-Origin |
| Cookie-Parser | Cookie Handling |

---

## 📁 Project Structure

```
a-10/
├── frontend/                     # Next.js Client
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.js           # Home Page
│   │   │   ├── layout.js         # Root Layout
│   │   │   ├── providers.js      # Context Providers
│   │   │   ├── not-found.js      # Custom 404
│   │   │   ├── error.js          # Error Boundary
│   │   │   ├── login/            # Login Page
│   │   │   ├── register/         # Register Page
│   │   │   ├── startups/         # Browse & Details
│   │   │   ├── opportunities/    # Browse Opportunities
│   │   │   └── dashboard/
│   │   │       ├── layout.js     # Dashboard Layout
│   │   │       ├── admin/        # Admin Pages
│   │   │       ├── founder/      # Founder Pages
│   │   │       └── collaborator/ # Collaborator Pages
│   │   ├── components/           # Shared Components
│   │   ├── contexts/             # Auth & Theme Contexts
│   │   └── lib/                  # Axios, Upload Utils
│   ├── next.config.mjs
│   └── package.json
│
├── backend/                      # Express.js Server
│   ├── config/
│   │   └── db.js                 # MongoDB Connection
│   ├── models/
│   │   ├── User.js
│   │   ├── Startup.js
│   │   ├── Opportunity.js
│   │   ├── Application.js
│   │   └── Payment.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── startupController.js
│   │   ├── opportunityController.js
│   │   ├── applicationController.js
│   │   ├── paymentController.js
│   │   └── statsController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── startupRoutes.js
│   │   ├── opportunityRoutes.js
│   │   ├── applicationRoutes.js
│   │   ├── paymentRoutes.js
│   │   └── statsRoutes.js
│   ├── middleware/
│   │   ├── auth.js               # JWT Verification
│   │   ├── rbac.js               # Role-Based Access
│   │   └── errorHandler.js       # Global Error Handler
│   ├── server.js                 # Entry Point
│   ├── package.json
│   └── .env.example
│
└── README.md
```

---

## 🗄️ MongoDB Collections

### users
```json
{
  "name": "string",
  "email": "string (unique)",
  "password": "string (hashed)",
  "image": "string (url)",
  "role": "admin | founder | collaborator",
  "skills": ["string"],
  "bio": "string",
  "isBlocked": "boolean",
  "provider": "local | google",
  "createdAt": "timestamp"
}
```

### startups
```json
{
  "startup_name": "string",
  "logo": "string (url)",
  "industry": "string (enum)",
  "description": "string",
  "funding_stage": "string (enum)",
  "founder_email": "string",
  "status": "pending | approved | rejected",
  "createdAt": "timestamp"
}
```

### opportunities
```json
{
  "startup_id": "ObjectId (ref: Startup)",
  "role_title": "string",
  "required_skills": ["string"],
  "work_type": "Remote | On-site | Hybrid",
  "commitment_level": "Full-time | Part-time | Contract | Internship",
  "deadline": "date",
  "createdAt": "timestamp"
}
```

### applications
```json
{
  "opportunity_id": "ObjectId (ref: Opportunity)",
  "applicant_email": "string",
  "portfolio_link": "string",
  "motivation": "string",
  "status": "pending | accepted | rejected",
  "applied_at": "timestamp"
}
```

### payments
```json
{
  "user_email": "string",
  "amount": "number",
  "transaction_id": "string (unique)",
  "payment_status": "succeeded | pending | failed",
  "paid_at": "timestamp"
}
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register user | Public |
| POST | `/api/auth/login` | Login user | Public |
| POST | `/api/auth/google` | Google login | Public |
| POST | `/api/auth/logout` | Logout user | Public |
| GET | `/api/auth/me` | Get current user | Private |

### Users
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/users` | Get all users | Admin |
| PATCH | `/api/users/:id/block` | Block user | Admin |
| PATCH | `/api/users/:id/unblock` | Unblock user | Admin |
| PUT | `/api/users/profile` | Update profile | Private |

### Startups
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/startups` | Browse startups | Public |
| GET | `/api/startups/featured` | Featured startups | Public |
| GET | `/api/startups/:id` | Startup details | Public |
| GET | `/api/startups/user/my-startup` | My startup | Founder |
| POST | `/api/startups` | Create startup | Founder |
| PUT | `/api/startups/:id` | Update startup | Founder |
| DELETE | `/api/startups/:id` | Delete startup | Founder/Admin |
| GET | `/api/startups/admin/all` | All startups | Admin |
| PATCH | `/api/startups/:id/approve` | Approve startup | Admin |

### Opportunities
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/opportunities` | Browse with filters | Public |
| GET | `/api/opportunities/featured` | Featured | Public |
| GET | `/api/opportunities/:id` | Details | Public |
| GET | `/api/opportunities/startup/:id` | By startup | Public |
| GET | `/api/opportunities/founder/my-opportunities` | My opportunities | Founder |
| POST | `/api/opportunities` | Create (paywall at 3) | Founder |
| PUT | `/api/opportunities/:id` | Update | Founder |
| DELETE | `/api/opportunities/:id` | Delete | Founder/Admin |

### Applications
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/applications` | Apply | Collaborator |
| GET | `/api/applications/my-applications` | My applications | Collaborator |
| GET | `/api/applications/founder` | Founder's apps | Founder |
| PATCH | `/api/applications/:id/accept` | Accept | Founder |
| PATCH | `/api/applications/:id/reject` | Reject | Founder |

### Payments
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/payments/create-payment-intent` | Create intent | Founder |
| POST | `/api/payments/confirm` | Confirm payment | Founder |
| GET | `/api/payments` | All transactions | Admin |
| GET | `/api/payments/check` | Check paid status | Founder |

### Stats
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/stats/admin` | Admin stats | Admin |
| GET | `/api/stats/founder` | Founder stats | Founder |
| GET | `/api/stats/collaborator` | Collaborator stats | Collaborator |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- Stripe account (for payments)
- ImgBB account (for image uploads)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd a-10
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/startupforge
JWT_SECRET=your_jwt_secret_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
IMGBB_API_KEY=your_imgbb_api_key
CLIENT_URL=http://localhost:3000
ADMIN_EMAIL=admin@startupforge.com
```

Start the server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

Start the client:
```bash
npm run dev
```

### 4. Access the Application
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`
- Health Check: `http://localhost:5000/api/health`

---

## 🔐 Admin Access
Register with the email specified in `ADMIN_EMAIL` env variable to get admin role automatically.

---

## 📱 Responsive Design
- ✅ Mobile (320px+)
- ✅ Tablet (768px+)
- ✅ Desktop (1024px+)
- ✅ Large Desktop (1280px+)

---

## 🎨 UI Features
- Glassmorphism design
- Dark/Light theme toggle with persistence
- Framer Motion animations
- Gradient accents
- Skeleton loaders
- Toast notifications
- Custom 404 page
- Responsive sidebar dashboard
- Equal card heights

---

## 🔒 Security
- JWT stored in HTTPOnly cookies
- Password hashing with bcrypt (12 rounds)
- Helmet security headers
- CORS configuration
- Input validation with Mongoose
- Rate limiting ready
- Environment variables for secrets

---

## 📄 License
This project is built for educational purposes as part of Programming Hero Assignment 10.

---

**Built with ❤️ using StartupForge**
#   P - 1 0  
 #   A - 1 0  
 