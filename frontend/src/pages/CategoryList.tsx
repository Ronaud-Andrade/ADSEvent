import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryAPI, Category } from '../lib/api';

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [next, setNext] = useState<string | null>(null);
  const [previous, setPrevious] = useState<string | null>(null);

  const loadCategories = async (pageNumber: number = 1) => {
    setLoading(true);
    try {
      const data = await categoryAPI.getCategories(pageNumber);
      setCategories(data.results || []);
      setNext(data.next);
      setPrevious(data.previous);
    } finally { setLoading(false); }
  };

  useEffect(() => { loadCategories(page); }, [page]);

  const handleDelete = async (id: number) => {
    if (window.confirm('Excluir esta categoria?')) {
      await categoryAPI.deleteCategory(id);
      loadCategories(page);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: '#333' }}>Categorias</h1>
        <Link to="/categories/new" style={{ padding: '0.8rem 1.2rem', backgroundColor: '#28a745', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold' }}>+ Nova Categoria</Link>
      </div>

      {categories.map(cat => (
        <div key={cat.id} style={{ backgroundColor: '#fff', border: '1px solid #eee', padding: '1.2rem', borderRadius: '10px', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.03)' }}>
          <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>{cat.name}</span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link to={`/categories/${cat.id}/edit`} style={{ padding: '0.4rem 0.8rem', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '6px', fontSize: '0.9rem' }}>Editar</Link>
            <button onClick={() => handleDelete(cat.id)} style={{ padding: '0.4rem 0.8rem', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' }}>Excluir</button>
          </div>
        </div>
      ))}

      {/* Paginação */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', padding: '1rem', backgroundColor: '#fff', borderRadius: '10px', border: '1px solid #eee' }}>
        <button
          type="button"
          onClick={() => setPage(page - 1)}
          disabled={!previous}
          style={{ padding: '0.6rem 1.2rem', backgroundColor: previous ? '#007bff' : '#ccc', color: 'white', border: 'none', borderRadius: '6px', cursor: previous ? 'pointer' : 'not-allowed' }}
        >
          Anterior
        </button>
        <div style={{ fontWeight: 'bold', color: '#555' }}>Página {page}</div>
        <button
          type="button"
          onClick={() => setPage(page + 1)}
          disabled={!next}
          style={{ padding: '0.6rem 1.2rem', backgroundColor: next ? '#007bff' : '#ccc', color: 'white', border: 'none', borderRadius: '6px', cursor: next ? 'pointer' : 'not-allowed' }}
        >
          Próximo
        </button>
      </div>
    </div>
  );
};

export default CategoryList;