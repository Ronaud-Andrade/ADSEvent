import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Events from './pages/Events';
import EventForm from './pages/EventForm';
import CategoryList from './pages/CategoryList';
import CategoryForm from './pages/CategoryForm';
import SubscribeList from './pages/SubscribeList';
import SubscribeEdit from './pages/SubscribeEdit';
import Login from './pages/Login';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return user ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Navigation />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
            <Route path="/events/new" element={<ProtectedRoute><EventForm /></ProtectedRoute>} />
            <Route path="/events/:id/edit" element={<ProtectedRoute><EventForm /></ProtectedRoute>} />
            <Route path="/categories" element={<ProtectedRoute><CategoryList /></ProtectedRoute>} />
            <Route path="/categories/new" element={<ProtectedRoute><CategoryForm /></ProtectedRoute>} />
            <Route path="/categories/:id/edit" element={<ProtectedRoute><CategoryForm /></ProtectedRoute>} />
            <Route path="/subscriptions" element={<ProtectedRoute><SubscribeList /></ProtectedRoute>} />
            <Route path="/subscriptions/:id/edit" element={<ProtectedRoute><SubscribeEdit /></ProtectedRoute>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;