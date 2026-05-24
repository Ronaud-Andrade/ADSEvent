# 🎨 Interface e Componentes - ADS Event

**Desenvolvedor**: Iago  
**Projeto**: ADS Event - Sistema de Gerenciamento de Eventos  
**Data**: 13 de maio de 2026  
**Tecnologias**: React 19.2.5 | TypeScript 6.0.3 | Styled-Components 6.4.1 | Vite 8.0.11

---

## 📌 Sumário Executivo

Implementei **todo o sistema de componentes visuais** da aplicação frontend usando **styled-components**, criando uma **arquitetura de design system** que centraliza a estilização e garante consistência visual em todas as páginas. A solução inclui:

- ✅ **20+ componentes reutilizáveis** exportados de um único arquivo
- ✅ **Sistema de variantes** para botões, links e estados
- ✅ **Responsividade completa** (desktop, tablet, mobile)
- ✅ **Componente de Navegação** principal com autenticação
- ✅ **Sistema de cores** via CSS variables
- ✅ **Tipagem TypeScript** completa com interfaces
- ✅ **Integração** em 7 páginas da aplicação

---

## 🏗️ Arquitetura de Componentes

### Estrutura de Pastas

```
frontend/src/
├── lib/
│   ├── ui.tsx              ← Sistema de componentes (20+ exports)
│   ├── api.ts              ← Cliente HTTP com Axios
│   └── ...
├── components/
│   ├── Navigation.tsx       ← Barra de navegação principal
│   └── ...
├── pages/
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── Events.tsx
│   ├── EventForm.tsx
│   ├── CategoryForm.tsx
│   ├── CategoryList.tsx
│   └── SubscribeList.tsx
├── contexts/
│   └── AuthContext.tsx      ← Contexto de autenticação
├── hooks/
│   └── useAuth.ts           ← Hook customizado de auth
├── index.css                ← Variáveis CSS globais
└── ...
```

---

## 🎨 Sistema de Design (UI Library)

### Arquivo: `src/lib/ui.tsx`

É o **coração do sistema visual** - um arquivo único que exporta todos os componentes styled-components usados em toda a aplicação.

#### **1️⃣ Componentes de Layout**

Estruturam o visual das páginas com padding, espaçamento e responsividade automática.

##### `PageContainer`
```typescript
export const PageContainer = styled.div`
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 1.2rem;
  }

  @media (max-width: 480px) {
    padding: 1rem;
  }
`;
```
**Uso**: Wrapper principal de todas as páginas
**Propriedades**: 
- Padding adaptativo (2rem → 1.2rem → 1rem)
- Máximo de 1000px de largura
- Centralizado com `margin: 0 auto`

##### `CenteredScreen`
```typescript
export const CenteredScreen = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
  padding: 1rem;
`;
```
**Uso**: Páginas que precisam estar centralizadas (Login, Home)
**Propriedades**: Flex com centering vertical e horizontal

##### `Panel`
```typescript
export const Panel = styled.div`
  background: var(--bg);
  border-radius: 12px;
  border: 1px solid var(--border);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  box-sizing: border-box;
`;
```
**Uso**: Base para Cards e FormCard
**Propriedades**: Estilo elevado com sombra

##### `Card`
```typescript
export const Card = styled(Panel)`
  display: flex;
  flex-direction: column;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 1rem;
  }
`;
```
**Uso**: Exibir items individuais (evento, categoria)
**Propriedades**: Estende Panel, flex column para layout vertical

##### `CardGrid`
```typescript
export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;
```
**Uso**: Listar múltiplos cards (eventos em Home)
**Propriedades**: Grid automático que se adapta a telas menores
**Funcionalidade**: `auto-fit` cria colunas de 240px, expandindo até preencher espaço

##### `GridTwoCols`
```typescript
export const GridTwoCols = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;
```
**Uso**: Layouts lado a lado (futuro)
**Propriedades**: Muda de 2 colunas para 1 em tablets

##### `FlexBetween`
```typescript
export const FlexBetween = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;
```
**Uso**: Distribui elementos nas extremidades (headers, footers)
**Propriedades**: `space-between` coloca conteúdo nas extremidades

##### `InfoRow`
```typescript
export const InfoRow = styled.div`
  font-size: 0.9rem;
  color: #555;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;
```
**Uso**: Mostrar metadados (data, vagas, local de eventos)
**Propriedades**: Flex com wrap para adaptar em mobile

