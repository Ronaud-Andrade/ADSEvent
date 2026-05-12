import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Events from './pages/Events';
import EventForm from './pages/EventForm';
import CategoryList from './pages/CategoryList';
import CategoryForm from './pages/CategoryForm';
import SubscribeList from './pages/SubscribeList';
import SubscribeEdit from './pages/SubscribeEdit';
import Login from './pages/Login';
import PrivateRoute from './routes/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Navigation />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/events" element={<PrivateRoute><Events /></PrivateRoute>} />
            <Route path="/events/new" element={<PrivateRoute><EventForm /></PrivateRoute>} />
            <Route path="/events/:id/edit" element={<PrivateRoute><EventForm /></PrivateRoute>} />
            <Route path="/categories" element={<PrivateRoute><CategoryList /></PrivateRoute>} />
            <Route path="/categories/new" element={<PrivateRoute><CategoryForm /></PrivateRoute>} />
            <Route path="/categories/:id/edit" element={<PrivateRoute><CategoryForm /></PrivateRoute>} />
            <Route path="/subscriptions" element={<PrivateRoute><SubscribeList /></PrivateRoute>} />
            <Route path="/subscriptions/:id/edit" element={<PrivateRoute><SubscribeEdit /></PrivateRoute>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;