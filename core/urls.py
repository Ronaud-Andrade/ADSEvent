from django.urls import path
from . import views

urlpatterns = [
    # Category
    path('categories/', views.CategoryListView.as_view(), name='category_list'),
    path('categories/new/', views.CategoryCreateView.as_view(), name='category_create'),
    path('categories/<int:pk>/edit/', views.CategoryUpdateView.as_view(), name='category_edit'),
    path('categories/<int:pk>/delete/', views.CategoryDeleteView.as_view(), name='category_delete'),

    # Events
    path('events/', views.EventListView.as_view(), name='event_list'),
    path('events/new/', views.EventCreateView.as_view(), name='event_create'),
    path('events/<int:pk>/', views.EventDetailView.as_view(), name='event_detail'),
    path('events/<int:pk>/edit/', views.EventUpdateView.as_view(), name='event_edit'),
    path('events/<int:pk>/delete/', views.EventDeleteView.as_view(), name='event_delete'),

    # Subscriptions
    path('subs/', views.SubscribeListView.as_view(), name='subscribe_list'),
    path('subs/new/', views.SubscribeCreateView.as_view(), name='subscribe_create'),
    path('subs/<int:pk>/edit/', views.SubscribeUpdateView.as_view(), name='subscribe_edit'),
    path('subs/<int:pk>/delete/', views.SubscribeDeleteView.as_view(), name='subscribe_delete'),
]

