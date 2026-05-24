// CategoryList.tsx

import React, {
  useState,
  useEffect
} from 'react';

import { categoryAPI, Category } from '../lib/api';

import {
  PageContainer,
  FlexBetween,
  Card,
  CardFooter,
  Heading,
  EmptyState,
  LinkButton,
  SmallButton,
  PaginationBar,
  Button,
  FilterSection,
  FormGroup,
  FormControl
} from '../lib/ui';

const CategoryList: React.FC = () => {
  const [categories, setCategories] =
    useState<Category[]>([]);

  const [, setLoading] =
    useState(true);

  const [page, setPage] =
    useState(1);

  const [next, setNext] =
    useState<string | null>(null);

  const [previous, setPrevious] =
    useState<string | null>(null);

  const [searchQuery, setSearchQuery] =
    useState('');

  const loadCategories = async (
    pageNumber: number = 1,
    search: string = ''
  ) => {
    setLoading(true);

    try {
      const data =
        await categoryAPI.getCategories(
          pageNumber,
          search
        );

      setCategories(data.results || []);
      setNext(data.next);
      setPrevious(data.previous);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories(page, searchQuery);
  }, [page, searchQuery]);

  const handleDelete = async (
    id: number
  ) => {
    if (
      window.confirm(
        'Excluir esta categoria?'
      )
    ) {
      await categoryAPI.deleteCategory(
        id
      );

      loadCategories(page, searchQuery);
    }
  };

  return (
    <PageContainer>
      <FlexBetween
        style={{
          marginBottom: '2rem',
        }}
      >
        <Heading
          style={{
            margin: 0,
          }}
        >
          Categorias
        </Heading>

        <LinkButton
          to="/categories/new"
          variant="success"
        >
          + Nova Categoria
        </LinkButton>
      </FlexBetween>

      <FilterSection>
        <FormGroup
          style={{
            flex: 1,
            marginBottom: 0,
          }}
        >
          <FormControl
            type="text"
            placeholder="Buscar categorias..."
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(e.target.value)
            }
          />
        </FormGroup>
      </FilterSection>

      {categories.length === 0 ? (
        <EmptyState>
          Nenhuma categoria
          encontrada.
        </EmptyState>
      ) : (
        categories.map((cat) => (
          <Card
            key={cat.id}
            style={{
              marginBottom: '1rem',
            }}
          >
            <Heading
              style={{
                fontSize: '1.2rem',
                marginBottom: '1rem',
              }}
            >
              {cat.name}
            </Heading>

            <CardFooter>
              <SmallButton
                variant="primary"
                onClick={() =>
                  window.location.assign(
                    `/categories/${cat.id}/edit`
                  )
                }
              >
                Editar
              </SmallButton>

              <SmallButton
                variant="danger"
                onClick={() =>
                  handleDelete(cat.id)
                }
              >
                Excluir
              </SmallButton>
            </CardFooter>
          </Card>
        ))
      )}

      <PaginationBar>
        <Button
          type="button"
          variant="primary"
          onClick={() =>
            setPage(page - 1)
          }
          disabled={!previous}
        >
          Anterior
        </Button>

        <div
          style={{
            fontWeight: 'bold',
            color: '#555',
          }}
        >
          Página {page}
        </div>

        <Button
          type="button"
          variant="primary"
          onClick={() =>
            setPage(page + 1)
          }
          disabled={!next}
        >
          Próximo
        </Button>
      </PaginationBar>
    </PageContainer>
  );
};

export default CategoryList;