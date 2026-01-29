# NITT ID Card Re-issue Application - Setup Guide

## ✅ Project Completion Status

This document outlines everything that has been completed and how to get the application running.

### Backend (Express.js + MongoDB)
- ✅ Complete server structure with models, routes, controllers
- ✅ User authentication (Email OTP verification)
- ✅ Admin authentication (JWT login)
- ✅ Application submission API
- ✅ Admin dashboard API
- ✅ File upload handling with Multer
- ✅ Email notifications with Nodemailer
- ✅ Input validation with Zod
- ✅ Error handling middleware
- ✅ CORS configuration

### Frontend (React + Vite)
- ✅ Home page with role selection
- ✅ Email verification page
- ✅ Student application form
- ✅ Faculty application form
- ✅ Staff application form
- ✅ File upload page
- ✅ Application preview page
- ✅ Success confirmation page
- ✅ Admin login page
- ✅ Admin dashboard with statistics
- ✅ Responsive design with CSS
- ✅ Axios API integration

## Quick Start Guide

### Prerequisites
- Node.js v18+ installed
- MongoDB installed locally OR MongoDB Atlas account
- Git (for version control)
- A Gmail account (for email notifications, optional but recommended)

### Step 1: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Edit .env with your configuration
# Important: Update MONGODB_URI, NODEMAILER_USER, NODEMAILER_PASSWORD

# Start the backend server
npm start

# Server will run on http://localhost:5000
```

### Step 2: Frontend Setup

```bash
# Open new terminal, navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Make sure VITE_API_URL=http://localhost:5000/api

# Start the frontend development server
npm run dev

# Application will be available at http://localhost:3000
```

### Step 3: Access the Application

**User Portal**: http://localhost:3000
**Admin Portal**: http://localhost:3000/admin-login

### Default Admin Credentials
- **Username**: admin
- **Password**: admin123

⚠️ **Important**: Change these credentials immediately in production!

## File Structure Overview

### Backend Files Created
```
backend/
├── server.js                    # Express server setup
├── config/
│   └── database.js             # MongoDB connection
├── models/
│   ├── Application.js          # Application schema
│   └── Admin.js                # Admin schema
├── routes/
│   ├── auth.js                 # Authentication routes
│   ├── applications.js         # Application routes
│   └── admin.js                # Admin routes
├── controllers/
│   ├── authController.js       # Auth logic
│   ├── applicationController.js # App logic
│   └── adminController.js      # Admin logic
├── middleware/
│   ├── authMiddleware.js       # JWT verification
│   ├── uploadMiddleware.js     # File upload
│   └── validationMiddleware.js # Input validation
├── package.json
└── .env.example
```

### Frontend Files Created
```
frontend/
├── src/
│   ├── pages/
│   │   ├── Home.jsx                    # Role selection
│   │   ├── EmailVerification.jsx       # OTP verification
│   │   ├── StudentForm.jsx             # Student form
│   │   ├── FacultyForm.jsx             # Faculty form
│   │   ├── StaffForm.jsx               # Staff form
│   │   ├── FileUpload.jsx              # Document upload
│   │   ├── ApplicationPreview.jsx      # Review & submit
│   │   ├── SubmissionSuccess.jsx       # Success page
│   │   ├── AdminLogin.jsx              # Admin login
│   │   └── AdminDashboard.jsx          # Admin panel
│   ├── components/
│   │   └── Header.jsx                  # App header
│   ├── services/
│   │   └── api.js                      # API integration
│   ├── App.jsx                         # Root component
│   ├── App.css                         # Global styles
│   ├── main.jsx                        # Entry point
│   └── pages/
│       ├── Home.css
│       ├── Form.css                    # Form styles
│       ├── Success.css                 # Success page styles
│       └── Admin.css                   # Admin styles
├── vite.config.js                      # Vite configuration
├── index.html
├── package.json
└── .env.example
```

## API Integration

### Authentication Flow
1. User enters email → Backend sends OTP
2. User enters OTP → Backend verifies and creates session
3. User fills form → Data saved in localStorage
4. User uploads files → Files sent to backend
5. User submits → Complete application processed

### Admin Flow
1. Admin logs in with credentials
2. JWT token generated and stored
3. Admin views all applications with stats
4. Admin can approve/reject with notes
5. Application status updated in database

## Styling & Customization

### Color Scheme (Defined in App.css)
```css
--primary: #1a365d          /* Dark Blue */
--secondary: #d97706        /* Amber/Gold */
--danger: #dc2626           /* Red */
--success: #22863a          /* Green */
--border: #e5e7eb           /* Light Gray */
--background: #f9fafb       /* Off White */
--text: #1f2937             /* Dark Text */
```

To customize colors, edit the CSS variables in `/frontend/src/App.css`

## Email Configuration (Gmail)

1. Go to Google Account settings
2. Enable 2-factor authentication
3. Create an App Password
4. Use this password in `.env` NODEMAILER_PASSWORD
5. Set NODEMAILER_USER to your Gmail address

## Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is already in use
lsof -i :5000
# Kill the process if needed
kill -9 <PID>

# Check MongoDB connection
# Ensure MongoDB is running: mongod
```

