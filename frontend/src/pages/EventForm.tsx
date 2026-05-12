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

  const labelStyle = {
    display: "block",
    marginBottom: "0.5rem",
    fontWeight: "bold",
    color: "#555",
    textAlign: "left" as const
  };

  const inputStyle = {
    width: "100%",
    padding: "0.8rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginBottom: "1.2rem",
    boxSizing: "border-box" as const,
    backgroundColor: "#fff",
    fontSize: "1rem"
  };

  const formGroupStyle = {
    maxWidth: "500px",
    margin: "0 auto"
  };

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
        <div style={formGroupStyle}>
          <label style={labelStyle}>Título</label>

          <input
            type="text"
            style={inputStyle}
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

        <div style={formGroupStyle}>
          <label style={labelStyle}>Descrição</label>

          <textarea
            style={{
              ...inputStyle,
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

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "2rem",
            justifyContent: "center",
            alignItems: "start",
            maxWidth: "500px",
            margin: "0 auto 1rem auto"
          }}
        >
          <div style={{ maxWidth: "240px", width: "100%" }}>
            <label style={labelStyle}>Data/Hora</label>

            <input
              type="datetime-local"
              style={inputStyle}
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

          <div style={{ maxWidth: "240px", width: "100%" }}>
            <label style={labelStyle}>Vagas</label>

            <input
              type="number"
              min="0"
              style={inputStyle}
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

        <div style={formGroupStyle}>
          <label style={labelStyle}>Local</label>

          <input
            type="text"
            style={inputStyle}
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

        <div style={formGroupStyle}>
          <label style={labelStyle}>Categorias</label>

          <select
            multiple
            style={{
              ...inputStyle,
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
            style={{
              flex: 1,
              padding: "1rem",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            Salvar
          </button>

          <button
            type="button"
            onClick={() => navigate("/events")}
            style={{
              flex: 1,
              padding: "1rem",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}