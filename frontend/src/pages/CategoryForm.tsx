import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { categoryAPI } from '../lib/api';
import {
  PageContainer,
  FormCard,
  FormGroup,
  FormLabel,
  FormControl,
  Button,
  ButtonRow,
  MessageBox,
  Heading
} from '../lib/ui';

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
    <PageContainer>
      <FormCard>
        <Heading>
          {isEditing ? 'Editar Categoria' : 'Criar Nova Categoria'}
        </Heading>

        {error && <MessageBox>{error}</MessageBox>}

        <form onSubmit={handleSubmit}>
          <FormGroup>
            <FormLabel htmlFor="name">Nome:</FormLabel>
            <FormControl
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <ButtonRow>
            <Button type="submit" variant="success" disabled={loading}>
              {loading
                ? 'Salvando...'
                : isEditing
                ? 'Atualizar Categoria'
                : 'Criar Categoria'}
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/categories')}
            >
              Cancelar
            </Button>
          </ButtonRow>
        </form>
      </FormCard>
    </PageContainer>
  );
};

export default CategoryForm;