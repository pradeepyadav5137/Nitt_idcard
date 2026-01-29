# NITT ID Card Re-issue Application - Architecture Guide

## System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Browser                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Frontend (React + Vite)                                 │   │
│  │  - React Router for navigation                           │   │
│  │  - Axios for API calls                                   │   │
│  │  - LocalStorage for session                              │   │
│  │  - CSS for styling                                       │   │
│  └────────────────────────┬─────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                            │
                   HTTP/HTTPS │ JSON
                            │
┌─────────────────────────────────────────────────────────────────┐
│                      Backend Server                              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Express.js Server (Node.js)                             │   │
│  │  - Route Handlers                                        │   │
│  │  - Controllers (Business Logic)                          │   │
│  │  - Middleware (Auth, Validation, Upload)                │   │
│  │  - Error Handling                                        │   │
│  └──────────────────────────────────────────────────────────┘   │
│                            │                                     │
│  ┌─────────────────┐  ┌────▼─────┐  ┌──────────────────────┐   │
│  │  Nodemailer     │  │ Mongoose  │  │  Multer              │   │
│  │  (Email Service)│  │  (ODM)    │  │  (File Upload)       │   │
│  └─────────────────┘  └────┬─────┘  └──────────────────────┘   │
│                            │                                     │
└─────────────────────────────────────────────────────────────────┘
                            │
              ┌─────────────┴─────────────┐
              │                           │
    ┌─────────▼──────────┐     ┌─────────▼──────────┐
    │  MongoDB Database  │     │  File Storage      │
    │  - Applications    │     │  - Uploads folder  │
    │  - Admins          │     │  - Organized by ID │
    └────────────────────┘     └────────────────────┘
