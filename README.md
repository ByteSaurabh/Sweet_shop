# Sweet Deal Sparkle 🍬

A delightful full-stack candy shop management application built with modern web technologies.

## Overview

Sweet Deal Sparkle is a comprehensive candy shop management system that allows users to browse, purchase, and manage an inventory of delicious sweets. The application features role-based access control with admin and user roles, real-time inventory management, and a beautiful, responsive UI.

## Technologies Used

**Frontend:**
- React 18 with TypeScript
- Vite for fast development
- TailwindCSS for styling
- shadcn-ui components
- React Query (TanStack Query) for state management
- Axios for API requests
- Framer Motion for animations

**Backend:**
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT authentication
- bcrypt for password hashing

## Getting Started

### Prerequisites

- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- MongoDB Atlas account (or local MongoDB)

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd sweet-deal-sparkle-main

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### Configuration

1. Create a `.env` file in the `backend` directory:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=3000
```

2. Seed the database with sample data:
```sh
cd backend
node seed.js
```

### Running the Application

**Start the backend server:**
```sh
cd backend
node server.js
```

**Start the frontend development server:**
```sh
npm run dev
```

The application will be available at `http://localhost:8080` (or 8081 if 8080 is in use).

## Features

- 🍭 Browse and search sweets by name, category, and price range
- 🛒 Purchase sweets with real-time inventory updates
- 👤 User authentication and authorization (JWT-based)
- 👑 Admin panel for managing sweets and inventory
- 📦 Restock functionality (admin only)
- 🎨 Beautiful, responsive UI with smooth animations
- 🔒 Secure password hashing and authentication
- 📊 Real-time stock validation

## Default Accounts

**Admin Account:**
- Email: admin@sweetshop.com
- Password: admin123

**User Account:**
- Email: user@sweetshop.com
- Password: user123

## API Documentation

See `API-ENDPOINTS.md` for complete API documentation with examples.

## Project Structure

```
sweet-deal-sparkle-main/
├── backend/              # Backend API
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Authentication middleware
│   └── server.js        # Express server
├── src/                 # Frontend source
│   ├── components/      # React components
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Page components
│   ├── lib/            # Utilities and API client
│   └── types/          # TypeScript types
└── public/             # Static assets
```

## Deployment

For production deployment, ensure:
1. Set up environment variables securely
2. Use a production MongoDB instance
3. Build the frontend: `npm run build`
4. Serve the built files with a production server
5. Use HTTPS for secure communication

## License

MIT
