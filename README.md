# Masuk10.com - Custom Full-Stack Web Application

Modern landing page with admin panel and shortlink system built with Next.js 14.

## 🚀 Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** NextAuth.js
- **Deployment:** Docker + Coolify

## 📋 Features

- 🎨 **Dynamic Landing Page** - Editable content via admin panel
- 👤 **Admin Panel** - Secure login with role-based access
- 🔗 **Shortlink System** - Direct URLs (masuk10.com/code)
- 📊 **Analytics Dashboard** - Track clicks, devices, locations
- 🖼️ **Media Library** - Upload and manage images
- 📱 **Mobile Responsive** - Optimized for all devices

## 🛠️ Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd masuk10-webapp
```

1. Install dependencies

```bash
npm install
```

1. Set up environment variables

```bash
cp .env.example .env
# Edit .env with your database credentials
```

1. Initialize database

```bash
npx prisma migrate dev
npx prisma generate
```

1. Seed initial admin user

```bash
npm run seed
```

1. Run development server

```bash
npm run dev
```

Visit `http://localhost:3000` for landing page
Visit `http://localhost:3000/admin` for admin panel

## 📦 Project Structure

```
masuk10-webapp/
├── app/                    # Next.js App Router
│   ├── (public)/          # Public pages (landing page)
│   ├── (admin)/           # Admin panel pages
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── ui/               # UI components
│   ├── admin/            # Admin-specific components
│   └── landing/          # Landing page components
├── lib/                   # Utilities
│   ├── prisma.ts         # Prisma client
│   ├── auth.ts           # Authentication helpers
│   └── utils.ts          # Helper functions
├── prisma/
│   └── schema.prisma     # Database schema
└── public/               # Static assets
```

## 🔐 Default Admin Credentials

**Email:** <admin@masuk10.com>  
**Password:** ChangeThisPassword123!

⚠️ **IMPORTANT:** Change these credentials immediately after first login!

## 🚢 Deployment

See `DEPLOYMENT.md` for detailed deployment instructions using Docker and Coolify.

## 📝 License

Copyright © 2026 Masuk10. All rights reserved.

## 🤝 Support

For questions or support, contact the development team.
