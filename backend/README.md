# HASA Gold Store Backend

Node.js/Express backend API for HASA GOLD STORE with Prisma ORM and Neon PostgreSQL.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: Neon PostgreSQL
- **Authentication**: Auth.js (to be implemented)
- **Language**: TypeScript
- **Validation**: Zod
- **Security**: Helmet, CORS, bcryptjs, rate limiting

## Project Structure

```
backend/
├── src/
│   ├── index.ts              # Server entry point
│   ├── lib/
│   │   └── prisma.ts         # Prisma client singleton
│   ├── middleware/
│   │   ├── auth.ts           # Authentication middleware
│   │   ├── errorHandler.ts   # Error handling middleware
│   │   ├── rateLimit.ts      # Rate limiting middleware
│   │   └── validation.ts     # Input validation middleware
│   ├── routes/
│   │   ├── auth.ts           # Authentication routes
│   │   ├── users.ts          # User routes
│   │   ├── games.ts          # Game routes
│   │   ├── packages.ts       # Package routes
│   │   ├── orders.ts         # Order routes
│   │   ├── reviews.ts        # Review routes
│   │   ├── notifications.ts  # Notification routes
│   │   ├── favorites.ts      # Favorite routes
│   │   ├── support.ts        # Support ticket routes
│   │   ├── admin.ts          # Admin routes
│   │   ├── faq.ts            # FAQ routes
│   │   ├── blog.ts           # Blog routes
│   │   ├── announcements.ts  # Announcement routes
│   │   └── promo.ts          # Promo code routes
│   ├── services/
│   │   ├── authService.ts    # Authentication service
│   │   ├── userService.ts    # User service
│   │   ├── gameService.ts    # Game service
│   │   ├── orderService.ts   # Order service
│   │   ├── reviewService.ts  # Review service
│   │   ├── notificationService.ts # Notification service
│   │   ├── favoriteService.ts # Favorite service
│   │   ├── supportService.ts # Support ticket service
│   │   ├── adminService.ts   # Admin service
│   │   ├── faqService.ts     # FAQ service
│   │   ├── blogService.ts    # Blog service
│   │   ├── announcementService.ts # Announcement service
│   │   ├── promoService.ts   # Promo code service
│   │   ├── settingsService.ts # Settings service
│   │   └── walletService.ts  # Wallet service
│   ├── types/
│   │   └── index.ts          # TypeScript types
│   └── utils/
│       ├── email.ts          # Email service placeholder
│       └── whatsapp.ts       # WhatsApp service placeholder
├── prisma/
│   ├── schema.prisma         # Prisma schema
│   └── seed.ts              # Database seed script
├── package.json
├── tsconfig.json
└── .env                     # Environment variables
```

## Setup Instructions

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   Copy `.env` and update with your Neon PostgreSQL connection string:
   ```env
   DATABASE_URL="postgresql://user:password@host:port/database?schema=public"
   PORT=3001
   NODE_ENV=development
   AUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3001"
   CORS_ORIGIN="http://localhost:3000"
   ```

3. **Generate Prisma Client**:
   ```bash
   npm run prisma:generate
   ```

4. **Run database migrations**:
   ```bash
   npm run prisma:migrate
   ```

5. **Seed the database**:
   ```bash
   npm run prisma:seed
   ```

6. **Start the development server**:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `GET /auth/session` - Get current session
- `GET /auth/csrf` - Get CSRF token
- `POST /auth/callback/credentials` - Login with credentials
- `POST /auth/register` - Register new user
- `POST /auth/signout` - Sign out
- `POST /auth/forgot-password` - Initiate password reset
- `POST /auth/reset-password` - Reset password
- `POST /auth/change-password` - Change password
- `POST /auth/verify-email` - Verify email
- `POST /auth/verify-phone/start` - Start phone verification
- `POST /auth/verify-phone/confirm` - Confirm phone verification

### Users
- `GET /users/me` - Get current user profile
- `PATCH /users/me` - Update current user profile

### Games
- `GET /games` - List games (supports `featured` and `search` query params)
- `GET /games/:slug` - Get game by slug

### Packages
- `GET /packages/:gameId` - List packages for a game

### Orders
- `POST /orders` - Create order
- `GET /orders` - List user's orders
- `GET /orders/:id` - Get order by ID
- `GET /orders/track/:number` - Track order by number
- `PATCH /orders/:id/status` - Update order status (admin)

### Reviews
- `GET /reviews` - List approved reviews (supports `gameId` query param)
- `POST /reviews` - Create review

### Notifications
- `GET /notifications` - List user notifications
- `PATCH /notifications/:id/read` - Mark notification as read
- `PATCH /notifications/read-all` - Mark all notifications as read

### Favorites
- `GET /favorites` - List user favorites
- `POST /favorites` - Add to favorites
- `DELETE /favorites/:gameId` - Remove from favorites

### Support
- `GET /support/tickets` - List user's tickets
- `POST /support/tickets` - Create ticket
- `GET /support/tickets/:id` - Get ticket details
- `POST /support/tickets/:id/messages` - Reply to ticket

### Admin
- `GET /admin/stats` - Get dashboard stats
- `GET /admin/users` - List all users
- `PATCH /admin/users/:id/status` - Update user status
- `GET /admin/orders` - List all orders
- `GET /admin/games` - List all games
- `GET /admin/packages` - List all packages
- `GET /admin/tickets` - List all tickets
- `GET /admin/settings` - Get system settings
- `PATCH /admin/settings` - Update system settings

### FAQ
- `GET /faqs` - List FAQs (supports `category` query param)

### Blog
- `GET /blog` - List blog posts (supports `adminAll` query param)
- `GET /blog/:slug` - Get blog post by slug

### Announcements
- `GET /announcements` - List active announcements

### Promo Codes
- `GET /promo-codes` - List active promo codes
- `POST /promo-codes/validate` - Validate promo code

## TODO

- [ ] Implement Auth.js session management
- [ ] Add proper session cookie handling
- [ ] Implement Google OAuth
- [ ] Add input validation schemas with Zod
- [ ] Integrate actual payment gateways
- [ ] Implement WhatsApp API integration
- [ ] Implement Namecheap SMTP email integration
- [ ] Add comprehensive error logging
- [ ] Add API documentation (Swagger/OpenAPI)
- [ ] Add unit tests
- [ ] Add integration tests

## Notes

- All routes currently use placeholder user IDs (`'placeholder-user-id'`) since Auth.js session management is not yet implemented
- Email and WhatsApp services are placeholders for future integration
- The backend is fully functional with the database and will work once proper session management is added
