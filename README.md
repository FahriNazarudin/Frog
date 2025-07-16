# My Social Media App

## 📱 Description

My Social Media App is a full-stack mobile social media application built using React Native with Expo and GraphQL Apollo Server. This application allows users to share posts, comment, like content, and follow other users in a secure and responsive environment.

### ✨ Key Features

-  **Authentication**: Register and Login with JWT
-  **Post Management**: Create, view, and manage posts
-  **Comments**: Embedded comment system within posts
-  **User Search**: Search users by name or username
-  **Follow System**: Follow and be followed by other users
-  **Like System**: Like posts with total like counter
-  **User Profile**: Display followers and following count

### 🛠️ Tech Stack

**Backend:**

- Node.js & GraphQL
- Apollo Server
- MongoDB (Database)
- Redis (Caching)
- JWT Authentication
- bcryptjs (Password Hashing)

**Frontend:**

- React Native & Expo
- Apollo Client
- React Navigation
- Expo Secure Store
- Context API for State Management

## 🚀 Installation and Usage

### Prerequisites

- Node.js (v16 or newer)
- MongoDB
- Redis
- Expo CLI
- Git

### 1. Clone Repository

```bash
git clone https://github.com/FahriNazarudin/my-social-media-app.git
cd my-social-media-app
```

### 2. Backend Setup (Server)

```bash
# Navigate to server folder
cd server

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your database and Redis configuration

# Run server
npm run dev
```

### 3. Frontend Setup (Mobile App)

```bash
# Navigate to SocialMedia folder
cd ../SocialMedia

# Install dependencies
npm install

# Run application
npm start
# or
npx expo start
```

### 4. Environment Variables

Create a `.env` file in the `server` folder with the following configuration:

```env
MONGODB_URI=mongodb://localhost:27017/socialmedia
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-jwt-secret-key
PORT=3000
```

## 📝 Usage Examples

### GraphQL Queries & Mutations

**1. Register User**

```graphql
mutation RegisterUser {
  register(
    name: "John Doe"
    username: "johndoe"
    email: "john@example.com"
    password: "password123"
  ) {
    _id
    name
    username
    email
  }
}
```

**2. Login**

```graphql
mutation LoginUser {
  login(email: "john@example.com", password: "password123") {
    access_token
    user {
      _id
      name
      username
      email
    }
  }
}
```

**3. Get Posts**

```graphql
query GetPosts {
  posts {
    _id
    content
    tag
    imgUrl
    createdAt
    likes {
      username
    }
    comments {
      content
      username
      createdAt
    }
    authorDetail {
      name
      username
    }
  }
}
```

**4. Create Post**

```graphql
mutation CreatePost {
  addPost(
    content: "Hello World! This is my first post"
    tag: "greeting"
    imgUrl: "https://example.com/image.jpg"
  ) {
    _id
    content
    tag
    createdAt
    authorDetail {
      name
      username
    }
  }
}
```

**5. Follow User**

```graphql
mutation FollowUser {
  followUser(followingId: "user_id_here") {
    _id
    followingId
    followerId
  }
}
```

## 🤝 Contributing

1. **Fork** this repository
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/FahriNazarudin/my-social-media-app.git
   ```
3. **Create** a new branch for your feature:
   ```bash
   git checkout -b feature/feature-name
   ```
4. **Commit** your changes:
   ```bash
   git commit -m "Add: new feature description"
   ```
5. **Push** to your branch:
   ```bash
   git push origin feature/feature-name
   ```
6. **Create** a Pull Request on GitHub

### Contributing Guidelines

- Ensure code follows the existing style guide
- Add tests for new features
- Update documentation if necessary
- Make sure all tests pass before submitting PR

## ScreenShot App

<img width="350" alt="Simulator Screenshot - iPhone 16 Pro - 2025-07-16 at 11 50 17" src="https://github.com/user-attachments/assets/0297e188-b85c-453d-aa6e-11efd1543864" />
<img width="350" alt="Simulator Screenshot - iPhone 16 Pro - 2025-07-16 at 11 50 12" src="https://github.com/user-attachments/assets/eb6d6b52-9ce1-4ffb-8c72-54c9d15283a9" />
<img width="350" alt="Simulator Screenshot - iPhone 16 Pro - 2025-07-16 at 11 50 01" src="https://github.com/user-attachments/assets/865e5857-e47b-4ac5-8159-88a301e7d381" />
<img width="350" alt="Simulator Screenshot - iPhone 16 Pro - 2025-07-16 at 11 49 54" src="https://github.com/user-attachments/assets/d7dd41de-6d8c-4c89-9f73-ba29a3e0cb74" />
<img width="350" alt="Simulator Screenshot - iPhone 16 Pro - 2025-07-16 at 11 49 30" src="https://github.com/user-attachments/assets/54315b6e-18fe-4061-9a81-760c2541ab92" />
<img width="350" alt="Simulator Screenshot - iPhone 16 Pro - 2025-07-16 at 11 49 47" src="https://github.com/user-attachments/assets/a51c028a-fe22-46cf-bc02-c206361e9135" />


## 📞 Contact

**Fahri Nazarudin**


- Email: fahri.nazarudin@example.com
- LinkedIn: [Fahri Nazarudin](https://linkedin.com/in/fahrinazarudin)


---
