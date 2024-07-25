from django.urls import path
from .views import InterestListCreateAPIView, InterestAcceptAPIView, InterestRejectAPIView

urlpatterns = [
    path('', InterestListCreateAPIView.as_view(), name='interest-list-create'),
    path('accept/<str:username>/', InterestAcceptAPIView.as_view(), name='interest-accept'),
    path('reject/<str:username>/', InterestRejectAPIView.as_view(), name='interest-reject'),
]
