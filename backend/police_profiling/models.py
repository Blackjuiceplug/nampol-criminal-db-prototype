from django.db import models
from django.contrib.auth.models import User
import uuid
import os
from django.core.validators import MinValueValidator, MaxValueValidator

def criminal_image_path(instance, filename):
    return f'criminals/{instance.id}/images/{filename}'

def criminal_evidence_path(instance, filename):
    return f'criminals/{instance.id}/evidence/{filename}'

def criminal_documents_path(instance, filename):
    return f'criminals/{instance.id}/documents/{filename}'

class Criminal(models.Model):
    THREAT_LEVELS = [
        ('LOW', 'Low Threat'),
        ('MEDIUM', 'Medium Threat'),
        ('HIGH', 'High Threat'),
        ('EXTREME', 'Extreme Threat'),
    ]
    
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
        ('U', 'Unknown'),
    ]
    
    EYE_COLOR_CHOICES = [
        ('BROWN', 'Brown'),
        ('BLUE', 'Blue'),
        ('GREEN', 'Green'),
        ('HAZEL', 'Hazel'),
        ('GRAY', 'Gray'),
        ('BLACK', 'Black'),
        ('OTHER', 'Other'),
    ]
    
    HAIR_COLOR_CHOICES = [
        ('BLACK', 'Black'),
        ('BROWN', 'Brown'),
        ('BLONDE', 'Blonde'),
        ('RED', 'Red'),
        ('GRAY', 'Gray'),
        ('WHITE', 'White'),
        ('BALD', 'Bald'),
        ('OTHER', 'Other'),
    ]
    
    BUILD_CHOICES = [
        ('SLENDER', 'Slender'),
        ('AVERAGE', 'Average'),
        ('ATHLETIC', 'Athletic'),
        ('HEAVYSET', 'Heavyset'),
        ('MUSCULAR', 'Muscular'),
        ('STOCKY', 'Stocky'),
    ]
    
    COMPLEXION_CHOICES = [
        ('FAIR', 'Fair'),
        ('LIGHT', 'Light'),
        ('MEDIUM', 'Medium'),
        ('OLIVE', 'Olive'),
        ('DARK', 'Dark'),
        ('DARK_BROWN', 'Dark Brown'),
        ('BLACK', 'Black'),
    ]
    
    MARITAL_STATUS_CHOICES = [
        ('SINGLE', 'Single'),
        ('MARRIED', 'Married'),
        ('DIVORCED', 'Divorced'),
        ('WIDOWED', 'Widowed'),
        ('SEPARATED', 'Separated'),
        ('UNKNOWN', 'Unknown'),
    ]
    
    EDUCATION_LEVEL_CHOICES = [
        ('NONE', 'No Formal Education'),
        ('PRIMARY', 'Primary School'),
        ('SECONDARY', 'Secondary School'),
        ('HIGH_SCHOOL', 'High School'),
        ('DIPLOMA', 'Diploma/Certificate'),
        ('BACHELORS', 'Bachelor\'s Degree'),
        ('MASTERS', 'Master\'s Degree'),
        ('DOCTORATE', 'Doctorate'),
        ('UNKNOWN', 'Unknown'),
    ]
    
    EMPLOYMENT_STATUS_CHOICES = [
        ('EMPLOYED', 'Employed'),
        ('UNEMPLOYED', 'Unemployed'),
        ('SELF_EMPLOYED', 'Self-Employed'),
        ('STUDENT', 'Student'),
        ('RETIRED', 'Retired'),
        ('DISABLED', 'Disabled'),
        ('INCARCERATED', 'Incarcerated'),
        ('UNKNOWN', 'Unknown'),
    ]

    # Basic Identification
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    alias = models.CharField(max_length=100, blank=True, null=True)
    date_of_birth = models.DateField(null=True, blank=True)
    place_of_birth = models.CharField(max_length=100, blank=True, null=True)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, default='U')
    nationality = models.CharField(max_length=50, blank=True, null=True)
    
    # Physical Description
    height = models.CharField(max_length=20, blank=True, null=True, help_text="Height in cm or feet/inches")
    weight = models.CharField(max_length=20, blank=True, null=True, help_text="Weight in kg or lbs")
    eye_color = models.CharField(max_length=20, choices=EYE_COLOR_CHOICES, blank=True, null=True)
    hair_color = models.CharField(max_length=20, choices=HAIR_COLOR_CHOICES, blank=True, null=True)
    build = models.CharField(max_length=20, choices=BUILD_CHOICES, blank=True, null=True)
    complexion = models.CharField(max_length=20, choices=COMPLEXION_CHOICES, blank=True, null=True)
    distinguishing_marks = models.TextField(blank=True, null=True, help_text="Tattoos, scars, birthmarks, etc.")
    physical_characteristics = models.TextField(blank=True, null=True)
    
    # Biometric Data
    fingerprint_code = models.CharField(max_length=50, blank=True, null=True, unique=True)
    dna_profile = models.CharField(max_length=100, blank=True, null=True, unique=True)
    
    # Personal Information
    marital_status = models.CharField(max_length=20, choices=MARITAL_STATUS_CHOICES, default='UNKNOWN')
    education_level = models.CharField(max_length=20, choices=EDUCATION_LEVEL_CHOICES, default='UNKNOWN')
    employment_status = models.CharField(max_length=20, choices=EMPLOYMENT_STATUS_CHOICES, default='UNKNOWN')
    occupation = models.CharField(max_length=100, blank=True, null=True)
    
    # Contact Information
    last_known_address = models.TextField(blank=True, null=True)
    phone_numbers = models.JSONField(default=list, blank=True, help_text="List of known phone numbers")
    email_addresses = models.JSONField(default=list, blank=True, help_text="List of known email addresses")
    known_associates = models.TextField(blank=True, null=True, help_text="Names and relationships of known associates")
    
    # Criminal Profile
    threat_level = models.CharField(max_length=10, choices=THREAT_LEVELS, default='LOW')
    criminal_history = models.TextField(blank=True, null=True, help_text="Summary of criminal history")
    modus_operandi = models.TextField(blank=True, null=True, help_text="Criminal's methods and patterns")
    gang_affiliations = models.TextField(blank=True, null=True, help_text="Gang memberships or affiliations")
    weapons_preference = models.TextField(blank=True, null=True, help_text="Preferred weapons or tools")
    escape_risk = models.BooleanField(default=False)
    violent_offender = models.BooleanField(default=False)
    
    # Medical & Psychological
    medical_conditions = models.TextField(blank=True, null=True)
    psychological_profile = models.TextField(blank=True, null=True)
    drug_use_history = models.TextField(blank=True, null=True)
    alcohol_use_history = models.TextField(blank=True, null=True)
    
    # Administrative
    profile_picture = models.ImageField(upload_to=criminal_image_path, null=True, blank=True)
    is_incarcerated = models.BooleanField(default=False)
    current_facility = models.CharField(max_length=100, blank=True, null=True)
    incarceration_date = models.DateField(null=True, blank=True)
    expected_release_date = models.DateField(null=True, blank=True)
    description = models.TextField(blank=True, null=True)
    
    # System Fields
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey('PoliceOfficer', on_delete=models.SET_NULL, null=True, blank=True, related_name='created_criminals')
    last_updated_by = models.ForeignKey('PoliceOfficer', on_delete=models.SET_NULL, null=True, blank=True, related_name='updated_criminals')
    
    # Computed Properties
    @property
    def age(self):
        if self.date_of_birth:
            from datetime import date
            today = date.today()
            return today.year - self.date_of_birth.year - ((today.month, today.day) < (self.date_of_birth.month, self.date_of_birth.day))
        return None
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
    
    @property
    def crimes_count(self):
        return self.crimes.count()
    
    @property
    def is_high_risk(self):
        return self.threat_level in ['HIGH', 'EXTREME']
    
    @property
    def profile_picture_url(self):
        if self.profile_picture:
            return self.profile_picture.url
        return None
    
    @property
    def incarceration_status(self):
        if self.is_incarcerated:
            return "In Custody"
        return "At Large"
    
    def __str__(self):
        return f"{self.full_name} ({self.alias})" if self.alias else self.full_name
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['last_name', 'first_name']),
            models.Index(fields=['threat_level']),
            models.Index(fields=['is_incarcerated']),
            models.Index(fields=['created_at']),
        ]

