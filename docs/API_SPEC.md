# HASA GOLD STORE - API Specification

This document describes the REST API that the HASA GOLD STORE frontend expects from the backend. The backend should implement these endpoints to support the frontend functionality.

## Base URL

```
http://localhost:3001
```

## Authentication

The frontend uses Auth.js for authentication with cookie-based sessions. All API endpoints should:

- Accept HTTP-only session cookies for authentication
- Return 401 Unauthorized for unauthenticated requests (except public endpoints)
- Support CSRF protection via `x-csrf-token` header on mutating requests

### Auth Endpoints

#### GET /auth/session
Get the current session.

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "email_verified": true,
    "phone": "+94771234567",
    "phone_verified": true,
    "roles": ["USER"],
    "status": "active",
    "created_at": "2024-01-01T00:00:00Z"
  },
  "profile": {
    "id": "uuid",
    "user_id": "uuid",
    "display_name": "John Doe",
    "username": "johndoe",
    "avatar_url": "https://...",
    "phone": "+94771234567",
    "country": "Sri Lanka",
    "status": "active",
    "status_reason": null,
    "status_updated_at": null,
    "created_at": "2024-01-01T00:00:00Z"
  },
  "expires": "2024-01-02T00:00:00Z"
}
```

#### GET /auth/csrf
Get CSRF token for form submissions.

**Response:**
```json
{
  "csrfToken": "token-string"
}
```

#### POST /auth/callback/credentials
Sign in with email and password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password",
  "remember": false
}
```

**Response:** Same as GET /auth/session

#### POST /auth/register
Register a new user.

**Request:**
```json
{
  "displayName": "John Doe",
  "email": "user@example.com",
  "password": "Password123",
  "acceptTerms": true
}
```

**Response:** Same as GET /auth/session

#### POST /auth/signout
Sign out the current user.

**Request:**
```json
{
  "csrfToken": "token-string"
}
```

#### POST /auth/forgot-password
Request password reset.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "ok": true
}
```

#### POST /auth/reset-password
Reset password with token.

**Request:**
```json
{
  "token": "reset-token",
  "password": "NewPassword123",
  "confirm": "NewPassword123"
}
```

**Response:**
```json
{
  "ok": true
}
```

#### POST /auth/change-password
Change password for authenticated user.

**Request:**
```json
{
  "currentPassword": "OldPassword123",
  "newPassword": "NewPassword123",
  "confirm": "NewPassword123"
}
```

**Response:**
```json
{
  "ok": true
}
```

#### POST /auth/verify-email
Verify email with token.

**Request:**
```json
{
  "token": "verification-token"
}
```

**Response:**
```json
{
  "ok": true
}
```

#### POST /auth/verify-phone/start
Request phone verification code.

**Request:**
```json
{
  "phone": "+94771234567"
}
```

**Response:**
```json
{
  "ok": true
}
```

#### POST /auth/verify-phone/confirm
Verify phone with code.

**Request:**
```json
{
  "phone": "+94771234567",
  "code": "123456"
}
```

**Response:**
```json
{
  "ok": true
}
```

#### GET /auth/signin/google
Redirect to Google OAuth (302 redirect).

## Users

#### GET /users/me
Get current user profile.

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "email_verified": true,
  "phone": "+94771234567",
  "phone_verified": true,
  "roles": ["USER"],
  "status": "active",
  "created_at": "2024-01-01T00:00:00Z"
}
```

#### PATCH /users/me
Update current user profile.

**Request:**
```json
{
  "displayName": "John Doe",
  "username": "johndoe",
  "phone": "+94771234567",
  "country": "Sri Lanka",
  "avatarUrl": "https://..."
}
```

**Response:** Updated user object

## Games

#### GET /games
List all games.