### Frontend won't start
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install

# Clear cache
npm cache clean --force

# Try again
npm run dev
```

### API calls failing
- Check if backend is running on port 5000
- Verify VITE_API_URL in frontend .env
- Check browser console for CORS errors
- Verify firewall settings

### MongoDB connection error
```bash
# Ensure MongoDB is running
mongod

# Test connection string in .env
# Format: mongodb://localhost:27017/nitt_idcard
```

## Database Backup & Recovery

### Backup MongoDB
```bash
mongodump --db nitt_idcard --out ./backup
```

### Restore MongoDB
```bash
mongorestore --db nitt_idcard ./backup/nitt_idcard
```

## Production Deployment Checklist

- [ ] Change admin password
- [ ] Update JWT_SECRET with a strong random value
- [ ] Set NODE_ENV=production
- [ ] Configure production MongoDB URI (Atlas)
- [ ] Set up proper email service (SendGrid, AWS SES)
- [ ] Enable HTTPS
- [ ] Configure proper CORS origins
- [ ] Set up rate limiting
- [ ] Configure file upload limits
- [ ] Enable logging and monitoring
- [ ] Set up automated backups
- [ ] Test all workflows thoroughly

## Development Tips

### Enable Debug Mode
Add to backend server.js:
```javascript
if (process.env.DEBUG) {
  app.use(require('morgan')('dev'));
}
```

### Test Email Flow
Use a test email service like MailTrap instead of Gmail

### Mock Admin Testing
Create additional admin accounts for testing different permissions

## Support & Resources

- **MongoDB Documentation**: https://docs.mongodb.com
- **Express.js Guide**: https://expressjs.com
- **React Documentation**: https://react.dev
- **Vite Guide**: https://vitejs.dev
- **Axios Docs**: https://axios-http.com

## Next Steps After Setup

1. Verify both servers are running
2. Test user registration flow
3. Test file upload functionality
4. Test admin approval workflow
5. Test email notifications
6. Verify database storage
7. Check responsive design on mobile

## Common Issues & Solutions

### Issue: OTP not sending
**Solution**: 
- Verify Gmail app password is correct
- Check email spam folder
- Try with a different email service

### Issue: Files not uploading
**Solution**:
- Check upload folder permissions
- Verify MAX_FILE_SIZE setting
- Ensure multer configuration

### Issue: Admin can't login
**Solution**:
- Verify admin credentials in database
- Check JWT_SECRET matches
- Clear browser cookies and try again

## Contact & Support

For technical support or questions:
- Create an issue in the project repository
- Contact: library@nitt.edu
- Phone: +91-431-4267290

---

**Last Updated**: January 2026
**Version**: 1.0.0
**Status**: Ready for Testing
