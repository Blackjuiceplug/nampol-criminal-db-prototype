import React, { useState } from 'react';
import { 
  User, Save, X, Upload, Camera, AlertCircle, 
  Shield, Calendar, VenusMars, FileText, Hash
} from 'lucide-react';

const CriminalForm = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    alias: '',
    date_of_birth: '',
    gender: 'U',
    threat_level: 'LOW',
    description: '',
    physical_characteristics: '',
    is_incarcerated: false
  });
  
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, profile_picture: 'Please select an image file' }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({ ...prev, profile_picture: 'Image must be less than 5MB' }));
        return;
      }
      setProfilePicture(file);
      setErrors(prev => ({ ...prev, profile_picture: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }
    
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }
    
    if (formData.threat_level === 'EXTREME' && !formData.description.trim()) {
      newErrors.description = 'Description is required for EXTREME threat level';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const submitData = new FormData();
      
      // Append form data
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          submitData.append(key, formData[key]);
        }
      });
      
      // Append profile picture if selected
      if (profilePicture) {
        submitData.append('profile_picture', profilePicture);
      }
      
      const response = await fetch('http://localhost:8000/api/criminals/', {
        method: 'POST',
        credentials: 'include',
        body: submitData,
        // Note: Don't set Content-Type header for FormData - browser will set it automatically with boundary
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create criminal record');
      }
      
      const result = await response.json();
      
      if (onSave) {
        onSave(result);
      }
      
    } catch (error) {
      console.error('Error creating criminal:', error);
      setErrors(prev => ({ ...prev, submit: error.message }));
    } finally {
      setLoading(false);
    }
  };

  const threatLevelOptions = [
    { value: 'LOW', label: 'Low Threat', color: 'text-green-600' },
    { value: 'MEDIUM', label: 'Medium Threat', color: 'text-yellow-600' },
    { value: 'HIGH', label: 'High Threat', color: 'text-orange-600' },
    { value: 'EXTREME', label: 'Extreme Threat', color: 'text-red-600' }
  ];

  const genderOptions = [
    { value: 'M', label: 'Male' },
    { value: 'F', label: 'Female' },
    { value: 'O', label: 'Other' },
    { value: 'U', label: 'Unknown' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <User className="w-6 h-6 mr-2 text-blue-600" />
          Add New Criminal
        </h2>
        <button
          onClick={onCancel}
          className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <span className="text-red-800">{errors.submit}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-500" />
              Basic Information
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.first_name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter first name"
              />
              {errors.first_name && (
                <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>
              )}
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
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.last_name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter last name"
              />
              {errors.last_name && (
                <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alias/Nickname
              </label>
              <input
                type="text"
                name="alias"
                value={formData.alias}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter alias or nickname"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {genderOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Profile Picture & Threat Level */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profile Picture
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <input
                  type="file"
                  id="profile-picture"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="profile-picture" className="cursor-pointer">
                  {profilePicture ? (
                    <div className="flex flex-col items-center">
                      <img
                        src={URL.createObjectURL(profilePicture)}
                        alt="Preview"
                        className="w-24 h-24 rounded-full object-cover mb-2"
                      />
                      <span className="text-sm text-blue-600">Change Image</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Camera className="w-12 h-12 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">Click to upload photo</span>
                      <span className="text-xs text-gray-500">JPG, PNG (Max 5MB)</span>
                    </div>
                  )}
                </label>
                {errors.profile_picture && (
                  <p className="text-red-500 text-sm mt-2">{errors.profile_picture}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Shield className="w-4 h-4 mr-1 text-red-500" />
                Threat Level
              </label>
              <select
                name="threat_level"
                value={formData.threat_level}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {threatLevelOptions.map(option => (
                  <option key={option.value} value={option.value} className={option.color}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FileText className="w-4 h-4 mr-1 text-gray-500" />
                Incarceration Status
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="is_incarcerated"
                  checked={formData.is_incarcerated}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Currently incarcerated</span>
              </label>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter physical description, known behaviors, modus operandi, etc."
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        {/* Physical Characteristics */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Physical Characteristics
          </label>
          <textarea
            name="physical_characteristics"
            value={formData.physical_characteristics}
            onChange={handleInputChange}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Height, weight, eye color, hair color, distinguishing features, tattoos, scars, etc."
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

export default CriminalForm;



// form handler
const [showForm, setShowForm] = useState(false);

// Handle form submission
const handleCriminalSaved = (newCriminal) => {
  console.log('New criminal created:', newCriminal);
  setShowForm(false);
  // Refresh your criminal list here
};

// Render the form
{showForm && (
  <CriminalForm 
    onSave={handleCriminalSaved}
    onCancel={() => setShowForm(false)}
  />
)}