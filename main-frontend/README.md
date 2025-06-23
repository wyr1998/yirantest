# Yiran Unified Website

This is the unified frontend for the Yiran knowledge platform. It integrates multiple domains, including:

- Computer Science
- DNA Repair (with interactive pathway visualization and protein management)
- Earth Environment
- Maths

The DNA Repair section is fully featured and includes pathway diagrams, protein lists, and forms for adding/editing proteins.

## Project Structure

```
main-frontend/
  ├── src/
  │   ├── components/      # Shared and DNA Repair components
  │   ├── pages/           # Route pages for DNA Repair
  │   ├── services/        # API and data services
  │   ├── types/           # TypeScript types
  │   └── App.tsx          # Main app and routing
  ├── public/
  ├── package.json
  └── ...
```

## Running the App

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Start the development server:**
   ```bash
   npm start
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000).

## Features

- **Homepage:** Navigation to all major knowledge domains.
- **DNA Repair:**
  - HR and NHEJ pathway visualization (React Flow)
  - Protein list and management (add/edit)
  - Interactive node movement and position saving
- **Other Sections:** Placeholder pages for future expansion.

## Extending the Platform
- Add new pages or features by creating components in `src/components` or `src/pages`.
- Update routing in `src/App.tsx` to add new sections.
- For backend/API integration, update or add services in `src/services`.

## Deployment
Build the app for production with:
```bash
npm run build
```
The output will be in the `build/` directory, ready for deployment.

## License
This project is part of the Yiran knowledge platform.
