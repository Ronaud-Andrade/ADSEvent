from django.test import TestCase
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from .models import BaseModel, CategoryEvent, Events, Subscribe

Client = get_user_model()


# ------------------ BaseModel ------------------
class BaseModelTest(TestCase):
    def setUp(self):
        # Cria uma categoria simples para testar os métodos herdados
        self.category = CategoryEvent.objects.create(name="Django")

    def test_campos_de_tempo_preenchidos(self):
        # Verifica se os timestamps foram preenchidos automaticamente
        self.assertIsNotNone(self.category.created_at)
        self.assertIsNotNone(self.category.updated_at)

    def test_soft_delete(self):
        # Testa se o método Soft_Delete marca o objeto como deletado
        self.category.Soft_Delete()
        self.assertTrue(self.category.is_deleted)
        self.assertIsNotNone(self.category.deleted_at)

    def test_hard_delete(self):
        # Testa se o método Hard_Delete remove o objeto do banco
        pk = self.category.pk
        self.category.Hard_Delete()
        with self.assertRaises(CategoryEvent.DoesNotExist):
            CategoryEvent.objects.get(pk=pk)

    def test_restored_funciona(self):
        # Testa se o método Restored restaura o objeto
        self.category.Soft_Delete()
        self.category.Restored()
        self.assertFalse(self.category.is_deleted)
        self.assertIsNone(self.category.deleted_at)


# ------------------ CategoryEvent ------------------
class CategoryEventModelTest(TestCase):
    def setUp(self):
        self.category = CategoryEvent.objects.create(name="Eventos Django")

    def test_str(self):
        # Testa se o método __str__ retorna o nome da categoria corretamente
        self.assertEqual(str(self.category), "Eventos Django")


# ------------------ Events ------------------
class EventsModelTest(TestCase):
    def setUp(self):
        self.category = CategoryEvent.objects.create(name="Web")
        self.event = Events.objects.create(
            date_time=timezone.now(),
            title="Workshop Django",
            vagas=25,
            descriptions="Curso intensivo",
            local="Unifip - Sala H8",
        )
        self.event.category.add(self.category)

    def test_evento_criado(self):
        # Verifica se o evento foi criado com os dados corretos
        self.assertEqual(self.event.title, "Workshop Django")
        self.assertEqual(self.event.vagas, 25)
        self.assertEqual(self.event.local, "Unifip - Sala H8")

    def test_str_evento(self):
        # Testa a string de representação (__str__)
        self.assertIn("Workshop Django", str(self.event))


# ------------------ Subscribe ------------------
class SubscribeModelTest(TestCase):
    def setUp(self):
        # Criação dos usuários e eventos para simular inscrições
        self.user1 = Client.objects.create_user(username="Monkey D. Luffymose", password="123")
        self.user2 = Client.objects.create_user(username="Oscar Alho", password="456")

        self.event1 = Events.objects.create(
            date_time=timezone.now() + timedelta(days=1),
            title="Evento 1",
            vagas=30,
            descriptions="Descrição 1",
            local="Local 1",
        )

        self.event2 = Events.objects.create(
            date_time=timezone.now() + timedelta(days=2),
            title="Evento 2",
            vagas=40,
            descriptions="Descrição 2",
            local="Local 2",
        )

        # Criação das inscrições
        self.sub1 = Subscribe.objects.create(client=self.user1, events=self.event1)
        self.sub2 = Subscribe.objects.create(client=self.user1, events=self.event2)
        self.sub3 = Subscribe.objects.create(client=self.user2, events=self.event1)

        # Marcamos sub2 como deletado para testar os filtros
        self.sub2.is_deleted = True
        self.sub2.save()

    def test_str_subscribe(self):
        # Testa a representação textual da inscrição
        self.assertEqual(str(self.sub1), f"{self.user1.username} _ {self.event1.title}")

    def test_manager_active(self):
        # Aqui o filtro active() deve retornar apenas as inscrições não deletadas
        ativos = Subscribe.objects.active()
        self.assertIn(self.sub1, ativos)
        self.assertIn(self.sub3, ativos)
        self.assertNotIn(self.sub2, ativos)  # ✅ Agora deve passar, pois sub2 foi marcado como deletado

    def test_manager_deleted(self):
        # Testa o método deleted() que retorna inscrições marcadas como deletadas
        deletados = Subscribe.objects.deleted()
        self.assertIn(self.sub2, deletados)

    def test_by_client(self):
        # Testa filtro por cliente específico
        results = Subscribe.objects.by_client(self.user1)
        self.assertIn(self.sub1, results)
        self.assertIn(self.sub2, results)
        self.assertNotIn(self.sub3, results)

    def test_by_events(self):
        # Testa filtro por evento específico
        results = Subscribe.objects.by_events(self.event1)
        self.assertIn(self.sub1, results)
        self.assertIn(self.sub3, results)
        self.assertNotIn(self.sub2, results)

    def test_order_by_event_date(self):
        # Testa se a ordenação por data do evento funciona corretamente
        ordered = list(Subscribe.objects.order_by_date_time())
        self.assertLessEqual(ordered[0].events.date_time, ordered[-1].events.date_time)
