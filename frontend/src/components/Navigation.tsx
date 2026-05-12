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
    <nav
      style={{
        backgroundColor: '#f8f9fa',
        borderBottom: '1px solid #ddd',
        padding: '1rem 2rem',
        marginBottom: '2rem',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Link
          to="/"
          style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#007bff',
            textDecoration: 'none',
          }}
        >
          ADS Event
        </Link>

        {user && (
          <ul
            style={{
              display: 'flex',
              listStyle: 'none',
              gap: '1.5rem',
              margin: 0,
              padding: 0,
              alignItems: 'center',
            }}
          >
            <li>
              <Link to="/" style={navLinkStyle}>
                Início
              </Link>
            </li>

            <li>
              <Link to="/events" style={navLinkStyle}>
                Eventos
              </Link>
            </li>

            <li>
              <Link to="/categories" style={navLinkStyle}>
                Categorias
              </Link>
            </li>

            <li>
              <Link to="/subscriptions" style={navLinkStyle}>
                Inscrições
              </Link>
            </li>

            <li>
              <button
                onClick={handleLogout}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
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

const navLinkStyle: React.CSSProperties = {
  color: '#333',
  textDecoration: 'none',
  fontWeight: '500',
  padding: '0.5rem 0.75rem',
  borderRadius: '4px',
  transition: 'background-color 0.2s',
};

export default Navigation;