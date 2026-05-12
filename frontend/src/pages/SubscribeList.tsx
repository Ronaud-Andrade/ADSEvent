import React, { useState, useEffect } from 'react';
import { eventsAPI, subscribeAPI, Subscribe } from '../lib/api';
import { Event } from "../types/events";

const SubscribeList: React.FC = () => {
  const [subscribes, setSubscribes] = useState<Subscribe[]>([]);
  const [allUserSubscribes, setAllUserSubscribes] = useState<Subscribe[]>([]);
  const [availableEvents, setAvailableEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<number | ''>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [next, setNext] = useState<string | null>(null);
  const [previous, setPrevious] = useState<string | null>(null);

  useEffect(() => {
    loadSubscribes(page);
  }, [page]);

  useEffect(() => {
    loadAllUserSubscribes();
    loadAvailableEvents();
  }, []);

  useEffect(() => {
    const filtered = availableEvents.filter(event =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredEvents(filtered);
  }, [searchQuery, availableEvents]);

  const loadSubscribes = async (pageNumber: number) => {
    setLoading(true);

    try {
      const data = await subscribeAPI.getUserSubscribes(pageNumber);

      setSubscribes(data.results || []);
      setNext(data.next);
      setPrevious(data.previous);
      setError('');
    } catch (err) {
      console.error('Erro ao carregar inscrições:', err);
      setError('Falha ao carregar inscrições');
    } finally {
      setLoading(false);
    }
  };

  const loadAllUserSubscribes = async () => {
    try {
      let currentPage = 1;
      let allSubscribes: Subscribe[] = [];
      let hasNext = true;

      while (hasNext) {
        const response = await subscribeAPI.getUserSubscribes(currentPage);

        allSubscribes = [
          ...allSubscribes,
          ...(response.results || [])
        ];

        if (!response.next) {
          hasNext = false;
        } else {
          currentPage += 1;
        }
      }

      setAllUserSubscribes(allSubscribes);
    } catch (err) {
      console.error('Erro ao carregar todas as inscrições:', err);
    }
  };

  const loadAvailableEvents = async () => {
    try {
      let currentPage = 1;
      let allEvents: Event[] = [];
      let hasNext = true;

      while (hasNext) {
        const response = await eventsAPI.getEvents(currentPage);

        allEvents = [
          ...allEvents,
          ...(response.results || [])
        ];

        if (!response.next) {
          hasNext = false;
        } else {
          currentPage += 1;
        }
      }

      setAvailableEvents(allEvents);
    } catch (err) {
      console.error('Error loading available events:', err);
    }
  };

  const isAlreadySubscribed = (
    eventId: number | undefined
  ) => {
    if (!eventId) return false;

    return allUserSubscribes.some(
      (sub) =>
        sub.events.id === eventId && sub.active
    );
  };

  const handleCreateSubscription = async () => {
    if (!selectedEventId) {
      setError('Selecione um evento para inscrever.');
      return;
    }

    try {
      await subscribeAPI.createSubscribe({
        events_id: selectedEventId
      });

      await loadSubscribes(page);
      await loadAllUserSubscribes();

      setSelectedEventId('');
      setError('');
    } catch (err) {
      console.error('Erro ao criar inscrição:', err);
      setError('Falha ao criar inscrição');
    }
  };

  const handleUnsubscribe = async (id: number) => {
    if (
      window.confirm(
        'Tem certeza que deseja cancelar a inscrição neste evento?'
      )
    ) {
      try {
        await subscribeAPI.deleteSubscribe(id);

        await loadSubscribes(page);
        await loadAllUserSubscribes();
      } catch (err) {
        setError('Falha ao cancelar inscrição');
      }
    }
  };

  const formatEventDateTime = (dateTime: string) => {
    if (!dateTime) return '';

    const date = new Date(dateTime);

    return date.toLocaleString('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short'
    });
  };

  if (loading) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '2rem'
        }}
      >
        Carregando...
      </div>
    );
  }

  return (
    <div
      style={{
        padding: '2rem',
        maxWidth: '1000px',
        margin: '0 auto'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          borderBottom: '2px solid #f0f0f0',
          paddingBottom: '1rem'
        }}
      >
        <h1
          style={{
            color: '#333',
            margin: 0
          }}
        >
          Minhas Inscrições
        </h1>
      </div>

      {error && (
        <div
          style={{
            backgroundColor: '#f8d7da',
            color: '#dc3545',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            fontWeight: 'bold',
            border: '1px solid #f5c6cb'
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          alignItems: 'center',
          marginBottom: '2rem',
          backgroundColor: '#f8f9fa',
          padding: '1.5rem',
          borderRadius: '10px',
          border: '1px solid #ddd'
        }}
      >
        <input
          type="text"
          placeholder="Buscar eventos disponíveis..."
          value={searchQuery}
          onChange={(e) =>
            setSearchQuery(e.target.value)
          }
          style={{
            padding: '0.6rem',
            borderRadius: '6px',
            border: '1px solid #ccc',
            minWidth: '200px',
            flex: 1,
            backgroundColor: '#fff'
          }}
        />

        <select
          value={selectedEventId}
          onChange={(e) =>
            setSelectedEventId(
              e.target.value
                ? Number(e.target.value)
                : ''
            )
          }
          style={{
            padding: '0.6rem',
            borderRadius: '6px',
            border: '1px solid #ccc',
            minWidth: '240px',
            flex: 1,
            backgroundColor: '#fff'
          }}
        >
          <option value="">
            Selecionar evento
          </option>

          {filteredEvents.map((event) => {
            const alreadySubscribed =
              isAlreadySubscribed(event.id);

            return (
              <option
                key={event.id}
                value={event.id}
                disabled={alreadySubscribed}
              >
                {event.title}
                {alreadySubscribed
                  ? ' (inscrito)'
                  : ''}
              </option>
            );
          })}
        </select>

        <button
          type="button"
          onClick={handleCreateSubscription}
          disabled={!selectedEventId}
          className="btn btn-success"
          style={{
            padding: '0.7rem 1.5rem'
          }}
        >
          + Inscrever-se
        </button>
      </div>

      {subscribes.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '3rem',
            color: '#666',
            backgroundColor: '#f8f9fa',
            borderRadius: '10px',
            border: '1px solid #ddd'
          }}
        >
          Nenhuma inscrição encontrada.
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gap: '1.5rem'
          }}
        >
          {subscribes.map((subscribe) => (
            <div
              key={subscribe.id}
              style={{
                backgroundColor: '#f8f9fa',
                border: '1px solid #ddd',
                padding: '1.5rem',
                borderRadius: '10px',
                boxShadow:
                  '0 2px 5px rgba(0,0,0,0.05)'
              }}
            >
              <h3
                style={{
                  color: '#007bff',
                  margin: '0 0 0.5rem 0'
                }}
              >
                {subscribe.events.title}
              </h3>

              <p
                style={{
                  color: '#666',
                  marginBottom: '1rem'
                }}
              >
                {subscribe.events.descriptions}
              </p>

              <div
                style={{
                  fontSize: '0.9rem',
                  color: '#555',
                  display: 'flex',
                  gap: '1.2rem',
                  flexWrap: 'wrap',
                  marginBottom: '1.2rem'
                }}
              >
                <span>
                  📅 <strong>Data:</strong>{' '}
                  {formatEventDateTime(
                    subscribe.events.date_time
                  )}
                </span>

                <span>
                  📍 <strong>Local:</strong>{' '}
                  {subscribe.events.local}
                </span>

                <span>
                  👥 <strong>Capacidade:</strong>{' '}
                  {subscribe.events.vagas}
                </span>

                {subscribe.events.category &&
                  subscribe.events.category.length >
                    0 && (
                    <span>
                      🏷️{' '}
                      {subscribe.events.category
                        .map((cat) => cat.name)
                        .join(', ')}
                    </span>
                  )}
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: '0.8rem',
                  borderTop: '1px solid #ddd',
                  paddingTop: '1.2rem'
                }}
              >
                <button
                  onClick={() =>
                    subscribe.id &&
                    handleUnsubscribe(
                      subscribe.id
                    )
                  }
                  className="btn btn-danger"
                  style={{
                    padding: '0.5rem 1.2rem'
                  }}
                >
                  Cancelar Inscrição
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div
        style={{
          display: 'flex',
          justifyContent:
            'space-between',
          alignItems: 'center',
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '10px',
          border: '1px solid #ddd'
        }}
      >
        <button
          type="button"
          onClick={() => setPage(page - 1)}
          disabled={!previous}
          style={{
            padding: '0.6rem 1.2rem',
            backgroundColor: previous
              ? '#007bff'
              : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: previous
              ? 'pointer'
              : 'not-allowed'
          }}
        >
          Anterior
        </button>

        <div
          style={{
            fontWeight: 'bold',
            color: '#555'
          }}
        >
          Página {page}
        </div>

        <button
          type="button"
          onClick={() => setPage(page + 1)}
          disabled={!next}
          style={{
            padding: '0.6rem 1.2rem',
            backgroundColor: next
              ? '#007bff'
              : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: next
              ? 'pointer'
              : 'not-allowed'
          }}
        >
          Próximo
        </button>
      </div>
    </div>
  );
};

export default SubscribeList;