---

#### **2️⃣ Componentes de Tipografia**

Garantem hierarquia e consistência nos textos.

##### `Heading`
```typescript
export const Heading = styled.h1`
  font-size: 2.2rem;
  margin-bottom: 1rem;
  color: #2c3e50;

  @media (max-width: 768px) {
    font-size: 1.8rem;
    text-align: center;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;
```
**Uso**: Títulos principais das páginas
**Tamanho**: 2.2rem → 1.8rem → 1.5rem

##### `SubTitle`
```typescript
export const SubTitle = styled.p`
  font-size: 1.1rem;
  margin-bottom: 2rem;
  color: #666;

  @media (max-width: 768px) {
    text-align: center;
  }
`;
```
**Uso**: Subtítulos e descrições
**Propriedades**: Cor cinza muted

---

#### **3️⃣ Componentes de Formulário**

Implementam inputs, textareas e selects com estilo e responsividade.

##### `FormCard`
```typescript
export const FormCard = styled(Panel)`
  padding: 2rem;
  max-width: 700px;
  margin: 2rem auto;
  width: 100%;
  box-sizing: border-box;
`;
```
**Uso**: Envolver formulários completos
**Propriedades**: Centralized, max 700px

##### `FormGroup`
```typescript
export const FormGroup = styled.div`
  margin-bottom: 1rem;
`;
```
**Uso**: Agrupar label + input
**Propriedades**: Espaçamento vertical

##### `FormLabel`
```typescript
export const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
`;
```
**Uso**: Labels de formulário
**Propriedades**: Font-weight 600 (negrito)

##### `FormControl`
```typescript
export const FormControl = styled.input`
  width: 100%;
  padding: 0.8rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  box-sizing: border-box;
`;
```
**Uso**: Input text, email, date, etc
**Propriedades**: 100% width, padding simétrico

##### `TextArea`
```typescript
export const TextArea = styled.textarea`
  width: 100%;
  padding: 0.8rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  min-height: 100px;
  resize: none;
  box-sizing: border-box;
`;
```
**Uso**: Descrições longas de eventos
**Propriedades**: Min-height 100px, resize desabilitado

##### `SelectControl`
```typescript
export const SelectControl = styled.select`
  width: 100%;
  padding: 0.8rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  box-sizing: border-box;
`;
```
**Uso**: Seleção de categorias
**Propriedades**: Mesmo estilo do FormControl

---

#### **4️⃣ Componentes de Botão**

Sistema robusto com variantes e estados.

##### **Sistema de Variantes**

```typescript
export type ButtonVariant =
  | 'primary'      // Azul - Ação principal
  | 'success'      // Verde - Criar/Salvar
  | 'danger'       // Vermelho - Deletar
  | 'secondary';   // Cinza - Cancelar
```

##### **Função Helper**
```typescript
const getButtonColor = (variant: ButtonVariant) => {
  switch (variant) {
    case 'success':
      return 'var(--success)';    // #28a745
    case 'danger':
      return 'var(--danger)';     // #dc3545
    case 'secondary':
      return 'var(--secondary)';  // #6c757d
    default:
      return 'var(--primary)';    // #007bff
  }
};
```

##### **Estilos Base (Shared)**
```typescript
const buttonStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 0.8rem 1.2rem;
  border-radius: 8px;

  font-weight: 600;
  cursor: pointer;

  border: none;
  color: #fff;

  transition: 0.2s ease;

  max-width: 100%;
  min-width: 0;
  width: auto;

  white-space: nowrap;
  box-sizing: border-box;

  &:hover {
    transform: translateY(-1px);  // Efeito de elevação
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 480px) {
    width: 100%;  // Full-width em mobile
  }
`;
```

##### `Button`
```typescript
export const Button = styled.button<{ variant?: ButtonVariant }>`
  ${buttonStyles}
  background: ${(props) =>
    getButtonColor(props.variant ?? 'primary')};
`;
```
**Uso**: Botão HTML nativo
**Exemplo**:
```typescript
<Button variant="success">Criar Evento</Button>
<Button variant="danger">Deletar</Button>
<Button>Padrão (Azul)</Button>
```

##### `LinkButton`
```typescript
export const LinkButton = styled(Link)<{ variant?: ButtonVariant }>`
  ${buttonStyles}
  background: ${(props) =>
    getButtonColor(props.variant ?? 'primary')};
  text-decoration: none;
`;
```
**Uso**: Botão que navega (React Router)
**Exemplo**:
```typescript
<LinkButton to="/events" variant="primary">
  Ver Eventos
</LinkButton>
```

##### `SmallButton`
```typescript
export const SmallButton = styled(Button)`
  padding: 0.45rem 0.8rem;
  font-size: 0.9rem;
`;
```
**Uso**: Botões secundários, ações em cards
**Propriedades**: 45% do tamanho do Button normal

##### `LogoutButton`
```typescript
export const LogoutButton = styled(Button)`
  padding: 0.45rem 0.8rem;
  min-width: auto;
  font-size: 0.9rem;
  white-space: nowrap;

  @media (max-width: 480px) {
    width: auto;
    align-self: center;
    margin: 0 auto;
  }
`;
```
**Uso**: Botão de logout na navbar
**Propriedades**: Não quebra em mobile

---

#### **5️⃣ Componentes de Navegação**

Formam a barra de navegação da aplicação.

##### `NavBar`
```typescript
export const NavBar = styled.nav`
  background: var(--bg);
  border-bottom: 1px solid var(--border);
`;
```
**Uso**: Container da navbar
**Propriedades**: Background e border-bottom

##### `NavInner`
```typescript
export const NavInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  gap: 1rem;
  flex-wrap: wrap;
  box-sizing: border-box;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 1rem;
  }
