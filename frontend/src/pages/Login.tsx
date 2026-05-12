import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Login: React.FC = () => {
  const [username, setUsername] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [error, setError] = useState('');

  const { login } = useAuth();

  const navigate = useNavigate();

  const inputStyle = {
    width: '100%',
    padding: '0.8rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    boxSizing: 'border-box' as const,
    marginBottom: '1rem',
    backgroundColor: '#fff'
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError(
        'Usuário ou senha incorretos.'
      );
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '70vh',
        padding: '1rem'
      }}
    >
      <div
        style={{
          maxWidth: '400px',
          width: '100%',
          padding: '2.5rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '12px',
          boxShadow:
            '0 10px 25px rgba(0,0,0,0.1)',
          border: '1px solid #ddd'
        }}
      >
        <h2
          style={{
            textAlign: 'center',
            marginBottom: '2rem',
            color: '#333'
          }}
        >
          Login ADS Event
        </h2>

        <form onSubmit={handleSubmit}>
          <label
            style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: 'bold',
              color: '#555'
            }}
          >
            Usuário
          </label>

          <input
            type="text"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
            style={inputStyle}
            required
          />

          <label
            style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: 'bold',
              color: '#555'
            }}
          >
            Senha
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            style={inputStyle}
            required
          />

          {error && (
            <div
              style={{
                color: '#dc3545',
                textAlign: 'center',
                marginBottom: '1rem',
                fontWeight: '500'
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '1rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;