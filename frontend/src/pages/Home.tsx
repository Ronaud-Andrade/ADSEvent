import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div style={{ padding: '2rem', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '1rem', color: '#333' }}>Bem-vindo ao ADS Event</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: '#666' }}>
        Sistema completo para gerenciamento de eventos e inscrições
      </p>

      {user ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid #ddd', padding: '1.5rem', borderRadius: '8px', backgroundColor: '#f8f9fa' }}>
            <h3 style={{ marginBottom: '1rem', color: '#007bff' }}>📅 Eventos</h3>
            <p style={{ marginBottom: '1rem', color: '#666', flex: 1 }}>Gerencie todos os eventos disponíveis</p>
            <Link
              to="/events"
              style={{
                display: 'inline-block',
                padding: '0.5rem 1rem',
                backgroundColor: '#007bff',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px',
                fontWeight: 'bold'
              }}
            >
              Ver Eventos
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid #ddd', padding: '1.5rem', borderRadius: '8px', backgroundColor: '#f8f9fa' }}>
            <h3 style={{ marginBottom: '1rem', color: '#28a745' }}>📋 Categorias</h3>
            <p style={{ marginBottom: '1rem', color: '#666', flex: 1 }}>Organize eventos por categorias</p>
            <Link
              to="/categories"
              style={{
                display: 'inline-block',
                padding: '0.5rem 1rem',
                backgroundColor: '#28a745',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px',
                fontWeight: 'bold'
              }}
            >
              Ver Categorias
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid #ddd', padding: '1.5rem', borderRadius: '8px', backgroundColor: '#f8f9fa' }}>
            <h3 style={{ marginBottom: '1rem', color: '#dc3545' }}>🎫 Minhas Inscrições</h3>
            <p style={{ marginBottom: '1rem', color: '#666', flex: 1 }}>Veja e gerencie suas inscrições</p>
            <Link
              to="/subscriptions"
              style={{
                display: 'inline-block',
                padding: '0.5rem 1rem',
                backgroundColor: '#dc3545',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px',
                fontWeight: 'bold'
              }}
            >
              Ver Inscrições
            </Link>
          </div>
        </div>
      ) : (
        <div style={{ marginTop: '2rem' }}>
          <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>
            Faça login para acessar todas as funcionalidades do sistema.
          </p>
          <Link
            to="/login"
            style={{
              display: 'inline-block',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#007bff',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              fontSize: '1.1rem'
            }}
          >
            Fazer Login
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;