```

## Layered Architecture

### Backend Layers

```
┌────────────────────────────────────────────────┐
│            API Layer (Routes)                  │
│  - /api/auth/*                                 │
│  - /api/applications/*                         │
│  - /api/admin/*                                │
└─────────────────┬────────────────────────────┘
                  │
┌─────────────────▼────────────────────────────┐
│        Business Logic (Controllers)           │
│  - authController.js                          │
│  - applicationController.js                   │
│  - adminController.js                         │
└─────────────────┬────────────────────────────┘
                  │
┌─────────────────▼────────────────────────────┐
│    Middleware Layer                           │
│  - Auth Middleware (JWT verification)         │
│  - Upload Middleware (File handling)          │
│  - Validation Middleware (Input validation)   │
│  - Error Handling Middleware                  │
└─────────────────┬────────────────────────────┘
                  │
┌─────────────────▼────────────────────────────┐
│      Data Access Layer (Models)               │
│  - Application.js (Mongoose schema)           │
│  - Admin.js (Mongoose schema)                 │
└─────────────────┬────────────────────────────┘
                  │
┌─────────────────▼────────────────────────────┐
│      Database Layer (MongoDB)                 │
│  - Collections                                │
│  - Indexes                                    │
│  - Queries                                    │
└────────────────────────────────────────────┘
```

### Frontend Layers

```
┌────────────────────────────────────────────────┐
│         Presentation Layer (UI)                │
│  - React Components                            │
│  - CSS Styling                                 │
│  - User Interactions                           │
└─────────────────┬────────────────────────────┘
                  │
┌─────────────────▼���───────────────────────────┐
│        State Management Layer                 │
│  - React hooks (useState, useEffect)          │
│  - Component State                            │
│  - LocalStorage                               │
└─────────────────┬────────────────────────────┘
                  │
┌─────────────────▼────────────────────────────┐
│       Business Logic Layer                    │
│  - Form handling                              │
│  - Validation logic                           │
│  - Navigation logic                           │
└─────────────────┬────────────────────────────┘
                  │
┌─────────────────▼────────────────────────────┐
│      API Service Layer                        │
│  - Axios instance                             │
│  - API endpoints                              │
│  - Error handling                             │
└─────────────────┬────────────────────────────┘
                  │
┌─────────────────▼────────────────────────────┐
│      Network Layer (HTTP Requests)            │
│  - REST API calls to backend                  │
│  - Response handling                          │
└────────────────────────────────────────────┘
```

## Data Flow Diagram

### User Application Submission Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      1. User Input                              │
│  Home Page → Select Role → EmailVerification → Form → Upload   │
└────────────────────────┬────────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────────┐
│            2. Frontend Processing                               │
│  - Form validation                                              │
│  - File validation                                              │
│  - Data organization                                            │
└────────────────────────┬────────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────────┐
│            3. API Request (Axios)                               │
│  POST /api/applications/submit                                  │
│  Headers: { Authorization: JWT_TOKEN }                          │
│  Body: FormData { files + form data }                           │
└────────────────────────┬────────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────────┐
│         4. Backend Receives Request (Express)                   │
│  - Route Handler                                                │
│  - Middleware execution                                         │
│  - JWT verification                                             │
│  - File validation                                              │
└────────────────────────┬────────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────────┐
│          5. Controller Processing                               │
│  - Create application object                                    │
│  - Validate input data                                          │
│  - Handle file uploads                                          │
│  - Generate Application ID                                      │
└────────────────────────┬────────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────────┐
│          6. Data Persistence                                    │
│  - Mongoose schema validation                                   │
│  - MongoDB insert operation                                     │
│  - File saved to disk                                           │
│  - Application created                                          │
└────────────────────────┬────────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────────┐
│          7. Response Generation                                 │
│  - Success status                                               │
│  - Application ID                                               │
│  - Confirmation message                                         │
│  - JSON response                                                │
└────────────────────────┬────────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────────┐
│          8. Frontend Receives Response                          │
│  - Parse JSON response                                          │
│  - Store Application ID                                         │
│  - Navigate to success page                                     │
│  - Display confirmation                                         │
└─────────────────────────────────────────────────────────────────┘
```

## Component Interaction Diagram

### Frontend Components

```
App.jsx (Root)
├── Header.jsx
│   ├── Home Link
│   └── Admin Link
│
└── Router
    ├── Home.jsx
    │   └── Displays 3 role cards
    │       └── Links to EmailVerification
    │
    ├── EmailVerification.jsx
    │   ├── Send OTP form
    │   ├── Verify OTP form
    │   └── Navigate to role-specific form
    │
    ├── StudentForm.jsx
    │   ├── Personal info inputs
    │   ├── Academic info inputs
    │   └── Request details
    │       └── Navigate to FileUpload
    │
    ├── FacultyForm.jsx
    │   ├── Personal info inputs
    │   ├── Employment info inputs
    │   └── Request details
    │       └── Navigate to FileUpload
    │
    ├── StaffForm.jsx
    │   ├── Personal info inputs
    │   ├── Employment info inputs
    │   └── Request details
    │       └── Navigate to FileUpload
    │
    ├── FileUpload.jsx
    │   ├── Photo upload
    │   ├── FIR upload
    │   ├── Payment receipt upload (non-faculty)
    │   └── Navigate to ApplicationPreview
    │
    ├── ApplicationPreview.jsx
    │   ├── Display all info
    │   ├── Confirm checkbox
    │   └── Submit button
    │       └── Navigate to SubmissionSuccess
    │
    ├── SubmissionSuccess.jsx
    │   ├── Success message
    │   ├── Application ID display
    │   └── Home button
    │
    ├── AdminLogin.jsx
    │   ├── Username input
    │   ├── Password input
    │   └── Login button
    │       └── Navigate to AdminDashboard
    │
    └── AdminDashboard.jsx
        ├── Stats cards
        ├── Filter buttons
        ├── Applications table
        └── ApplicationModal
            ├── Details display
            ├── Approve button
            └── Reject button
```

## API Endpoint Structure

### Authentication Routes

```
POST /api/auth/send-otp
├── Request: { email: string }
├── Validation: Email format check
├── Processing: Generate OTP, send via Nodemailer
└── Response: { success: boolean, message: string }

POST /api/auth/verify-email
├── Request: { email: string, otp: string }
├── Validation: OTP length, format
├── Processing: Verify OTP, generate JWT
└── Response: { token: string, success: boolean }

POST /api/auth/admin-login
├── Request: { username: string, password: string }
├── Validation: Username/password format
├── Processing: Check credentials, hash compare
└── Response: { token: string, admin: object }
```

### Application Routes

```
POST /api/applications/submit
├── Middleware: authMiddleware (JWT), uploadMiddleware (files)
├── Request: FormData { files + form data }
├── Validation: Zod schema validation
├── Processing: 
│   ├── Create application
│   ├── Store documents
│   ├── Generate ID
│   └── Set status to pending
└── Response: { applicationId: string, success: boolean }

GET /api/applications/all
├── Middleware: authMiddleware (admin only)
├── Query: { filter?: string, type?: string }
├── Processing: Query MongoDB with filters
└── Response: { applications: array, count: number }

GET /api/applications/status/:id
├── Middleware: authMiddleware
├── Params: id (applicationId)
├── Processing: Find application in database
└── Response: { application: object }
```

### Admin Routes

```
GET /api/admin/stats
├── Middleware: authMiddleware (admin only)
├── Processing: Count applications by status
└── Response: { total: number, pending: number, approved: number, rejected: number }

PUT /api/admin/approve/:id
├── Middleware: authMiddleware (admin only)
├── Request: { adminNotes?: string }
├── Processing: 
│   ├── Update status to approved
│   ├── Store admin notes
│   ├── Update timestamp
│   └── Send email notification
└── Response: { application: object, success: boolean }

PUT /api/admin/reject/:id
├── Middleware: authMiddleware (admin only)
├── Request: { adminNotes: string }
├── Validation: adminNotes required
├── Processing:
│   ├── Update status to rejected
│   ├── Store rejection notes
│   ├── Update timestamp
│   └── Send email notification
└── Response: { application: object, success: boolean }
```

## Database Schema Relationships

```
┌─────────────────────────────────────┐
│        Admin Collection             │
│ ┌─────────────────────────────────┐ │
│ │ _id (ObjectId)                  │ │
│ │ username (String, unique)       │ │
│ │ password (String, hashed)       │ │
│ │ email (String)                  │ │
│ │ role (String)                   │ │
│ │ createdAt (Date)                │ │
│ │ updatedAt (Date)                │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│      Application Collection         │
│ ┌─────────────────────────────────┐ │
│ │ _id (ObjectId)                  │ │  ◄─── Admin can reference
│ │ applicationId (String, unique)  │ │       for approveBy/approvedBy
│ │ userType (String: S/F/Staff)    │ │
│ │ status (String: pending/app/rej)│ │
│ │ email (String, indexed)         │ │
│ │ phone (String)                  │ │
│ │ ... (user details)              │ │
│ │ approvedBy (String: admin ID)   │ │  ◄─── References Admin username
│ │ approvalDate (Date)             │ │
│ │ adminNotes (String)             │ │
│ │ createdAt (Date)                │ │
│ │ updatedAt (Date)                │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

## File Upload Flow

```
┌──────────────────────────────────┐
│   User Selects Files             │
│  - Photo (JPG/PNG, <5MB)         │
│  - FIR (PDF/JPG/PNG, <5MB)       │
│  - Payment (PDF/JPG/PNG, <5MB)   │
└────────────┬─────────────────────┘
             │
┌────────────▼─────────────────────┐
│ Frontend Validation              │
│ - File type check                │
│ - File size check                │
│ - Show preview                   │
└────────────┬─────────────────────┘
             │
┌────────────▼─────────────────────┐
│ Create FormData Object           │
│ - Append files                   │
│ - Append form data               │
│ - Add JWT token header           │
└────────────┬─────────────────────┘
             │
       POST /api/applications/submit
             │
┌────────────▼─────────────────────┐
│ Multer Middleware                │
│ - Parse multipart/form-data      │
│ - Save to ./uploads/{id}/        │
│ - Add files to req.files         │
└────────────┬─────────────────────┘
             │
┌────────────▼─────────────────────┐
│ Backend Validation               │
│ - Check file types               │
│ - Verify file sizes              │
│ - Scan for virus (optional)      │
└────────────┬─────────────────────┘
             │
┌────────────▼─────────────────────┐
│ Store in Database                │
│ - Save paths in Application doc  │
│ - Create indices for files       │
└────────────┬─────────────────────┘
             │
┌────────────▼─────────────────────┐
│ Response to Frontend             │
│ { success: true, appId: "..." }  │
└──────────────────────────────────┘
```

## Authentication Flow

```
┌──────────────────────────────────────────┐
│        User Authentication               │
└──────────┬───────────────────────────────┘
           │
           ├─────────────────────────────────┐
           │    User Application Flow        │
           │                                 │
           ├──→ EmailVerification Component  │
           │    └─→ POST /api/auth/send-otp │
           │        └─→ Nodemailer sends OTP│
           │                                 │
           ├──→ User receives email with OTP │
           │                                 │
           ├─���→ User enters OTP              │
           │    └─→ POST /api/auth/verify-email
           │        └─→ Server verifies OTP │
           │        └─→ Generates JWT token │
           │        └─→ Returns token       │
           │                                 │
           ├──→ Frontend stores JWT in localStorage
           │                                 │
           └──→ JWT used in all API headers │
                Authorization: Bearer JWT   │
                                            │
           ├─────────────────────────────────┐
           │    Admin Authentication Flow    │
           │                                 │
           ├──→ AdminLogin Component         │
           │    └─→ Enter username/password  │
           │                                 │
           ├──→ POST /api/auth/admin-login   │
           │    └─→ Server verifies credentials
           │    └─→ Hashes password with bcryptjs
           │    └─→ Compares hash           │
           │    └─→ Generates JWT token     │
           │                                 │
           ├──→ Frontend stores JWT token    │
           │                                 │
           └──→ Access AdminDashboard        │
                with JWT authorization      │
```

## Error Handling Flow

```
┌────────────────────────────────────┐
│      API Request Error             │
└─────────┬──────────────────────────┘
          │
    ┌─────┴─────┬──────────┬─────────┐
    │            │          │         │
    ▼            ▼          ▼         ▼
 Validation  Auth Error  File Error  DB Error
 Error       (401)       (400)       (500)
    │            │          │         │
    ▼            ▼          ▼         ▼
 Generate Error Response with:
 - Status Code
 - Error Message
 - Error Details (dev mode)
    │
    ▼
 Send to Frontend
    │
    ▼
 Frontend Displays:
 - Error Alert
 - User-friendly message
 - Retry option
    │
    ▼
 User Can Retry or Navigate Away
```

## Security Architecture

```
┌─────────────────────────────────────────────┐
│           Security Layers                   │
└────────────────┬────────────────────────────┘
                 │
    ┌────────────┴────────────┬───────────────┐
    │                         │               │
    ▼                         ▼               ▼
Frontend Security    Network Security    Backend Security
    │                         │               │
    ├─ Input validation       ├─ HTTPS/TLS   ├─ JWT verification
    ├─ Form validation        ├─ CORS        ├─ Password hashing
    ├─ File type check        └─ HTTP-only   ├─ Input sanitization
    └─ Size validation           cookies     ├─ Zod validation
                                             ├─ Rate limiting
                                             └─ Role-based access
```

## Scalability Considerations

```
Current Architecture (Single Server):
┌─────────────────────────┐
│ React Frontend (Vite)   │ → http://localhost:3000
└────────────┬────────────┘
             │
    ┌────────▼─────────┐
    │  Express Server  │ → http://localhost:5000
    │  - Controllers   │
    │  - Middleware    │
    │  - Routes        │
    └────────┬─────────┘
             │
    ┌────────▼─────────┐
    │ MongoDB Database │
    └──────────────────┘

Future Scalable Architecture:
┌─────────────────────────────────────────┐
│ Load Balancer (Nginx/HAProxy)           │
└─────────────────────────────────────────┘
       │              │              │
   ┌───▼──┐       ┌───▼──┐       ┌───▼──┐
   │ App  │       │ App  │       │ App  │
   │ 1    │       │ 2    │       │ 3    │
   └───┬──┘       └───┬──┘       └───┬──┘
       │              │              │
       └──────────────┬──────────────┘
                      │
            ┌─────────▼─────────┐
            │ MongoDB Cluster   │
            │ (Replica Set)     │
            └───────────────────┘
            
Optional Additions:
- Redis cache layer
- CDN for static files
- Message queue (Bull/RabbitMQ)
- Separate file storage (AWS S3)
```

## Deployment Architecture Options

### Option 1: Single Server
```
┌─────────────────────────────────┐
│ Vercel/Heroku/Render            │
│  - Frontend (Next.js)           │
│  - Backend (Node.js)            │
│  - MongoDB Atlas                │
└─────────────────────────────────┘
```

### Option 2: Separated Services
```
Frontend                Backend                 Database
Vercel        ←→      Heroku/Railway   ←→    MongoDB Atlas
(React SPA)        (Express.js API)          (Cloud DB)
```

### Option 3: Docker Containers
```
┌──────────────────────────────────┐
│ Docker Compose                   │
│  ├─ Frontend Container           │
│  ├─ Backend Container            │
│  ├─ MongoDB Container            │
│  └─ Nginx Reverse Proxy          │
└──────────────────────────────────┘
Deploy to: AWS ECS, DigitalOcean, or self-hosted
```

---

**Architecture Version**: 1.0
**Last Updated**: January 2026
**Status**: Production-Ready
