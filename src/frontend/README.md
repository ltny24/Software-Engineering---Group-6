# MyUS University Portal - Frontend Application

This directory contains the React + TypeScript frontend application for the University Portal System. It utilizes strict routing controls, global error interceptors, and code-splitting for optimal performance.

##  Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation
1. Navigate to the frontend directory:
   ```bash
   cd src/frontend
   ```
2. Install all required dependencies:
   ```bash
   npm install
   ```
3. Set up your local environment variables:
   - Copy `.env.example` and rename it to `.env`.
   - Ensure the API URL points to your active Spring Boot backend instance.
   ```bash
   cp .env.example .env
   ```

### Running the App
To boot up the local Webpack development server:
```bash
npm start
```
The application will automatically open and run at `http://localhost:3000`.

---

##  Coding Standards & Code Quality

To maintain a unified code style across the team, this project enforces strict linting and formatting rules via ESLint and Prettier.

- **Check for linting warnings/errors**:
  ```bash
  npm run lint
  ```
- **Automatically fix linting issues**:
  ```bash
  npm run lint:fix
  ```
- **Auto-format all code files**:
  ```bash
  npm run format
  ```

> **Pro Tip:** Make sure you have the **Prettier** and **ESLint** extensions installed in your VS Code. The shared `.vscode/settings.json` configuration at the repository root will automatically format your files on save.

---

## API Integration & Shared Data Service

All HTTP requests to the Spring Boot backend must use the shared Axios service instance located at `src/frontend/src/services/api.ts`. 

Do **not** use the default `axios` directly in your components. The shared instance automatically handles:
1. Fetching and attaching the JWT token (`Authorization: Bearer <token>`) to request headers if the user is authenticated.
2. Intercepting global response errors (e.g., catching `401 Unauthorized` to wipe expired tokens and clear the session seamlessly).

### Usage Example in a Component/Page:

```typescript
import api from '../../services/api';

interface StudentProfile {
  id: string;
  name: string;
  gpa: number;
}

const fetchProfileData = async () => {
  try {
    // The base URL and Authorization headers are handled automatically
    const data = await api.get<StudentProfile>('/students/profile');
    console.log('Profile loaded successfully:', data);
  } catch (error) {
    // Global errors (401, 403, 500) are already handled/logged by the interceptor
    console.error('Failed to render profile UI:', error);
  }
};
```
