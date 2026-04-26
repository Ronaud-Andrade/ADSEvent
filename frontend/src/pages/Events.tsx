import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { eventsAPI, Event, PaginatedResponse } from '../lib/api';

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [next, setNext] = useState<string | null>(null);
  const [previous, setPrevious] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const pageParam = Number(searchParams.get('page')) || 1;
    setPage(pageParam);
  }, [searchParams]);

  useEffect(() => {
    loadEvents(page);
  }, [page]);

  const loadEvents = async (pageNumber: number) => {
    setLoading(true);
    try {
      const data: PaginatedResponse<Event> = await eventsAPI.getEvents(pageNumber);
      setEvents(data.results);
      setCount(data.count);
      setNext(data.next);
      setPrevious(data.previous);
    } catch (err) {
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventsAPI.deleteEvent(id);
        loadEvents(page);
      } catch (err) {
        setError('Failed to delete event');
      }
    }
  };

  const changePage = (newPage: number) => {
    if (newPage < 1) return;
    setSearchParams({ page: String(newPage) });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Events</h1>
      <Link to="/events/new" style={{ display: 'inline-block', marginBottom: '1rem', padding: '0.5rem 1rem', backgroundColor: '#28a745', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
        Add New Event
      </Link>
      <div>
        {events.length === 0 ? (
          <p>No events found.</p>
        ) : (
          events.map(event => (
            <div key={event.id} style={{ border: '1px solid #ddd', padding: '1rem', marginBottom: '1rem', borderRadius: '8px' }}>
              <h3>{event.title}</h3>
              <p>{event.descriptions}</p>
              <p><strong>Date:</strong> {new Date(event.date_time).toLocaleString()}</p>
              <p><strong>Location:</strong> {event.local}</p>
              <p><strong>Capacity:</strong> {event.vagas}</p>
              <div style={{ marginTop: '1rem' }}>
                <Link to={`/events/${event.id}/edit`} style={{ marginRight: '1rem', padding: '0.25rem 0.5rem', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
                  Edit
                </Link>
                <button onClick={() => handleDelete(event.id)} style={{ padding: '0.25rem 0.5rem', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
        <button
          type="button"
          onClick={() => changePage(page - 1)}
          disabled={!previous}
          style={{ padding: '0.5rem 1rem', backgroundColor: previous ? '#007bff' : '#ccc', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Previous
        </button>
        <div>
          Page {page} of {Math.max(1, Math.ceil(count / 2))}
        </div>
        <button
          type="button"
          onClick={() => changePage(page + 1)}
          disabled={!next}
          style={{ padding: '0.5rem 1rem', backgroundColor: next ? '#007bff' : '#ccc', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Events;