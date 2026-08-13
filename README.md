# 🛍️ Online Store — Full Stack E-Commerce Application

A modern full-stack e-commerce web application built with **Next.js, TypeScript, PostgreSQL, Prisma ORM, NextAuth, Tailwind CSS, DaisyUI, and Razorpay**.

This project was developed as a portfolio project to demonstrate my ability to build a complete web application with a modern frontend, secure authentication, database management, server-side operations, shopping cart functionality, order management, and payment integration.

## 🚀 Live Demo

🔗 **Live Website:** Coming soon

🔗 **GitHub Repository:** https://github.com/Amrenther/online-store

---

## 📌 About The Project

The **Online Store** is a full-stack e-commerce platform where users can browse products, create an account, authenticate securely, add products to their cart, proceed through checkout, and manage their orders.

The application follows a modern full-stack architecture using **Next.js App Router and Server Actions**, with **PostgreSQL and Prisma** handling persistent data and **NextAuth** managing authentication.

The project also includes **Razorpay integration** for payment processing and webhook support.

---

## ✨ Key Features

### 🛒 Product & Shopping Experience

* Product listing and browsing
* Product details
* Shopping cart functionality
* Add/remove products from cart
* Quantity management
* Checkout flow
* Order creation and management

### 🔐 Authentication

* User registration
* User login
* Secure authentication using NextAuth v5
* Credentials-based authentication
* JWT-based sessions
* Protected application functionality

### 📦 Order Management

* Create orders during checkout
* Store order information in PostgreSQL
* View previous orders
* Track order-related information

### 💳 Payment Integration

* Razorpay payment integration
* Test-mode payment support
* Server-side payment handling
* Razorpay webhook endpoint for payment events

### 🗄️ Database

* PostgreSQL database
* Prisma 7 ORM
* Prisma migrations
* Database seeding
* Relational data modeling

### 🎨 UI & Styling

* Responsive user interface
* Tailwind CSS 4
* DaisyUI 5
* Reusable React components
* Clean and modern e-commerce layout

---

## 🧑‍💻 Tech Stack

| Category         | Technologies                        |
| ---------------- | ----------------------------------- |
| Frontend         | Next.js 16, React, TypeScript       |
| Framework        | Next.js App Router                  |
| Backend          | Next.js Server Actions & API Routes |
| Authentication   | NextAuth v5                         |
| Database         | PostgreSQL 17                       |
| ORM              | Prisma 7                            |
| Styling          | Tailwind CSS 4, DaisyUI 5           |
| Payments         | Razorpay                            |
| Validation       | Zod                                 |
| Package Manager  | npm                                 |
| Development      | VS Code, Docker                     |
| Deployment       | Vercel                              |
| Database Hosting | Neon PostgreSQL                     |

---

## 🏗️ Architecture

```text
┌───────────────────────────────┐
│          Next.js App          │
│                               │
│  App Router + React + TS      │
│  Tailwind CSS + DaisyUI       │
└───────────────┬───────────────┘
                │
        Server Actions
        API Routes
                │
       ┌────────┴────────┐
       │                 │
       ▼                 ▼
  NextAuth v5         Razorpay
       │                 │
       │             Payments
       │             Webhooks
       │
       ▼
┌───────────────────────────────┐
│          Prisma ORM           │
└───────────────┬───────────────┘
                │
                ▼
       PostgreSQL Database
```

---

## 📂 Project Structure

```text
online-store/
│
├── app/
│   ├── api/
│   │   └── webhooks/
│   ├── actions/
│   ├── cart/
│   ├── checkout/
│   ├── components/
│   ├── health/
│   ├── login/
│   ├── orders/
│   ├── register/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
│
├── lib/
│   ├── prisma/
│   ├── auth/
│   └── razorpay/
│
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
│
├── public/
│
├── docker-compose.yml
├── next.config.ts
├── package.json
├── prisma.config.ts
└── tsconfig.json
```

---

## ⚙️ Local Development

### Prerequisites

Make sure you have the following installed:

* Node.js 20.19+ or Node.js 22.x
* npm
* Docker Desktop
* Git

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd online-store
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://dev:dev@localhost:5432/online_store"

AUTH_SECRET="your-auth-secret"
BETTER_AUTH_SECRET="your-better-auth-secret"

RAZORPAY_KEY_ID="your-razorpay-key-id"
RAZORPAY_KEY_SECRET="your-razorpay-key-secret"
NEXT_PUBLIC_RAZORPAY_KEY_ID="your-razorpay-key-id"
RAZORPAY_WEBHOOK_SECRET="your-webhook-secret"
```

> ⚠️ Never commit `.env` or expose API secrets in your GitHub repository.

### 4. Start PostgreSQL

Docker is used for the local PostgreSQL database:

```bash
docker compose up -d
```

Check the database container:

```bash
docker compose ps
```

### 5. Run Prisma migrations

```bash
npx prisma migrate dev
```

### 6. Seed the database

```bash
npx prisma db seed
```

### 7. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## 🗃️ Database Management

Prisma Studio can be used to inspect and manage the local database:

```bash
npx prisma studio
```

Create a new migration after modifying the Prisma schema:

```bash
npx prisma migrate dev --name your_migration_name
```

Generate the Prisma Client:

```bash
npx prisma generate
```

---

## 🐳 Docker

The project uses Docker Compose to provide a consistent local PostgreSQL development environment.

Start the database:

```bash
docker compose up -d
```

Stop the database:

```bash
docker compose down
```

Stop the database and remove its stored data:

```bash
docker compose down -v
```

---

## 🔒 Environment Variables

The application requires environment variables for:

* PostgreSQL database connection
* Authentication secrets
* Razorpay API credentials
* Razorpay webhook verification

Environment files containing secrets are excluded from Git using `.gitignore`.

---

## 🚀 Deployment

The application is designed to be deployed using **Vercel**.

For production deployment:

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Configure the production environment variables.
4. Connect a hosted PostgreSQL database such as Neon.
5. Configure Razorpay production credentials when payment functionality is enabled.
6. Deploy the application.

Production environment variables include:

```text
DATABASE_URL
AUTH_SECRET
RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET
NEXT_PUBLIC_RAZORPAY_KEY_ID
RAZORPAY_WEBHOOK_SECRET
```

---

## 🧠 What I Learned

Through this project, I gained practical experience with:

* Building full-stack applications with Next.js
* Next.js App Router architecture
* React and TypeScript development
* Server Actions and API Routes
* Authentication and authorization
* JWT-based sessions
* PostgreSQL database design
* Prisma ORM and migrations
* Database seeding
* Payment gateway integration
* Webhook handling
* Environment variable management
* Docker-based local development
* Git and GitHub workflow
* Preparing applications for Vercel deployment

---

## 🔮 Future Improvements

Some features I plan to explore or improve:

* Admin dashboard for product management
* Product search and filtering
* Product categories
* Pagination
* Wishlist functionality
* Improved order tracking
* Enhanced payment workflow
* Email notifications
* Image optimization and cloud storage
* Automated testing
* Performance optimization

---

## 👨‍💻 About Me

I'm a **Computer Science graduate and Full Stack Developer** interested in building modern, scalable web applications using technologies such as **React, Next.js, TypeScript, PostgreSQL, and Prisma**.

This project represents my practical experience in developing a complete full-stack application from database design and authentication to frontend development and deployment.

### Connect With Me

* **GitHub:** https://github.com/Amrenther
* **LinkedIn:** https://www.linkedin.com/in/amrenther/

---

## ⭐ If You Found This Project Useful

If you found this project interesting, consider giving the repository a ⭐ on GitHub.
