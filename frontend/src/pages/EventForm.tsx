import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createEvent, updateEvent, getEvent } from "../services/eventsService";
import { getCategories } from "../services/categoryService";
import { Event, Category } from "../types/events";

export default function EventForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [categories, setCategories] = useState<Category[]>([]);

  const [event, setEvent] = useState<Event>({
    title: "",
    descriptions: "",
    date_time: "",
    vagas: 0,
    local: "",
    category_ids: []
  });

  useEffect(() => {
    const fetchData = async () => {
      const cats = await getCategories();
      setCategories(cats);

      if (id) {
        const data = await getEvent(Number(id));

        setEvent({
          ...data,
          category_ids: data.category
            ? data.category.map((cat) => cat.id)
            : []
        });
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const eventData = {
        ...event,
        category_ids: event.category_ids
      };

      if (isEditing) {
        await updateEvent(Number(id), eventData);
      } else {
        await createEvent(eventData);
      }

      navigate("/events");
    } catch {
      alert("Erro ao salvar");
    }
  };

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "3rem auto",
        padding: "2rem",
        backgroundColor: "#f8f9fa",
        borderRadius: "12px",
        border: "1px solid #ddd",
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
      }}
    >
      <h2
        style={{
          marginBottom: "2rem",
          borderBottom: "2px solid #eee",
          paddingBottom: "0.5rem",
          textAlign: "center",
          color: "#333"
        }}
      >
        {isEditing ? "Editar Evento" : "Novo Evento"}
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Título</label>

          <input
            className="form-control"
            type="text"
            value={event.title}
            onChange={(e) =>
              setEvent({
                ...event,
                title: e.target.value
              })
            }
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Descrição</label>

          <textarea
            className="form-control"
            style={{
              height: "100px",
              resize: "none"
            }}
            value={event.descriptions}
            onChange={(e) =>
              setEvent({
                ...event,
                descriptions: e.target.value
              })
            }
            required
          />
        </div>

        <div className="grid-2-cols" style={{ maxWidth: "500px", margin: "0 auto 1rem auto" }}>
          <div className="form-group">
            <label className="form-label">Data/Hora</label>

            <input
              className="form-control"
              type="datetime-local"
              style={{ marginBottom: "0" }}
              value={event.date_time?.slice(0, 16)}
              onChange={(e) =>
                setEvent({
                  ...event,
                  date_time: e.target.value
                })
              }
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Vagas</label>

            <input
              className="form-control"
              type="number"
              min="0"
              style={{ marginBottom: "0" }}
              value={event.vagas}
              onChange={(e) =>
                setEvent({
                  ...event,
                  vagas: Math.max(0, Number(e.target.value))
                })
              }
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Local</label>

          <input
            className="form-control"
            type="text"
            value={event.local}
            onChange={(e) =>
              setEvent({
                ...event,
                local: e.target.value
              })
            }
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Categorias</label>

          <select
            className="form-control"
            multiple
            style={{
              height: "120px"
            }}
            value={event.category_ids?.map(String)}
            onChange={(e) => {
              const selectedOptions = Array.from(
                e.target.selectedOptions,
                (option) => Number(option.value)
              );

              setEvent({
                ...event,
                category_ids: selectedOptions
              });
            }}
            required
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginTop: "2rem",
            maxWidth: "500px",
            marginLeft: "auto",
            marginRight: "auto"
          }}
        >
          <button
            type="submit"
            className="btn btn-success"
            style={{ flex: 1 }}
          >
            Salvar
          </button>

          <button
            type="button"
            onClick={() => navigate("/events")}
            className="btn btn-secondary"
            style={{ flex: 1 }}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}