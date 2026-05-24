import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createEvent, updateEvent, getEvent } from '../services/eventsService';
import { getCategories } from '../services/categoryService';
import { Event, Category } from '../types/events';
import {
  PageContainer,
  FormCard,
  Heading,
  FormGroup,
  FormLabel,
  FormControl,
  TextArea,
  SelectControl,
  Button,
  ButtonRow,
  GridTwoCols
} from '../lib/ui';

export default function EventForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [categories, setCategories] = useState<Category[]>([]);
  const [event, setEvent] = useState<Event>({
    title: '',
    descriptions: '',
    date_time: '',
    vagas: 0,
    local: '',
    category_ids: []
  });

  useEffect(() => {
    const fetchData = async () => {
      const cats = await getCategories();
      setCategories(cats);

      if (id) {
        const data = await getEvent(Number(id));
        setEvent({
          ...data,
          category_ids: data.category ? data.category.map((cat) => cat.id) : []
        });
      }
    };

    fetchData();
  }, [id, isEditing, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const eventData = {
        ...event,
        category_ids: event.category_ids
      };

      if (isEditing) {
        await updateEvent(Number(id), eventData);
      } else {
        await createEvent(eventData);
      }

      navigate('/events');
    } catch {
      alert('Erro ao salvar');
    }
  };

  return (
    <PageContainer>
      <FormCard>
        <Heading>{isEditing ? 'Editar Evento' : 'Novo Evento'}</Heading>

        <form onSubmit={handleSubmit}>
          <FormGroup>
            <FormLabel>Título</FormLabel>
            <FormControl
              type="text"
              value={event.title}
              onChange={(e) => setEvent({ ...event, title: e.target.value })}
              required
            />
          </FormGroup>

          <FormGroup>
            <FormLabel>Descrição</FormLabel>
            <TextArea
              value={event.descriptions}
              onChange={(e) => setEvent({ ...event, descriptions: e.target.value })}
              required
            />
          </FormGroup>

          <GridTwoCols>
            <FormGroup>
              <FormLabel>Data/Hora</FormLabel>
              <FormControl
                type="datetime-local"
                value={event.date_time?.slice(0, 16)}
                onChange={(e) => setEvent({ ...event, date_time: e.target.value })}
                required
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>Vagas</FormLabel>
              <FormControl
                type="number"
                min="0"
                value={event.vagas}
                onChange={(e) =>
                  setEvent({
                    ...event,
                    vagas: Math.max(0, Number(e.target.value))
                  })
                }
                required
              />
            </FormGroup>
          </GridTwoCols>

          <FormGroup>
            <FormLabel>Local</FormLabel>
            <FormControl
              type="text"
              value={event.local}
              onChange={(e) => setEvent({ ...event, local: e.target.value })}
              required
            />
          </FormGroup>

          <FormGroup>
            <FormLabel>Categorias</FormLabel>
            <SelectControl
              multiple
              value={event.category_ids?.map(String)}
              onChange={(e) => {
                const selectedOptions = Array.from(
                  e.target.selectedOptions,
                  (option) => Number(option.value)
                );
                setEvent({ ...event, category_ids: selectedOptions });
              }}
              required
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </SelectControl>
          </FormGroup>

          <ButtonRow>
            <Button type="submit" variant="success">
              Salvar
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/events')}>
              Cancelar
            </Button>
          </ButtonRow>
        </form>
      </FormCard>
    </PageContainer>
  );
}