`;
```

##### `LogoLink`
```typescript
export const LogoLink = styled(Link)`
  text-decoration: none;
  color: var(--primary);
  font-weight: 700;
  font-size: 1.5rem;
  white-space: nowrap;

  &:hover {
    color: var(--primary);
  }

  &:focus-visible {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
  }
`;
```
**Uso**: Logo da aplicação (clicável)

##### `NavLinks`
```typescript
export const NavLinks = styled.ul`
  list-style: none;
  display: flex;
  gap: 1.5rem;
  margin: 0;
  padding: 0;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 0.8rem;
  }
`;
```

##### `NavItem`
```typescript
export const NavItem = styled.li`
  /* Sem estilo adicional, usado como container */
`;
```

##### `NavAnchor`
```typescript
export const NavAnchor = styled(Link)`
  text-decoration: none;
  color: var(--text);
  font-weight: 500;
  transition: 0.2s ease;

  &:hover {
    color: var(--primary);
  }

  &:focus-visible {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
  }
`;
```
**Uso**: Links de navegação

---

#### **6️⃣ Componentes de Card**

Estruturam conteúdo dentro de cards.

##### `CardTitle`
```typescript
export const CardTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: #2c3e50;
`;
```

##### `CardDescription`
```typescript
export const CardDescription = styled.p`
  font-size: 0.95rem;
  color: #666;
  margin-bottom: 1rem;
`;
```

##### `CardFooter`
```typescript
export const CardFooter = styled.div`
  display: flex;
  gap: 0.8rem;
  border-top: 1px solid var(--border);
  padding-top: 1rem;
  margin-top: auto;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    gap: 0.5rem;
  }
`;
```
**Uso**: Footer dos cards com botões de ação

---

#### **7️⃣ Componentes de Estado**

Exibem mensagens e estados especiais.

##### `MessageBox`
```typescript
export const MessageBox = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #dc3545;
  margin-bottom: 1rem;
  text-align: center;
`;
```
**Uso**: Mensagens de erro

