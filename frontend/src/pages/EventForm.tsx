/* Importa o useState do React */
import { useState, useEffect } from "react";
/* Importa funções da API */
import { createEvent, updateEvent } from "../services/eventsService";
/* Importa funções de categoria */
import { getCategories } from "../services/categoryService";
/* Importa o tipo Event */
import { Event } from "../types/events";
/* Importa o tipo Category */
import { Category } from "../types/events";

export default function EventForm() {
  /* Estado do formulário (dados do evento) */
  const [event, setEvent] = useState<Event>({
    title: "",
    descriptions: "",
    date_time: "",
    vagas: 0,
    local: "",
    category: [], // Inicializa como array vazio para categorias
  });

  /* Estado para armazenar as categorias */
  const [categories, setCategories] = useState<Category[]>([]);
  
  
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

    /* Define se está editando ou criando */
    const [isEditing, setIsEditing] = useState(false);

/* Função chamada ao enviar formulário */
const handleSubmit = async () => {
  try {
    /* Monta o payload que será enviado para API */
    const payload = {
      ...event,
      category: event.category?.length ? event.category : [],
      vagas: Number(event.vagas),
    };

    /* Verifica se está editando ou criando */
    if (isEditing) {
      /* Garante que existe ID antes de atualizar */
      if (!event.id) {
        alert("Evento sem ID!");
        return;
      }

      /* Atualiza evento existente (usando o payload) */
      await updateEvent(event.id, payload);

      alert("Evento atualizado!");
    } else {
      /* Cria novo evento (usando o payload) */
      await createEvent(payload);

      alert("Evento criado!");
    }
  } catch (error) {
    console.error(error);
    alert("Erro ao salvar evento");
  }
};

return (
    <div>
      <h1>{isEditing ? "Editar Evento" : "Criar Evento"}</h1>

      {/* Título do Evento */}
      <input
        type="text"
        placeholder="Título"
        value={event.title}
        onChange={(e) => setEvent({ ...event, title: e.target.value })}
      />


      {/* Descrição do Evento */}
      <textarea
        placeholder="Descrição"
        value={event.descriptions}
        onChange={(e) => setEvent({ ...event, descriptions: e.target.value })}
      />

      {/* Data e Hora do Evento */}
      <input
        type="datetime-local"
        value={event.date_time}
        onChange={(e) => setEvent({ ...event, date_time: e.target.value })}
      />

      {/* Vagas do Evento */}
      <input
        type="number"
        placeholder="Vagas"
        value={event.vagas}
        onChange={(e) => setEvent({ ...event, vagas: Number(e.target.value) })}
      />

      {/* Local do Evento */}
      <input
        type="text"
        placeholder="Local"
        value={event.local}
        onChange={(e) => setEvent({ ...event, local: e.target.value })}
      />

      {/* Categoria do Evento */}
      <select
      onChange={(e) =>
        setEvent({
          ...event,
          category: [Number(e.target.value)],
        })
        }
        >
  <option value="">Selecione uma categoria</option>

  {categories.map((cat) => (
    <option key={cat.id} value={cat.id}>
      {cat.name}
    </option>
  ))}
</select>

      {/* Botão salvar */}
      <button onClick={handleSubmit}>
        Salvar
      </button>
    </div>
  );
}