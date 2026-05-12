// CategoryList.tsx

import React, {
  useState,
  useEffect
} from 'react';

import { useAuth } from '../hooks/useAuth';

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
  Button
} from '../lib/ui';

const CategoryList: React.FC = () => {
  const { user } = useAuth();
  
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

  const loadCategories = async (
    pageNumber: number = 1
  ) => {
    setLoading(true);

    try {
      const data =
        await categoryAPI.getCategories(
          pageNumber
        );

      setCategories(data.results || []);
      setNext(data.next);
      setPrevious(data.previous);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories(page);
  }, [page]);

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

      loadCategories(page);
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

        {user?.is_admin && (
          <LinkButton
            to="/categories/new"
            variant="success"
          >
            + Nova Categoria
          </LinkButton>
        )}
      </FlexBetween>

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
              {user?.is_admin && (
                <>
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
                </>
              )}
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