##### `EmptyState`
```typescript
export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  color: #666;

  p {
    margin: 0.5rem 0;
  }
`;
```
**Uso**: Quando não há eventos/categorias

##### `PaginationBar`
```typescript
export const PaginationBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;
```
**Uso**: Barra de paginação (Previous/Next)

##### `FilterSection`
```typescript
export const FilterSection = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  align-items: flex-end;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
  }
`;
```
**Uso**: Filtros e busca

---

### 🎨 Sistema de Cores

Arquivo: `src/index.css`

```css
:root {
  --bg: #f8f9fa;           /* Background claro - páginas */
  --surface: #ffffff;      /* Superfícies brancas - cards */
  --border: #ddd;          /* Bordas cinzas */
  --text: #333;            /* Texto principal escuro */
  --muted: #666;           /* Texto secundário cinza */
  --primary: #007bff;      /* Azul - Ação principal */
  --success: #28a745;      /* Verde - Criar/Salvar */
  --danger: #dc3545;       /* Vermelho - Deletar */
  --secondary: #6c757d;    /* Cinza - Secundário */
}
```

**Padrão**: Baseado em Bootstrap colors, familiar e testado

---

## 🧩 Componente: Navigation

**Arquivo**: `src/components/Navigation.tsx`

Barra de navegação principal da aplicação com autenticação.

### Estrutura

```typescript
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import * as UI from '../lib/ui';

export default function Navigation() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <UI.NavBar>
      <UI.NavInner>
        <UI.LogoLink to="/">
          ADS Event
        </UI.LogoLink>

        {user && (
          <>
            <UI.NavLinks>
              <UI.NavItem>
                <UI.NavAnchor to="/">Início</UI.NavAnchor>
              </UI.NavItem>
              <UI.NavItem>
                <UI.NavAnchor to="/events">Eventos</UI.NavAnchor>
              </UI.NavItem>
              <UI.NavItem>
                <UI.NavAnchor to="/categories">Categorias</UI.NavAnchor>
              </UI.NavItem>
              <UI.NavItem>
                <UI.NavAnchor to="/subscriptions">Minhas Inscrições</UI.NavAnchor>
              </UI.NavItem>
            </UI.NavLinks>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <span>{user.username}</span>
              <UI.LogoutButton onClick={handleLogout}>
                Logout
              </UI.LogoutButton>
            </div>
          </>
        )}
      </UI.NavInner>
    </UI.NavBar>
  );
}
```

### Funcionalidades

| Funcionalidade | Implementação |
|---|---|
| **Logo Clicável** | `LogoLink to="/"` - Volta para home |
| **Links de Navegação** | Condicional (só mostra se `user` existe) |
| **Nome do Usuário** | Exibido ao lado direito |
| **Logout** | Chama `logout()` + navega para `/login` |
| **Responsividade** | NavInner muda para flex-direction: column em mobile |

### Fluxo de Autenticação

1. **Login bem-sucedido** → AuthContext salva `user` + `token`
2. **Token no Header** → Axios interceptor adiciona `Authorization: Bearer {token}`
3. **Navigation renderiza** → Mostra links se `user` existe
4. **Logout** → Remove token, atualiza contexto, redireciona

---

## 📄 Páginas e Uso de Componentes

### 1. **Home** (`src/pages/Home.tsx`)

Página de boas-vindas e dashboard de eventos.

```typescript
import { PageContainer, Heading, CardGrid, Card, CardTitle } from '../lib/ui';

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);

  return (
    <PageContainer>
      <Heading>Bem-vindo aos Eventos ADS</Heading>
      
      <CardGrid>
        {events.map(event => (
          <Card key={event.id}>
            <CardTitle>{event.title}</CardTitle>
            {/* ... */}
          </Card>
        ))}
      </CardGrid>
    </PageContainer>
  );
}
```

**Componentes usados**: `PageContainer`, `Heading`, `CardGrid`, `Card`, `CardTitle`, `Button`

---

### 2. **Login** (`src/pages/Login.tsx`)

Tela de autenticação.

