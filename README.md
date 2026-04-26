# ADSEvent

Sistema de gerenciamento de eventos desenvolvido com Django, incluindo uma API REST para integração.

## Descrição

O ADSEvent é uma aplicação web para gerenciamento de eventos, categorias e inscrições. Inclui interface administrativa, templates responsivos e uma API REST documentada com Swagger/OpenAPI.

## Funcionalidades

- Gerenciamento de eventos
- Categorias de eventos
- Sistema de inscrições
- Interface administrativa do Django
- API REST com documentação automática
- Suporte a múltiplos idiomas (Português e Inglês)
- Logging estruturado

## Tecnologias Utilizadas

- **Backend**: Django 5.2.7
- **Banco de Dados**: PostgreSQL
- **API**: Django Rest Framework (DRF)
- **Documentação da API**: DRF Spectacular
- **Configuração de Ambiente**: django-environ
- **Outros**: psycopg2-binary, PyYAML, etc.

## Pré-requisitos

- Python 3.8+
- PostgreSQL
- Git

## Instalação

1. **Clone o repositório:**
   ```bash
   git clone <url-do-repositorio>
   cd ADSEvent
   ```

2. **Crie um ambiente virtual:**
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # No Windows: .venv\Scripts\activate
   ```

3. **Instale as dependências:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure o ambiente:**
   - Copie o arquivo `.env` e ajuste as variáveis:
     ```bash
     cp .env .env.local
     ```
   - Edite `.env.local` com suas configurações locais (banco de dados, SECRET_KEY, etc.)

5. **Configure o banco de dados:**
   - Crie um banco de dados PostgreSQL
   - Atualize as variáveis `DB_*` no `.env`

6. **Execute as migrações:**
   ```bash
   python manage.py migrate
   ```

7. **Crie um superusuário (opcional):**
   ```bash
   python manage.py createsuperuser
   ```

## Execução

Para executar o servidor de desenvolvimento:

```bash
python manage.py runserver
```

Acesse:
- **Aplicação**: http://localhost:8000
- **Admin**: http://localhost:8000/admin
- **Documentação da API**: http://localhost:8000/api/schema/swagger-ui/

## Estrutura do Projeto

```
ADSEvent/
├── ADSEvent/          # Configurações principais do Django
├── core/              # Aplicação principal
│   ├── api/           # API REST
│   ├── migrations/    # Migrações do banco
│   ├── static/        # Arquivos estáticos
│   └── templates/     # Templates HTML
├── logs/              # Arquivos de log
├── db.sqlite3         # Banco de dados (desenvolvimento)
├── manage.py          # Script de gerenciamento Django
├── requirements.txt   # Dependências Python
└── .env               # Variáveis de ambiente
```

## API

A API REST está localizada em `/api/v1/` e inclui endpoints para:
- Eventos
- Categorias
- Inscrições

Documentação completa disponível via Swagger UI em `/api/schema/swagger-ui/`.

## Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## Contato

Para dúvidas ou sugestões, entre em contato com a equipe de desenvolvimento.
