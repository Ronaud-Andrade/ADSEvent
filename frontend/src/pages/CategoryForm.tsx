import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { categoryAPI } from '../lib/api';

const CategoryForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    name: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadCategory = async (categoryId: number) => {
    try {
      const category = await categoryAPI.getCategory(categoryId);
      setFormData({
        name: category.name
      });
    } catch (err) {
      console.error('Erro ao carregar categoria:', err);
      setError('Falha ao carregar categoria');
    }
  };

  useEffect(() => {
    const load = async () => {
      if (isEditing && id) {
        await loadCategory(Number(id));
      }
    };
    load();
  }, [id, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEditing && id) {
        await categoryAPI.updateCategory(Number(id), formData);
      } else {
        await categoryAPI.createCategory(formData);
      }
      navigate('/categories');
    } catch (err) {
      console.error('Erro ao salvar categoria:', err);
      setError('Falha ao salvar categoria');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>{isEditing ? 'Editar Categoria' : 'Criar Nova Categoria'}</h1>

      {error && (
        <div style={{ marginBottom: '1rem', color: '#dc3545', fontWeight: 'bold' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Nome:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '1rem'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Salvando...' : (isEditing ? 'Atualizar Categoria' : 'Criar Categoria')}
          </button>

          <button
            type="button"
            onClick={() => navigate('/categories')}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;