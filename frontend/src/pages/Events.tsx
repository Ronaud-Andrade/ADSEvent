// Events.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
  InfoRow,
  FilterSection,
  FormGroup,
  FormControl
} from '../lib/ui';

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [next, setNext] = useState<string | null>(null);
  const [previous, setPrevious] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    loadEvents(page, searchQuery);
  }, [page, searchQuery]);

  const loadEvents = async (pageNumber: number, search: string) => {
    setLoading(true);
    setError('');

    try {
      const data: PaginatedResponse<Event> =
        await getEvents(pageNumber, search);

      setEvents(data.results || []);
      setNext(data.next);
      setPrevious(data.previous);
    } catch (err) {
      console.error('Erro ao carregar eventos:', err);
      setError('Falha ao carregar eventos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number | undefined) => {
    if (!id) return;

    if (!window.confirm('Tem certeza que deseja deletar este evento?')) {
      return;
    }

    try {
      await deleteEvent(id);
      loadEvents(page, searchQuery);
    } catch (err) {
      console.error('Erro ao deletar evento:', err);
      setError('Falha ao deletar evento');
    }
  };

  const formatEventDateTime = (dateTime: string) => {
    if (!dateTime) return '';

    const date = new Date(dateTime);

    return date.toLocaleString('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  };

  if (loading) {
    return (
      <PageContainer>
        <MessageBox>Carregando...</MessageBox>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: 'calc(100vh - 70px)',
        gap: '12px',
      }}
    >

      {/* CONTEÚDO PRINCIPAL */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >

        {/* HEADER */}
        <FlexBetween style={{ marginBottom: '8px' }}>
          <Heading style={{ margin: 0 }}>
            Eventos
          </Heading>

          <LinkButton variant="success" to="/events/new">
            + Novo Evento
          </LinkButton>
        </FlexBetween>

        {/* BUSCA */}
        <FilterSection style={{ marginBottom: '8px' }}>
          <FormGroup style={{ flex: 1, marginBottom: 0 }}>
            <FormControl
              type="text"
              placeholder="Buscar eventos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </FormGroup>
        </FilterSection>

        {/* ERRO */}
        {error && (
          <MessageBox style={{ marginBottom: '8px' }}>
            {error}
          </MessageBox>
        )}

        {/* LISTA */}
        {events.length === 0 ? (
          <EmptyState>
            Nenhum evento encontrado.
          </EmptyState>
        ) : (
          <div
            style={{
              display: 'grid',
              gap: '12px',
            }}
          >
            {events.map((event) => (
              <Card key={event.id}>
                <CardTitle>{event.title}</CardTitle>

                <CardDescription>
                  {event.descriptions}
                </CardDescription>

                <InfoRow>
                  <span>
                    📅 <strong>Data:</strong>{' '}
                    {formatEventDateTime(event.date_time)}
                  </span>

                  <span>
                    📍 <strong>Local:</strong> {event.local}
                  </span>

                  <span>
                    👥 <strong>Vagas:</strong> {event.vagas}
                  </span>

                  {event.category && event.category.length > 0 && (
                    <span>
                      🏷️ {event.category.map((cat) => cat.name).join(', ')}
                    </span>
                  )}
                </InfoRow>

                <CardFooter style={{ gap: '12px' }}>
                  <SmallButton
                    variant="primary"
                    onClick={() =>
                      event.id && navigate(`/events/${event.id}/edit`)
                    }
                  >
                    Editar
                  </SmallButton>

                  <SmallButton
                    variant="danger"
                    onClick={() =>
                      event.id && handleDelete(event.id)
                    }
                  >
                    Deletar
                  </SmallButton>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

      </div>

      {/* PAGINAÇÃO */}
      <PaginationBar
        style={{
          marginTop: '12px',
        }}
      >
        <Button
          variant="primary"
          onClick={() => setPage(page - 1)}
          disabled={!previous}
        >
          Anterior
        </Button>

        <div style={{ fontWeight: 'bold', color: '#555' }}>
          Página {page}
        </div>

        <Button
          variant="primary"
          onClick={() => setPage(page + 1)}
          disabled={!next}
        >
          Próximo
        </Button>
      </PaginationBar>

    </PageContainer>
  );
};

export default Events;