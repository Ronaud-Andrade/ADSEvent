import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createEvent, updateEvent, getEvent } from "../services/eventsService";
import { getCategories } from "../services/categoryService";
import { Event, Category } from "../types/events";

export default function EventForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const isEditing = Boolean(id);

  const [event, setEvent] = useState<Event>({
    title: "",
    descriptions: "",
    date_time: "",
    vagas: 0,
    local: "",
    category: [],
  });
  const [categories, setCategories] = useState<Category[]>([]);

  const loadEvent = async () => {
    try {
      const data = await getEvent(Number(id));
      setEvent(data);
    } catch {
      alert("Erro ao carregar evento");
    }
  };

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Erro ao buscar categorias", error);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const load = async () => {
      if (id) {
        await loadEvent();
      }
    };
    load();
  }, [id]);

  const handleSubmit = async () => {
    try {
      const payload: Event = {
        ...event,
        category: event.category?.length ? event.category : [],
        vagas: Number(event.vagas),
      };

      if (isEditing) {
        if (!event.id) {
          alert("Evento sem ID!");
          return;
        }

        await updateEvent(event.id, payload);
        alert("Evento atualizado!");
      } else {
        await createEvent(payload);
        alert("Evento criado!");
      }

      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar evento");
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>{isEditing ? "Editar Evento" : "Criar Evento"}</h1>

      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="title" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Título:
          </label>
          <input
            type="text"
            id="title"
            placeholder="Título do evento"
            value={event.title}
            onChange={(e) => setEvent({ ...event, title: e.target.value })}
            required
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '1rem'
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="descriptions" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Descrição:
          </label>
          <textarea
            id="descriptions"
            placeholder="Descrição do evento"
            value={event.descriptions}
            onChange={(e) => setEvent({ ...event, descriptions: e.target.value })}
            required
            rows={4}
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '1rem',
              resize: 'vertical'
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="date_time" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Data e Hora:
          </label>
          <input
            type="datetime-local"
            id="date_time"
            value={event.date_time}
            onChange={(e) => setEvent({ ...event, date_time: e.target.value })}
            required
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '1rem'
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="vagas" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Vagas:
          </label>
          <input
            type="number"
            id="vagas"
            placeholder="Número de vagas"
            value={event.vagas}
            onChange={(e) => setEvent({ ...event, vagas: Number(e.target.value) })}
            required
            min="1"
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '1rem'
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="local" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Local:
          </label>
          <input
            type="text"
            id="local"
            placeholder="Local do evento"
            value={event.local}
            onChange={(e) => setEvent({ ...event, local: e.target.value })}
            required
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '1rem'
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="category" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Categoria:
          </label>
          <select
            id="category"
            value={event.category.length > 0 ? event.category[0].toString() : ""}
            onChange={(e) =>
              setEvent({ ...event, category: e.target.value ? [Number(e.target.value)] : [] })
            }
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '1rem'
            }}
          >
            <option value="">Selecione uma categoria</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            type="submit"
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Salvar
          </button>
          <Link
            to="/events"
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#6c757d',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '6px',
              fontWeight: 'bold'
            }}
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
