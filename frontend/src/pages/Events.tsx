// Events.tsx

import React, {
  useState,
  useEffect,
} from 'react';

import {
  useNavigate,
} from 'react-router-dom';

import {
  getEvents,
  deleteEvent,
} from '../services/eventsService';

import {
  Event,
  PaginatedResponse,
} from '../types/events';

import {
  PageContainer,
  MessageBox,
  Button,
  LinkButton,
  SmallButton,
  EmptyState,
  Card,
  CardTitle,
  CardDescription,
  CardFooter,
  PaginationBar,
  Heading,
  FlexBetween,
  InfoRow
} from '../lib/ui';

const Events: React.FC = () => {
  const [events, setEvents] =
    useState<Event[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [page, setPage] =
    useState(1);

  const [next, setNext] =
    useState<string | null>(null);

  const [previous, setPrevious] =
    useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    loadEvents(page);
  }, [page]);

  const loadEvents = async (
    pageNumber: number
  ) => {
    setLoading(true);
    setError('');

    try {
      const data: PaginatedResponse<Event> =
        await getEvents(pageNumber);

      setEvents(data.results || []);
      setNext(data.next);
      setPrevious(data.previous);
    } catch (err) {
      console.error(
        'Erro ao carregar eventos:',
        err
      );

      setError(
        'Falha ao carregar eventos'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (
    id: number | undefined
  ) => {
    if (!id) return;

    if (
      !window.confirm(
        'Tem certeza que deseja deletar este evento?'
      )
    ) {
      return;
    }

    try {
      await deleteEvent(id);
      loadEvents(page);
    } catch (err) {
      console.error(
        'Erro ao deletar evento:',
        err
      );

      setError(
        'Falha ao deletar evento'
      );
    }
  };

  const formatEventDateTime = (
    dateTime: string
  ) => {
    if (!dateTime) return '';

    const date = new Date(dateTime);

    return date.toLocaleString(
      'pt-BR',
      {
        dateStyle: 'short',
        timeStyle: 'short',
      }
    );
  };

  if (loading) {
    return (
      <PageContainer>
        <MessageBox>
          Carregando...
        </MessageBox>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <FlexBetween
        style={{
          marginBottom: '2rem',
        }}
      >
        <Heading
          style={{
            margin: 0,
          }}
        >
          Eventos
        </Heading>

        <LinkButton
          variant="success"
          to="/events/new"
        >
          + Novo Evento
        </LinkButton>
      </FlexBetween>

      {error && (
        <MessageBox>
          {error}
        </MessageBox>
      )}

      {events.length === 0 ? (
        <EmptyState>
          Nenhum evento encontrado.
        </EmptyState>
      ) : (
        <div
          style={{
            display: 'grid',
            gap: '1.5rem',
          }}
        >
          {events.map((event) => (
            <Card key={event.id}>
              <CardTitle>
                {event.title}
              </CardTitle>

              <CardDescription>
                {event.descriptions}
              </CardDescription>

              <InfoRow>
                <span>
                  📅{' '}
                  <strong>
                    Data:
                  </strong>{' '}
                  {formatEventDateTime(
                    event.date_time
                  )}
                </span>

                <span>
                  📍{' '}
                  <strong>
                    Local:
                  </strong>{' '}
                  {event.local}
                </span>

                <span>
                  👥{' '}
                  <strong>
                    Vagas:
                  </strong>{' '}
                  {event.vagas}
                </span>

                {event.category &&
                  event.category
                    .length > 0 && (
                    <span>
                      🏷️{' '}
                      {event.category
                        .map(
                          (cat) =>
                            cat.name
                        )
                        .join(', ')}
                    </span>
                  )}
              </InfoRow>

              <CardFooter>
                <SmallButton
                  variant="primary"
                  onClick={() =>
                    event.id &&
                    navigate(
                      `/events/${event.id}/edit`
                    )
                  }
                >
                  Editar
                </SmallButton>

                <SmallButton
                  variant="danger"
                  onClick={() =>
                    event.id &&
                    handleDelete(
                      event.id
                    )
                  }
                >
                  Deletar
                </SmallButton>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <PaginationBar>
        <Button
          variant="primary"
          onClick={() =>
            setPage(page - 1)
          }
          disabled={!previous}
        >
          Anterior
        </Button>

        <div
          style={{
            fontWeight: 'bold',
            color: '#555',
          }}
        >
          Página {page}
        </div>

        <Button
          variant="primary"
          onClick={() =>
            setPage(page + 1)
          }
          disabled={!next}
        >
          Próximo
        </Button>
      </PaginationBar>
    </PageContainer>
  );
};

export default Events;