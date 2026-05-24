import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  CenteredScreen,
  FormCard,
  Heading,
  FormGroup,
  FormLabel,
  FormControl,
  Button,
  MessageBox
} from '../lib/ui';

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
    <CenteredScreen>
      <FormCard>
        <Heading>ADS Event</Heading>

        <form onSubmit={handleSubmit}>
          <FormGroup>
            <FormLabel>Usuário</FormLabel>
            <FormControl
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup>
            <FormLabel>Senha</FormLabel>
            <FormControl
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FormGroup>

          {error && <MessageBox>{error}</MessageBox>}

          <Button type="submit" variant="primary" style={{ width: '100%' }}>
            Entrar
          </Button>
        </form>

        <p style={{ marginTop: '1rem', textAlign: 'center' }}>
          Não tem conta? <Link to="/register">Cadastre-se</Link>
        </p>
      </FormCard>
    </CenteredScreen>
  );
};

export default Login;