# 🎨 Aivora AI - Complete AI Toolkit

Aivora is a full-stack AI-powered platform offering tools for image generation, content creation, background removal, object removal, resume review, and more. Built with React, Node.js, Express, Prisma, and PostgreSQL.

![Aivora AI](client/public/logo.png)

## ✨ Features

### 🖼️ Image Tools
- **AI Image Generation** - Generate images from text prompts using Pollinations.ai
- **Background Removal** - Remove backgrounds from images using Cloudinary AI
- **Object Removal** - Remove specific objects from images with AI

### ✍️ Content Tools
- **Article Writer** - Generate full articles with AI (500-800 words)
- **Blog Title Generator** - Create catchy blog titles
- **Resume Review** - Upload and get AI-powered resume feedback

### 👥 Community Features
- **Community Gallery** - Share and explore AI-generated images
- **Like System** - Like and interact with community creations
- **Public/Private Creations** - Choose to publish or keep creations private

### 🔍 Advanced Features (NEW!)
- **Pagination** - Navigate through large lists of creations
- **Search** - Find creations by prompt text
- **Filtering** - Filter by creation type (image, article, blog-title, etc.)
- **Sorting** - Sort by newest or oldest first
- **Delete** - Remove your own creations

### 💎 Premium Plans
- **Free Plan** - Limited usage with basic features
- **Premium Plan** - Unlimited access to all AI tools
- **Stripe Integration** - Secure payment processing

## 🏗️ Tech Stack

### Frontend
- **React 19** - Modern UI library
- **Vite** - Fast build tool
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Lucide React** - Beautiful icons
- **React Hot Toast** - Toast notifications
- **React Markdown** - Markdown rendering
- **Framer Motion** - Animations

### Backend
- **Node.js** - JavaScript runtime
- **Express 5** - Web framework
- **Prisma** - Type-safe ORM
- **PostgreSQL** - Database (NeonDB)
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File uploads
- **Cloudinary** - Image storage and processing
- **OpenAI/Gemini** - AI text generation
- **Pollinations.ai** - Free AI image generation
- **Stripe** - Payment processing
- **pdf-parse** - PDF parsing for resume review

## 📁 Project Structure

```
aivora-ai/
├── client/                 # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── assets/        # Images, icons
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context (Auth)
│   │   ├── pages/         # Page components
│   │   ├── utils/         # Utility functions
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── .env               # Environment variables
│   ├── package.json
│   └── vite.config.js     # Vite configuration
│
├── server/                # Node.js backend
│   ├── configs/           # Configuration files
│   │   ├── cloudinary.js  # Cloudinary setup
│   │   ├── db.js          # Database connection
│   │   └── multer.js      # File upload config
│   ├── controllers/       # Route controllers
│   │   ├── aiController.js      # AI operations
│   │   ├── authController.js    # Authentication
│   │   ├── paymentController.js # Payments
│   │   └── userController.js    # User operations
│   ├── middlewares/       # Express middlewares
│   │   └── auth.js        # JWT authentication
│   ├── prisma/            # Database schema
│   │   └── schema.prisma  # Prisma schema
│   ├── routes/            # API routes
│   │   ├── aiRoutes.js
│   │   ├── authRoutes.js
│   │   └── userRoutes.js
│   ├── .env               # Environment variables
│   ├── package.json
│   └── server.js          # Entry point
│
└── README.md              # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database (NeonDB recommended)
- npm or yarn
- Cloudinary account
- OpenAI/Gemini API key
- Stripe account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd aivora-ai
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

### Environment Setup

#### Server (.env)
Create `server/.env` file:
```env
# Database
DATABASE_URL="postgresql://user:password@host/database"

# JWT
JWT_SECRET="your-super-secret-jwt-key"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# AI APIs
GEMINI_API_KEY="your-gemini-api-key"

# Stripe (optional)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Server
PORT=3000
```

#### Client (.env)
Create `client/.env` file:
```env
# Backend API URL (use localhost for development)
VITE_API_URL=http://localhost:3000

# Stripe Publishable Key (optional)
VITE_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

### Database Setup

1. **Generate Prisma Client**
   ```bash
   cd server
   npm run prisma:generate
   ```

2. **Run migrations**
   ```bash
   npm run prisma:migrate
   ```

3. **Open Prisma Studio (optional)**
   ```bash
   npm run prisma:studio
   ```

### Running the Application

#### Development Mode

**Terminal 1 - Start Backend:**
```bash
cd server
npm run server
```
Server runs on http://localhost:3000

**Terminal 2 - Start Frontend:**
```bash
cd client
npm run dev
```
Client runs on http://localhost:5173

