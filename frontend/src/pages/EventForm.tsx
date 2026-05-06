/* Importa o useState do React */
import { useState, useEffect } from "react";
/* Importa useParams do React Router */
import { useParams } from 'react-router-dom';
/* Importa funções da API */
import { createEvent, updateEvent, getEvent } from "../services/eventsService";
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
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { categoryAPI, eventsAPI, Category } from '../lib/api';

const EventForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    descriptions: '',
    date_time: '',
    local: '',
    vagas: 30,
    category: [] as string[],
  });

  /* Estado para armazenar as categorias */
  const [categories, setCategories] = useState<Category[]>([]);
  
  /* Pega o ID da URL (para edição) */
  const { id } = useParams<{ id: string }>();

  /* Define se está editando ou criando */
  const [isEditing, setIsEditing] = useState(false);

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
    if (id) {
        setIsEditing(true);
        loadEvent();
    }
}, [id]);

/* Função para carregar evento (para edição) */
const loadEvent = async () => {
    try {
        const data = await getEvent(Number(id));
        setEvent(data);
    } catch (error) {
        alert("Erro ao carregar evento");
    }
};

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