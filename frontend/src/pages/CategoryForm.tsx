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
    <div
      style={{
        padding: '2rem',
        maxWidth: '600px',
        margin: '2rem auto',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #ddd',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
      }}
    >
      <h1
        style={{
          marginBottom: '1.5rem',
          textAlign: 'center',
          color: '#333'
        }}
      >
        {isEditing ? 'Editar Categoria' : 'Criar Nova Categoria'}
      </h1>

      {error && (
        <div
          style={{
            marginBottom: '1rem',
            color: '#dc3545',
            fontWeight: 'bold',
            textAlign: 'center'
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label
            htmlFor="name"
            className="form-label"
          >
            Nome:
          </label>

          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center'
          }}
        >
          <button
            type="submit"
            disabled={loading}
            className="btn btn-success"
            style={{
              flex: 1,
              maxWidth: '200px'
            }}
          >
            {loading
              ? 'Salvando...'
              : isEditing
              ? 'Atualizar Categoria'
              : 'Criar Categoria'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/categories')}
            className="btn btn-secondary"
            style={{
              flex: 1,
              maxWidth: '200px'
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