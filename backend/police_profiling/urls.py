from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PoliceOfficerViewSet, CriminalViewSet, CrimeViewSet, 
    RegisterView, LoginView, LogoutView, CheckAuthView,
    CriminalEvidenceViewSet, CriminalDocumentViewSet,
    CSRFTokenView
)

router = DefaultRouter()
router.register(r'officers', PoliceOfficerViewSet)
router.register(r'criminals', CriminalViewSet)
router.register(r'crimes', CrimeViewSet)
router.register(r'criminal-evidence', CriminalEvidenceViewSet)
router.register(r'criminal-documents', CriminalDocumentViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/csrf/', CSRFTokenView.as_view(), name='auth-csrf'),
    path('auth/register/', RegisterView.as_view(), name='auth-register'),
    path('auth/login/', LoginView.as_view(), name='auth-login'),
    path('auth/logout/', LogoutView.as_view(), name='auth-logout'),
    path('auth/check/', CheckAuthView.as_view(), name='auth-check'),
]