from rest_framework import generics, serializers, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .models import Interest
from .serializers import InterestSerializer
import logging

logger = logging.getLogger(__name__)
User = get_user_model()

class InterestListCreateAPIView(generics.GenericAPIView):
    serializer_class = InterestSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        interests = Interest.objects.filter(receiver=request.user)
        interests_data = InterestSerializer(interests, many=True).data
        return Response({'interests': interests_data})

    def post(self, request, *args, **kwargs):
        receiver_username = request.data.get('receiver')
        if not receiver_username:
            return Response({"receiver": "Receiver username is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            receiver = User.objects.get(username=receiver_username)
            serializer = InterestSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(sender=request.user, receiver=receiver)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({"receiver": "Receiver user does not exist"}, status=status.HTTP_404_NOT_FOUND)


class InterestAcceptAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        receiver_username = kwargs.get('username')
        if not receiver_username:
            return Response({"error": "Receiver username is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            receiver = User.objects.get(username=receiver_username)
            interest = Interest.objects.get(sender=receiver, receiver=request.user)
            interest.is_accepted = True
            interest.save()
            return Response({"success": True, "chat_redirect": True}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "Receiver user does not exist"}, status=status.HTTP_404_NOT_FOUND)
        except Interest.DoesNotExist:
            return Response({"error": "Interest not found"}, status=status.HTTP_404_NOT_FOUND)

class InterestRejectAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        receiver_username = request.data.get('receiver')
        if not receiver_username:
            return Response({"error": "Receiver username is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            receiver = User.objects.get(username=receiver_username)
            interest = Interest.objects.get(sender=receiver, receiver=request.user)
            interest.is_rejected = True
            interest.save()
            return Response(status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "Receiver user does not exist"}, status=status.HTTP_404_NOT_FOUND)
        except Interest.DoesNotExist:
            return Response({"error": "Interest not found"}, status=status.HTTP_404_NOT_FOUND)
