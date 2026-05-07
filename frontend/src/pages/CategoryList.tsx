import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryAPI, Category } from '../lib/api';

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [next, setNext] = useState<string | null>(null);
  const [previous, setPrevious] = useState<string | null>(null);

  const loadCategories = async (pageNumber: number) => {
    setLoading(true);
    try {
      const data = await categoryAPI.getCategories(pageNumber);
      setCategories(data.results || []);
      setCount(data.count);
      setNext(data.next);
      setPrevious(data.previous);
      setError('Falha ao carregar categorias');
    } catch (err) {
      console.error('Erro ao carregar categorias:', err);
      setError('Falha ao carregar categorias');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      await loadCategories(page);
    };
    load();
  }, [page]);

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja deletar esta categoria?')) {
      try {
        await categoryAPI.deleteCategory(id);
        loadCategories(page); // Reload the current page after deletion
      } catch (err) {
        console.error('Erro ao deletar categoria:', err);
        setError('Falha ao deletar categoria');
      }
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1>Categorias</h1>
        <Link
          to="/categories/new"
          style={{
            padding: '0.75rem 1rem',
            backgroundColor: '#28a745',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '6px',
            fontWeight: 'bold'
          }}
        >
          Criar Nova Categoria
        </Link>
      </div>

      {categories.length === 0 ? (
        <p>Nenhuma categoria encontrada.</p>
      ) : (
        <div>
          {categories.map(category => (
            <div key={category.id} style={{ border: '1px solid #ddd', padding: '1rem', marginBottom: '1rem', borderRadius: '8px' }}>
              <h3>{category.name}</h3>
              <div style={{ marginTop: '1rem' }}>
                <Link
                  to={`/categories/${category.id}/edit`}
                  style={{ marginRight: '1rem', padding: '0.25rem 0.5rem', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '4px' }}
                >
                  Editar
                </Link>
                <button
                  onClick={() => handleDelete(category.id)}
                  style={{ padding: '0.25rem 0.5rem', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}
                >
                  Deletar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
        <button
          type="button"
          onClick={() => setPage(page - 1)}
          disabled={!previous}
          style={{ padding: '0.5rem 1rem', backgroundColor: previous ? '#007bff' : '#ccc', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Anterior
        </button>
        <div>Página {page} de {Math.max(1, count)}</div>
        <button
          type="button"
          onClick={() => setPage(page + 1)}
          disabled={!next}
          style={{ padding: '0.5rem 1rem', backgroundColor: next ? '#007bff' : '#ccc', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Próximo
        </button>
      </div>
    </div>
  );
};

export default CategoryList;