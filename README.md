# HASA GOLD STORE

A modern, fast, and secure game top-up platform for Sri Lankan gamers. Instant delivery of game currency for Free Fire, PUBG Mobile, Mobile Legends, and Blood Strike.

## 🎮 Features

- **Instant Top-Ups**: Fast delivery of game currency
- **Secure Payments**: Multiple payment methods (Card, eZ Cash, Frimi, Bank Transfer)
- **Wallet System**: Store credits for quick purchases
- **Order Tracking**: Real-time order status updates
- **User Dashboard**: Manage orders, wallet, favorites, and profile
- **Admin Panel**: Complete admin dashboard for order and user management
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Dark Mode**: Built-in theme support

## 🛠 Tech Stack

### Frontend
- **Framework**: React 19 with TypeScript
- **Routing**: TanStack Router
- **State Management**: TanStack Query
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI + shadcn/ui
- **Forms**: React Hook Form + Zod validation
- **Build Tool**: Vite

### Backend (To Be Implemented)
- **Runtime**: Node.js
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: PostgreSQL (Neon)
- **Authentication**: Auth.js
- **Email**: Namecheap SMTP
- **Messaging**: WhatsApp API

## 📋 Prerequisites

- Node.js 18+ 
- npm or bun
- PostgreSQL database (Neon recommended)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd hasastore
```

### 2. Install Dependencies

```bash
npm install
# or
bun install
```

### 3. Environment Setup

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Update `.env` with your configuration:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3001

# Environment
NODE_ENV=development
```

### 4. Start Development Server

```bash
npm run dev
# or
bun run dev
```

The frontend will be available at `http://localhost:3000`

## 📁 Project Structure

```
hasastore/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Database seed script
├── docs/
│   └── API_SPEC.md        # API specification
├── public/                # Static assets
├── src/
│   ├── api/
│   │   └── httpClient.ts  # HTTP client for API calls
│   ├── components/        # React components
│   │   ├── admin/         # Admin-specific components
│   │   ├── brand/         # Brand components (Logo)
│   │   ├── dashboard/     # Dashboard components
│   │   ├── site/          # Site-wide components
│   │   ├── system/        # System components (Gates)
│   │   └── ui/            # UI components (shadcn/ui)
│   ├── constants/         # App constants
│   ├── contexts/          # React contexts
│   │   └── AuthContext.tsx
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Utility functions
│   ├── providers/         # React providers
│   ├── routes/            # TanStack Router routes
│   ├── services/          # API service layer
│   │   ├── authService.ts
│   │   ├── gameService.ts
│   │   ├── orderService.ts
│   │   └── ...
│   ├── types/             # TypeScript types
│   ├── validation/        # Zod validation schemas
│   ├── styles.css         # Global styles
│   ├── router.tsx         # Router configuration
│   └── start.ts           # Entry point
├── .env.example           # Environment variables template
├── .gitignore
├── components.json        # shadcn/ui configuration
├── eslint.config.js       # ESLint configuration
├── package.json
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite configuration
└── README.md
```

## 🔧 Development Workflow

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Format code
npm run format
```

### Service Layer Architecture

The frontend uses a typed service layer for all API communication:

- **Location**: `src/services/`
- **HTTP Client**: `src/api/httpClient.ts`
- **Types**: `src/types/index.ts`
- **Validation**: `src/validation/index.ts`

**Never make direct API calls from components.** Always use the service layer.

Example:

```typescript
// ✅ Correct - Use service
import { gameService } from '@/services/gameService'

const games = await gameService.list()

// ❌ Incorrect - Direct fetch
const games = await fetch('/api/games')
```

### Authentication

Authentication is handled through `AuthContext`:

```typescript
import { useAuthContext } from '@/contexts/AuthContext'

function MyComponent() {
  const { user, login, logout } = useAuthContext()
  // ...
}
```

## 🗄️ Database Setup

### Prisma Schema

The Prisma schema is defined in `prisma/schema.prisma` and includes models for:

- Users & Profiles
- Games & Packages
- Orders & Payments
- Wallet Transactions
- Notifications
- Promo Codes
- Reviews
- Support Tickets
- Favorites
- FAQs
- Blog Posts
- Announcements
- System Settings

### Seeding the Database

```bash
# Install Prisma CLI (if not installed)
npm install -g prisma

# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed the database
npx prisma db seed
```

## 🔌 Backend Requirements

The frontend is designed to work with a backend implementing the API specification in `docs/API_SPEC.md`.

### Required Backend Endpoints

- **Authentication**: Auth.js-compatible session management
- **Users**: Profile management
- **Games**: Game and package listings
- **Orders**: Order creation and tracking
- **Wallet**: Wallet balance and transactions
- **Payments**: Payment processing integration
- **Admin**: Admin dashboard endpoints

### Backend Tech Stack

- **Express.js**: REST API framework
- **Prisma**: Database ORM
- **Auth.js**: Authentication (NextAuth.js)
- **Neon PostgreSQL**: Managed PostgreSQL database
- **Namecheap SMTP**: Email delivery
- **WhatsApp API**: Order notifications

### Environment Variables for Backend

```env
DATABASE_URL="postgresql://..."
AUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3001"

# SMTP (Namecheap)
SMTP_HOST="smtp.namecheap.com"
SMTP_PORT=465
SMTP_USER="your-email"
SMTP_PASSWORD="your-password"

# WhatsApp API
WHATSAPP_API_URL="https://..."
WHATSAPP_API_KEY="your-key"
```

## 🎨 UI Components

The project uses shadcn/ui components customized with Tailwind CSS:

- Located in `src/components/ui/`
- Configured via `components.json`
- Follow Radix UI patterns

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🔒 Security

- CSRF protection on all mutating requests
- HTTP-only session cookies
- Input validation with Zod
- Type-safe API communication
- Role-based access control (RBAC)

## 🚢 Deployment

### Frontend Deployment

```bash
# Build for production
npm run build

# The build output is in the `dist/` directory
# Deploy to Vercel, Netlify, or any static hosting service
```

### Backend Deployment

The backend should be deployed separately:
- Use a Node.js hosting service (Railway, Render, Fly.io)
- Configure environment variables
- Set up PostgreSQL database (Neon)
- Configure SMTP and WhatsApp API credentials

## 📝 API Documentation

Complete API specification is available in `docs/API_SPEC.md`.

## 🤝 Contributing

1. Follow the existing code style
2. Use the service layer for API calls
3. Add TypeScript types for new features
4. Update the API specification for new endpoints
5. Test thoroughly before committing

## 📄 License

This project is proprietary software. All rights reserved.

## 📞 Support

For support, contact support@hasa.lk or create a support ticket through the application.

---

**Built with ❤️ for Sri Lankan gamers**
