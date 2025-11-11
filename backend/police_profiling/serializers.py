from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from .models import PoliceOfficer, Criminal, Crime, CriminalEvidence, CriminalDocument

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']

class PoliceOfficerSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    can_activate_users = serializers.BooleanField(read_only=True)
    user_full_name = serializers.CharField(source='user.get_full_name', read_only=True)
    
    class Meta:
        model = PoliceOfficer
        fields = '__all__'

class PoliceOfficerActivationSerializer(serializers.Serializer):
    is_active = serializers.BooleanField(required=True)
    
    def validate(self, attrs):
        request = self.context.get('request')
        target_officer = self.context.get('target_officer')
        
        if not request or not hasattr(request.user, 'policeofficer'):
            raise serializers.ValidationError("User is not a police officer")
        
        current_officer = request.user.policeofficer
        
        # Check if current officer can activate users
        if not current_officer.can_activate_users:
            raise serializers.ValidationError("You don't have permission to activate users")
        
        # Check if current officer can activate this specific target
        if not current_officer.can_activate_target(target_officer):
            raise serializers.ValidationError("You don't have permission to activate this user")
        
        return attrs

class PoliceOfficerRegistrationSerializer(serializers.ModelSerializer):
    username = serializers.CharField(write_only=True, required=True)
    password = serializers.CharField(write_only=True, required=True)
    first_name = serializers.CharField(write_only=True, required=True)
    last_name = serializers.CharField(write_only=True, required=True)
    email = serializers.EmailField(write_only=True, required=False)
    
    class Meta:
        model = PoliceOfficer
        fields = ['username', 'password', 'first_name', 'last_name', 'email', 'badge_number', 'rank', 'station']
    
    def validate_badge_number(self, value):
        if PoliceOfficer.objects.filter(badge_number=value).exists():
            raise serializers.ValidationError("An officer with this badge number already exists.")
        return value
    
    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with this username already exists.")
        return value
    
    def validate_password(self, value):
        validate_password(value)
        return value
    
    def create(self, validated_data):
        user_data = {
            'username': validated_data.pop('username'),
            'password': validated_data.pop('password'),
            'first_name': validated_data.pop('first_name'),
            'last_name': validated_data.pop('last_name'),
        }
        
        if 'email' in validated_data:
            user_data['email'] = validated_data.pop('email')
        
        user = User.objects.create_user(**user_data)
        police_officer = PoliceOfficer.objects.create(user=user, **validated_data)
        
        return police_officer

class CriminalEvidenceSerializer(serializers.ModelSerializer):
    collected_by_name = serializers.CharField(source='collected_by.__str__', read_only=True)
    
    class Meta:
        model = CriminalEvidence
        fields = '__all__'

class CriminalDocumentSerializer(serializers.ModelSerializer):
    uploaded_by_name = serializers.CharField(source='uploaded_by.__str__', read_only=True)
    
    class Meta:
        model = CriminalDocument
        fields = '__all__'

class CriminalSerializer(serializers.ModelSerializer):
    crimes_count = serializers.SerializerMethodField()
    evidence = CriminalEvidenceSerializer(many=True, read_only=True)
    documents = CriminalDocumentSerializer(many=True, read_only=True)
    profile_picture_url = serializers.SerializerMethodField()
    age = serializers.ReadOnlyField()
    full_name = serializers.ReadOnlyField()
    is_high_risk = serializers.ReadOnlyField()
    incarceration_status = serializers.ReadOnlyField()
    
    class Meta:
        model = Criminal
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'last_updated_by']
    
    def get_crimes_count(self, obj):
        return obj.crimes.count()
    
    def get_profile_picture_url(self, obj):
        if obj.profile_picture:
            return obj.profile_picture.url
        return None
    
    def create(self, validated_data):
        # Set the created_by field to the current user
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            if hasattr(request.user, 'policeofficer'):
                validated_data['created_by'] = request.user.policeofficer
                validated_data['last_updated_by'] = request.user.policeofficer
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        # Update the last_updated_by field
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            if hasattr(request.user, 'policeofficer'):
                validated_data['last_updated_by'] = request.user.policeofficer
        return super().update(instance, validated_data)

class CriminalListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list views"""
    age = serializers.ReadOnlyField()
    full_name = serializers.ReadOnlyField()
    crimes_count = serializers.SerializerMethodField()
    profile_picture_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Criminal
        fields = [
            'id', 'first_name', 'last_name', 'full_name', 'alias', 'age', 'gender',
            'threat_level', 'is_incarcerated', 'crimes_count', 'profile_picture_url',
            'created_at'
        ]
    
    def get_crimes_count(self, obj):
        return obj.crimes.count()
    
    def get_profile_picture_url(self, obj):
        if obj.profile_picture:
            return obj.profile_picture.url
        return None

class CrimeSerializer(serializers.ModelSerializer):
    criminal_name = serializers.CharField(source='criminal.__str__', read_only=True)
    arresting_officer_name = serializers.CharField(source='arresting_officer.__str__', read_only=True, allow_null=True)
    
    class Meta:
        model = Crime
        fields = '__all__'

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True)

class CriminalSearchSerializer(serializers.Serializer):
    """Serializer for criminal search functionality"""
    query = serializers.CharField(required=False)
    threat_level = serializers.ChoiceField(
        choices=Criminal.THREAT_LEVELS, 
        required=False
    )
    is_incarcerated = serializers.BooleanField(required=False)
    gender = serializers.ChoiceField(
        choices=Criminal.GENDER_CHOICES,
        required=False
    )