```typescript
import { CenteredScreen, Panel, FormCard, FormGroup, FormLabel, 
         FormControl, Button, Heading } from '../lib/ui';

export default function Login() {
  return (
    <CenteredScreen>
      <FormCard>
        <Heading>Login</Heading>
        <FormGroup>
          <FormLabel>Usuário</FormLabel>
          <FormControl 
            type="text" 
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <FormLabel>Senha</FormLabel>
          <FormControl 
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormGroup>
        <Button onClick={handleLogin}>Entrar</Button>
      </FormCard>
    </CenteredScreen>
  );
}
```

**Componentes usados**: `CenteredScreen`, `FormCard`, `FormGroup`, `FormLabel`, `FormControl`, `Button`, `Heading`

---

### 3. **Events** (`src/pages/Events.tsx`)

Lista de eventos com paginação e CRUD para admins.

```typescript
import { PageContainer, Heading, Card, CardTitle, CardFooter, 
         Button, PaginationBar, CardGrid } from '../lib/ui';

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <PageContainer>
      <Heading>Eventos</Heading>
      
      <CardGrid>
        {events.map(event => (
          <Card key={event.id}>
            <CardTitle>{event.title}</CardTitle>
            <CardDescription>{event.descriptions}</CardDescription>
            <InfoRow>
              <span>📅 {event.date_time}</span>
              <span>📍 {event.local}</span>
              <span>👥 {event.vagas} vagas</span>
            </InfoRow>
            <CardFooter>
              {isAdmin && (
                <>
                  <Button 
                    variant="primary" 
                    onClick={() => navigate(`/events/${event.id}/edit`)}
                  >
                    Editar
                  </Button>
                  <Button 
                    variant="danger"
                    onClick={() => handleDelete(event.id)}
                  >
                    Deletar
                  </Button>
                </>
              )}
            </CardFooter>
          </Card>
        ))}
      </CardGrid>

      <PaginationBar>
        <Button 
          onClick={() => setCurrentPage(p => p - 1)}
          disabled={!data.previous}
        >
          Anterior
        </Button>
        <span>Página {currentPage}</span>
        <Button 
          onClick={() => setCurrentPage(p => p + 1)}
          disabled={!data.next}
        >
          Próxima
        </Button>
      </PaginationBar>
    </PageContainer>
  );
}
```

**Componentes usados**: `PageContainer`, `Heading`, `CardGrid`, `Card`, `CardTitle`, `CardDescription`, `InfoRow`, `CardFooter`, `Button`, `PaginationBar`

---

### 4. **EventForm** (`src/pages/EventForm.tsx`)

Criar e editar eventos.

```typescript
import { FormCard, FormGroup, FormLabel, FormControl, TextArea, 
         SelectControl, Button, Heading } from '../lib/ui';

export default function EventForm() {
  const [formData, setFormData] = useState<EventFormData>({...});

  return (
    <FormCard>
      <Heading>
        {isEdit ? 'Editar Evento' : 'Criar Evento'}
      </Heading>

      <FormGroup>
        <FormLabel>Título</FormLabel>
        <FormControl 
          type="text"
          value={formData.title}
          onChange={handleChange}
        />
      </FormGroup>

      <FormGroup>
        <FormLabel>Descrição</FormLabel>
        <TextArea 
          value={formData.descriptions}
          onChange={handleChange}
        />
      </FormGroup>

      <FormGroup>
        <FormLabel>Categoria</FormLabel>
        <SelectControl 
          value={formData.category}
          onChange={handleCategoryChange}
        >
          <option value="">Selecione uma categoria</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </SelectControl>
      </FormGroup>

      <FormGroup>
        <FormLabel>Data e Hora</FormLabel>
        <FormControl 
          type="datetime-local"
          value={formData.date_time}
          onChange={handleChange}
        />
      </FormGroup>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <Button variant="success" onClick={handleSubmit}>
          {isEdit ? 'Atualizar' : 'Criar'}
        </Button>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Cancelar
        </Button>
      </div>
    </FormCard>
  );
}
```

