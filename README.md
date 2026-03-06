# QuickHire — Mini Job Board Application

QuickHire is a full-stack job board application that connects job seekers with employers through a clean and modern platform. Job seekers can browse listings, filter by category and location, and submit applications directly. Administrators manage the entire hiring pipeline through a dedicated panel, posting jobs, reviewing candidates, and updating application statuses in real time.
Built to demonstrate production-ready full-stack development with Google OAuth, Cloudinary image storage, and a RESTful API deployed across Vercel and Render.

**Live Demo**
- Frontend: https://quick-hire-vert-theta.vercel.app
- Admin Panel: https://quick-hire-admin.vercel.app

---

## Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Frontend  | React.js, Vite, Tailwind CSS            |
| Backend   | Node.js, Express.js                     |
| Database  | MongoDB Atlas (Mongoose)                |
| Auth      | JWT, Google OAuth 2.0     |
| Storage   | Cloudinary (company logo uploads)       |
| Deploy    | Vercel (frontend + admin), Render (API) |

---

## Features

### Users
- Browse and search job listings
- Filter by category, location, and job type
- View full job details
- Submit applications with resume link and cover note
- Register / Login with email & password
- Login with Google (OAuth 2.0)

### Admin
- Secure admin login (email + password)
- Create, edit, and delete job listings
- Upload company logos via Cloudinary
- View all applications with pagination
- Filter applications by status or job
- Update application status: `Pending → Reviewed → Shortlisted → Rejected`
- Delete applications

---

## Project Structure

```
quickhire/
├── frontend/               # React user-facing app (Vite)
├── admin-panel/            # React admin dashboard (Vite)
└── backend/
    ├── config/
    │   ├── cloudinary.js      # Cloudinary + multer setup
    │   └── googleStrategy.js  # Passport Google OAuth strategy
    ├── controllers/
    │   ├── authController.js
    │   ├── jobController.js
    │   └── applicationController.js
    ├── middleware/
    │   ├── authMiddleware.js  # protect, adminOnly
    │   ├── errorHandler.js
    │   └── response.js        # successResponse, errorResponse, paginatedResponse
    ├── models/
    │   ├── User.js
    │   ├── Job.js
    │   └── Application.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── jobRoutes.js
    │   └── applicationRoutes.js
    └── server.js
```

---

## Database Models

### User
| Field    | Type   | Notes                           |
|----------|--------|---------------------------------|
| name     | String | 2–50 characters, required       |
| email    | String | Unique, validated               |
| password | String | Bcrypt hashed, optional (OAuth) |
| googleId | String | Set on Google login             |
| avatar   | String | Profile picture URL             |
| role     | String | `user` or `admin`               |

### Job
| Field       | Type    | Notes                                                               |
|-------------|---------|---------------------------------------------------------------------|
| title       | String  | Max 100 chars, required                                             |
| company     | String  | Max 100 chars, required                                             |
| logoUrl     | String  | Cloudinary URL                                                      |
| location    | String  | Required                                                            |
| category    | String  | Junior/Senior SE, UI/UX, ML Engineer, HR, DevOps                   |
| type        | String  | `Internship`, `Remote`, `Part Time`, `Full Time`                    |
| description | String  | Min 50 chars, required                                              |
| isActive    | Boolean | Default `true`, controls visibility                                 |

### Application
| Field      | Type     | Notes                                            |
|------------|----------|--------------------------------------------------|
| jobId      | ObjectId | Ref to Job, required                             |
| name       | String   | 2–50 chars, required                             |
| email      | String   | Validated, unique per job (no duplicate applies) |
| resumeLink | String   | Valid URL required                               |
| coverNote  | String   | Optional, max 1000 chars                         |
| status     | String   | `Pending`, `Reviewed`, `Shortlisted`, `Rejected` |

---

## API Endpoints

### Auth — `/api/auth`
| Method | Endpoint           | Access    | Description           |
|--------|--------------------|-----------|-----------------------|
| POST   | `/register`        | Public    | Register with email   |
| POST   | `/login`           | Public    | Login with email      |
| POST   | `/admin/login`     | Public    | Admin login           |
| GET    | `/me`              | Protected | Get current user      |
| GET    | `/google`          | Public    | Start Google OAuth    |
| GET    | `/google/callback` | Public    | Google OAuth callback |

### Jobs — `/api/jobs`
| Method | Endpoint            | Access     | Description                         |
|--------|---------------------|------------|-------------------------------------|
| GET    | `/`                 | Public     | List jobs (search, filter, paginate)|
| GET    | `/categories`       | Public     | Get job category counts             |
| GET    | `/:id`              | Public     | Get single job                      |
| POST   | `/`                 | Admin only | Create job                          |
| PUT    | `/:id`              | Admin only | Update job                          |
| DELETE | `/:id`              | Admin only | Delete job + its applications       |
| GET    | `/:id/applications` | Admin only | Get applications for a job          |
| POST   | `/upload-logo`      | Admin only | Upload company logo to Cloudinary   |

### Applications — `/api/applications`
| Method | Endpoint      | Access     | Description               |
|--------|---------------|------------|---------------------------|
| POST   | `/`           | Protected  | Submit application        |
| GET    | `/`           | Admin only | List all applications     |
| GET    | `/:id`        | Admin only | Get single application    |
| PATCH  | `/:id/status` | Admin only | Update application status |
| DELETE | `/:id`        | Admin only | Delete application        |

---

## Getting Started Locally

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Google Cloud OAuth credentials
- Cloudinary account

### 1. Clone the repository

```bash
git clone https://github.com/XGNoir95/CSE-Carn.git
cd quickhire
```

### 2. Backend setup

```bash
cd Backend
npm install
```

Create a `.env` file inside `backend/`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

FRONTEND_URL=http://localhost:5173,http://localhost:5174
FRONTEND_CLIENT_URL=http://localhost:5173

ADMIN_EMAIL=admin@quickhire.com
ADMIN_PASSWORD=your_admin_password
```

Start the backend:

```bash
npm run dev
```

### 3. Frontend setup

```bash
cd Frontend
npm install
```

Create a `.env` file inside `frontend/`:

```env
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev
```

### 4. Admin panel setup

```bash
cd Admin-Pannel
npm install
```

Create a `.env` file inside `admin-panel/`:

```env
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev
```




---

## Author

**Julker Nayeen Karim**
