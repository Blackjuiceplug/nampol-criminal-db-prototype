from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate, login, logout
from django.db.models import Q
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.middleware.csrf import get_token
from .models import PoliceOfficer, Criminal, Crime, CriminalEvidence, CriminalDocument
from .serializers import (
    PoliceOfficerSerializer, CriminalSerializer, 
    CrimeSerializer, LoginSerializer, PoliceOfficerRegistrationSerializer,
    CriminalEvidenceSerializer, CriminalDocumentSerializer, PoliceOfficerActivationSerializer,
    CriminalListSerializer, CriminalSearchSerializer
)

class PoliceOfficerViewSet(viewsets.ModelViewSet):
    queryset = PoliceOfficer.objects.all()
    serializer_class = PoliceOfficerSerializer
    
    @action(detail=True, methods=['patch'])
    def activate(self, request, pk=None):
        """Activate or deactivate an officer"""
        try:
            target_officer = self.get_object()
        except PoliceOfficer.DoesNotExist:
            return Response(
                {'error': 'Officer not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check if requesting user is authenticated
        if not request.user.is_authenticated:
            return Response(
                {'error': 'Authentication required'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Get the current officer making the request
        try:
            current_officer = PoliceOfficer.objects.get(user=request.user)
        except PoliceOfficer.DoesNotExist:
            return Response(
                {'error': 'You are not a registered police officer'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Check if current officer can activate users
        if not current_officer.can_activate_users:
            return Response(
                {'error': 'You do not have permission to activate users'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Check if current officer can activate this specific target
        if not current_officer.can_activate_target(target_officer):
            return Response(
                {'error': f'You cannot activate/deactivate an officer with rank {target_officer.rank}'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = PoliceOfficerActivationSerializer(
            data=request.data,
            context={'request': request, 'target_officer': target_officer, 'current_officer': current_officer}
        )
        
        if serializer.is_valid():
            target_officer.is_active = serializer.validated_data['is_active']
            target_officer.save()
            
            action = "activated" if target_officer.is_active else "deactivated"
            return Response({
                'message': f'Officer {target_officer.badge_number} ({target_officer.user.get_full_name()}) has been {action}',
                'is_active': target_officer.is_active
            })
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def pending_activation(self, request):
        """Get list of officers pending activation (only for authorized officers)"""
        if not request.user.is_authenticated:
            return Response(
                {'error': 'Authentication required'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Get the current officer making the request
        try:
            current_officer = PoliceOfficer.objects.get(user=request.user)
        except PoliceOfficer.DoesNotExist:
            return Response(
                {'error': 'You are not a registered police officer'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        if not current_officer.can_activate_users:
            return Response(
                {'error': 'You do not have permission to view pending activations'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Filter based on current officer's permissions
        if current_officer.rank == 'COMMISSIONER':
            pending_officers = PoliceOfficer.objects.filter(is_active=False)
        else:  # Inspector
            pending_officers = PoliceOfficer.objects.filter(
                is_active=False,
                rank__in=['CONSTABLE', 'SERGEANT']
            )
        
        serializer = self.get_serializer(pending_officers, many=True)
        return Response(serializer.data)

class CriminalViewSet(viewsets.ModelViewSet):
    queryset = Criminal.objects.all().order_by('-created_at')
    serializer_class = CriminalSerializer
    
    def get_serializer_class(self):
        """Use different serializers for list vs detail views"""
        if self.action == 'list':
            return CriminalListSerializer
        return CriminalSerializer
    
    def perform_create(self, serializer):
        """Automatically set created_by and last_updated_by"""
        if self.request.user.is_authenticated and hasattr(self.request.user, 'policeofficer'):
            serializer.save(
                created_by=self.request.user.policeofficer,
                last_updated_by=self.request.user.policeofficer
            )
        else:
            serializer.save()
    
    def perform_update(self, serializer):
        """Automatically update last_updated_by"""
        if self.request.user.is_authenticated and hasattr(self.request.user, 'policeofficer'):
            serializer.save(last_updated_by=self.request.user.policeofficer)
        else:
            serializer.save()
    
    @action(detail=False, methods=['get', 'post'])
    def search(self, request):
        """Enhanced search with filtering capabilities"""
        if request.method == 'GET':
            # Handle GET requests with query parameters
            query = request.GET.get('q', '')
            threat_level = request.GET.get('threat_level', '')
            is_incarcerated = request.GET.get('is_incarcerated', '')
            gender = request.GET.get('gender', '')
            
            criminals = Criminal.objects.all()
            
            # Apply search query
            if query:
                criminals = criminals.filter(
                    Q(first_name__icontains=query) |
                    Q(last_name__icontains=query) |
                    Q(alias__icontains=query) |
                    Q(nationality__icontains=query) |
                    Q(description__icontains=query)
                )
            
            # Apply filters
            if threat_level:
                criminals = criminals.filter(threat_level=threat_level)
            if is_incarcerated.lower() in ['true', 'false']:
                criminals = criminals.filter(is_incarcerated=(is_incarcerated.lower() == 'true'))
            if gender:
                criminals = criminals.filter(gender=gender)
            
            serializer = CriminalListSerializer(criminals, many=True)
            return Response(serializer.data)
        
        else:  # POST request for complex searches
            serializer = CriminalSearchSerializer(data=request.data)
            if serializer.is_valid():
                query = serializer.validated_data.get('query', '')
                threat_level = serializer.validated_data.get('threat_level')
                is_incarcerated = serializer.validated_data.get('is_incarcerated')
                gender = serializer.validated_data.get('gender')
                
                criminals = Criminal.objects.all()
                
                if query:
                    criminals = criminals.filter(
                        Q(first_name__icontains=query) |
                        Q(last_name__icontains=query) |
                        Q(alias__icontains=query) |
                        Q(nationality__icontains=query) |
                        Q(description__icontains=query) |
                        Q(known_associates__icontains=query) |
                        Q(gang_affiliations__icontains=query)
                    )
                
                if threat_level:
                    criminals = criminals.filter(threat_level=threat_level)
                if is_incarcerated is not None:
                    criminals = criminals.filter(is_incarcerated=is_incarcerated)
                if gender:
                    criminals = criminals.filter(gender=gender)
                
                serializer = CriminalListSerializer(criminals, many=True)
                return Response(serializer.data)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get criminal statistics"""
        total_criminals = Criminal.objects.count()
        incarcerated_count = Criminal.objects.filter(is_incarcerated=True).count()
        at_large_count = Criminal.objects.filter(is_incarcerated=False).count()
        
        threat_level_stats = {
            'LOW': Criminal.objects.filter(threat_level='LOW').count(),
            'MEDIUM': Criminal.objects.filter(threat_level='MEDIUM').count(),
            'HIGH': Criminal.objects.filter(threat_level='HIGH').count(),
            'EXTREME': Criminal.objects.filter(threat_level='EXTREME').count(),
        }
        
        gender_stats = {
            'MALE': Criminal.objects.filter(gender='M').count(),
            'FEMALE': Criminal.objects.filter(gender='F').count(),
            'OTHER': Criminal.objects.filter(gender='O').count(),
            'UNKNOWN': Criminal.objects.filter(gender='U').count(),
        }
        
        return Response({
            'total_criminals': total_criminals,
            'incarcerated': incarcerated_count,
            'at_large': at_large_count,
            'threat_levels': threat_level_stats,
            'genders': gender_stats,
        })
    
    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        """Update criminal incarceration status"""
        criminal = self.get_object()
        
        if 'is_incarcerated' in request.data:
            criminal.is_incarcerated = request.data['is_incarcerated']
            
            # Update incarceration dates if provided
            if criminal.is_incarcerated and 'incarceration_date' in request.data:
                criminal.incarceration_date = request.data['incarceration_date']
            elif not criminal.is_incarcerated and 'expected_release_date' in request.data:
                criminal.expected_release_date = request.data['expected_release_date']
            
            criminal.save()
            serializer = self.get_serializer(criminal)
            return Response(serializer.data)
        
        return Response(
            {'error': 'is_incarcerated field is required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )

class CrimeViewSet(viewsets.ModelViewSet):
    queryset = Crime.objects.all()
    serializer_class = CrimeSerializer

class CriminalEvidenceViewSet(viewsets.ModelViewSet):
    queryset = CriminalEvidence.objects.all()
    serializer_class = CriminalEvidenceSerializer

class CriminalDocumentViewSet(viewsets.ModelViewSet):
    queryset = CriminalDocument.objects.all()
    serializer_class = CriminalDocumentSerializer

# CSRF Token endpoint
class CSRFTokenView(APIView):
    def get(self, request):
        token = get_token(request)
        response = Response({'csrfToken': token})
        response.set_cookie(
            'csrftoken',
            token,
            max_age=3600,
            httponly=False,
            samesite='Lax',
            secure=False
        )
        return response

# Auth views with CSRF exemption
@method_decorator(csrf_exempt, name='dispatch')
class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = authenticate(
                username=serializer.validated_data['username'],
                password=serializer.validated_data['password']
            )
            if user:
                # Check if user is a police officer and is active
                try:
                    officer = PoliceOfficer.objects.get(user=user)
                    if not officer.is_active:
                        return Response(
                            {'error': 'Your account is pending activation by a Commissioner or Inspector'}, 
                            status=status.HTTP_403_FORBIDDEN
                        )
                    
                    # Include officer data in response
                    officer_data = {
                        'id': officer.id,
                        'badge_number': officer.badge_number,
                        'rank': officer.rank,
                        'station': officer.station,
                        'can_activate_users': officer.can_activate_users,
                        'is_active': officer.is_active
                    }
                    
                except PoliceOfficer.DoesNotExist:
                    officer_data = {}
                
                login(request, user)
                
                return Response({
                    'message': 'Login successful', 
                    'user': user.username,
                    'user_id': user.id,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'officer': officer_data
                })
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@method_decorator(csrf_exempt, name='dispatch')
class RegisterView(APIView):
    def post(self, request):
        serializer = PoliceOfficerRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            officer = serializer.save()
            return Response(
                {
                    'message': 'Officer registered successfully. Please wait for activation by a Commissioner or Inspector.',
                    'officer_id': officer.id,
                    'badge_number': officer.badge_number,
                    'is_active': officer.is_active
                },
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@method_decorator(csrf_exempt, name='dispatch')
class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({'message': 'Logout successful'})

@method_decorator(csrf_exempt, name='dispatch')
class CheckAuthView(APIView):
    def get(self, request):
        if request.user.is_authenticated:
            officer_data = {}
            try:
                officer = PoliceOfficer.objects.get(user=request.user)
                officer_data = {
                    'id': officer.id,
                    'badge_number': officer.badge_number,
                    'rank': officer.rank,
                    'station': officer.station,
                    'can_activate_users': officer.can_activate_users,
                    'is_active': officer.is_active
                }
            except PoliceOfficer.DoesNotExist:
                pass
            
            return Response({
                'authenticated': True, 
                'user': request.user.username,
                'user_id': request.user.id,
                'first_name': request.user.first_name,
                'last_name': request.user.last_name,
                'officer': officer_data
            })
        return Response({'authenticated': False})