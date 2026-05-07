import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { subscribeAPI, Subscribe } from '../lib/api';

const SubscribeEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [subscribe, setSubscribe] = useState<Subscribe | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      loadSubscribe();
    }
  }, [id]);

  const loadSubscribe = async () => {
    if (!id) return;

    setLoading(true);
    try {
      // Como a API filtra por usuário, podemos buscar todas as inscrições do usuário
      const subscriptions = await subscribeAPI.getUserSubscribes();
      const foundSubscribe = subscriptions.results.find((sub: Subscribe) => sub.id === Number(id));

      if (foundSubscribe) {
        setSubscribe(foundSubscribe);
      } else {
        setError('Inscrição não encontrada');
      }
    } catch (err) {
      console.error('Erro ao carregar inscrição:', err);
      setError('Falha ao carregar inscrição');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscribe || !id) return;

    setSaving(true);
    try {
      // Para editar, vamos usar PUT com o campo active
      await subscribeAPI.updateSubscribe(Number(id), { active: subscribe.active });
      navigate('/subscriptions');
    } catch (err) {
      console.error('Erro ao atualizar inscrição:', err);
      setError('Falha ao atualizar inscrição');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (subscribe) {
      setSubscribe({
        ...subscribe,
        active: e.target.checked
      });
    }
  };

  const formatEventDateTime = (dateTime: string) => {
    if (!dateTime) return '';

    const normalized = dateTime.replace(/Z$/, '').split('.')[0];
    const [datePart, timePart] = normalized.split('T');
    if (!datePart || !timePart) return dateTime.replace('T', ' ');

    const [year, month, day] = datePart.split('-').map(Number);
    const [hour = 0, minute = 0] = timePart.split(':').map(Number);
    if ([year, month, day, hour, minute].some((value) => Number.isNaN(value))) {
      return dateTime.replace('T', ' ');
    }

    const date = new Date(year, month - 1, day, hour, minute);
    return date.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
  };

  if (loading) return <div>Carregando...</div>;
  if (error && !subscribe) return <div>Erro: {error}</div>;
  if (!subscribe) return <div>Inscrição não encontrada</div>;

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h1>Editar Inscrição</h1>

      <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h3>{subscribe.events.title}</h3>
        <p>{subscribe.events.descriptions}</p>
        <p><strong>Data:</strong> {formatEventDateTime(subscribe.events.date_time)}</p>
        <p><strong>Local:</strong> {subscribe.events.local}</p>
        <p><strong>Capacidade:</strong> {subscribe.events.vagas}</p>
        <p><strong>Inscrito em:</strong> {new Date(subscribe.created_at).toLocaleDateString('pt-BR')}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              checked={subscribe.active}
              onChange={handleChange}
              style={{ width: 'auto' }}
            />
            <span>Inscrição Ativa</span>
          </label>
          <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.25rem' }}>
            Desmarque para desativar temporariamente esta inscrição
          </p>
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            type="submit"
            disabled={saving}
            style={{ flex: 1, padding: '0.75rem', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/subscriptions')}
            style={{ flex: 1, padding: '0.75rem', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubscribeEdit;