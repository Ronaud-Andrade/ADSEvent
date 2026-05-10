import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryAPI, Category } from '../lib/api';

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await categoryAPI.getCategories();
      setCategories(data.results || []);
      setError('');
    } catch (err) {
      console.error('Erro ao carregar categorias:', err);
      setCategories([]);
      setError('Falha ao carregar categorias.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja deletar esta categoria?')) {
      try {
        await categoryAPI.deleteCategory(id);
        loadCategories();
      } catch (err) {
        console.error('Erro ao deletar categoria:', err);
        setError('Falha ao deletar categoria');
      }
    }
  };

  if (loading) return <div>Carregando...</div>;

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

      {error && (
        <div style={{ marginBottom: '1rem', color: '#dc3545', fontWeight: 'bold' }}>
          {error}
        </div>
      )}

      {categories.length === 0 ? (
        <p style={{ color: '#000' }}>Nenhuma categoria encontrada.</p>
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
    </div>
  );
};

export default CategoryList;