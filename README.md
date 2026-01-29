# NITT ID Card Re-issue Application System

A full-stack web application for managing ID card re-issue requests at National Institute of Technology Tiruchirappalli (NITT).

## Project Structure

```
.
├── backend/              # Express.js server (Node.js)
│   ├── models/          # MongoDB schemas (Application, Admin)
│   ├── routes/          # API route endpoints
│   ├── controllers/      # Business logic
│   ├── middleware/      # Authentication, validation, file upload
│   ├── config/          # Database and environment config
│   ├── server.js        # Express server entry point
│   ├── package.json
│   └── .env.example
│
├── frontend/            # React + Vite application
│   ├── src/
│   │   ├── pages/       # React page components
│   │   │   ├── Home.jsx
│   │   │   ├── EmailVerification.jsx
│   │   │   ├── StudentForm.jsx
│   │   │   ├── FacultyForm.jsx
│   │   │   ├── StaffForm.jsx
│   │   │   ├── FileUpload.jsx
│   │   │   ├── ApplicationPreview.jsx
│   │   │   ├── SubmissionSuccess.jsx
│   │   │   ├── AdminLogin.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── components/  # Reusable components
│   │   │   └── Header.jsx
│   │   ├── services/    # API service layer
│   │   │   └── api.js
│   │   ├── App.jsx      # Root component
│   │   ├── main.jsx     # Entry point
│   │   └── App.css      # Global styles
│   ├── vite.config.js
│   ├── index.html
│   ├── package.json
│   └── .env.example
│
└── README.md            # This file
```

## Features

### User Features
- **Email Verification**: OTP-based email verification for all user types
- **Multi-role Forms**: Separate application forms for Students, Faculty, and Staff
- **Document Upload**: Upload passport photo, FIR/Lost report, and payment receipts
- **Application Tracking**: View application status and receive confirmation
- **Step-by-step Process**: Guided application flow (Email → Form → Upload → Review → Submit)

