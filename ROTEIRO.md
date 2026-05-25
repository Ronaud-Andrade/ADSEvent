# Relatório de Padrões de Projeto

## Introdução
Este documento descreve a aplicação de três padrões de projeto no frontend do projeto `ADSEvent`:
- `Singleton` (padrão criacional)
- `Facade` (padrão estrutural)
- `Strategy` (padrão comportamental)

O objetivo foi melhorar organização, reutilização e separação de responsabilidades no consumo da API e no comportamento de filtro de eventos.

---

## 1. Singleton

### Problema
Antes da refatoração, a configuração do cliente HTTP `axios` podia ficar dispersa e componentes poderiam acabar criando ou usando instâncias independentes de cliente.
Isso resulta em configurações inconsistentes de `baseURL`, headers e interceptors, além de dificultar a manutenção.

### Solução
Foi criado o arquivo `frontend/src/lib/ApiClient.ts` com a classe `ApiClient`.
Ela garante que toda a aplicação use apenas uma instância única de cliente HTTP, centralizando a configuração.

### Código antes
```ts
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1/",
});
```

### Código depois
```ts
export class ApiClient {
  private static instance: ApiClient | null = null;
  public readonly axios: AxiosInstance;

  private constructor() {
    this.axios = axios.create({
      baseURL: "http://127.0.0.1:8000/api/v1/",
    });

    this.axios.interceptors.request.use((config) => {
      const token = localStorage.getItem("access_token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  public static getInstance(): ApiClient {
    if (ApiClient.instance === null) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }
}
```

### Vantagens
- Configuração única e consistente de `axios`.
- Interceptors definidos em um só lugar.
- Reduz duplicação e divergência entre requisições HTTP.

### Desvantagens
- Introduz dependência global compartilhada.
- Pode dificultar testes se a instância não for injetada ou substituída.

---

## 2. Facade

### Problema
O código do frontend podia passar a lidar diretamente com detalhes de requisição `axios`, URLs, parâmetros e tipos de retorno.
Isso aumentava o acoplamento entre componentes e as camadas de transporte HTTP.

### Solução
Foi criado `frontend/src/lib/api.ts` como uma fachada que expõe interfaces de alto nível para cada área da API.
Componentes passam a chamar `authAPI`, `categoryAPI`, `eventsAPI` e `subscribeAPI` sem conhecer detalhes de implementação.

### Código antes
```ts
const response = await axios.get<PaginatedResponse<Event>>("http://127.0.0.1:8000/api/v1/events/", { params: { page } });
```

### Código depois
```ts
const api = ApiClient.getInstance().axios;

export const eventsAPI = {
  getEvents: async (page: number = 1, search: string = ''): Promise<PaginatedResponse<Event>> => {
    const response = await api.get<PaginatedResponse<Event>>("events/", {
      params: { page, search: search || undefined },
    });
    return response.data;
  },
  // ... outros métodos
};
```

### Vantagens
- Interface de uso simples e coesa para o frontend.
- Isola a lógica de requisição HTTP.
- Facilita mudanças futuras na camada de transporte.

### Desvantagens
- Pode adicionar uma camada extra de abstração nos casos mais simples.
- Se crescer demais, a fachada pode ficar complicada de manter.

---

## 3. Strategy

### Problema
A busca de eventos disponível em `SubscribeList.tsx` estava fixa em um único critério, tornando difícil alternar entre tipos de filtro e expandir a lógica de pesquisa.

### Solução
Foi criado `frontend/src/lib/filterStrategies.ts` com a interface `EventFilterStrategy` e implementações concretas para cada critério:
- `TitleFilterStrategy`
- `LocationFilterStrategy`
- `CategoryFilterStrategy`

O componente `SubscribeList.tsx` escolhe a estratégia em tempo de execução com base no estado `filterType`.

### Código antes
```ts
useEffect(() => {
  const filtered = availableEvents.filter((event) =>
    event.title
      .toLowerCase()
      .includes(
        searchQuery.toLowerCase()
      )
  );

  setFilteredEvents(filtered);
}, [searchQuery, availableEvents]);
```

### Código depois
```ts
const strategy = eventFilterStrategies[filterType];
const filtered = availableEvents.filter((event) =>
  strategy.matches(event, searchQuery)
);
```

### Vantagens
- Comportamento de filtro intercambiável.
- Nova lógica de filtro pode ser adicionada sem alterar o componente principal.
- Separa claramente cada critério de busca.

### Desvantagens
- Introduz novas classes e abstração.
- Pode ser um exagero para filtros muito simples.

---

## Conclusão
Foram aplicados três padrões no frontend:
- `Singleton` para o cliente HTTP compartilhado em `frontend/src/lib/ApiClient.ts`
- `Facade` para expor APIs de alto nível em `frontend/src/lib/api.ts`
- `Strategy` para alternar dinamicamente a forma de filtrar eventos em `frontend/src/lib/filterStrategies.ts` e `frontend/src/pages/SubscribeList.tsx`
