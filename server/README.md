# Quick AI - Backend Server

A Node.js + Express backend with JWT-based authentication, Prisma ORM, and PostgreSQL (NeonDB).

## Features

- 🔐 **JWT Authentication** - Secure token-based authentication
- 📦 **Prisma ORM** - Type-safe database access with PostgreSQL
- ✅ **Input Validation** - Express-validator for request validation
- 🔒 **Password Hashing** - bcrypt for secure password storage
- 🎨 **AI Integration** - OpenAI API integration
- 📤 **File Upload** - Cloudinary integration for media storage
- 💳 **Payment Processing** - Stripe integration

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database (NeonDB recommended)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env` and fill in your credentials:
   ```bash
   cp .env.example .env
   ```

   Required environment variables:
   - `DATABASE_URL` - Your PostgreSQL connection string (NeonDB)
   - `JWT_SECRET` - A strong secret key for JWT signing
   - `STRIPE_SECRET_KEY` - Your Stripe secret key
   - `STRIPE_WEBHOOK_SECRET` - Your Stripe webhook secret
   - `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
   - `CLOUDINARY_API_KEY` - Cloudinary API key
   - `CLOUDINARY_API_SECRET` - Cloudinary API secret
   - `OPENAI_API_KEY` - OpenAI API key

4. **Generate Prisma Client**
   ```bash
   npm run prisma:generate
   ```

5. **Run database migrations**
   ```bash
   npm run prisma:migrate
   ```

6. **Start the development server**
   ```bash
   npm run server
   ```

## API Endpoints

### Authentication Routes (`/api/auth`)

#### Sign Up
```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "clx...",
      "name": "John Doe",
      "email": "john@example.com",
      "plan": "free",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "clx...",
      "name": "John Doe",
      "email": "john@example.com",
      "plan": "free"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Get Profile (Protected)
```http
GET /api/auth/me
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "clx...",
    "name": "John Doe",
    "email": "john@example.com",
    "plan": "free",
    "freeUsage": 0,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Protected Routes

All routes under `/api/ai` and `/api/user` require JWT authentication.

**Authorization Header:**
```
Authorization: Bearer <your-jwt-token>
```

## Database Schema

### User Model

```prisma
model User {
  id           String   @id @default(cuid())
  name         String
  email        String   @unique
  password     String
  plan         String   @default("free")
  freeUsage    Int      @default(0)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

## Middleware

### `requireJwt`
Verifies JWT token and attaches user data to `req.user`.

### `attachPlan`
Fetches the latest user plan and usage data from the database.

### `requireRole`
Role-based access control middleware for restricting routes by user plan.

## Scripts

- `npm run server` - Start development server with nodemon
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio (database GUI)

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Optional validation errors
}
```

## Security Best Practices

1. **Environment Variables** - Never commit `.env` file
2. **Password Hashing** - Using bcrypt with salt rounds of 12
3. **JWT Expiration** - Tokens expire after 7 days
4. **Input Validation** - All inputs are validated using express-validator
5. **CORS Configuration** - Configured for specific origins only

## Development

### Database Management

View your database in Prisma Studio:
```bash
npm run prisma:studio
```

### Creating New Migrations

After modifying `schema.prisma`:
```bash
npx prisma migrate dev --name your_migration_name
```

## Troubleshooting

### Prisma Client Not Generated
```bash
npm run prisma:generate
```

### Database Connection Issues
- Verify `DATABASE_URL` in `.env`
- Ensure your IP is whitelisted in NeonDB
- Check database credentials

### JWT Token Issues
- Verify `JWT_SECRET` is set in `.env`
- Check token expiration
- Ensure proper Authorization header format

## License

ISC