### Admin Features
- **Admin Dashboard**: View all applications with real-time statistics
- **Application Management**: Approve or reject applications with detailed notes
- **Filtering & Search**: Filter applications by status (Pending, Approved, Rejected)
- **Statistics**: Monitor total, pending, approved, and rejected applications
- **Action Tracking**: Complete audit trail of admin actions

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Email**: Nodemailer for OTP and notifications
- **File Upload**: Multer for handling document uploads
- **Validation**: Zod for input validation
- **Security**: bcryptjs for password hashing, CORS enabled

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Routing**: React Router v7
- **HTTP Client**: Axios for API calls
- **Styling**: Custom CSS with CSS variables for theming

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with required variables:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nitt_idcard
JWT_SECRET=your_super_secret_jwt_key_here
NODEMAILER_USER=your_email@gmail.com
NODEMAILER_PASSWORD=your_app_password_here
NODEMAILER_SERVICE=gmail
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
NODE_ENV=development
```

4. Start the backend server:
```bash
npm start
```

The backend API will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## API Endpoints

### Authentication Routes
- `POST /api/auth/send-otp` - Send OTP to email address
- `POST /api/auth/verify-email` - Verify email with OTP
- `POST /api/auth/admin-login` - Admin portal login

### Application Routes
- `POST /api/applications/submit` - Submit completed application with documents
- `GET /api/applications/all` - Get all applications (admin only)
- `GET /api/applications/status/:id` - Get individual application status

### Admin Routes
- `GET /api/admin/stats` - Get dashboard statistics
- `PUT /api/admin/approve/:id` - Approve an application
- `PUT /api/admin/reject/:id` - Reject an application

## User Workflow

### Step 1: Home Page
- User selects their role: Student, Faculty, or Staff
- Click on the corresponding card to proceed

### Step 2: Email Verification
- Enter verified institutional email
- Receive 6-digit OTP
- Enter OTP to verify email address

### Step 3: Application Form
- Fill personal information (name, contact details, DOB, etc.)
- Enter academic/employment details
- Specify request category (Lost, Damaged, Correction)
- Provide details about the request

### Step 4: Document Upload
- Upload passport-sized photo (JPG/PNG, max 5MB)
- Upload FIR copy or lost report (PDF/JPG/PNG, max 5MB)
- Upload payment receipt (Students & Staff only, max 5MB)

### Step 5: Application Review
- Review all entered information
- Verify uploaded documents
- Accept terms and conditions

### Step 6: Submission
- Submit complete application
- Receive unique Application ID
- View confirmation page

## Admin Workflow

### Login
- Visit `/admin-login`
- Enter admin credentials
- Access admin dashboard

### Dashboard
- View key statistics (Total, Pending, Approved, Rejected)
- See list of all applications in table format

### Application Review
- Click "View" on any application
- See detailed application information
- Choose to Approve or Reject

### Action
- For Approval: Add optional notes and confirm
- For Rejection: Provide mandatory reason for rejection
- Application status updates immediately

## Database Schema Overview

### Application Collection
- User information (name, email, phone, etc.)
- User type (student, faculty, staff)
- Academic/Employment details
- Document URLs/paths
- Request category and details
- Status (pending, approved, rejected)
- Admin notes/actions
- Timestamps (created, updated)

### Admin Collection
- Username and hashed password
- Email address
- Role and permissions
- Created and updated timestamps

## Security Features

✓ Password hashing with bcryptjs
✓ JWT token-based authentication
✓ HTTP-only cookies for token storage
✓ Input validation and sanitization
✓ File upload type and size restrictions
✓ CORS protection
✓ Role-based access control
✓ Rate limiting on OTP requests
✓ Secure session management

## Running Both Servers

### Option 1: Two Terminal Windows
Terminal 1 (Backend):
```bash
cd backend && npm start
```

Terminal 2 (Frontend):
```bash
cd frontend && npm run dev
```

### Option 2: Using Concurrently (from root)
```bash
npm install -g concurrently
concurrently "cd backend && npm start" "cd frontend && npm run dev"
```

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Verify connection string in `.env`
- Check firewall/network settings

### Port Already in Use
```bash
# Find and kill process on port 5000 (backend)
lsof -ti:5000 | xargs kill -9

# Find and kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9
```

### CORS Issues
- Verify frontend URL is in backend CORS configuration
- Check that API_URL in frontend matches backend URL
- Clear browser cache and cookies

### OTP Not Received
- Check email configuration in `.env`
- Verify email is in Gmail "Less Secure Apps" or use App Password
- Check spam/junk folder

## Environment Variables Reference

### Backend `.env`
| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/nitt_idcard |
| JWT_SECRET | Secret key for JWT signing | your_secret_key |
| NODEMAILER_USER | Sender email address | your_email@gmail.com |
| NODEMAILER_PASSWORD | Email app password | generated_password |
| ADMIN_USERNAME | Default admin username | admin |
| ADMIN_PASSWORD | Default admin password | admin123 |

### Frontend `.env`
| Variable | Description | Example |
|----------|-------------|---------|
| VITE_API_URL | Backend API URL | http://localhost:5000/api |

## Future Enhancements

- Mobile-responsive design improvements
- Email notification templates
- Batch application processing
- ID card design and printing module
- SMS notifications for status updates
- Payment gateway integration (Razorpay/PayPal)
- Advanced analytics and reporting
- Two-factor authentication for admin
- Application history and timeline
- Document verification automation
- Multi-language support

## Support & Contact

For questions, issues, or feedback:
- **Email**: library@nitt.edu
- **Phone**: +91-431-4267290
- **Location**: Central Library, NIT Tiruchirappalli

## License

This project is proprietary software of National Institute of Technology, Tiruchirappalli. All rights reserved.

## Development Team

- Backend Development: Node.js/Express Team
- Frontend Development: React/Vite Team
- Database Design: MongoDB Team
- Quality Assurance: Testing Team
