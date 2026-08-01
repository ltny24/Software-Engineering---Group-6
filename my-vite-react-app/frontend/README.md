# My Vite React App

This project is a React application built with Vite, designed to manage grade appeals and track their status. It follows a modular architecture with a focus on reusability and adherence to a global UI design system.

## Features

- **Submit Grade Appeal**: Users can submit grade appeals through a form that includes fields for course selection, current grade, reason for appeal, and file uploads. The form includes validation and user notifications for successful submissions or errors.
  
- **Status Tracking**: Users can track the status of their submitted appeals. The application displays different states such as Pending, Processing, and Rejected, along with appropriate messages and details.

## Project Structure

```
my-vite-react-app
├── frontend
│   ├── src
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── index.css
│   │   ├── components
│   │   │   └── ui
│   │   ├── pages
│   │   │   └── appeals
│   │   │       ├── AppealForm.tsx
│   │   │       ├── AppealStatusTracking.tsx
│   │   │       ├── AppealPage.tsx
│   │   │       ├── types.ts
│   │   │       └── index.ts
│   │   └── services
│   │       └── api.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── vite.config.ts
│   └── README.md
```

## Getting Started

To get started with the project, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd my-vite-react-app/frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to `http://localhost:3000` to view the application.

## API Integration

The application interacts with a backend API for submitting appeals and fetching appeal configurations. Ensure that the backend is running and accessible for the application to function correctly.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.