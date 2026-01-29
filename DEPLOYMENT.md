# Deployment Guide - NITT ID Card Re-issue Application

## Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account
- Gmail account with app password
- Vercel account (optional, for frontend hosting)

## Environment Setup

### 1. MongoDB Atlas Setup

1. Create MongoDB Atlas cluster
2. Create a database named `nitt_idcard`
3. Create database user with read/write access
4. Whitelist your server IP or use 0.0.0.0
5. Copy the connection string

### 2. Email Setup

1. Enable 2FA on Gmail account
2. Generate app-specific password
3. Note the app password for `.env` file

## Backend Deployment

### Local Development

1. Clone repository and navigate to server:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with:
```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secure_random_string
NODEMAILER_EMAIL=your_email@gmail.com
NODEMAILER_PASSWORD=your_app_password
NODEMAILER_SERVICE=gmail
OTP_EXPIRY=300000
NODE_ENV=development
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=1048576
FRONTEND_URL=http://localhost:3000
```

4. Create admin user:
```bash
npm run seed
```

5. Start server:
```bash
npm run dev
```

### Production Deployment (Heroku)

1. Install Heroku CLI:
```bash
curl https://cli.heroku.com/install.sh | sh
```

2. Login to Heroku:
```bash
heroku login
```

3. Create Heroku app:
```bash
heroku create your-app-name
```

4. Set environment variables:
```bash
heroku config:set MONGO_URI=your_connection_string
heroku config:set JWT_SECRET=your_secret
heroku config:set NODEMAILER_EMAIL=your_email
heroku config:set NODEMAILER_PASSWORD=your_app_password
heroku config:set NODE_ENV=production
heroku config:set FRONTEND_URL=your_frontend_url
```

5. Deploy:
```bash
git push heroku main
```

6. Seed admin:
```bash
heroku run npm run seed
```

### Production Deployment (AWS EC2)

1. Launch EC2 instance with Node.js
2. Install dependencies and clone repository
3. Create `.env` file
4. Install PM2:
```bash
npm install -g pm2
```

5. Start application:
```bash
pm2 start server.js --name "nitt-idcard"
pm2 startup
pm2 save
```

6. Install Nginx:
```bash
sudo apt-get install nginx
```

7. Configure Nginx as reverse proxy
8. Setup SSL with Let's Encrypt

## Frontend Deployment

### Local Development

1. Navigate to frontend:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start development server:
```bash
npm start
```

### Build for Production

```bash
npm run build
```

### Deployment Options

#### Option 1: Vercel (Recommended)

1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy with automatic deployments on push

#### Option 2: Netlify

1. Build project:
```bash
npm run build
```

2. Deploy to Netlify:
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=build
```

#### Option 3: AWS S3 + CloudFront

1. Build project:
```bash
npm run build
```

2. Upload to S3:
```bash
aws s3 sync build/ s3://your-bucket-name/
```

3. Create CloudFront distribution

#### Option 4: Traditional Hosting

1. Build project:
```bash
npm run build
```

2. Upload `build/` folder to hosting server
3. Configure server to serve `index.html` for all routes
4. Set up HTTPS

## Post-Deployment Steps

### 1. Change Default Admin Password

1. Login to admin dashboard: `/admin/dashboard`
2. Change password from `Admin@123` to secure password

### 2. Configure CORS

Update backend CORS settings:
```javascript
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://yourdomain.com'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
```

### 3. Setup Email Templates

Customize email notifications in `utils/emailService.js`

### 4. Database Backups

1. Enable MongoDB automated backups
2. Configure backup frequency (daily recommended)
3. Test backup restoration

### 5. Monitoring

Install monitoring tools:
```bash
npm install pm2-monitoring
```

## SSL/HTTPS Setup

### Using Let's Encrypt (Nginx)

1. Install Certbot:
```bash
sudo apt-get install certbot python3-certbot-nginx
```

2. Obtain certificate:
```bash
sudo certbot certonly --nginx -d yourdomain.com
```

3. Configure Nginx SSL

### Using AWS Certificate Manager

1. Create certificate in ACM
2. Validate domain ownership
3. Attach to CloudFront or ALB

## Performance Optimization

### Frontend
1. Enable gzip compression
2. Minify CSS and JavaScript
3. Optimize images
4. Use CDN for static assets

### Backend
1. Enable database indexing
2. Implement caching (Redis recommended)
3. Optimize file upload handling
4. Use compression middleware

## Security Checklist

- [ ] Change default admin password
- [ ] Configure CORS properly
- [ ] Enable HTTPS/SSL
- [ ] Set secure JWT secret
- [ ] Configure file upload restrictions
- [ ] Enable database authentication
- [ ] Setup rate limiting
- [ ] Configure firewall rules
- [ ] Enable CSRF protection
- [ ] Setup monitoring and logging
- [ ] Configure backup strategy
- [ ] Enable database encryption at rest

## Troubleshooting

### CORS Issues
```javascript
// Update backend CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

### File Upload Issues
1. Check server upload directory permissions
2. Verify file size limits
3. Check disk space availability

### Email Not Sending
1. Verify Gmail app password
2. Check spam folder
3. Verify email configuration
4. Check rate limiting

### MongoDB Connection Issues
1. Verify connection string
2. Check IP whitelist
3. Verify credentials
4. Check network connectivity

## Scaling Considerations

### Database
- Setup MongoDB sharding for large datasets
- Implement read replicas
- Use connection pooling

### Backend
- Horizontal scaling with load balancer
- Session management with Redis
- Queue system for email sending

### Frontend
- CDN for static assets
- Code splitting
- Lazy loading components

## Maintenance

### Regular Updates
```bash
npm update
npm audit fix
```

### Log Monitoring
1. Setup centralized logging (ELK, CloudWatch)
2. Monitor error rates
3. Track performance metrics

### Database Maintenance
1. Regular backups
2. Index optimization
3. Query performance monitoring

## Support & Documentation

- Backend API docs: See routes in `server/routes/`
- Frontend components: See `frontend/src/components/`
- Database schema: See `server/models/`

## Emergency Procedures

### Database Recovery
1. Access MongoDB Atlas backup
2. Restore to specific point in time
3. Verify data integrity

### Application Rollback
1. Deploy previous version
2. Clear browser cache
3. Notify users

## Contact

For deployment support, contact the development team.
