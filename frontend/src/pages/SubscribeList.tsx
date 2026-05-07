import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventsAPI, subscribeAPI, Event, Subscribe } from '../lib/api';

const SubscribeList: React.FC = () => {
  const [subscribes, setSubscribes] = useState<Subscribe[]>([]);
  const [allSubscribes, setAllSubscribes] = useState<Subscribe[]>([]);
  const [availableEvents, setAvailableEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<number | ''>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [next, setNext] = useState<string | null>(null);
  const [previous, setPrevious] = useState<string | null>(null);

  useEffect(() => {
    loadSubscribes(page);
  }, [page]);

  useEffect(() => {
    loadAvailableEvents();
    loadAllSubscribes();
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
      console.log('Loaded subscriptions:', data);
      setSubscribes(data.results || []);
      setCount(data.count);
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

  const loadAllSubscribes = async () => {
    try {
      const data = await subscribeAPI.getAllUserSubscribes();
      setAllSubscribes(data);
    } catch (err) {
      console.error('Error loading all subscriptions:', err);
    }
  };

  const loadAvailableEvents = async () => {
    try {
      let page = 1;
      let allEvents: Event[] = [];

      while (true) {
        const response = await eventsAPI.getEvents(page);
        allEvents = [...allEvents, ...(response.results || [])];
        if (!response.next) {
          break;
        }
        page += 1;
      }

      setAvailableEvents(allEvents);
    } catch (err) {
      console.error('Error loading available events:', err);
    }
  };

  const isAlreadySubscribed = (eventId: number) => {
    return allSubscribes.some((sub) => sub.events.id === eventId && sub.active);
  };

  const handleCreateSubscription = async () => {
    if (!selectedEventId) {
      setError('Selecione um evento para inscrever.');
      return;
    }

    if (isAlreadySubscribed(selectedEventId)) {
      setError('Você já está inscrito neste evento.');
      return;
    }

    try {
      await subscribeAPI.createSubscribe(selectedEventId);
      await loadSubscribes(page);
      await loadAllSubscribes();
      setSelectedEventId('');
      setError('');
    } catch (err) {
      console.error('Erro ao criar inscrição:', err);
      setError('Falha ao criar inscrição');
    }
  };

  const handleUnsubscribe = async (id: number) => {
    if (window.confirm('Tem certeza que deseja cancelar a inscrição neste evento?')) {
      try {
        await subscribeAPI.deleteSubscribe(id);
        await loadSubscribes(page);
        await loadAllSubscribes();
      } catch (err) {
        setError('Falha ao cancelar inscrição');
      }
    }
  };

  const formatEventDateTime = (dateTime: string) => {
    if (!dateTime) return '';

    const normalized = dateTime.replace(/Z$/, '').split('.')[0];
    const [datePart, timePart] = normalized.split('T');
    if (!datePart || !timePart) return dateTime.replace('T', ' ');

    const [year, month, day] = datePart.split('-').map(Number);
    const [hour = 0, minute = 0] = timePart.split(':').map(Number);
    if ([year, month, day, hour, minute].some((value) => Number.isNaN(value))) {
      return dateTime.replace('T', ' ');
    }

    const date = new Date(year, month - 1, day, hour, minute);
    return date.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div style={{ padding: '2rem' }}>
      {error && (
        <div style={{ marginBottom: '1rem', color: '#dc3545', fontWeight: 'bold' }}>
          {error}
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1>Minhas Inscrições</h1>
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Buscar eventos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', minWidth: '200px' }}
        />

        <select
          value={selectedEventId}
          onChange={(e) => setSelectedEventId(e.target.value ? Number(e.target.value) : '')}
          style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', minWidth: '240px' }}
        >
          <option value="">Selecionar evento</option>
          {filteredEvents.map((event) => {
            const alreadySubscribed = isAlreadySubscribed(event.id);
            return (
              <option key={event.id} value={event.id} disabled={alreadySubscribed}>
                {event.title}{alreadySubscribed ? ' (inscrito)' : ''}
              </option>
            );
          })}
        </select>

        <button
          type="button"
          onClick={handleCreateSubscription}
          disabled={!selectedEventId}
          style={{ padding: '0.6rem 1.2rem', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Nova Inscrição
        </button>
      </div>

      {subscribes.length === 0 ? (
        <p>Você ainda não tem inscrições.</p>
      ) : (
        <div>
          {subscribes.map(subscribe => (
            <div key={subscribe.id} style={{ border: '1px solid #ddd', padding: '1rem', marginBottom: '1rem', borderRadius: '8px' }}>
              <h3>{subscribe.events.title}</h3>
              <p>{subscribe.events.descriptions}</p>
              <p><strong>Data:</strong> {formatEventDateTime(subscribe.events.date_time)}</p>
              <p><strong>Local:</strong> {subscribe.events.local}</p>
              <p><strong>Capacidade:</strong> {subscribe.events.vagas}</p>
              <div style={{ marginTop: '1rem' }}>
                <Link
                  to={`/subscriptions/${subscribe.id}/edit`}
                  style={{ marginRight: '1rem', padding: '0.25rem 0.5rem', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '4px' }}
                >
                  Editar
                </Link>
                <button
                  onClick={() => handleUnsubscribe(subscribe.id)}
                  style={{ padding: '0.25rem 0.5rem', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}
                >
                  Cancelar Inscrição
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
        <button
          type="button"
          onClick={() => setPage(page - 1)}
          disabled={!previous}
          style={{ padding: '0.5rem 1rem', backgroundColor: previous ? '#007bff' : '#ccc', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Anterior
        </button>
        <div>Página {page} de {Math.max(1, count)}</div>
        <button
          type="button"
          onClick={() => setPage(page + 1)}
          disabled={!next}
          style={{ padding: '0.5rem 1rem', backgroundColor: next ? '#007bff' : '#ccc', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Próximo
        </button>
      </div>
    </div>
  );
};

export default SubscribeList;