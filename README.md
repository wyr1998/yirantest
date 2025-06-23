# Yiran Project Workspace

This workspace contains multiple projects organized by domain areas.

## File Tree Structure

```
yiran/
├── computer-science/                    # Computer Science projects
├── dna-repair/                         # DNA Repair pathway analysis project
│   ├── .vscode/                        # VS Code configuration
│   ├── node_modules/                   # Node.js dependencies
│   ├── backend/                        # Backend API server
│   │   ├── node_modules/               # Backend dependencies
│   │   ├── dist/                       # Compiled TypeScript output
│   │   ├── src/                        # Source code
│   │   │   ├── config/                 # Configuration files
│   │   │   │   └── database.ts         # Database configuration
│   │   │   ├── controllers/            # API controllers
│   │   │   │   ├── protein.controller.ts
│   │   │   │   └── proteinPosition.controller.ts
│   │   │   ├── models/                 # Data models
│   │   │   │   ├── Protein.ts
│   │   │   │   └── ProteinPosition.ts
│   │   │   ├── routes/                 # API routes
│   │   │   │   ├── protein.routes.ts
│   │   │   │   └── proteinPosition.routes.ts
│   │   │   ├── scripts/                # Database scripts
│   │   │   │   └── seedHRProteins.ts
│   │   │   └── server.ts               # Main server file
│   │   ├── package.json                # Backend package configuration
│   │   ├── package-lock.json           # Backend dependency lock file
│   │   └── tsconfig.json               # TypeScript configuration
│   ├── package.json                    # Root package configuration
│   ├── package-lock.json               # Root dependency lock file
│   └── README.md                       # DNA repair project documentation
├── earth-environment/                  # Earth Environment projects
├── main-frontend/                      # Main React frontend application
│   ├── node_modules/                   # Frontend dependencies
│   ├── public/                         # Static assets
│   │   ├── favicon.ico                 # Site favicon
│   │   ├── index.html                  # Main HTML template
│   │   ├── logo192.png                 # App logo (192px)
│   │   ├── logo512.png                 # App logo (512px)
│   │   ├── manifest.json               # PWA manifest
│   │   └── robots.txt                  # Search engine configuration
│   ├── src/                            # Source code
│   │   ├── components/                 # React components
│   │   │   ├── Navigation.tsx          # Navigation component
│   │   │   ├── ProteinForm.tsx         # Protein form component
│   │   │   ├── ProteinList.tsx         # Protein list component
│   │   │   └── ProteinNode.tsx         # Protein node component
│   │   ├── pages/                      # Page components
│   │   │   ├── HRPathway.tsx           # Homologous Recombination pathway
│   │   │   └── NHEJPathway.tsx         # Non-Homologous End Joining pathway
│   │   ├── services/                   # API services
│   │   │   ├── api.ts                  # Base API configuration
│   │   │   ├── proteinService.ts       # Protein API service
│   │   │   └── proteinPositionService.ts # Protein position API service
│   │   ├── types/                      # TypeScript type definitions
│   │   │   ├── index.ts                # Main type exports
│   │   │   └── protein.ts              # Protein-related types
│   │   ├── App.css                     # Main application styles
│   │   ├── App.tsx                     # Main application component
│   │   ├── index.tsx                   # Application entry point
│   │   └── react-app-env.d.ts          # React app type definitions
│   ├── .gitignore                      # Git ignore rules
│   ├── package.json                    # Frontend package configuration
│   ├── package-lock.json               # Frontend dependency lock file
│   ├── README.md                       # Frontend project documentation
│   └── tsconfig.json                   # TypeScript configuration
└── maths/                              # Mathematics projects
```

## Project Overview

### DNA Repair Project
A full-stack application for analyzing DNA repair pathways, specifically focusing on:
- **Homologous Recombination (HR)** pathway
- **Non-Homologous End Joining (NHEJ)** pathway

**Backend**: Node.js/Express API with TypeScript
**Frontend**: React application with TypeScript

### Main Frontend
A React-based web application that provides:
- Interactive protein pathway visualization
- Protein data management forms
- Navigation between different DNA repair pathways

### Other Projects
- **Computer Science**: For computer science related projects
- **Earth Environment**: For environmental science projects  
- **Maths**: For mathematics projects

## Getting Started

### DNA Repair Project
1. Navigate to `dna-repair/`
2. Install dependencies: `npm install`
3. Start backend: `cd backend && npm start`
4. Start frontend: `cd ../main-frontend && npm start`

### Main Frontend
1. Navigate to `main-frontend/`
2. Install dependencies: `npm install`
3. Start development server: `npm start`

## Technology Stack

- **Backend**: Node.js, Express, TypeScript, MongoDB
- **Frontend**: React, TypeScript, CSS
- **Build Tools**: TypeScript compiler, npm 