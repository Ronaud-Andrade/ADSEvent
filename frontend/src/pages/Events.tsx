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
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1>Eventos</h1>
        <Link
          to="/events/new"
          style={{
            padding: '0.75rem 1rem',
            backgroundColor: '#28a745',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '6px',
            fontWeight: 'bold'
          }}
        >
          Criar Novo Evento
        </Link>
      </div>

      {events.length === 0 ? (
        <p>Nenhum evento encontrado.</p>
      ) : (
        <div>
          {events.map((event) => (
            <div key={event.id} style={{ border: '1px solid #ddd', padding: '1rem', marginBottom: '1rem', borderRadius: '8px' }}>
              <h3>{event.title}</h3>
              <p style={{ marginBottom: '0.5rem' }}>{event.descriptions}</p>
              <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
                📅 {new Date(event.date_time).toLocaleString('pt-BR')} | 📍 {event.local} | 👥 {event.vagas} vagas
              </p>
              <div style={{ marginTop: '1rem' }}>
                <Link
                  to={`/events/${event.id}/edit`}
                  style={{ marginRight: '1rem', padding: '0.25rem 0.5rem', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '4px' }}
                >
                  Editar
                </Link>
                <button
                  onClick={() => handleDelete(event.id!)}
                  style={{ padding: '0.25rem 0.5rem', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}
                >
                  Deletar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}