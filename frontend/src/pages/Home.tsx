import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Home: React.FC = () => {
  const { user } = useAuth();

  const cardStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #eee',
    padding: '2rem',
    borderRadius: '12px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    transition: 'transform 0.2s'
  };

  const buttonStyle = (color: string) => ({
    display: 'inline-block',
    padding: '0.8rem 1.5rem',
    backgroundColor: color,
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
    fontWeight: 'bold' as const,
    textAlign: 'center' as const
  });

  return (
    <div style={{ padding: '3rem 1rem', textAlign: 'center', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#2c3e50' }}>ADS Event</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '3rem', color: '#666' }}>
        Gerenciamento profissional de eventos e inscrições acadêmicas.
      </p>

      {user ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          <div style={cardStyle}>
            <h3 style={{ marginBottom: '1rem', color: '#007bff' }}>📅 Eventos</h3>
            <p style={{ marginBottom: '1.5rem', color: '#666', flex: 1 }}>Explore e gerencie a lista completa de eventos.</p>
            <Link to="/events" style={buttonStyle('#007bff')}>Ver Eventos</Link>
          </div>

          <div style={cardStyle}>
            <h3 style={{ marginBottom: '1rem', color: '#28a745' }}>🏷️ Categorias</h3>
            <p style={{ marginBottom: '1.5rem', color: '#666', flex: 1 }}>Organize os eventos por tipos e categorias.</p>
            <Link to="/categories" style={buttonStyle('#28a745')}>Categorias</Link>
          </div>

          <div style={cardStyle}>
            <h3 style={{ marginBottom: '1rem', color: '#dc3545' }}>🎫 Minhas Inscrições</h3>
            <p style={{ marginBottom: '1.5rem', color: '#666', flex: 1 }}>Acompanhe o status das suas participações.</p>
            <Link to="/subscriptions" style={buttonStyle('#dc3545')}>Inscrições</Link>
          </div>
        </div>
      ) : (
        <div style={{ ...cardStyle, maxWidth: '500px', margin: '0 auto' }}>
          <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem', color: '#444' }}>
            Acesse sua conta para começar a se inscrever.
          </p>
          <Link to="/login" style={buttonStyle('#007bff')}>Entrar no Sistema</Link>
        </div>
      )}
    </div>
  );
};

export default Home;