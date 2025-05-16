# 📦 Ement API (Event Management Backend)

**Ement API** is a web-based backend service for managing events and registrations. It supports user authentication, role-based access control, image uploads, and real-time event registration features.

🌍 Live API: [Production Link](https://projectevent-management-backend-production.up.railway.app)
📘 API Docs: [Swagger UI](https://projectevent-management-backend-production.up.railway.app/api-docs)

---

## 🚀 Key Features

- 🔐 **User Authentication (JWT)** – Secure login and registration
- 🧑‍💼 **Role-Based Access Control** – Admin vs. regular users
- 🗓️ **Event Management** – Create, update, delete events
- ✍️ **Event Registration** – Join events as an authenticated user
- 🌁 **Cloudinary Uploads** – Upload and serve event images
<!-- - 📊 **Reporting Support** – Stats & analytics (coming soon) -->

---

## 🛠️ Built With

- **Node.js + Express**
- **MongoDB + Mongoose**
- **JWT + bcrypt**
- **Cloudinary** (image hosting)

---

## 📦 Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/tiedsandi/project_event-management-backend
   cd project_event-management-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Add a `.env` file** to the root of the project:

   ```env
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

---

## 📚 API Endpoints Overview

### 🔐 Auth

- `POST /api/auth/register` – Register new users
- `POST /api/auth/login` – Authenticate users and return JWT

### 📅 Events

- `GET /api/events/` – List all events
- `POST /api/events/` – Create new event _(admin only)_
- `PUT /api/events/:id` – Edit event _(admin only)_
- `DELETE /api/events/:id` – Delete event _(admin only)_

### 📝 Registrations

- `POST /api/registrations/:eventId` – Register for an event
- `GET /api/registrations/me` – View your registrations

### 📊 Reports _(coming soon)_

- Event attendance
- User activity & metrics

---

## 🗂️ Project Structure

```
project_event-management-backend/
├── controllers/        # API logic per resource
├── middleware/         # Auth & error handling
├── models/             # Mongoose schemas (User, Event, Registration)
├── routes/             # Route definitions
├── utils/              # Utility functions (cloudinary, token)
├── swagger.js          # Swagger setup
├── server.js           # App entry point
└── README.md
```

---

## 👨‍💻 Developer Info

**Fachran Sandi** – Fullstack Web Developer from Jakarta, Indonesia
🌐 [Portfolio](https://fachran-sandi.netlify.app/)
🔗 [LinkedIn](https://www.linkedin.com/in/fachransandi/)
📁 [GitHub](https://github.com/fachransandi)

---

Feel free to open issues or contribute to this project!