**Response:**
```json
[
  {
    "id": "uuid",
    "slug": "free-fire",
    "name": "Free Fire",
    "tagline": "Battle royale at its finest",
    "publisher": "Garena",
    "image_url": "https://...",
    "card_image": "https://...",
    "hero_image": "https://...",
    "popularity": 100,
    "is_featured": true,
    "sort_order": 1,
    "is_live": true,
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

#### GET /games/:slug
Get game by slug.

**Response:** Single game object

#### GET /games/:slug/packages
Get packages for a game.

**Response:**
```json
[
  {
    "id": "uuid",
    "game_id": "uuid",
    "label": "100 Diamonds",
    "amount": 100,
    "bonus": 0,
    "price_lkr": 150,
    "currency": "LKR",
    "badge": null,
    "is_active": true,
    "sort_order": 1
  }
]
```

## Orders

#### POST /orders
Create a new order.

**Request:**
```json
{
  "gameId": "uuid",
  "packageId": "uuid",
  "playerId": "player123",
  "serverId": "server1",
  "quantity": 1,
  "paymentMethod": "card",
  "promoCode": "WELCOME10",
  "useWallet": false
}
```

**Response:**
```json
{
  "id": "uuid",
  "order_number": "ORD-12345",
  "user_id": "uuid",
  "game_id": "uuid",
  "game_name": "Free Fire",
  "package_id": "uuid",
  "package_label": "100 Diamonds",
  "player_id": "player123",
  "quantity": 1,
  "subtotal_lkr": 150,
  "discount_lkr": 15,
  "total_lkr": 135,
  "currency": "LKR",
  "payment_method": "card",
  "status": "pending",
  "promo_code": "WELCOME10",
  "timeline": [
    {
      "at": "2024-01-01T00:00:00Z",
      "label": "Order created",
      "status": "pending"
    }
  ],
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

#### GET /orders
Get user's orders (authenticated).

**Query params:** `page`, `limit`, `status`

**Response:**
```json
{
  "orders": [...],
  "total": 100,
  "page": 1,
  "limit": 20
}
```

#### GET /orders/:id
Get order by ID.

**Response:** Order object

#### GET /orders/track/:number
Track order publicly (no auth required).

**Response:**
```json
{
  "id": "uuid",
  "order_number": "ORD-12345",
  "status": "delivered",
  "game_name": "Free Fire",
  "package_label": "100 Diamonds",
  "player_id": "player123",
  "total_lkr": 135,
  "created_at": "2024-01-01T00:00:00Z",
  "timeline": [...]
}
```

## Wallet

#### GET /wallet
Get wallet summary.

**Response:**
```json
{
  "balance": 5000,
  "transactions": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "type": "credit",
      "amount_lkr": 1000,
      "balance_after": 5000,
      "description": "Top up",
      "order_id": null,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### POST /wallet/top-up
Top up wallet.

**Request:**
```json
{
  "amountLkr": 1000,
  "paymentMethod": "card"
}
```

**Response:** Payment initiation response

## Promo Codes

#### GET /promo-codes
List active promo codes.

**Response:**
```json
[
  {
    "id": "uuid",
    "code": "WELCOME10",
    "description": "First order discount",
    "kind": "percent",
    "value": 10,
    "min_spend_lkr": 500,
    "is_active": true,
    "expires_at": "2024-12-31T23:59:59Z",
    "redemptions_count": 100,
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

#### POST /promo-codes/validate
Validate a promo code.

**Request:**
```json
{
  "code": "WELCOME10",
  "subtotalLkr": 1000
}
```

**Response:**
```json
{
  "valid": true,
  "discountLkr": 100,
  "message": "10% discount applied"
}
```

## Notifications

#### GET /notifications
Get user notifications.

**Response:**
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "type": "order",
    "title": "Order delivered",
    "body": "Your order ORD-12345 has been delivered",
    "link": "/orders/uuid",
    "is_read": false,
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

#### PATCH /notifications/:id/read
Mark notification as read.

**Response:** Success

#### PATCH /notifications/read-all
Mark all notifications as read.

**Response:** Success

## Favorites

#### GET /favorites
Get user's favorite games.

**Response:**
```json
[
  {
    "user_id": "uuid",
    "game_id": "uuid",
    "created_at": "2024-01-01T00:00:00Z",
    "game": {
      "id": "uuid",
      "slug": "free-fire",
      "name": "Free Fire",
      ...
    }
  }
]
```

#### POST /favorites
Add game to favorites.

**Request:**
```json
{
  "gameId": "uuid"
}
```

**Response:** Success

#### DELETE /favorites/:gameId
Remove game from favorites.

**Response:** Success

## Reviews

#### GET /reviews
List reviews (with optional filters).

**Query params:** `gameId`, `page`, `limit`

**Response:**
```json
{
  "reviews": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "game_id": "uuid",
      "order_id": "uuid",
      "rating": 5,
      "title": "Great service",
      "body": "Fast delivery, will buy again!",
      "is_approved": true,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 20
}
```

#### POST /reviews
Create a review.

**Request:**
```json
{
  "gameId": "uuid",
  "orderId": "uuid",
  "rating": 5,
  "title": "Great service",
  "body": "Fast delivery, will buy again!"
}
```

**Response:** Created review

## Support Tickets

#### GET /support/tickets
Get user's support tickets.

**Response:**
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "order_id": "uuid",
    "subject": "Order not delivered",
    "category": "Delivery",
    "status": "open",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

#### POST /support/tickets
Create a support ticket.

**Request:**
```json
{
  "subject": "Order not delivered",
  "category": "Delivery",
  "orderId": "uuid",
  "body": "My order hasn't been delivered yet"
}
```

**Response:** Created ticket

#### GET /support/tickets/:id/messages
Get ticket messages.

**Response:**
```json
[
  {
    "id": "uuid",
    "ticket_id": "uuid",
    "sender_id": "uuid",
    "body": "My order hasn't been delivered yet",
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

#### POST /support/tickets/:id/messages
Send a message to a ticket.

**Request:**
```json
{
  "body": "Please check my order"
}
```

**Response:** Created message

## FAQ

#### GET /faqs
Get FAQs.

**Response:**
```json
[
  {
    "id": "uuid",
    "question": "How long does delivery take?",
    "answer": "Most orders are delivered within 5-15 minutes...",
    "category": "Orders",
    "is_active": true,
    "sort_order": 1
  }
]
```

## Blog

#### GET /blog
List blog posts.

**Response:**
```json
[
  {
    "id": "uuid",
    "slug": "how-to-top-up-free-fire",
    "title": "How to Top Up Free Fire Diamonds",
    "excerpt": "A complete guide...",
    "body": "Top up your Free Fire diamonds...",
    "cover_url": "https://...",
    "is_published": true,
    "published_at": "2024-01-01T00:00:00Z",
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

#### GET /blog/:slug
Get blog post by slug.

**Response:** Single blog post

## Announcements

#### GET /announcements
Get active announcements.

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Welcome to HASA GOLD STORE!",
    "body": "Your one-stop shop for game top-ups...",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

## Admin Endpoints

All admin endpoints require `ADMIN` role.

#### GET /admin/stats
Get admin dashboard stats.

**Response:**
```json
{
  "revenue": 100000,
  "todayRev": 5000,
  "orderCount": 500,
  "userCount": 200,
  "openTickets": 10,
  "chart": [
    { "date": "2024-01-01", "value": 1000 },
    { "date": "2024-01-02", "value": 1500 }
  ]
}
```

#### GET /admin/users
List all users.

**Response:** Paginated user list

#### PATCH /admin/users/:id/status
Update user status.

**Request:**
```json
{
  "status": "suspended",
  "reason": "Violation of terms"
}
```

#### GET /admin/orders
List all orders.

**Response:** Paginated order list

#### PATCH /admin/orders/:id/status
Update order status.

**Request:**
```json
{
  "status": "delivered",
  "note": "Delivered successfully"
}
```

#### GET /admin/tickets
List all support tickets.

**Response:** Paginated ticket list

#### GET /admin/settings
Get system settings.

**Response:**
```json
{
  "maintenance": {
    "enabled": false,
    "message": "We are currently performing maintenance..."
  },
  "security_lock": {
    "enabled": false,
    "message": "Your account has been temporarily locked..."
  }
}
```

#### PATCH /admin/settings
Update system settings.

**Request:**
```json
{
  "maintenance": {
    "enabled": true,
    "message": "Maintenance in progress"
  }
}
```

## Error Responses

All endpoints may return error responses:

```json
{
  "code": "ERROR_CODE",
  "message": "Human-readable error message",
  "details": {}
}
```

Common error codes:
- `UNAUTHORIZED` - Not authenticated
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `VALIDATION_ERROR` - Invalid input
- `INTERNAL_ERROR` - Server error
- `NO_API_BASE_URL` - Frontend configuration error

## Data Serialization

The backend should serialize Prisma models to match the frontend type definitions in `src/types/index.ts`. Note:

- Use snake_case for JSON field names
- Include all nested relations as specified
- Format dates as ISO 8601 strings
- Use UUID strings for ID fields
