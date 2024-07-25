
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie

from rest_framework import generics, serializers
from rest_framework.permissions import IsAuthenticated
from .models import Message
from .serializers import MessageSerializer
from django.contrib.auth import get_user_model
import logging

logger = logging.getLogger(__name__)

User = get_user_model()

class MessageListView(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        receiver_username = self.request.query_params.get('username')
        if receiver_username:
            return Message.objects.filter(
                sender=user, receiver__username=receiver_username
            ).order_by('timestamp') | Message.objects.filter(
                sender__username=receiver_username, receiver=user
            ).order_by('timestamp')
        return Message.objects.filter(receiver=user).order_by('timestamp')

    def perform_create(self, serializer):
        receiver_username = self.request.data.get('receiver')
        if not receiver_username:
            raise serializers.ValidationError({'receiver': 'Receiver is required'})
        
        try:
            receiver = User.objects.get(username=receiver_username)
        except User.DoesNotExist:
            raise serializers.ValidationError({'receiver': 'User does not exist'})
        
        # Check if the receiver is the same as the logged-in user
        if receiver == self.request.user:
            raise serializers.ValidationError({'receiver': 'Cannot send a message to yourself'})
        
        text = self.request.data.get('text')
        if not text:
            raise serializers.ValidationError({'text': 'Text is required'})
        
        serializer.save(sender=self.request.user, receiver=receiver)


class MessageDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # Ensure that the message belongs to the user
        obj = super().get_object()
        if obj.receiver != self.request.user and obj.sender != self.request.user:
            raise serializers.ValidationError({'detail': 'Not permitted to access this message'})
        return obj



@ensure_csrf_cookie
def csrf(request):
    return JsonResponse(
        {'csrfToken': get_token(request)})