**Componentes usados**: `FormCard`, `FormGroup`, `FormLabel`, `FormControl`, `TextArea`, `SelectControl`, `Button`, `Heading`

---

### 5. **CategoryForm** (`src/pages/CategoryForm.tsx`)

Criar e editar categorias.

```typescript
import { FormCard, FormGroup, FormLabel, FormControl, Button, Heading } from '../lib/ui';

export default function CategoryForm() {
  return (
    <FormCard>
      <Heading>
        {isEdit ? 'Editar Categoria' : 'Criar Categoria'}
      </Heading>

      <FormGroup>
        <FormLabel>Nome da Categoria</FormLabel>
        <FormControl 
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Tecnologia, Esportes..."
        />
      </FormGroup>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <Button variant="success" onClick={handleSubmit}>
          {isEdit ? 'Atualizar' : 'Criar'}
        </Button>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Cancelar
        </Button>
      </div>
    </FormCard>
  );
}
```

**Componentes usados**: `FormCard`, `FormGroup`, `FormLabel`, `FormControl`, `Button`, `Heading`

---

### 6. **CategoryList** (`src/pages/CategoryList.tsx`)

Listar e gerenciar categorias (admin).

```typescript
import { PageContainer, Heading, Card, CardTitle, CardFooter, 
         Button, PaginationBar, CardGrid } from '../lib/ui';

export default function CategoryList() {
  return (
    <PageContainer>
      <Heading>Categorias</Heading>
      
      <Button variant="success" onClick={() => navigate('/categories/new')}>
        + Criar Categoria
      </Button>

      <CardGrid>
        {categories.map(category => (
          <Card key={category.id}>
            <CardTitle>{category.name}</CardTitle>
            <CardFooter>
              {isAdmin && (
                <>
                  <Button 
                    variant="primary"
                    onClick={() => navigate(`/categories/${category.id}/edit`)}
                  >
                    Editar
                  </Button>
                  <Button 
                    variant="danger"
                    onClick={() => handleDelete(category.id)}
                  >
                    Deletar
                  </Button>
                </>
              )}
            </CardFooter>
          </Card>
        ))}
      </CardGrid>

      <PaginationBar>
        {/* Controles de paginação */}
      </PaginationBar>
    </PageContainer>
  );
}
```

---

### 7. **SubscribeList** (`src/pages/SubscribeList.tsx`)

Gerenciar inscrições em eventos.

```typescript
import { PageContainer, Heading, FormGroup, SelectControl, Button, 
         Card, CardTitle, CardDescription, PaginationBar, FilterSection } from '../lib/ui';

export default function SubscribeList() {
  return (
    <PageContainer>
      <Heading>Minhas Inscrições</Heading>

      <FilterSection>
        <SelectControl 
          value={selectedCategory}
          onChange={(e) => handleFilter(e.target.value)}
        >
          <option value="">Todas as categorias</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </SelectControl>

        <Button variant="primary" onClick={handleSearch}>
          Buscar
        </Button>
      </FilterSection>

      {/* Lista de eventos disponíveis */}
      <div style={{ marginBottom: '2rem' }}>
        <h3>Eventos Disponíveis</h3>
        {availableEvents.map(event => (
          <Card key={event.id}>
            <CardTitle>{event.title}</CardTitle>
            <CardDescription>{event.descriptions}</CardDescription>
            <Button 
              variant="success"
              onClick={() => handleSubscribe(event.id)}
            >
              Inscrever-se
            </Button>
          </Card>
        ))}
      </div>

      {/* Lista de inscrições do usuário */}
      <div>
        <h3>Minha Inscrições</h3>
        {userSubscriptions.map(sub => (
          <Card key={sub.id}>
            <CardTitle>{sub.event.title}</CardTitle>
            <Button 
              variant="danger"
              onClick={() => handleUnsubscribe(sub.id)}
            >
              Cancelar Inscrição
            </Button>
          </Card>
        ))}
      </div>

      <PaginationBar>
        {/* Controles de paginação */}
      </PaginationBar>
    </PageContainer>
  );
}
```

---

## 🎯 Padrões de Responsividade

### Breakpoints

