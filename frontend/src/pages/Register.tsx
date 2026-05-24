import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../lib/api';
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

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password1 !== password2) {
      setError('As senhas não coincidem.');
      return;
    }

    setIsSubmitting(true);

    try {
      await authAPI.signup({
        username,
        password: password1,
      });
      navigate('/login');
    } catch (err) {
      setError('Não foi possível criar a conta. Verifique os dados e tente novamente.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CenteredScreen>
      <FormCard>
        <Heading>Crie sua conta</Heading>

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
              value={password1}
              onChange={(e) => setPassword1(e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup>
            <FormLabel>Confirmar senha</FormLabel>
            <FormControl
              type="password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
            />
          </FormGroup>

          {error && <MessageBox>{error}</MessageBox>}

          <Button
            type="submit"
            variant="primary"
            style={{ width: '100%' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Cadastrando...' : 'Registrar'}
          </Button>
        </form>

        <p style={{ marginTop: '1rem', textAlign: 'center' }}>
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </FormCard>
    </CenteredScreen>
  );
};

export default Register;
