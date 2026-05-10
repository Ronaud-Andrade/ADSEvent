import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createEvent, updateEvent, getEvent } from "../services/eventsService";
import { getCategories } from "../services/categoryService";
import { Event, Category } from "../types/events";

export default function EventForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [, setCategories] = useState<Category[]>([]);
  const [event, setEvent] = useState<Event>({
    title: "", descriptions: "", date_time: "", vagas: 0, local: "", category: []
  });

  useEffect(() => {
    const fetchData = async () => {
      const cats = await getCategories();
      setCategories(cats);
      if (id) {
        const data = await getEvent(Number(id));
        setEvent(data);
      }
    };
    fetchData();
  }, [id]);

  const labelStyle = { display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' };
  const inputStyle = { width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc', marginBottom: '1.2rem' };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      isEditing ? await updateEvent(Number(id), event) : await createEvent(event);
      navigate("/events");
    } catch { alert("Erro ao salvar"); }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '3rem auto', padding: '2rem', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
      <h2 style={{ marginBottom: '2rem', borderBottom: '2px solid #eee', paddingBottom: '0.5rem' }}>
        {isEditing ? 'Editar Evento' : 'Novo Evento'}
      </h2>
      <form onSubmit={handleSubmit}>
        <label style={labelStyle}>Título</label>
        <input type="text" style={inputStyle} value={event.title} onChange={e => setEvent({...event, title: e.target.value})} required />
        
        <label style={labelStyle}>Descrição</label>
        <textarea style={{...inputStyle, height: '100px'}} value={event.descriptions} onChange={e => setEvent({...event, descriptions: e.target.value})} required />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Data/Hora</label>
            <input type="datetime-local" style={inputStyle} value={event.date_time.slice(0, 16)} onChange={e => setEvent({...event, date_time: e.target.value})} required />
          </div>
          <div>
            <label style={labelStyle}>Vagas</label>
            <input type="number" style={inputStyle} value={event.vagas} onChange={e => setEvent({...event, vagas: Number(e.target.value)})} required />
          </div>
        </div>

        <label style={labelStyle}>Local</label>
        <input type="text" style={inputStyle} value={event.local} onChange={e => setEvent({...event, local: e.target.value})} required />

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button type="submit" style={{ flex: 2, padding: '1rem', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Salvar</button>
          <button type="button" onClick={() => navigate('/events')} style={{ flex: 1, padding: '1rem', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}