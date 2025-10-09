# Business Cards API

A RESTful API for managing business cards with user authentication, authorization, and social features. Built as a final project for the Backend Development module in Full Stack Web Development course.

## Table of Contents
- [Features](#features)
- [Technologies](#technologies)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Initial Data Setup](#initial-data-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
  - [Authentication](#authentication)
  - [Users Endpoints](#users-endpoints)
  - [Cards Endpoints](#cards-endpoints)
- [Authorization & Permissions](#authorization--permissions)
- [Error Handling](#error-handling)
- [Database Schema](#database-schema)
- [Security Features](#security-features)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)

## Features

✅ User registration and authentication (JWT)  
✅ Three user types: Regular, Business, and Admin  
✅ Business card CRUD operations  
✅ Like/Unlike functionality for cards  
✅ User profile management  
✅ Permission-based access control  
✅ Input validation with Joi  
✅ Secure password hashing with bcrypt  
✅ MongoDB with Mongoose ODM  

## Technologies

- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Password Security:** bcrypt
- **Validation:** Joi
- **Environment Variables:** dotenv

## Prerequisites

Before running this application, make sure you have:

- **Node.js** (v14 or higher) installed
- **MongoDB** installed and running locally, OR MongoDB Atlas account
- **npm** or **yarn** package manager
- **Postman** or similar tool for API testing (optional)

## Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd <project-folder>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

## Environment Variables

Create a `.env` file in the project root directory:

```env
PORT=3000
LOCAL_DB=mongodb://127.0.0.1:27017/business_card_app
ATLAS_DB=<your-atlas-uri>
SECRET_WORD= <secretWord נמצאת בתאור הגשת המשימה>
```

**Configuration options:**
- `PORT`: Server port number (default: 3000)
- `LOCAL_DB`: Local MongoDB connection string
- `ATLAS_DB`: MongoDB Atlas connection string (for cloud database)

**Note:** A `.env.example` file is included in the project. Copy it and rename to `.env`, then update with your values.

## Initial Data Setup

The project includes a seed script to populate the database with sample data.

### Steps:

1. **Make sure MongoDB is running**
   - Open MongoDB Compass, OR
   - Run `mongod` command in terminal

2. **Run the seed script**
   ```bash
   node initialData.js
   ```

This creates:
- **3 Users:**
  - Regular user: `regular@example.com` / `password123`
  - Business user: `business@example.com` / `password123`
  - Admin user: `admin@example.com` / `password123`
- **3 Sample Business Cards** (owned by business user)

## Running the Application

**Production mode:**
```bash
npm start
```

**Development mode:**
```bash
npm run dev
```

The server will start on `http://localhost:3000` (or your configured PORT).

**Expected console output:**
```
Server is listening to port 3000
connected to MongoDb Locally!
```

## API Documentation

Base URL: `http://localhost:3000`

All API requests return JSON responses. Protected routes require authentication via JWT token in the `x-auth-token` header.

### Authentication

#### Register User
```http
POST /users
```

**Request Body:**
```json
{
  "name": {
    "first": "John",
    "middle": "",
    "last": "Doe"
  },
  "email": "john@example.com",
  "password": "password123",
  "phone": "0501234567",
  "isBusiness": true,
  "address": {
    "state": "IL",
    "country": "Israel",
    "city": "Tel Aviv",
    "street": "Dizengoff",
    "houseNumber": 50,
    "zip": 12345
  },
  "image": {
    "url": "https://example.com/image.jpg",
    "alt": "Profile picture"
  }
}
```

**Success Response:** `201 Created`
```json
{
  "email": "john@example.com",
  "name": {
    "first": "John",
    "middle": "",
    "last": "Doe"
  },
  "_id": "507f1f77bcf86cd799439011"
}
```

**Note:** `isAdmin` is always set to `false` for security. Admin users must be created via seed script or database directly.

---

#### Login
```http
POST /users/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response:** `200 OK`
```json
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response is the JWT token** - save this for authenticated requests.

---

### Users Endpoints

#### Get All Users
```http
GET /users
```

**Authorization:** Admin only  
**Headers:** `x-auth-token: <JWT_TOKEN>`

**Success Response:** `200 OK`
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": { "first": "John", "middle": "", "last": "Doe" },
    "email": "john@example.com",
    "phone": "0501234567",
    "isBusiness": true,
    "isAdmin": false
  }
]
```

---

#### Get User by ID
```http
GET /users/:id
```

**Authorization:** Admin OR own account  
**Headers:** `x-auth-token: <JWT_TOKEN>`

**Success Response:** `200 OK`
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": { "first": "John", "middle": "", "last": "Doe" },
  "email": "john@example.com",
  "phone": "0501234567",
  "address": { ... },
  "image": { ... },
  "isBusiness": true,
  "isAdmin": false,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

#### Update User
```http
PUT /users/:id
```

**Authorization:** Own account only  
**Headers:** `x-auth-token: <JWT_TOKEN>`

**Request Body:** (Any user fields to update)
```json
{
  "name": {
    "first": "John",
    "middle": "M",
    "last": "Doe"
  },
  "phone": "0509876543"
}
```

**Success Response:** `200 OK` - Returns updated user

---

#### Toggle Business Status
```http
PATCH /users/:id
```

**Authorization:** Own account only  
**Headers:** `x-auth-token: <JWT_TOKEN>`

**Request Body:** Empty (toggles current status)

**Success Response:** `200 OK` - Returns updated user with toggled `isBusiness`

---

#### Delete User
```http
DELETE /users/:id
```

**Authorization:** Admin OR own account  
**Headers:** `x-auth-token: <JWT_TOKEN>`

**Success Response:** `200 OK`
```json
"User John Doe deleted successfully"
```

**Note:** Deleting a user also deletes all their business cards (cascade delete).

---

### Cards Endpoints

#### Get All Cards
```http
GET /cards
```

**Authorization:** None (public endpoint)

**Success Response:** `200 OK`
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Tech Solutions",
    "subtitle": "IT Services",
    "description": "Professional IT consulting",
    "phone": "050-4444444",
    "email": "tech@example.com",
    "web": "https://techsolutions.com",
    "image": { ... },
    "address": { ... },
    "bizNumber": 1000001,
    "likes": ["userId1", "userId2"],
    "user_id": "507f1f77bcf86cd799439011",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

#### Get Card by ID
```http
GET /cards/:id
```

**Authorization:** None (public endpoint)

**Success Response:** `200 OK` - Returns single card object

---

#### Get My Cards
```http
GET /cards/my-cards
```

**Authorization:** Authenticated user  
**Headers:** `x-auth-token: <JWT_TOKEN>`

**Success Response:** `200 OK` - Returns array of user's cards

---

#### Create Card
```http
POST /cards
```

**Authorization:** Business users only  
**Headers:** `x-auth-token: <JWT_TOKEN>`

**Request Body:**
```json
{
  "title": "My Business",
  "subtitle": "Professional Services",
  "description": "We provide excellent services",
  "phone": "050-1234567",
  "email": "business@example.com",
  "web": "https://mybusiness.com",
  "image": {
    "url": "https://example.com/image.jpg",
    "alt": "Business logo"
  },
  "address": {
    "state": "IL",
    "country": "Israel",
    "city": "Tel Aviv",
    "street": "Rothschild",
    "houseNumber": 1,
    "zip": 12345
  }
}
```

**Success Response:** `201 Created` - Returns created card with auto-generated `bizNumber`

---

#### Update Card
```http
PUT /cards/:id
```

**Authorization:** Card owner only  
**Headers:** `x-auth-token: <JWT_TOKEN>`

**Request Body:** (Any card fields to update)
```json
{
  "title": "Updated Business Name",
  "phone": "050-9999999"
}
```

**Success Response:** `200 OK` - Returns updated card

---

#### Delete Card
```http
DELETE /cards/:id
```

**Authorization:** Admin OR card owner  
**Headers:** `x-auth-token: <JWT_TOKEN>`

**Success Response:** `200 OK`
```json
"Card deleted successfully"
```

---

#### Toggle Like Card
```http
PATCH /cards/:id
```

**Authorization:** Any authenticated user  
**Headers:** `x-auth-token: <JWT_TOKEN>`

**Request Body:** Empty

**Success Response:** `200 OK` - Returns updated card

**Behavior:**
- If user hasn't liked the card → adds like
- If user already liked the card → removes like

---

## Authorization & Permissions

| Endpoint | Regular User | Business User | Admin |
|----------|-------------|---------------|-------|
| Register | ✅ | ✅ | ❌* |
| Login | ✅ | ✅ | ✅ |
| Get all users | ❌ | ❌ | ✅ |
| Get user by ID | Own account | Own account | Any user |
| Update user | Own account | Own account | Own account |
| Delete user | Own account | Own account | Any user |
| Get all cards | ✅ | ✅ | ✅ |
| Get card by ID | ✅ | ✅ | ✅ |
| Get my cards | ✅ | ✅ | ✅ |
| Create card | ❌ | ✅ | ✅ |
| Update card | ❌ | Own cards | Own cards |
| Delete card | ❌ | Own cards | Any card |
| Like/Unlike card | ✅ | ✅ | ✅ |

*Admin can only be created via seed script or direct database access for security reasons.

## Error Handling

The API returns appropriate HTTP status codes and error messages:

### Status Codes

- `200 OK` - Request succeeded
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid data or validation failed
- `401 Unauthorized` - Not authenticated (no token or invalid token)
- `403 Forbidden` - Authenticated but no permission
- `404 Not Found` - Resource doesn't exist
- `409 Conflict` - Resource already exists (e.g., duplicate email)
- `500 Internal Server Error` - Server error

### Error Response Format

```json
"Error message describing what went wrong"
```

### Common Errors

**Authentication required:**
```json
"Authentication Error: Please Login"
```

**Invalid token:**
```json
"Authentication Error: Unauthorize user"
```

**No permission:**
```json
"Access denied - you can only edit your own user"
```

**Validation error:**
```json
"\"phone\" is not allowed to be empty"
```

**Email already exists:**
```json
"Email already exists"
```

## Database Schema

### User Schema

```javascript
{
  name: {
    first: String (required, 2-256 chars),
    middle: String (optional, 2-256 chars),
    last: String (required, 2-256 chars)
  },
  phone: String (required, format: 0XX-XXXXXXX),
  email: String (required, unique, valid email),
  password: String (required, min 6 chars, hashed),
  image: {
    url: String (optional, valid URL),
    alt: String (optional, 2-256 chars)
  },
  address: {
    state: String (optional),
    country: String (required, 2-256 chars),
    city: String (required, 2-256 chars),
    street: String (required, 2-256 chars),
    houseNumber: Number (required),
    zip: Number (optional)
  },
  isAdmin: Boolean (default: false),
  isBusiness: Boolean (default: false),
  createdAt: Date (auto-generated)
}
```

### Card Schema

```javascript
{
  title: String (required, 2-256 chars),
  subtitle: String (required, 2-256 chars),
  description: String (required, 2-1024 chars),
  phone: String (required, format: 0XX-XXXXXXX),
  email: String (required, valid email),
  web: String (optional, valid URL),
  image: {
    url: String (optional, valid URL),
    alt: String (optional, 2-256 chars)
  },
  address: {
    state: String (optional),
    country: String (required, 2-256 chars),
    city: String (required, 2-256 chars),
    street: String (required, 2-256 chars),
    houseNumber: Number (required),
    zip: Number (optional)
  },
  bizNumber: Number (required, auto-generated, 7 digits),
  likes: Array of Strings (user IDs),
  user_id: String (required, card owner's ID),
  createdAt: Date (auto-generated)
}
```

## Security Features

### Password Security
- All passwords are hashed using **bcrypt** before storage
- Passwords are never stored or transmitted in plain text
- Minimum password length: 6 characters

### JWT Authentication
- Tokens expire after 24 hours
- Token contains: user ID, isBusiness status, isAdmin status
- Token must be sent in `x-auth-token` header for protected routes

### Admin Protection
- Admin users cannot be created via registration API
- `isAdmin` is forced to `false` in registration endpoint
- Admin users must be created via seed script or direct database access

### Input Validation
- All user inputs validated using **Joi** schemas
- Email format validation
- Phone number format validation
- URL validation for web addresses and images
- String length limits enforced

### Authorization Checks
- Controller layer validates user permissions
- Service layer validates ownership (user can only edit own resources)
- Cascade delete: deleting a user removes all their cards

## Testing

### Using Postman

1. **Register a new user**
   - POST `http://localhost:3000/users`
   - Body: User JSON

2. **Login**
   - POST `http://localhost:3000/users/login`
   - Body: `{ "email": "...", "password": "..." }`
   - Copy the token from response

3. **Test protected endpoints**
   - Add header: `x-auth-token: <paste-token-here>`
   - Make requests to protected endpoints

### Test Accounts

Use the seed script accounts for testing:
- **Regular:** `regular@example.com` / `password123`
- **Business:** `business@example.com` / `password123`
- **Admin:** `admin@example.com` / `password123`

## Project Structure

```
project-root/
├── .env                          # Environment variables (not in git)
├── .env.example                  # Environment template
├── .gitignore                    # Git ignore file
├── package.json                  # Dependencies and scripts
├── initialData.js                # Database seed script
├── server.js                     # Main server file
│
├── auth/
│   ├── providers/
│   │   └── jwtProvider.js        # JWT generation and verification
│   └── services/
│       └── authService.js        # Authentication middleware
│
├── users/
│   ├── models/
│   │   └── User.js               # User Mongoose model
│   ├── routes/
│   │   └── usersController.js   # User routes/endpoints
│   ├── services/
│   │   ├── usersService.js       # User business logic
│   │   └── usersDataService.js   # User database operations
│   ├── validation/
│   │   ├── userValidationSchema.js    # Joi schemas
│   │   └── userValidationService.js   # Validation functions
│   └── helpers/
│       └── bcrypt.js             # Password hashing utilities
│
├── cards/
│   ├── models/
│   │   └── Card.js               # Card Mongoose model
│   ├── routes/
│   │   └── cardsController.js   # Card routes/endpoints
│   ├── services/
│   │   ├── cardsService.js       # Card business logic
│   │   └── cardsDataService.js   # Card database operations
│   ├── validation/
│   │   ├── cardValidationSchema.js    # Joi schemas
│   │   └── cardValidationService.js   # Validation functions
│   └── helpers/
│       └── generateBizNumber.js  # Business number generator
│
├── DB/
│   └── dbService.js              # MongoDB connection
│
└── helpers/
    ├── mongooseValidators.js     # Mongoose validation helpers
    └── submodels/
        ├── Name.js               # Name sub-schema
        ├── Address.js            # Address sub-schema
        └── Image.js              # Image sub-schema
```

## Troubleshooting

### MongoDB Connection Issues

**Error:** `could not connect to mongoDB`

**Solutions:**
- Verify MongoDB is running (check MongoDB Compass or run `mongod`)
- Check `LOCAL_DB` in `.env` matches your database name
- Try connecting with: `mongodb://localhost:27017/business_card_app` instead of `127.0.0.1`

---

### Duplicate Key Error

**Error:** `E11000 duplicate key error`

**Solutions:**
- Email already exists in database
- Use different email or delete existing user
- Run seed script again (it clears data first)

---

### Cannot Find Module 'dotenv'

**Error:** `Cannot find module 'dotenv'`

**Solution:**
```bash
npm install dotenv
```

---

### Token Expired or Invalid

**Error:** `Authentication Error: Unauthorize user`

**Solutions:**
- Token may be expired (24h lifetime)
- Login again to get new token
- Verify token is correctly copied in `x-auth-token` header

---

### Validation Errors

**Error:** `"phone" is not allowed to be empty`

**Solution:**
- Check all required fields are included
- Verify data format matches schema (phone: 0XX-XXXXXXX, email format, etc.)
- Check nested objects are complete (name must have first and last)

---

### Port Already in Use

**Error:** `Error: listen EADDRINUSE: address already in use :::3000`

**Solutions:**
- Another application is using port 3000
- Change `PORT` in `.env` to different number (e.g., 3001)
- Or stop the other application using that port

---

## Credits

**Developer:** [Gur Ben Sira]  
**Course:** Full Stack Web Development - Backend Module  
**Institution:** [Your Institution Name]  
**Date:** [Project Date]

---

## Notes

- This is an educational project for learning backend development concepts
- Demo credentials are for testing purposes only
- Not intended for production use without additional security measures
- Follow security best practices if deploying to production

---

## Support

For questions or issues:
- Review this README documentation
- Check the Troubleshooting section
- Consult course materials and resources

---

**Happy Coding! 🚀**