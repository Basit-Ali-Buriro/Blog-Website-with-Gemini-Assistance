# 📝 Blog Website - Full Stack MERN Application

A modern, feature-rich blogging platform built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring AI-powered writing assistance using Google's Gemini API.

## ✨ Features

### 🎯 Core Functionality
- **User Authentication** - Secure JWT-based authentication with httpOnly cookies
- **Post Management** - Create, read, update, and delete blog posts
- **Rich Text Support** - Markdown-supported content editor
- **Image Upload** - Cloudinary integration for image hosting
- **Categories & Tags** - Organize posts with categories and tags
- **Comments System** - Engage with readers through comments
- **Like System** - Allow users to like posts
- **Search & Filter** - Find posts by title, category, or tags
- **Pagination** - Smooth pagination for better performance

### 🤖 AI-Powered Features (Gemini Integration)
- **Improve Content** - Enhance writing quality and engagement
- **Generate Titles** - Create SEO-friendly, catchy titles
- **Generate Excerpts** - Auto-generate compelling post summaries
- **Suggest Tags** - Get relevant tag recommendations
- **Expand Content** - Add more details and examples to your writing
- **Continue Writing** - AI continues your blog post in the same style
- **Simplify Content** - Make complex content easier to understand
- **Blog Ideas Generator** - Get creative topic suggestions

### 👤 User Features
- **User Profiles** - Manage your profile with avatar upload
- **Dashboard** - Admin dashboard for content management
- **Post Statistics** - Track views, likes, and comments
- **Draft System** - Save posts as drafts before publishing
- **Edit Profile** - Update bio, profile picture, and password

### 🎨 UI/UX
- **Modern Design** - Clean, responsive interface with Tailwind CSS 4
- **Animations** - Smooth transitions and hover effects
- **Toast Notifications** - User-friendly feedback with react-hot-toast
- **Mobile Responsive** - Optimized for all screen sizes
- **Dark Theme Ready** - Modern gradient-based color scheme

## 🛠️ Tech Stack

### Frontend
- **React 19.2.0** - Latest React with concurrent features
- **Vite** - Fast build tool and dev server
- **Tailwind CSS 4** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client with interceptors
- **React Hot Toast** - Beautiful toast notifications
- **Lucide React** - Modern icon library
- **date-fns** - Date formatting utilities

### Backend
- **Node.js** - JavaScript runtime
- **Express.js 5** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Cloudinary** - Cloud-based image storage
- **Multer** - File upload middleware
- **Google Generative AI** - Gemini API integration
- **express-rate-limit** - API rate limiting
- **cookie-parser** - Cookie handling
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local or MongoDB Atlas account)
- **Cloudinary Account** (for image uploads)
- **Google AI Studio Account** (for Gemini API key)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Blog-Website
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
```

### 3. Frontend Setup

```bash
cd client
npm install
```

Create a `.env` file in the `client` directory:

```env
VITE_API_URL=/api
```

### 4. Run the Application

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

The application will be available at:
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:5000

## 🔑 Getting API Keys

### MongoDB Atlas
1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string
4. Replace `<password>` with your database password

### Cloudinary
1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Go to Dashboard
3. Copy Cloud Name, API Key, and API Secret

### Google Gemini API
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key to your `.env` file

## 📁 Project Structure

```
Blog-Website/
├── client/                 # Frontend React application
│   ├── public/            # Static files
│   ├── src/
│   │   ├── assets/        # Images, fonts, etc.
│   │   ├── components/    # React components
│   │   │   ├── auth/      # Login, Signup forms
│   │   │   ├── layout/    # Header, Footer, Navbar, etc.
│   │   │   └── post/      # Post-related components
│   │   ├── context/       # React Context (Auth)
│   │   ├── hooks/         # Custom hooks
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── utils/         # Utility functions
│   └── package.json
│
├── server/                # Backend Node.js application
│   ├── config/           # Configuration files
│   ├── controllers/      # Request handlers
│   ├── middlewares/      # Custom middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   └── server.js        # Entry point
│
└── README.md
```

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt for password encryption
- **HTTP-only Cookies** - Secure cookie storage
- **Rate Limiting** - Prevent API abuse
- **Input Validation** - Express-validator for data validation
- **CORS Protection** - Controlled cross-origin requests

## 🎨 Key Features Implementation

### AI Writing Assistant
The AI features use Google's Gemini 1.5 Flash model to provide real-time writing assistance:
- Contextual content improvement
- Smart title generation
- Automatic excerpt creation
- Intelligent tag suggestions
- Content expansion and continuation

### Authentication Flow
1. User registers with email and password
2. Password is hashed using bcryptjs
3. JWT token is generated and stored in httpOnly cookie
4. Token is validated on protected routes
5. User data is accessible via AuthContext

### Image Upload Flow
1. User selects images from file system
2. Images are previewed in browser
3. On submit, images are uploaded to Cloudinary
4. URLs are stored in MongoDB
5. Images are displayed from Cloudinary CDN

## 🧪 Available Scripts

### Backend
```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
```

### Frontend
```bash
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/password` - Change password

### Posts
- `GET /api/posts` - Get all posts (with filters)
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create new post (protected)
- `PUT /api/posts/:id` - Update post (protected)
- `DELETE /api/posts/:id` - Delete post (protected)
- `POST /api/posts/:id/like` - Toggle like (protected)
- `GET /api/posts/author/:userId` - Get posts by author

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (protected)
- `PUT /api/categories/:id` - Update category (protected)
- `DELETE /api/categories/:id` - Delete category (protected)

### Comments
- `GET /api/comments/:postId` - Get post comments
- `POST /api/comments/:postId` - Add comment (protected)
- `DELETE /api/comments/:id` - Delete comment (protected)

### AI Assistance
- `POST /api/ai/assist` - Get AI writing assistance (protected)
- `POST /api/ai/ideas` - Generate blog ideas (protected)

## 🐛 Known Issues & Solutions

### Issue: Images not uploading
**Solution:** Ensure Cloudinary credentials are correct in `.env` file

### Issue: AI features not working
**Solution:** Verify GEMINI_API_KEY is valid and has sufficient quota

### Issue: MongoDB connection failed
**Solution:** Check MONGO_URI and ensure IP is whitelisted in MongoDB Atlas

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Created with ❤️ by Basit Ali

## 🙏 Acknowledgments

- [React](https://react.dev/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Express.js](https://expressjs.com/) - Backend framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Cloudinary](https://cloudinary.com/) - Image hosting
- [Google AI](https://ai.google.dev/) - AI integration
- [Lucide Icons](https://lucide.dev/) - Icon library

## 📞 Support

For support, email basit.web24@gmail.com or open an issue in the repository.

---

⭐ If you like this project, please give it a star on GitHub!
