import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="nav">
      <div className="nav-content">
        <Link
          to="/"
          className="nav-link"
          style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: 'var(--primary)',
            textDecoration: 'none'
          }}
        >
          ADS Event
        </Link>

        {user && (
          <ul
            className="nav-links"
            style={{
              display: 'flex',
              listStyle: 'none',
              gap: '1.5rem',
              margin: 0,
              padding: 0,
              alignItems: 'center'
            }}
          >
            <li>
              <Link to="/" className="nav-link">
                Início
              </Link>
            </li>

            <li>
              <Link to="/events" className="nav-link">
                Eventos
              </Link>
            </li>

            <li>
              <Link to="/categories" className="nav-link">
                Categorias
              </Link>
            </li>

            <li>
              <Link to="/subscriptions" className="nav-link">
                Inscrições
              </Link>
            </li>

            <li>
              <button
                onClick={handleLogout}
                className="btn btn-danger"
                style={{ padding: '0.5rem 1rem' }}
              >
                Sair
              </button>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navigation;