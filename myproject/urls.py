from django.urls import path, re_path, include
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from rest_framework_simplejwt.views import TokenRefreshView
from users.views import LoginView, RegisterView, UserListAPIView
from interests.views import InterestListCreateAPIView, InterestAcceptAPIView, InterestRejectAPIView
from chat.views import csrf 

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/users/', UserListAPIView.as_view(), name='users'),
    path('api/interests/', include([
        path('', InterestListCreateAPIView.as_view(), name='interest-list-create'),
        path('accept/<str:username>/', InterestAcceptAPIView.as_view(), name='interest-accept'),
        path('reject/<str:username>/', InterestRejectAPIView.as_view(), name='interest-reject'),
    ])),
    path('api/messages/', include('chat.urls')),  # This should correctly include the messages URLs
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('csrf/', csrf, name='csrf'),
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html')),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
