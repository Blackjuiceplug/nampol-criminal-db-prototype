// src/Components/Records/RecordManagement.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Users, FileText, Scale, FileSearch, Save, X, Calendar, Upload, AlertCircle, Badge, Mail, MapPin, User, Clock, FileBox } from 'lucide-react';

const RecordManagement = ({ searchQuery }) => {
  const [activeTab, setActiveTab] = useState('criminal');
  const [showForm, setShowForm] = useState(false);
  const [criminals, setCriminals] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // Fetch criminals and officers for dropdowns
  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      try {
        // Fetch criminals
        const criminalsResponse = await fetch('http://localhost:8000/api/criminals/', {
          credentials: 'include',
        });
        if (criminalsResponse.ok) {
          const criminalsData = await criminalsResponse.json();
          setCriminals(criminalsData.results || criminalsData);
        }

        // Fetch officers
        const officersResponse = await fetch('http://localhost:8000/api/officers/', {
          credentials: 'include',
        });
        if (officersResponse.ok) {
          const officersData = await officersResponse.json();
          setOfficers(officersData.results || officersData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoadingData(false);
      }
    };

    if (showForm && (activeTab === 'crime' || activeTab === 'evidence')) {
      fetchData();
    }
  }, [showForm, activeTab]);

  // Render the appropriate form based on activeTab
  const renderForm = () => {
    switch(activeTab) {
      case 'criminal':
        return <CriminalForm onSave={() => setShowForm(false)} onCancel={() => setShowForm(false)} />;
      case 'officer':
        return <OfficerForm onSave={() => setShowForm(false)} onCancel={() => setShowForm(false)} />;
      case 'crime':
        return <CrimeForm onSave={() => setShowForm(false)} onCancel={() => setShowForm(false)} criminals={criminals} officers={officers} loadingData={loadingData} />;
      case 'evidence':
        return <EvidenceForm onSave={() => setShowForm(false)} onCancel={() => setShowForm(false)} criminals={criminals} loadingData={loadingData} />;
      default:
        return <CriminalForm onSave={() => setShowForm(false)} onCancel={() => setShowForm(false)} />;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Records Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Record
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="flex border-b border-gray-200">
          {[
            { id: 'criminal', label: 'Criminals', icon: Users },
            { id: 'officer', label: 'Officers', icon: FileText },
            { id: 'crime', label: 'Crimes', icon: Scale },
            { id: 'evidence', label: 'Evidence', icon: FileSearch }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-6 py-4 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-5 h-5 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content area */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="text-center text-gray-500 py-12">
          <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium mb-2">No {activeTab} records to display</h3>
          <p>Click "Add New Record" to create {activeTab} record.</p>
          {searchQuery && (
            <p className="mt-2 text-sm">Search query: "{searchQuery}"</p>
          )}
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="max-w-2xl w-full">
            {renderForm()}
          </div>
        </div>
      )}
    </div>
  );
};

