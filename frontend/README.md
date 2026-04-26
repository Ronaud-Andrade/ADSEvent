# ADS Event Frontend

This is the frontend part of the ADS Event application, built with React and TypeScript using Vite.

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

### Running the Application

To start the development server:

```
npm run dev
```

The application will be available at `http://localhost:5173/` (or next available port).

### Building for Production

To build the application for production:

```
npm run build
```

To preview the production build:

```
npm run preview
```

## Features

### Authentication
- Login page with token-based authentication
- Protected routes requiring authentication
- Automatic token management and logout

### Events Management
- List all events
- Create new events
- Edit existing events
- Delete events

### Pages
- **Login** (`/login`): User authentication
- **Home** (`/`): Welcome page (protected)
- **Events** (`/events`): List of events (protected)
- **Event Form** (`/events/new` or `/events/:id/edit`): Create/edit events (protected)

## API Integration

The frontend communicates with the Django REST API running on `http://127.0.0.1:8000/api/v1/`.

### Authentication Endpoints
- `POST /api/v1/auth/login/` - Login
- `POST /api/v1/auth/logout/` - Logout
- `GET /api/v1/auth/user/` - Get current user

### Events Endpoints
- `GET /api/v1/events/` - List events
- `POST /api/v1/events/` - Create event
- `GET /api/v1/events/{id}/` - Get event details
- `PUT /api/v1/events/{id}/` - Update event
- `DELETE /api/v1/events/{id}/` - Delete event

## Testing

Use the following credentials to test the application:
- Username: `admin`
- Password: `admin123`

## Technologies Used

- React 19
- TypeScript
- Vite
- React Router DOM
- Axios (for API calls)
- Context API (for state management)