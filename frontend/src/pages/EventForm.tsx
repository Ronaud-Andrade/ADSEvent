import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { categoryAPI, eventsAPI, Category } from '../lib/api';

const EventForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    descriptions: '',
    date_time: '',
    local: '',
    vagas: 30,
    category: [] as string[],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const isEditing = !!id;

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (isEditing) {
      loadEvent();
    }
  }, [id]);

  const loadEvent = async () => {
    try {
      const event = await eventsAPI.getEvent(Number(id));
      setFormData({
        title: event.title,
        descriptions: event.descriptions,
        date_time: event.date_time.slice(0, 16), // Remove seconds for datetime-local input
        local: event.local,
        vagas: event.vagas,
        category: event.category.map((item: any) => String(typeof item === 'object' ? item.id : item)),
      });
    } catch (err) {
      setError('Failed to load event');
    }
  };

  const loadCategories = async () => {
    try {
      const data = await categoryAPI.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({
      ...prev,
      category: selectedOptions,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      ...formData,
      category: formData.category.map(Number),
    };
    try {
      if (isEditing) {
        await eventsAPI.updateEvent(Number(id), payload);
      } else {
        await eventsAPI.createEvent(payload);
      }
      navigate('/events?page=1');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const data = err.response.data;
        if (data && typeof data === 'object') {
          setError(JSON.stringify(data));
        } else {
          setError(err.response.statusText || 'Failed to save event');
        }
      } else {
        setError('Failed to save event');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'vagas' ? Number(value) : value,
    }));
  };

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h1>{isEditing ? 'Edit Event' : 'Create New Event'}</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="descriptions">Description:</label>
          <textarea
            id="descriptions"
            name="descriptions"
            value={formData.descriptions}
            onChange={handleChange}
            required
            rows={4}
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="date_time">Date & Time:</label>
          <input
            type="datetime-local"
            id="date_time"
            name="date_time"
            value={formData.date_time}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="local">Location:</label>
          <input
            type="text"
            id="local"
            name="local"
            value={formData.local}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="category">Categories:</label>
          <select
            id="category"
            name="category"
            multiple
            value={formData.category}
            onChange={handleCategoryChange}
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="vagas">Capacity:</label>
          <input
            type="number"
            id="vagas"
            name="vagas"
            value={formData.vagas}
            onChange={handleChange}
            min="1"
            required
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            type="submit"
            disabled={loading}
            style={{ flex: 1, padding: '0.75rem', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            {loading ? 'Saving...' : (isEditing ? 'Update Event' : 'Create Event')}
          </button>
          <button
            type="button"
            onClick={() => navigate('/events')}
            style={{ flex: 1, padding: '0.75rem', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;