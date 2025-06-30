# Yiran DNA Repair Knowledge Platform

## Project Overview
This project is a DNA repair knowledge platform supporting protein, modification, and interaction network visualization and management. It features a modern frontend and backend, and supports both local development and one-click production deployment (e.g., yiranest.cloud).

- **Frontend**: React + TypeScript, with interactive protein/modification network visualization and editing
- **Backend**: Node.js + Express + MongoDB, RESTful API
- **Database**: MongoDB
- **Deployment**: Local development, Docker Compose, and production nginx reverse proxy

---

## Quick Start

### 1. Local Development

1. Start MongoDB (locally or via Docker)
2. Start the backend:
   ```bash
   cd dna-repair/backend
   npm install
   npm start
   ```
3. Start the frontend:
   ```bash
   cd main-frontend
   npm install
   # In package.json, set proxy to http://localhost:5000
   npm start
   ```
4. Visit [http://localhost:3000](http://localhost:3000)

---

### 2. One-Click Docker Compose Deployment

1. Make sure Docker and docker-compose are installed
2. In the project root, run:
   ```bash
   docker-compose up -d
   ```
3. Default ports:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend: [http://localhost:5000](http://localhost:5000)
   - MongoDB: 27017

> For production, change the frontend port to 80 and use nginx reverse proxy (see below)

---

### 3. Production Deployment (yiranest.cloud)

1. **Recommended: Use nginx reverse proxy**
2. Example nginx.conf:

```nginx
server {
    listen 80;
    server_name yiranest.cloud;

    location /api/ {
        proxy_pass http://backend:5000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        root /usr/share/nginx/html;
        try_files $uri /index.html;
    }
}
```

3. After building the frontend image, mount the static files to nginx's `/usr/share/nginx/html`
4. Backend service name should be `backend`, port 5000
5. Visit [http://yiranest.cloud](http://yiranest.cloud)

---

## Main Features
- Visual and editable protein/modification nodes and interactions
- Supports protein modifications, protein-protein, and modification-protein relationships
- Automatic bi-directional interaction sync, frontend edge deduplication
- Seamless switching between local and production environments

---

## Project Structure
```
yiran-local/
  dna-repair/backend/    # Backend: Node.js + Express
  main-frontend/        # Frontend: React + TypeScript
  nginx.conf            # Production nginx config
  docker-compose.yml    # One-click deployment
```

---

## FAQ
- **Proxy error in local dev**: Make sure `proxy` in package.json is set to `http://localhost:5000`
- **API 404 in production**: Check nginx reverse proxy config and backend service name
- **Port conflict**: You can customize ports in docker-compose.yml

---

## Contributing & Feedback
Feel free to open issues or pull requests for suggestions, bugs, or feature requests! 