#### Production Build

**Build Frontend:**
```bash
cd client
npm run build
```

**Start Backend:**
```bash
cd server
npm start
```

## 📡 API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### AI Tools (`/api/ai`)
All routes require authentication.

- `POST /api/ai/generate-article` - Generate article
- `POST /api/ai/generate-blog-title` - Generate blog title
- `POST /api/ai/generate-image` - Generate AI image
- `POST /api/ai/remove-background` - Remove image background
- `POST /api/ai/remove-object` - Remove object from image
- `POST /api/ai/resume-review` - Review resume PDF

### User Operations (`/api/user`)
All routes require authentication.

- `GET /api/user/get-user-creations` - Get user's creations (with pagination, search, filter, sort)
- `GET /api/user/get-published-creations` - Get community creations (with pagination, search, filter, sort)
- `POST /api/user/toggle-like-creation` - Like/unlike a creation
- `DELETE /api/user/delete-creation/:id` - Delete a creation

### Query Parameters for Pagination/Search/Filter
```
?page=1&limit=10&search=boy&type=image&sortBy=createdAt&sortOrder=desc
```

## 🎯 Key Features Implementation

### Pagination
- Backend: Prisma `skip` and `take` for efficient pagination
- Frontend: Page navigation with Previous/Next buttons
- Returns total count and total pages

### Search
- Case-insensitive search in prompt field
- Debounced input (500ms delay)
- Works with pagination

### Filtering
- Filter by creation type: image, article, blog-title, resume-review
- Combines with search and pagination

### Sorting
- Sort by creation date (newest/oldest)
- Easy to extend with more sort options

### Delete
- Users can only delete their own creations
- Confirmation dialog before deletion
- Automatic list refresh after deletion

## 🔐 Authentication Flow

1. User signs up with name, email, password
2. Password is hashed with bcrypt
3. JWT token is generated and returned
4. Token is stored in localStorage
5. Token is sent in Authorization header for protected routes
6. Middleware verifies token and attaches userId to request

## 💾 Database Schema

### User
```prisma
model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String
  plan      String   @default("free")
  freeUsage Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Creation
```prisma
model Creation {
  id        Int       @id @default(autoincrement())
  userId    String
  prompt    String
  content   String
  type      String
  publish   Boolean?  @default(false)
  likes     String[]  @default([])
  createdAt DateTime? @default(now())
  updatedAt DateTime? @default(now())
}
```

## 🎨 UI Components

- **Navbar** - Navigation with auth state
- **Sidebar** - Tool navigation in dashboard
- **Hero** - Landing page hero section
- **AiTools** - Tool cards showcase
- **Plan** - Pricing plans
- **Testimonial** - User testimonials
- **Footer** - Site footer
- **CreationItem** - Display individual creation with delete button
- **PremiumGate** - Restrict features to premium users

## 🔧 Configuration

### Vite Proxy (Development)
The client proxies API requests to the backend:
```javascript
// vite.config.js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    }
  }
}
```

### CORS (Production)
Configure CORS in `server/server.js` for your production domain.

## 📦 Deployment

### Backend (Render/Railway/Heroku)
1. Push code to GitHub
2. Connect repository to hosting platform
3. Set environment variables
4. Deploy

### Frontend (Vercel/Netlify)
1. Build the client: `npm run build`
2. Deploy the `dist` folder
3. Set `VITE_API_URL` to your backend URL

### Database (NeonDB)
1. Create PostgreSQL database on NeonDB
2. Copy connection string to `DATABASE_URL`
3. Run migrations

## 🐛 Troubleshooting

### Search not working
- Check server logs for search query
- Verify proxy configuration in vite.config.js
- Ensure VITE_API_URL is set correctly

### Delete returns 404
- Restart server after adding new routes
- Check if route is defined in userRoutes.js
- Verify authentication token is valid

### Images not loading
- Check Cloudinary credentials
- Verify image URLs in database
- Check CORS settings

### Database connection failed
- Verify DATABASE_URL format
- Check NeonDB IP whitelist
- Ensure database exists

## 📝 Scripts Reference

### Server
- `npm run server` - Development with nodemon
- `npm start` - Production
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run migrations
- `npm run prisma:studio` - Open database GUI

### Client
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

ISC

## 👨‍💻 Author

Keshav Rajput

## 🙏 Acknowledgments

- Pollinations.ai for free AI image generation
- Cloudinary for image processing
- OpenAI/Gemini for text generation
- NeonDB for PostgreSQL hosting
- Stripe for payment processing

---

**Made with ❤️ using React, Node.js, and AI**
