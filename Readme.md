# Event Management Backend

A backend API for managing events and registrations with role-based access control.

## Features

✅ User registration & login (JWT)
✅ Role-based access (admin/user)
✅ CRUD events
✅ Event registrations
✅ Image upload with Cloudinary
✅ Reporting endpoints

## Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- JWT + bcrypt
- Cloudinary (image hosting)

## Setup

1. Clone this repo.
2. Run `npm install`.
3. Create a `.env` file:

```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4. Run `npm run dev`.

## Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/events/`
- `POST /api/events/` (admin)
- `PUT /api/events/:id` (admin)
- `DELETE /api/events/:id` (admin)
<!--

## To Do (Next Steps)

- Add registration endpoints (for users to sign up for events)
- Add reporting endpoints (e.g., total attendees, event stats)
- Add test cases (Jest, Supertest)
- Write API documentation (Swagger or Postman) -->
