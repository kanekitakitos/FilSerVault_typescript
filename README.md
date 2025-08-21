# FilSerVault - Movie & Series Favorites Manager

A modern web application for managing and organizing your favorite movies and TV series. Built with React, TypeScript, and Node.js.

## 🎯 Project Overview

FilSerVault allows users to:
- Browse and search movies and TV series
- Create accounts and manage personal profiles
- Save and organize favorite content
- Discover featured content on the homepage

## 🚀 Technologies

### Frontend
- **React 18.3.1** - Modern React with hooks
- **TypeScript 5.6.3** - Type-safe development
- **Material-UI 6.1.7** - UI component library
- **Axios** - HTTP client for API communication

### Backend
- **Node.js** - JavaScript runtime
- **Express.js 4.18.2** - Web framework
- **TypeScript 5.3.3** - Server-side type safety
- **NeDB** - Embedded document database
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing

### Development Tools
- **Webpack 5.96.1** - Module bundler
- **ts-node-dev** - Development server
- **Prettier** - Code formatting

## 🏗️ Architecture

**Client-Server Architecture:**
- **Client**: React SPA with TypeScript
- **Server**: Express.js REST API
- **Database**: NeDB (file-based NoSQL)
- **Authentication**: JWT with bcrypt

## ✨ Key Features

- **User Authentication**: Registration, login, JWT tokens
- **Content Management**: Browse movies/series with search and filters
- **Favorites System**: Save and manage favorite content
- **Responsive UI**: Modern design with Material-UI components
- **Real-time Updates**: Immediate UI updates for favorites

## 🛠️ Quick Start

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Installation
```bash
# Clone repository
git clone <your-repo-url>
cd projeto-final

# Install dependencies
cd client && npm install
cd ../server && npm install

# Start development servers
# Terminal 1 - Server
cd server && npm run dev

# Terminal 2 - Client  
cd client && npm run dev
```

### Access
- **Client**: http://localhost:8080
- **Server API**: http://localhost:3000

## 🔧 API Endpoints

- `POST /register` - User registration
- `POST /login` - User authentication
- `GET /movies` - List all movies
- `GET /series` - List all series
- `GET /movies/featured` - Featured movies
- `GET /series/featured` - Featured series
- `POST /users/:id/favoriteMovies` - Update favorite movies
- `POST /users/:id/favoriteSeries` - Update favorite series

## 📱 Available Scripts

### Client
```bash
npm run dev      # Development build and serve
npm run build    # Production build
npm run serve    # Serve built files
```

### Server
```bash
npm run dev      # Development with hot reload
npm run compile  # Compile TypeScript and run
```

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation (client & server)
- CORS configuration
- Secure session management

## 🌟 Future Enhancements

- User ratings and reviews
- Advanced search filters
- Content recommendations
- Mobile app (React Native)
- Admin panel
- External API integration (TMDB, OMDB)

## 📄 License

This project is licensed under the ISC License.

## 👥 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

**Built with ❤️ using modern web technologies** 