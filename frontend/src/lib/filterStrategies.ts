import { Event } from "../types/events";

// Strategy: permite trocar dinamicamente a forma de filtrar eventos
// sem alterar a lógica de renderização do componente.
export type EventFilterType =
  | "title"
  | "location"
  | "category";

export interface EventFilterStrategy {
  matches(event: Event, query: string): boolean;
}

class TitleFilterStrategy implements EventFilterStrategy {
  matches(event: Event, query: string): boolean {
    return event.title
      .toLowerCase()
      .includes(query.toLowerCase());
  }
}

class LocationFilterStrategy implements EventFilterStrategy {
  matches(event: Event, query: string): boolean {
    return event.local
      .toLowerCase()
      .includes(query.toLowerCase());
  }
}

class CategoryFilterStrategy implements EventFilterStrategy {
  matches(event: Event, query: string): boolean {
    return (
      event.category?.some((category) =>
        category.name
          .toLowerCase()
          .includes(query.toLowerCase())
      ) ?? false
    );
  }
}

// Registro de estratégias concretas, usado para selecionar o comportamento
// de filtro em tempo de execução pela chave `filterType`.
export const eventFilterStrategies: Record<
  EventFilterType,
  EventFilterStrategy
> = {
  title: new TitleFilterStrategy(),
  location: new LocationFilterStrategy(),
  category: new CategoryFilterStrategy(),
};
