import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { getEvents, deleteEvent } from "../services/eventsService";
import { Event, PaginatedResponse } from "../types/events";

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [next, setNext] = useState<string | null>(null);
  const [previous, setPrevious] = useState<string | null>(null);

  const loadEvents = async (pageNumber: number = 1) => {
    setLoading(true);
    try {
      const data: PaginatedResponse<Event> = await getEvents(pageNumber);
      setEvents(data.results);
      setNext(data.next);
      setPrevious(data.previous);
    } catch (error) {
      alert("Erro ao carregar eventos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadEvents(page); }, [page]);

  const handleDelete = async (id: number) => {
    if (!confirm("Deseja realmente excluir este evento?")) return;
    try {
      await deleteEvent(id);
      loadEvents(page);
    } catch (error) { alert("Erro ao deletar"); }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Carregando...</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', borderBottom: '2px solid #f0f0f0', paddingBottom: '1rem' }}>
        <h1 style={{ color: '#333', margin: 0 }}>Gerenciar Eventos</h1>
        <Link to="/events/new" style={{ padding: '0.8rem 1.5rem', backgroundColor: '#28a745', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold' }}>
          + Novo Evento
        </Link>
      </div>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {events.map((event) => (
          <div key={event.id} style={{ backgroundColor: '#fff', border: '1px solid #ddd', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
            <h3 style={{ color: '#007bff', margin: '0 0 0.5rem 0' }}>{event.title}</h3>
            <p style={{ color: '#666', marginBottom: '1rem' }}>{event.descriptions}</p>
            <div style={{ fontSize: '0.9rem', color: '#888', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <span>📅 {new Date(event.date_time).toLocaleDateString()}</span>
              <span>📍 {event.local}</span>
              <span>👥 {event.vagas} vagas</span>
              {event.category && event.category.length > 0 && (
                <span>🏷️ {event.category.map(cat => cat.name).join(', ')}</span>
              )}
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.8rem' }}>
              <Link to={`/events/${event.id}/edit`} style={{ padding: '0.5rem 1.2rem', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '6px' }}>Editar</Link>
              <button onClick={() => handleDelete(event.id!)} style={{ padding: '0.5rem 1.2rem', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Excluir</button>
            </div>
          </div>
        ))}
      </div>

      {/* Paginação */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', padding: '1rem', backgroundColor: '#fff', borderRadius: '10px', border: '1px solid #eee' }}>
        <button
          type="button"
          onClick={() => setPage(page - 1)}
          disabled={!previous}
          style={{ padding: '0.6rem 1.2rem', backgroundColor: previous ? '#007bff' : '#ccc', color: 'white', border: 'none', borderRadius: '6px', cursor: previous ? 'pointer' : 'not-allowed' }}
        >
          Anterior
        </button>
        <div style={{ fontWeight: 'bold', color: '#555' }}>Página {page}</div>
        <button
          type="button"
          onClick={() => setPage(page + 1)}
          disabled={!next}
          style={{ padding: '0.6rem 1.2rem', backgroundColor: next ? '#007bff' : '#ccc', color: 'white', border: 'none', borderRadius: '6px', cursor: next ? 'pointer' : 'not-allowed' }}
        >
          Próximo
        </button>
      </div>
    </div>
  );
}