// Criminal Form Component - Enhanced with all new attributes
const CriminalForm = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    alias: '',
    date_of_birth: '',
    place_of_birth: '',
    gender: 'U',
    nationality: '',
    height: '',
    weight: '',
    eye_color: '',
    hair_color: '',
    build: '',
    complexion: '',
    distinguishing_marks: '',
    physical_characteristics: '',
    fingerprint_code: '',
    dna_profile: '',
    marital_status: 'UNKNOWN',
    education_level: 'UNKNOWN',
    employment_status: 'UNKNOWN',
    occupation: '',
    last_known_address: '',
    phone_numbers: [],
    email_addresses: [],
    known_associates: '',
    threat_level: 'LOW',
    criminal_history: '',
    modus_operandi: '',
    gang_affiliations: '',
    weapons_preference: '',
    escape_risk: false,
    violent_offender: false,
    medical_conditions: '',
    psychological_profile: '',
    drug_use_history: '',
    alcohol_use_history: '',
    is_incarcerated: false,
    current_facility: '',
    incarceration_date: '',
    expected_release_date: '',
    description: '',
    profile_picture: null
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [phoneInput, setPhoneInput] = useState('');
  const [emailInput, setEmailInput] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle phone numbers array
  const addPhoneNumber = () => {
    if (phoneInput.trim()) {
      setFormData(prev => ({
        ...prev,
        phone_numbers: [...prev.phone_numbers, phoneInput.trim()]
      }));
      setPhoneInput('');
    }
  };

  const removePhoneNumber = (index) => {
    setFormData(prev => ({
      ...prev,
      phone_numbers: prev.phone_numbers.filter((_, i) => i !== index)
    }));
  };

  // Handle email addresses array
  const addEmailAddress = () => {
    if (emailInput.trim() && emailInput.includes('@')) {
      setFormData(prev => ({
        ...prev,
        email_addresses: [...prev.email_addresses, emailInput.trim()]
      }));
      setEmailInput('');
    }
  };

  const removeEmailAddress = (index) => {
    setFormData(prev => ({
      ...prev,
      email_addresses: prev.email_addresses.filter((_, i) => i !== index)
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors({ image: 'Please select an image file (JPEG, PNG, GIF)' });
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ image: 'Image must be less than 5MB' });
        return;
      }
      
      setFormData(prev => ({ ...prev, profile_picture: file }));
      setErrors(prev => ({ ...prev, image: '' }));
      
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, profile_picture: null }));
    setImagePreview(null);
    setErrors(prev => ({ ...prev, image: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const formDataToSend = new FormData();
      
      // Append all form fields to FormData
      Object.keys(formData).forEach(key => {
        const value = formData[key];
        
        if (value !== null && value !== undefined && value !== '') {
          if (Array.isArray(value)) {
            // Convert arrays to JSON strings for FormData
            formDataToSend.append(key, JSON.stringify(value));
          } else {
            formDataToSend.append(key, value);
          }
        }
      });

      // Get CSRF token
      const csrfToken = getCSRFToken();
      
      // Send POST request to create new criminal
      const response = await fetch('http://localhost:8000/api/criminals/', {
        method: 'POST',
        body: formDataToSend,
        credentials: 'include', 
        headers: {
          'X-CSRFToken': csrfToken,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error response:', errorData);
        
        // Handle validation errors
        if (response.status === 400 && errorData) {
          setErrors(errorData);
          throw new Error('Please check the form for errors');
        }
        
        throw new Error(errorData.detail || 'Failed to create criminal record');
      }

      const result = await response.json();
      console.log('Criminal created successfully:', result);
      onSave();
      
    } catch (error) {
      console.error('Error creating criminal:', error);
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  // Options for select fields
  const genderOptions = [
    { value: 'M', label: 'Male' },
    { value: 'F', label: 'Female' },
    { value: 'O', label: 'Other' },
    { value: 'U', label: 'Unknown' }
  ];

  const threatLevelOptions = [
    { value: 'LOW', label: 'Low Threat' },
    { value: 'MEDIUM', label: 'Medium Threat' },
    { value: 'HIGH', label: 'High Threat' },
    { value: 'EXTREME', label: 'Extreme Threat' }
  ];

  const eyeColorOptions = [
    { value: 'BROWN', label: 'Brown' },
    { value: 'BLUE', label: 'Blue' },
    { value: 'GREEN', label: 'Green' },
    { value: 'HAZEL', label: 'Hazel' },
    { value: 'GRAY', label: 'Gray' },
    { value: 'BLACK', label: 'Black' },
    { value: 'OTHER', label: 'Other' }
  ];

  const hairColorOptions = [
    { value: 'BLACK', label: 'Black' },
    { value: 'BROWN', label: 'Brown' },
    { value: 'BLONDE', label: 'Blonde' },
    { value: 'RED', label: 'Red' },
    { value: 'GRAY', label: 'Gray' },
    { value: 'WHITE', label: 'White' },
    { value: 'BALD', label: 'Bald' },
    { value: 'OTHER', label: 'Other' }
  ];

  const buildOptions = [
    { value: 'SLENDER', label: 'Slender' },
    { value: 'AVERAGE', label: 'Average' },
    { value: 'ATHLETIC', label: 'Athletic' },
    { value: 'HEAVYSET', label: 'Heavyset' },
    { value: 'MUSCULAR', label: 'Muscular' },
    { value: 'STOCKY', label: 'Stocky' }
  ];

  const complexionOptions = [
    { value: 'FAIR', label: 'Fair' },
    { value: 'LIGHT', label: 'Light' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'OLIVE', label: 'Olive' },
    { value: 'DARK', label: 'Dark' },
    { value: 'DARK_BROWN', label: 'Dark Brown' },
    { value: 'BLACK', label: 'Black' }
  ];

  const maritalStatusOptions = [
    { value: 'SINGLE', label: 'Single' },
    { value: 'MARRIED', label: 'Married' },
    { value: 'DIVORCED', label: 'Divorced' },
    { value: 'WIDOWED', label: 'Widowed' },
    { value: 'SEPARATED', label: 'Separated' },
    { value: 'UNKNOWN', label: 'Unknown' }
  ];

  const educationOptions = [
    { value: 'NONE', label: 'No Formal Education' },
    { value: 'PRIMARY', label: 'Primary School' },
    { value: 'SECONDARY', label: 'Secondary School' },
    { value: 'HIGH_SCHOOL', label: 'High School' },
    { value: 'DIPLOMA', label: 'Diploma/Certificate' },
    { value: 'BACHELORS', label: 'Bachelor\'s Degree' },
    { value: 'MASTERS', label: 'Master\'s Degree' },
    { value: 'DOCTORATE', label: 'Doctorate' },
    { value: 'UNKNOWN', label: 'Unknown' }
  ];

  const employmentOptions = [
    { value: 'EMPLOYED', label: 'Employed' },
    { value: 'UNEMPLOYED', label: 'Unemployed' },
    { value: 'SELF_EMPLOYED', label: 'Self-Employed' },
    { value: 'STUDENT', label: 'Student' },
    { value: 'RETIRED', label: 'Retired' },
    { value: 'DISABLED', label: 'Disabled' },
    { value: 'INCARCERATED', label: 'Incarcerated' },
    { value: 'UNKNOWN', label: 'Unknown' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <Users className="w-6 h-6 mr-2 text-blue-600" />
          Add New Criminal
        </h2>
        <button
          onClick={onCancel}
          className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
          disabled={loading}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <span className="text-red-600">{errors.submit}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Basic Information</h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alias/Nickname</label>
            <input
              type="text"
              name="alias"
              value={formData.alias}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Place of Birth</label>
            <input
              type="text"
              name="place_of_birth"
              value={formData.place_of_birth}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Windhoek, Namibia"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
            <input
              type="text"
              name="nationality"
              value={formData.nationality}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Namibian"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              {genderOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Threat Level</label>
            <select
              name="threat_level"
              value={formData.threat_level}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              {threatLevelOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Physical Description Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Physical Description</h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
            <input
              type="text"
              name="height"
              value={formData.height}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 180 cm"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
            <input
              type="text"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 85 kg"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Eye Color</label>
            <select
              name="eye_color"
              value={formData.eye_color}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              <option value="">Select eye color</option>
              {eyeColorOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hair Color</label>
            <select
              name="hair_color"
              value={formData.hair_color}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              <option value="">Select hair color</option>
              {hairColorOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Build</label>
            <select
              name="build"
              value={formData.build}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              <option value="">Select build</option>
              {buildOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Complexion</label>
            <select
              name="complexion"
              value={formData.complexion}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              <option value="">Select complexion</option>
              {complexionOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Distinguishing Marks</label>
            <textarea
              name="distinguishing_marks"
              value={formData.distinguishing_marks}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tattoos, scars, birthmarks, etc."
              disabled={loading}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Physical Characteristics</label>
            <textarea
              name="physical_characteristics"
              value={formData.physical_characteristics}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Detailed physical description"
              disabled={loading}
            />
          </div>
        </div>

        {/* Biometric Data Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Biometric Data</h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fingerprint Code</label>
            <input
              type="text"
              name="fingerprint_code"
              value={formData.fingerprint_code}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., FP-NAM-12345"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">DNA Profile</label>
            <input
              type="text"
              name="dna_profile"
              value={formData.dna_profile}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., DNA-NAM-67890"
              disabled={loading}
            />
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Personal Information</h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
            <select
              name="marital_status"
              value={formData.marital_status}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              {maritalStatusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Education Level</label>
            <select
              name="education_level"
              value={formData.education_level}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              {educationOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employment Status</label>
            <select
              name="employment_status"
              value={formData.employment_status}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              {employmentOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
            <input
              type="text"
              name="occupation"
              value={formData.occupation}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Former construction worker"
              disabled={loading}
            />
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="grid grid-cols-1 gap-4">
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Contact Information</h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Known Address</label>
            <textarea
              name="last_known_address"
              value={formData.last_known_address}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter full address"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Numbers</label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter phone number"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={addPhoneNumber}
                  className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
                  disabled={loading}
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.phone_numbers.map((phone, index) => (
                  <div key={index} className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {phone}
                    <button
                      type="button"
                      onClick={() => removePhoneNumber(index)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                      disabled={loading}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Addresses</label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email address"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={addEmailAddress}
                  className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
                  disabled={loading}
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.email_addresses.map((email, index) => (
                  <div key={index} className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    {email}
                    <button
                      type="button"
                      onClick={() => removeEmailAddress(index)}
                      className="ml-2 text-green-600 hover:text-green-800"
                      disabled={loading}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Known Associates</label>
            <textarea
              name="known_associates"
              value={formData.known_associates}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Names and relationships of known associates"
              disabled={loading}
            />
          </div>
        </div>

        {/* Criminal Profile Section */}
        <div className="grid grid-cols-1 gap-4">
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Criminal Profile</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Criminal History</label>
              <textarea
                name="criminal_history"
                value={formData.criminal_history}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Summary of criminal history and previous offenses"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Modus Operandi</label>
              <textarea
                name="modus_operandi"
                value={formData.modus_operandi}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Criminal's methods and patterns"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gang Affiliations</label>
              <textarea
                name="gang_affiliations"
                value={formData.gang_affiliations}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Gang memberships or affiliations"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weapons Preference</label>
              <textarea
                name="weapons_preference"
                value={formData.weapons_preference}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Preferred weapons or tools"
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="escape_risk"
                checked={formData.escape_risk}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                disabled={loading}
              />
              <span className="ml-2 text-sm text-gray-700">Escape Risk</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="violent_offender"
                checked={formData.violent_offender}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                disabled={loading}
              />
              <span className="ml-2 text-sm text-gray-700">Violent Offender</span>
            </label>
          </div>
        </div>

        {/* Medical & Psychological Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Medical & Psychological</h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Medical Conditions</label>
            <textarea
              name="medical_conditions"
              value={formData.medical_conditions}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Medical conditions and history"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Psychological Profile</label>
            <textarea
              name="psychological_profile"
              value={formData.psychological_profile}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Psychological assessment and history"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Drug Use History</label>
            <textarea
              name="drug_use_history"
              value={formData.drug_use_history}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Substance abuse history"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alcohol Use History</label>
            <textarea
              name="alcohol_use_history"
              value={formData.alcohol_use_history}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Alcohol consumption history"
              disabled={loading}
            />
          </div>
        </div>

        {/* Incarceration Information Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Incarceration Information</h3>
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="is_incarcerated"
                checked={formData.is_incarcerated}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                disabled={loading}
              />
              <span className="ml-2 text-sm text-gray-700">Currently Incarcerated</span>
            </label>
          </div>

          {formData.is_incarcerated && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Facility</label>
                <input
                  type="text"
                  name="current_facility"
                  value={formData.current_facility}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter facility name"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Incarceration Date</label>
                <input
                  type="date"
                  name="incarceration_date"
                  value={formData.incarceration_date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expected Release Date</label>
                <input
                  type="date"
                  name="expected_release_date"
                  value={formData.expected_release_date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
              </div>
            </>
          )}
        </div>

        {/* Profile Picture and Description Section */}
        <div className="grid grid-cols-1 gap-4">
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Additional Information</h3>
          </div>

          {/* Profile Picture Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
            <div className="flex items-center space-x-6">
              {imagePreview ? (
                <div className="flex-shrink-0">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="h-20 w-20 rounded-full object-cover border-2 border-gray-300"
                  />
                </div>
              ) : (
                <div className="flex-shrink-0 h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center border-2 border-dashed border-gray-300">
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
              )}
              
              <div className="flex-1">
                <input
                  type="file"
                  id="profile-picture"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={loading}
                />
                <label 
                  htmlFor="profile-picture" 
                  className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {formData.profile_picture ? 'Change Image' : 'Upload Image'}
                </label>
                
                {formData.profile_picture && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="ml-3 text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
                    disabled={loading}
                  >
                    Remove
                  </button>
                )}
                
                {errors.image && (
                  <p className="mt-1 text-sm text-red-600">{errors.image}</p>
                )}
                
                <p className="mt-1 text-xs text-gray-500">
                  JPG, PNG, or GIF. Max 5MB.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter additional description, notes, or observations"
              disabled={loading}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Create Criminal Record
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

// Officer Form Component
const OfficerForm = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    first_name: '',
    last_name: '',
    email: '',
    badge_number: '',
    rank: 'CONSTABLE',
    station: '',
    is_active: true
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const csrfToken = getCSRFToken();
      
      const response = await fetch('http://localhost:8000/api/auth/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error response:', errorData);
        
        if (response.status === 400 && errorData) {
          setErrors(errorData);
          throw new Error('Please check the form for errors');
        }
        
        throw new Error(errorData.detail || 'Failed to create officer account');
      }

      const result = await response.json();
      console.log('Officer created successfully:', result);
      onSave();
      
    } catch (error) {
      console.error('Error creating officer:', error);
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  const rankOptions = [
    { value: 'CONSTABLE', label: 'Constable' },
    { value: 'SERGEANT', label: 'Sergeant' },
    { value: 'INSPECTOR', label: 'Inspector' },
    { value: 'CAPTAIN', label: 'Captain' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <Badge className="w-6 h-6 mr-2 text-blue-600" />
          Add New Police Officer
        </h2>
        <button
          onClick={onCancel}
          className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
          disabled={loading}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <span className="text-red-600">{errors.submit}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Account Information */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Account Information</h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username *
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter username"
              required
              disabled={loading}
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
              required
              disabled={loading}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name *
            </label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter first name"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name *
            </label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter last name"
              required
              disabled={loading}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter email address"
                disabled={loading}
              />
            </div>
          </div>

          {/* Officer Details */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-2 mt-6">Officer Details</h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Badge Number *
            </label>
            <input
              type="text"
              name="badge_number"
              value={formData.badge_number}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter badge number"
              required
              disabled={loading}
            />
            {errors.badge_number && (
              <p className="mt-1 text-sm text-red-600">{errors.badge_number}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rank
            </label>
            <select
              name="rank"
              value={formData.rank}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              {rankOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Station *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                name="station"
                value={formData.station}
                onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter station name"
                required
                disabled={loading}
              />
            </div>
          </div>

                    <div className="md:col-span-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                disabled={loading}
              />
              <span className="ml-2 text-sm text-gray-700">Active Officer</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled: cursor-not-allowed flex items-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Create Officer Account
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

// Crime Form Component
const CrimeForm = ({ onSave, onCancel, criminals, officers, loadingData }) => {
  const [formData, setFormData] = useState({
    criminal: '',
    crime_type: 'THEFT',
    description: '',
    date_committed: '',
    location: '',
    arresting_officer: '',
    status: 'OPEN'
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const csrfToken = getCSRFToken();
      
      const response = await fetch('http://localhost:8000/api/crimes/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error response:', errorData);
        
        if (response.status === 400 && errorData) {
          setErrors(errorData);
          throw new Error('Please check the form for errors');
        }
        
        throw new Error(errorData.detail || 'Failed to create crime record');
      }

      const result = await response.json();
      console.log('Crime created successfully:', result);
      onSave();
      
    } catch (error) {
      console.error('Error creating crime:', error);
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  const crimeTypeOptions = [
    { value: 'THEFT', label: 'Theft' },
    { value: 'ASSAULT', label: 'Assault' },
    { value: 'BURGLARY', label: 'Burglary' },
    { value: 'ROBBERY', label: 'Robbery' },
    { value: 'DRUGS', label: 'Drug Offense' },
    { value: 'FRAUD', label: 'Fraud' },
    { value: 'HOMICIDE', label: 'Homicide' },
    { value: 'OTHER', label: 'Other' }
  ];

  const statusOptions = [
    { value: 'OPEN', label: 'Open Investigation' },
    { value: 'CLOSED', label: 'Case Closed' },
    { value: 'CONVICTED', label: 'Convicted' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <Scale className="w-6 h-6 mr-2 text-blue-600" />
          Add New Crime Record
        </h2>
        <button
          onClick={onCancel}
          className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
          disabled={loading}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <span className="text-red-600">{errors.submit}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Crime Information */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Crime Information</h3>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Criminal *
            </label>
            <select
              name="criminal"
              value={formData.criminal}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading || loadingData}
            >
              <option value="">Select a criminal</option>
              {criminals.map(criminal => (
                <option key={criminal.id} value={criminal.id}>
                  {criminal.first_name} {criminal.last_name} {criminal.alias ? `(${criminal.alias})` : ''}
                </option>
              ))}
            </select>
            {errors.criminal && (
              <p className="mt-1 text-sm text-red-600">{errors.criminal}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Crime Type *
            </label>
            <select
              name="crime_type"
              value={formData.crime_type}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
            >
              {crimeTypeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
                       </select>
            {errors.crime_type && (
              <p className="mt-1 text-sm text-red-600">{errors.crime_type}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter crime location"
                required
                disabled={loading}
              />
            </div>
            {errors.location && (
              <p className="mt-1 text-sm text-red-600">{errors.location}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Committed *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="date"
                name="date_committed"
                value={formData.date_committed}
                onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={loading}
              />
            </div>
            {errors.date_committed && (
              <p className="mt-1 text-sm text-red-600">{errors.date_committed}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Arresting Officer
            </label>
            <select
              name="arresting_officer"
              value={formData.arresting_officer}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading || loadingData}
            >
              <option value="">Select an officer</option>
              {officers.map(officer => (
                <option key={officer.id} value={officer.id}>
                  {officer.badge_number} - {officer.user?.first_name} {officer.user?.last_name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter crime description, details, evidence, etc."
              required
              disabled={loading}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Create Crime Record
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

// Evidence Form Component
const EvidenceForm = ({ onSave, onCancel, criminals, loadingData }) => {
  const [formData, setFormData] = useState({
    criminal: '',
    evidence_type: 'PHOTO',
    description: '',
    date_collected: new Date().toISOString().split('T')[0],
    collected_by: '', // This will be set automatically
    file: null
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [filePreview, setFilePreview] = useState(null);
  const [currentOfficer, setCurrentOfficer] = useState(null);

  // Fetch current officer on component mount
  useEffect(() => {
    const fetchCurrentOfficer = async () => {
      try {
        // First get the current user
        const userResponse = await fetch('http://localhost:8000/api/auth/check/', {
          credentials: 'include',
        });
        
        if (userResponse.ok) {
          const userData = await userResponse.json();
          
          // Then get the officer details
          const officerResponse = await fetch('http://localhost:8000/api/officers/', {
            credentials: 'include',
          });
          
          if (officerResponse.ok) {
            const officersData = await officerResponse.json();
            const officers = officersData.results || officersData;
            
            // Find the officer associated with the current user
            const officer = officers.find(o => o.user?.id === userData.user_id || o.user?.username === userData.username);
            
            if (officer) {
              setCurrentOfficer(officer);
              // Set the collected_by field to the officer's ID
              setFormData(prev => ({ ...prev, collected_by: officer.id }));
            }
          }
        }
      } catch (error) {
        console.error('Error fetching current officer:', error);
      }
    };

    fetchCurrentOfficer();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, file }));
      setErrors(prev => ({ ...prev, file: '' }));
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => setFilePreview(e.target.result);
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  const removeFile = () => {
    setFormData(prev => ({ ...prev, file: null }));
    setFilePreview(null);
    setErrors(prev => ({ ...prev, file: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const formDataToSend = new FormData();
      
      // Append all form fields to FormData
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined && formData[key] !== '') {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Get CSRF token
      const csrfToken = getCSRFToken();
      
      const response = await fetch('http://localhost:8000/api/criminal-evidence/', {
        method: 'POST',
        body: formDataToSend,
        credentials: 'include',
        headers: {
          'X-CSRFToken': csrfToken,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error response:', errorData);
        
        if (response.status === 400 && errorData) {
          setErrors(errorData);
          throw new Error('Please check the form for errors');
        }
        
        throw new Error(errorData.detail || 'Failed to create evidence record');
      }

      const result = await response.json();
      console.log('Evidence created successfully:', result);
      onSave();
      
    } catch (error) {
      console.error('Error creating evidence:', error);
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  const evidenceTypeOptions = [
    { value: 'PHOTO', label: 'Photograph' },
    { value: 'VIDEO', label: 'Video Recording' },
    { value: 'AUDIO', label: 'Audio Recording' },
    { value: 'DOCUMENT', label: 'Document' },
    { value: 'WEAPON', label: 'Weapon' },
    { value: 'OTHER', label: 'Other Evidence' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <FileSearch className="w-6 h-6 mr-2 text-blue-600" />
          Add New Evidence
        </h2>
        <button
          onClick={onCancel}
          className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
          disabled={loading}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <span className="text-red-600">{errors.submit}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Evidence Information */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Evidence Information</h3>
          </div>

          {/* Current Officer (Read-only) */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Collected By (Current Officer)
            </label>
            <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
              <Badge className="w-4 h-4 text-gray-500 mr-2" />
              <span className="text-gray-700">
                {currentOfficer ? (
                  <>
                    {currentOfficer.user?.first_name} {currentOfficer.user?.last_name} 
                    {currentOfficer.badge_number && ` (Badge: ${currentOfficer.badge_number})`}
                    {currentOfficer.rank && ` - ${currentOfficer.rank}`}
                  </>
                ) : (
                  'Loading officer information...'
                )}
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              This field is automatically set to the currently logged-in officer
            </p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Criminal *
            </label>
            <select
              name="criminal"
              value={formData.criminal}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading || loadingData}
            >
              <option value="">Select a criminal</option>
              {criminals.map(criminal => (
                <option key={criminal.id} value={criminal.id}>
                  {criminal.first_name} {criminal.last_name} {criminal.alias ? `(${criminal.alias})` : ''}
                </option>
              ))}
            </select>
            {errors.criminal && (
              <p className="mt-1 text-sm text-red-600">{errors.criminal}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Evidence Type
            </label>
            <select
              name="evidence_type"
              value={formData.evidence_type}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              {evidenceTypeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Collected
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="date"
                name="date_collected"
                value={formData.date_collected}
                onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>
          </div>

          {/* File Upload */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Evidence File *
            </label>
            
            <div className="flex items-center space-x-6">
              {/* File Preview */}
              {filePreview ? (
                <div className="flex-shrink-0">
                  <img 
                    src={filePreview} 
                    alt="Preview" 
                    className="h-20 w-20 object-cover border-2 border-gray-300 rounded-lg"
                  />
                </div>
              ) : formData.file ? (
                <div className="flex-shrink-0 h-20 w-20 bg-gray-200 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                  <FileBox className="h-8 w-8 text-gray-400" />
                </div>
              ) : null}
              
              {/* Upload Controls */}
              <div className="flex-1">
                <input
                  type="file"
                  id="evidence-file"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={loading}
                />
                <label 
                  htmlFor="evidence-file" 
                  className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {formData.file ? 'Change File' : 'Upload Evidence File'}
                </label>
                
                {formData.file && (
                  <button
                    type="button"
                    onClick={removeFile}
                    className="ml-3 text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
                    disabled={loading}
                  >
                    Remove
                  </button>
                )}
                
                {errors.file && (
                  <p className="mt-1 text-sm text-red-600">{errors.file}</p>
                )}
                
                <p className="mt-1 text-xs text-gray-500">
                  All file types accepted
                </p>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter evidence description, where it was found, relevance to case, etc."
              disabled={loading}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !currentOfficer}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Add Evidence
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

// Helper function to get CSRF token from cookies
const getCSRFToken = () => {
  const name = 'csrftoken=';
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
};

export default RecordManagement;