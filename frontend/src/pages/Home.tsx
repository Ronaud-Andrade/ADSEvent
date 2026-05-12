// Home.tsx

import React from 'react';
import { useAuth } from '../hooks/useAuth';

import {
  PageContainer,
  Heading,
  SubTitle,
  CardGrid,
  Card,
  CardTitle,
  CardDescription,
  LinkButton
} from '../lib/ui';

const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <PageContainer>
      <Heading>
        ADS Event
      </Heading>

      <SubTitle>
        Gerenciamento profissional
        de eventos e inscrições
        acadêmicas.
      </SubTitle>

      {user ? (
        <CardGrid>
          <Card>
            <CardTitle>
              📅 Eventos
            </CardTitle>

            <CardDescription>
              Explore e gerencie a
              lista completa de
              eventos.
            </CardDescription>

            <LinkButton
              variant="primary"
              to="/events"
            >
              Ver Eventos
            </LinkButton>
          </Card>

          <Card>
            <CardTitle>
              🏷️ Categorias
            </CardTitle>

            <CardDescription>
              Organize os eventos
              por tipos e categorias.
            </CardDescription>

            <LinkButton
              variant="success"
              to="/categories"
            >
              Categorias
            </LinkButton>
          </Card>

          <Card>
            <CardTitle>
              🎫 Minhas Inscrições
            </CardTitle>

            <CardDescription>
              Acompanhe o status das
              suas participações.
            </CardDescription>

            <LinkButton
              variant="danger"
              to="/subscriptions"
            >
              Inscrições
            </LinkButton>
          </Card>
        </CardGrid>
      ) : (
        <Card>
          <CardDescription>
            Acesse sua conta para
            começar a se inscrever.
          </CardDescription>

          <LinkButton
            variant="primary"
            to="/login"
          >
            Entrar no Sistema
          </LinkButton>
        </Card>
      )}
    </PageContainer>
  );
};

export default Home;