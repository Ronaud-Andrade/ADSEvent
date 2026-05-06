/* Importa hooks do React */
import { useEffect, useState } from "react";
/* Importa Link do React Router */
import { Link } from 'react-router-dom';
/* Importa funções do serviço */
import { getEvents, deleteEvent } from "../services/eventsService";
/* Importa tipo Event */
import { Event } from "../types/events";

/* Componente principal da página */
export default function Events() {
  /* Estado para armazenar os eventos */
  const [events, setEvents] = useState<Event[]>([]);

  /* Estado de carregamento */
  const [loading, setLoading] = useState(true);

  /* Função para carregar eventos da API */
  const loadEvents = async () => {
    try {
      /* Chama a API */
      const data = await getEvents();

      /* Atualiza o estado com os dados */
      setEvents(data);
    } catch (error) {
      /* Mostra erro para o usuário */
      alert("Erro ao carregar eventos");
    } finally {
      /* Finaliza o loading */
      setLoading(false);
    }
  };

  /* Função para deletar evento */
  const handleDelete = async (id: number) => {
    /* Confirmação antes de excluir */
    if (!confirm("Tem certeza?")) return;

    try {
      /* Chama a API para deletar */
      await deleteEvent(id);

      /* Recarrega lista */
      loadEvents();
    } catch {
      /* Erro ao deletar */
      alert("Erro ao deletar evento");
    }
  };

  /* Executa quando o componente é montado */
  useEffect(() => {
    loadEvents();
  }, []);

  /* Enquanto carrega, mostra mensagem */
  if (loading) return <p>Carregando...</p>;

  /* Renderização da tela */
  return (
    <div>
      <h1>Eventos</h1>

      {/* Link para criar novo evento */}
      <Link to="/events/new">Criar Novo Evento</Link>

      {/* Percorre a lista de eventos */}
      {events.map((event) => (
        <div key={event.id}>
          <h3>{event.title}</h3>
          <p>{event.descriptions}</p>

          {/* Botão de editar */}
          <Link to={`/events/${event.id}/edit`}>Editar</Link>

          {/* Botão de deletar */}
          <button onClick={() => handleDelete(event.id!)}>
            Deletar
          </button>
        </div>
      ))}
    </div>
  );
}