# Keep all other models EXACTLY the same as before:

class PoliceOfficer(models.Model):
    RANK_CHOICES = [
        ('CONSTABLE', 'Constable'),
        ('SERGEANT', 'Sergeant'),
        ('INSPECTOR', 'Inspector'),
        ('COMMISSIONER', 'Commissioner'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    badge_number = models.CharField(max_length=20, unique=True)
    rank = models.CharField(max_length=20, choices=RANK_CHOICES)
    station = models.CharField(max_length=100)
    is_active = models.BooleanField(default=False)  # Changed to False
    
    def __str__(self):
        return f"{self.badge_number} - {self.user.get_full_name()}"
    
    @property
    def can_activate_users(self):
        """Check if this officer can activate other users"""
        return self.rank in ['COMMISSIONER', 'INSPECTOR']
    
    def can_activate_target(self, target_officer):
        """
        Check if this officer can activate the target officer
        Commissioners can activate anyone, Inspectors can activate anyone below Commissioner
        """
        if self.rank == 'COMMISSIONER':
            return True
        elif self.rank == 'INSPECTOR':
            # Inspectors can activate anyone except Commissioners and other Inspectors
            return target_officer.rank not in ['COMMISSIONER', 'INSPECTOR']
        return False

class CriminalEvidence(models.Model):
    EVIDENCE_TYPES = [
        ('PHOTO', 'Photograph'),
        ('VIDEO', 'Video Recording'),
        ('AUDIO', 'Audio Recording'),
        ('DOCUMENT', 'Document'),
        ('WEAPON', 'Weapon'),
        ('OTHER', 'Other Evidence'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    criminal = models.ForeignKey(Criminal, on_delete=models.CASCADE, related_name='evidence')
    evidence_type = models.CharField(max_length=20, choices=EVIDENCE_TYPES)
    file = models.FileField(upload_to=criminal_evidence_path)
    description = models.TextField(blank=True, null=True)
    date_collected = models.DateField(auto_now_add=True)
    collected_by = models.ForeignKey(PoliceOfficer, on_delete=models.SET_NULL, null=True, blank=True)
    
    def __str__(self):
        return f"{self.criminal} - {self.evidence_type}"

class CriminalDocument(models.Model):
    DOCUMENT_TYPES = [
        ('ARREST_REPORT', 'Arrest Report'),
        ('COURT_DOCUMENT', 'Court Document'),
        ('MEDICAL_REPORT', 'Medical Report'),
        ('FINGERPRINT', 'Fingerprint Record'),
        ('WARRANT', 'Warrant'),
        ('OTHER', 'Other Document'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    criminal = models.ForeignKey(Criminal, on_delete=models.CASCADE, related_name='documents')
    document_type = models.CharField(max_length=20, choices=DOCUMENT_TYPES)
    file = models.FileField(upload_to=criminal_documents_path)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    date_uploaded = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.ForeignKey(PoliceOfficer, on_delete=models.SET_NULL, null=True, blank=True)
    
    def __str__(self):
        return f"{self.criminal} - {self.document_type}"

class Crime(models.Model):
    CRIME_TYPES = [
        ('THEFT', 'Theft'),
        ('ASSAULT', 'Assault'),
        ('BURGLARY', 'Burglary'),
        ('ROBBERY', 'Robbery'),
        ('DRUGS', 'Drug Offense'),
        ('FRAUD', 'Fraud'),
        ('HOMICIDE', 'Homicide'),
        ('OTHER', 'Other'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    criminal = models.ForeignKey(Criminal, on_delete=models.CASCADE, related_name='crimes')
    crime_type = models.CharField(max_length=20, choices=CRIME_TYPES)
    description = models.TextField()
    date_committed = models.DateField()
    location = models.CharField(max_length=255)
    arresting_officer = models.ForeignKey(PoliceOfficer, on_delete=models.SET_NULL, null=True, blank=True)
    status = models.CharField(max_length=20, choices=[
        ('OPEN', 'Open Investigation'),
        ('CLOSED', 'Case Closed'),
        ('CONVICTED', 'Convicted'),
    ], default='OPEN')
    
    def __str__(self):
        return f"{self.criminal}: {self.crime_type}"