/* Importa a instância configurada do axios */
import api from "../lib/api";
/* Importa os tipos TypeScript */
import { Event, PaginatedResponse } from 
"../types/events";

/* Função para listar eventos */
export const getEvents = async (): Promise<Event[]> => {
    try {
    /* Faz requisição GET para /events/ */
    const response = await api.get<PaginatedResponse<Event>>("events/");

    /* Retorna apenas a lista de eventos (results) */
    return response.data.results;
} catch (error) {
    /* Mostra erro no console (debug) */
    console.error("Erro ao buscar eventos:", error);

    /* Repassa o erro para quem chamou a função */
    throw error;
    }
};

/* Função para criar evento*/
export const createEvent = async (data: Event): Promise<Event> => {
    try {
    /* Envia os dados via POST para /events/ */
    const response = await api.post<Event>("events/", data);

    /* Retorna o evento criado */
    return response.data;
} catch (error) {
    /* Log de erro */
    console.error("Erro ao criar evento:", error);

    /* Propaga o erro */
    throw error;
}
};

/* Função para atualizar evento */
export const updateEvent = async (
  id: number,   // ID do evento a ser atualizado
  data: Event   // Novos dados do evento
): Promise<Event> => {
    try {
    /* Faz requisição PUT para /events/{id}/ */
    const response = await api.put<Event>(`events/${id}/`, data);

    /* Retorna o evento atualizado */
    return response.data;
} catch (error) {
    /* Log de erro */
    console.error("Erro ao atualizar evento:", error);

    /* Propaga o erro */
    throw error;
}
};

/* Função para deletar evento */
export const deleteEvent = async (id: number): Promise<void> => {
    try {
    /* Faz requisição DELETE para /events/{id}/ */
    await api.delete(`events/${id}/`);
} catch (error) {
    /* Log de erro */
    console.error("Erro ao deletar evento:", error);

    /* Propaga o erro */
    throw error;
}
};