import React, {
  useState,
  useEffect,
} from 'react';

import {
  eventsAPI,
  subscribeAPI,
  Subscribe
} from '../lib/api';

import {
  Event
} from '../types/events';

import {
  EventFilterType,
  eventFilterStrategies,
} from '../lib/filterStrategies';

import {
  PageContainer,
  Heading,
  MessageBox,
  FormGroup,
  FormControl,
  SelectControl,
  Button,
  EmptyState,
  Card,
  CardTitle,
  CardDescription,
  CardFooter,
  PaginationBar,
  FilterSection,
  InfoRow
} from '../lib/ui';

const SubscribeList: React.FC = () => {
  const [subscribes, setSubscribes] =
    useState<Subscribe[]>([]);

  const [
    allUserSubscribes,
    setAllUserSubscribes
  ] = useState<Subscribe[]>([]);

  const [
    availableEvents,
    setAvailableEvents
  ] = useState<Event[]>([]);

  const [
    filteredEvents,
    setFilteredEvents
  ] = useState<Event[]>([]);

  const [
    selectedEventId,
    setSelectedEventId
  ] = useState<number | ''>('');

  const [searchQuery, setSearchQuery] =
    useState('');

  const [filterType, setFilterType] =
    useState<EventFilterType>('title');

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

  useEffect(() => {
    loadSubscribes(page);
  }, [page]);

  useEffect(() => {
    loadAllUserSubscribes();
    loadAvailableEvents();
  }, []);

  useEffect(() => {
    const strategy =
      eventFilterStrategies[filterType];

    const filtered =
      availableEvents.filter((event) =>
        strategy.matches(event, searchQuery)
      );

    setFilteredEvents(filtered);
  }, [searchQuery, availableEvents, filterType]);

  const loadSubscribes = async (
    pageNumber: number
  ) => {
    setLoading(true);

    try {
      const data =
        await subscribeAPI.getUserSubscribes(
          pageNumber
        );

      setSubscribes(data.results || []);
      setNext(data.next);
      setPrevious(data.previous);
      setError('');
    } catch (err) {
      console.error(
        'Erro ao carregar inscrições:',
        err
      );

      setError(
        'Falha ao carregar inscrições'
      );
    } finally {
      setLoading(false);
    }
  };

  const loadAllUserSubscribes =
    async () => {
      try {
        let currentPage = 1;

        let allSubscribes: Subscribe[] =
          [];

        let hasNext = true;

        while (hasNext) {
          const response =
            await subscribeAPI.getUserSubscribes(
              currentPage
            );

          allSubscribes = [
            ...allSubscribes,
            ...(response.results || []),
          ];

          if (!response.next) {
            hasNext = false;
          } else {
            currentPage += 1;
          }
        }

        setAllUserSubscribes(
          allSubscribes
        );
      } catch (err) {
        console.error(
          'Erro ao carregar todas as inscrições:',
          err
        );
      }
    };

  const loadAvailableEvents =
    async () => {
      try {
        let currentPage = 1;

        let allEvents: Event[] = [];

        let hasNext = true;

        while (hasNext) {
          const response =
            await eventsAPI.getEvents(
              currentPage
            );

          allEvents = [
            ...allEvents,
            ...(response.results || []),
          ];

          if (!response.next) {
            hasNext = false;
          } else {
            currentPage += 1;
          }
        }

        setAvailableEvents(allEvents);
      } catch (err) {
        console.error(
          'Erro ao carregar eventos:',
          err
        );
      }
    };

  const isAlreadySubscribed = (
    eventId: number | undefined
  ) => {
    if (!eventId) return false;

    return allUserSubscribes.some(
      (sub) =>
        sub.events.id === eventId &&
        sub.active
    );
  };

  const handleCreateSubscription =
    async () => {
      if (!selectedEventId) {
        setError(
          'Selecione um evento para inscrever.'
        );

        return;
      }

      try {
        await subscribeAPI.createSubscribe({
          events_id: selectedEventId,
        });

        await loadSubscribes(page);
        await loadAllUserSubscribes();

        setSelectedEventId('');
        setError('');
      } catch (err) {
        console.error(
          'Erro ao criar inscrição:',
          err
        );

        setError(
          'Falha ao criar inscrição'
        );
      }
    };

  const handleUnsubscribe = async (
    id: number
  ) => {
    if (
      !window.confirm(
        'Tem certeza que deseja cancelar a inscrição neste evento?'
      )
    ) {
      return;
    }

    try {
      await subscribeAPI.deleteSubscribe(
        id
      );

      await loadSubscribes(page);
      await loadAllUserSubscribes();
    } catch (err) {
      setError(
        'Falha ao cancelar inscrição'
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
      <Heading>
        Minhas Inscrições
      </Heading>

      {error && (
        <MessageBox>
          {error}
        </MessageBox>
      )}

      <FilterSection>
        <FormGroup
          style={{
            flex: 1,
            marginBottom: 0,
          }}
        >
          <FormControl
            type="text"
            placeholder="Buscar eventos disponíveis..."
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(
                e.target.value
              )
            }
          />
        </FormGroup>

        <FormGroup
          style={{
            minWidth: '180px',
            marginBottom: 0,
          }}
        >
          <SelectControl
            value={filterType}
            onChange={(e) =>
              setFilterType(
                e.target.value as EventFilterType
              )
            }
          >
            <option value="title">
              Título
            </option>
            <option value="location">
              Local
            </option>
            <option value="category">
              Categoria
            </option>
          </SelectControl>
        </FormGroup>

        <FormGroup
          style={{
            flex: 1,
            minWidth: '220px',
            marginBottom: 0,
          }}
        >
          <SelectControl
            value={selectedEventId}
            onChange={(e) =>
              setSelectedEventId(
                e.target.value
                  ? Number(
                      e.target.value
                    )
                  : ''
              )
            }
          >
            <option value="">
              Selecionar evento
            </option>

            {filteredEvents.map(
              (event) => {
                const alreadySubscribed =
                  isAlreadySubscribed(
                    event.id
                  );

                return (
                  <option
                    key={event.id}
                    value={event.id}
                    disabled={
                      alreadySubscribed
                    }
                  >
                    {event.title}

                    {alreadySubscribed
                      ? ' (inscrito)'
                      : ''}
                  </option>
                );
              }
            )}
          </SelectControl>
        </FormGroup>

        <Button
          variant="success"
          onClick={
            handleCreateSubscription
          }
          disabled={
            !selectedEventId
          }
        >
          + Inscrever-se
        </Button>
      </FilterSection>

      {subscribes.length === 0 ? (
        <EmptyState>
          Nenhuma inscrição encontrada.
        </EmptyState>
      ) : (
        <div
          style={{
            display: 'grid',
            gap: '1.5rem',
          }}
        >
          {subscribes.map(
            (subscribe) => (
              <Card
                key={subscribe.id}
              >
                <CardTitle>
                  {
                    subscribe.events
                      .title
                  }
                </CardTitle>

                <CardDescription>
                  {
                    subscribe.events
                      .descriptions
                  }
                </CardDescription>

                <InfoRow>
                  <span>
                    📅{' '}
                    <strong>
                      Data:
                    </strong>{' '}
                    {formatEventDateTime(
                      subscribe
                        .events
                        .date_time
                    )}
                  </span>

                  <span>
                    📍{' '}
                    <strong>
                      Local:
                    </strong>{' '}
                    {
                      subscribe
                        .events
                        .local
                    }
                  </span>

                  <span>
                    👥{' '}
                    <strong>
                      Capacidade:
                    </strong>{' '}
                    {
                      subscribe
                        .events
                        .vagas
                    }
                  </span>

                  {subscribe.events
                    .category &&
                    subscribe.events
                      .category
                      .length > 0 && (
                      <span>
                        🏷️{' '}
                        {subscribe.events.category
                          .map(
                            (
                              cat
                            ) =>
                              cat.name
                          )
                          .join(
                            ', '
                          )}
                      </span>
                    )}
                </InfoRow>

                <CardFooter>
                  <Button
                    variant="danger"
                    onClick={() =>
                      subscribe.id &&
                      handleUnsubscribe(
                        subscribe.id
                      )
                    }
                  >
                    Cancelar
                    Inscrição
                  </Button>
                </CardFooter>
              </Card>
            )
          )}
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

export default SubscribeList;