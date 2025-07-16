# My Social Media App

[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=19733285&assignment_repo_type=AssignmentRepo)

## 📱 Deskripsi Singkat

My Social Media App adalah aplikasi mobile social media full-stack yang dibangun menggunakan React Native dengan Expo dan GraphQL Apollo Server. Aplikasi ini memungkinkan pengguna untuk berbagi postingan, berkomentar, menyukai konten, dan mengikuti pengguna lain dalam lingkungan yang aman dan responsif.

### ✨ Fitur Utama

- 🔐 **Autentikasi**: Register dan Login dengan JWT
- 📝 **Post Management**: Membuat, melihat, dan mengelola postingan
- 💬 **Komentar**: Sistem komentar embedded dalam postingan
- 👤 **Pencarian User**: Cari pengguna berdasarkan nama atau username
- 👥 **Follow System**: Mengikuti dan diikuti pengguna lain
- ❤️ **Like System**: Menyukai postingan dengan total like counter
- 📊 **Analytics**: Menampilkan jumlah followers dan following

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

## 🚀 Cara Instalasi dan Penggunaan

### Prerequisites

- Node.js (v16 atau lebih baru)
- MongoDB
- Redis
- Expo CLI
- Git

### 1. Clone Repository

```bash
git clone https://github.com/FahriNazarudin/my-social-media-app.git
cd my-social-media-app
```

### 2. Setup Backend (Server)

```bash
# Masuk ke folder server
cd server

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env dengan konfigurasi database dan Redis Anda

# Jalankan server
npm run dev
```

### 3. Setup Frontend (Mobile App)

```bash
# Masuk ke folder SocialMedia
cd ../SocialMedia

# Install dependencies
npm install

# Jalankan aplikasi
npm start
# atau
npx expo start
```

### 4. Environment Variables

Buat file `.env` di folder `server` dengan konfigurasi:

```env
MONGODB_URI=mongodb://localhost:27017/socialmedia
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-jwt-secret-key
PORT=3000
```

## 📝 Contoh Penggunaan

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

## 🤝 Cara Berkontribusi

1. **Fork** repository ini
2. **Clone** fork Anda ke lokal:
   ```bash
   git clone https://github.com/FahriNazarudin/my-social-media-app.git
   ```
3. **Buat branch** baru untuk fitur Anda:
   ```bash
   git checkout -b feature/nama-fitur
   ```
4. **Commit** perubahan Anda:
   ```bash
   git commit -m "Add: deskripsi fitur baru"
   ```
5. **Push** ke branch Anda:
   ```bash
   git push origin feature/nama-fitur
   ```
6. **Buat Pull Request** di GitHub

### Guidelines Kontribusi

- Pastikan kode mengikuti style guide yang sudah ada
- Tambahkan test untuk fitur baru
- Update dokumentasi jika diperlukan
- Pastikan semua test pass sebelum submit PR

## 📄 Lisensi

Project ini dilisensikan under MIT License. Lihat file [LICENSE](LICENSE) untuk detail lengkap.

```
MIT License

Copyright (c) 2025 Fahri Nazarudin

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 📞 Kontak

**Fahri Nazarudin**

- GitHub: [@fahrinzrdn](https://github.com/fahrinzrdn)
- Email: fahri.nazarudin@example.com
- LinkedIn: [Fahri Nazarudin](https://linkedin.com/in/fahrinazarudin)

**Project Repository:** [my-social-media-app](https://github.com/FahriNazarudin/my-social-media-app)

---

## 🎯 Fitur Development Checklist

### Fitur Backend

- [x] Fitur Register
- [x] Fitur Login
- [x] Fitur Add Post
- [x] Fitur Show Post (berdasarkan yang paling baru)
- [x] Fitur Comment Post (Embedded Document)
- [x] Fitur search user berdasarkan nama atau username
- [x] Fitur follow
- [x] Menampilkan Followers dan Following dari setiap user (Reference with $lookup)
- [x] Fitur Like Post
- [x] Menampilkan total like dari setiap post

### Fitur Frontend

- [x] UI/UX Design
- [x] Authentication Flow
- [x] Post Creation & Display
- [x] Comment System
- [x] User Search
- [x] Follow/Unfollow System
- [x] Like/Unlike Posts
- [x] Profile Management
- [x] Navigation System

### Performance & Security

- [x] Redis Caching
- [x] JWT Authentication
- [x] Password Hashing
- [x] Input Validation
- [x] Error Handling
- [x] Cache Invalidation
