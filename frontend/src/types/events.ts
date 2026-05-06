/* Interface que define o formato de uma categoria */
export interface Category {
  id: number;       // ID único da categoria
  name: string;     // Nome da categoria
}

/* Interface que define o formato de um evento */
export interface Event {
  id?: number;          // ID opcional (não existe ao criar)
  title: string;        // Título do evento
  descriptions: string; // Descrição do evento
  date_time: string;    // Data e hora (formato ISO)
  vagas: number;        // Quantidade de vagas
  local: string;        // Local do evento
  category: number[];   // Lista de IDs de categorias
}

/* Interface genérica para respostas paginadas do Django REST */
export interface PaginatedResponse<T> {
  count: number;           // Total de itens
  next: string | null;     // URL da próxima página
  previous: string | null; // URL da página anterior
  results: T[];            // Lista de dados (eventos, categorias, etc)
}