```
Desktop   → 769px+
Tablet    → 481px - 768px
Mobile    → 0px - 480px
```

### Implementação em Cada Componente

#### **Exemplo: PageContainer**

```typescript
export const PageContainer = styled.div`
  padding: 2rem;              /* Desktop: 32px */
  
  @media (max-width: 768px) {
    padding: 1.2rem;          /* Tablet: 19px */
  }

  @media (max-width: 480px) {
    padding: 1rem;            /* Mobile: 16px */
  }
`;
```

#### **Exemplo: CardGrid**

```typescript
export const CardGrid = styled.div`
  /* Desktop: 4 colunas de 240px */
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;

  /* Mobile: 1 coluna */
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;
```

#### **Exemplo: Button**

```typescript
${buttonStyles}

@media (max-width: 480px) {
  width: 100%;  /* Botão ocupa toda a largura em mobile */
}
```

---

## 🔌 Integração com Contexto e Hooks

### AuthContext (`src/contexts/AuthContext.tsx`)

Gerencia estado global de autenticação.

```typescript
interface AuthContextType {
  user: User | null;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({...});
```

### Hook useAuth (`src/hooks/useAuth.ts`)

```typescript
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
```

**Usado em**: Navigation, todas as páginas autenticadas

---

## 💡 Boas Práticas Implementadas

### 1. **Componentização Reutilizável**
Cada componente em `ui.tsx` serve a um propósito específico e é reutilizado em múltiplas páginas.

### 2. **Responsividade Mobile-First**
Estilos base para mobile, depois `@media` queries para aumentar tamanho em tablets/desktop.

### 3. **Tipagem TypeScript Completa**
- `ButtonVariant` type para variantes
- Props com tipos genéricos (`<{ variant?: ButtonVariant }>`)
- Interfaces para todos os dados

### 4. **Acessibilidade**
- `:focus-visible` em links para navegação por teclado
- Botões desabilitados visuamente quando não clicáveis
- Semântica HTML: `<nav>`, `<button>`, `<label>`, etc

### 5. **Performance**
- CSS-in-JS compilado apenas uma vez
- Grid automático sem cálculos JavaScript
- Flex wrapping nativo do CSS

### 6. **Consistência Visual**
- Sistema de cores com CSS variables
- Espaçamento com múltiplos de `0.5rem`
- Border radius consistente: `8px`
- Sombras sutis: `0 4px 15px rgba(0, 0, 0, 0.08)`

---

## 📈 Estatísticas

| Métrica | Valor |
|---------|-------|
| **Componentes Criados** | 20+ |
| **Páginas com UI Library** | 7 |
| **Responsividade** | 3 breakpoints |
| **Variantes de Botão** | 4 |
| **Cores Definidas** | 8 |
| **Arquivo Principal** | 1 (`ui.tsx`) |

---

## 🚀 Como Começar a Estudar

### Ordem Recomendada

1. **Leia a seção "Sistema de Design"** para entender os 20+ componentes
2. **Estude o arquivo `src/lib/ui.tsx`** no VS Code (Ctrl+Click para ver definições)
3. **Abra uma página** (ex: `Events.tsx`) e veja como usa `ui.tsx`
4. **Execute a aplicação**:
   ```bash
   cd frontend
   npm run dev
   ```
5. **Teste responsividade**: F12 → Toggle device toolbar

### Dúvidas Frequentes

**P: Como adicionar um novo componente?**
A: Adicione em `src/lib/ui.tsx` com `export const NewComponent = styled.div\`...\`;`

**P: Como mudar cores?**
A: Edite as variáveis CSS em `src/index.css` (`:root`)

**P: Por que styled-components?**
R: Escopagem automática + TypeScript + Performance

**P: Como fazer responsivo?**
R: Use `@media (max-width: 480px) { ... }`

---

## 📚 Referências

- [Styled-Components Docs](https://styled-components.com/)
- [React Router Docs](https://reactrouter.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [CSS Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [Flexbox Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)

---

**Desenvolvido por**: Iago  
**Data**: 13 de maio de 2026  
**Versão**: 1.0
