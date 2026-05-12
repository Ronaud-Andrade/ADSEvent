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
          <div className="form-group">
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
              className="form-control"
              type="text"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              required
            />
          </div>

          <div className="form-group">
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
              className="form-control"
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />
          </div>

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
            className="btn btn-primary"
            style={{
              width: '100%'
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