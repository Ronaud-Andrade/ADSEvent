# ADS Event

A full-stack web application for managing events and subscriptions, built with Django REST Framework and React.

## Project Structure

- **Backend**: Django REST API (`/` root directory)
- **Frontend**: React + TypeScript + Vite (`/frontend` directory)

## Backend Setup

### Prerequisites

- Python 3.x
- pip

### Installation

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Run migrations:
   ```bash
   python manage.py migrate
   ```

3. Create a superuser (optional):
   ```bash
   python manage.py createsuperuser
   ```

### Running the Server

Start the development server:

```bash
python manage.py runserver
```

The backend API will be available at `http://127.0.0.1:8000/`

## Frontend Setup

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173/` (or next available port).

### Building for Production

To build the application for production:

```bash
npm run build
```

To preview the production build:

```bash
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

### Backend
- Django
- Django REST Framework

### Frontend
- React 19
- TypeScript
- Vite
- React Router DOM
- Axios (for API calls)
- Context API (for state management)
