from django.urls import path
from .views import (
    MessageListView,
    MessageDetailView,  # For handling individual message operations
)

urlpatterns = [
    path('', MessageListView.as_view(), name='message-list'),  # List and create messages
    path('<int:pk>/', MessageDetailView.as_view(), name='message-detail'),  # Retrieve, update, delete a single message
]
