import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { getEvents, deleteEvent } from "../services/eventsService";
import { Event } from "../types/events";

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEvents = async () => {
    try {
      const data = await getEvents();
      setEvents(data);
    } catch (error) {
      alert("Erro ao carregar eventos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadEvents(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Deseja realmente excluir este evento?")) return;
    try {
      await deleteEvent(id);
      loadEvents();
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
            <div style={{ fontSize: '0.9rem', color: '#888', display: 'flex', gap: '1rem' }}>
              <span>📅 {new Date(event.date_time).toLocaleDateString()}</span>
              <span>📍 {event.local}</span>
              <span>👥 {event.vagas} vagas</span>
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.8rem' }}>
              <Link to={`/events/${event.id}/edit`} style={{ padding: '0.5rem 1.2rem', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '6px' }}>Editar</Link>
              <button onClick={() => handleDelete(event.id!)} style={{ padding: '0.5rem 1.2rem', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Excluir</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}