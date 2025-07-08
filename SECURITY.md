# Security Implementation

## Overview

The DNA Repair Knowledge Platform now implements a secure authentication system that moves password handling from the frontend to the backend, eliminating the security vulnerability of hardcoded credentials.

## Security Features

### 1. Backend Authentication
- **Password Hashing**: All passwords are hashed using bcrypt with a salt round of 12
- **JWT Tokens**: Secure token-based authentication with 24-hour expiration
- **Rate Limiting**: Login attempts are limited to 5 per 15 minutes per IP
- **Input Validation**: All user inputs are validated and sanitized

### 2. Frontend Security
- **No Hardcoded Credentials**: All authentication is handled through secure API calls
- **Token Management**: JWT tokens are stored securely in localStorage
- **Automatic Logout**: Tokens are cleared on authentication errors
- **Protected Routes**: Admin routes require valid authentication

### 3. API Security
- **CORS Protection**: Cross-origin requests are properly configured
- **Authentication Headers**: All admin API calls include Bearer tokens
- **Error Handling**: Secure error messages that don't leak sensitive information

## Setup Instructions

### 1. Environment Configuration
```bash
# Copy the example environment file
cp env.example .env

# Edit .env with your secure credentials
nano .env
```

Required environment variables:
- `JWT_SECRET`: Strong secret for JWT token signing
- `ADMIN_PASSWORD`: Your admin password
- `ADMIN_USERNAME`: Admin username (default: admin)
- `ADMIN_EMAIL`: Admin email (default: admin@yiranest.cloud)

### 2. Install Dependencies
```bash
# Backend
cd dna-repair/backend
npm install

# Frontend
cd main-frontend
npm install
```

### 3. Build the Application
```bash
# Backend
cd dna-repair/backend
npm run build

# Frontend
cd main-frontend
npm run build
```

### 4. Start with Docker
```bash
docker-compose up --build
```

### 5. Login
Use the credentials you set in the `.env` file.

## Production Security Checklist

### 1. Environment Variables
- [ ] Set strong `JWT_SECRET` in `.env`
- [ ] Use strong `ADMIN_PASSWORD` in `.env`
- [ ] Use environment-specific MongoDB credentials
- [ ] Set `NODE_ENV=production`

### 2. Password Security
- [ ] Use strong, unique passwords
- [ ] Implement password complexity requirements
- [ ] Consider implementing password expiration

### 3. Network Security
- [ ] Enable HTTPS with valid SSL certificates
- [ ] Configure proper firewall rules
- [ ] Use reverse proxy (nginx) for additional security
- [ ] Implement IP whitelisting if needed

### 4. Database Security
- [ ] Use strong MongoDB passwords
- [ ] Enable MongoDB authentication
- [ ] Restrict database access to application servers only
- [ ] Regular database backups

### 5. Application Security
- [ ] Regular security updates for dependencies
- [ ] Implement request logging and monitoring
- [ ] Consider adding two-factor authentication
- [ ] Implement session management

## API Endpoints

### Authentication Endpoints
- `POST /api/auth/login` - Admin login
- `GET /api/auth/verify` - Verify token
- `POST /api/auth/logout` - Logout
- `POST /api/auth/setup` - Create initial admin (first-time only)

### Protected Endpoints
All admin endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Security Best Practices

1. **Never store passwords in plain text**
2. **Use HTTPS in production**
3. **Implement proper session management**
4. **Regular security audits**
5. **Keep dependencies updated**
6. **Monitor for suspicious activity**
7. **Implement proper logging**
8. **Use strong, unique secrets**

## Troubleshooting

### Common Issues

1. **Authentication fails after deployment**
   - Check if JWT_SECRET is properly set in `.env`
   - Verify MongoDB connection
   - Check server logs for errors

2. **Rate limiting errors**
   - Wait 15 minutes before trying again
   - Check if multiple users are using the same IP

3. **Token expiration**
   - Tokens expire after 24 hours
   - Re-login to get a new token

## Support

For security-related issues or questions, please contact the development team. 