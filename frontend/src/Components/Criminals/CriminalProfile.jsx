import React, { useState } from 'react';
import { 
  User, Edit, Save, X, ArrowLeft, Shield, Calendar, 
  VenusMars, FileText, Hash, Camera, Download, Trash2,
  AlertCircle, MapPin, Clock, Eye, Plus, Minus
} from 'lucide-react';

const CriminalProfile = ({ criminal, onBack, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(criminal);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('details');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditedData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!editedData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }
    
    if (!editedData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(`http://localhost:8000/api/criminals/${criminal.id}/`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update criminal record');
      }
      
      const updatedCriminal = await response.json();
      
      if (onUpdate) {
        onUpdate(updatedCriminal);
      }
      
      setIsEditing(false);
      
    } catch (error) {
      console.error('Error updating criminal:', error);
      setErrors(prev => ({ ...prev, submit: error.message }));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this criminal record? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(`http://localhost:8000/api/criminals/${criminal.id}/`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete criminal record');
      }
      
      if (onBack) {
        onBack();
      }
      
    } catch (error) {
      console.error('Error deleting criminal:', error);
      setErrors(prev => ({ ...prev, submit: error.message }));
    } finally {
      setLoading(false);
    }
  };

  const getThreatLevelColor = (level) => {
    switch(level) {
      case 'EXTREME': return 'bg-red-100 text-red-800 border border-red-200';
      case 'HIGH': return 'bg-orange-100 text-orange-800 border border-orange-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'LOW': return 'bg-green-100 text-green-800 border border-green-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getGenderText = (gender) => {
    switch(gender) {
      case 'M': return 'Male';
      case 'F': return 'Female';
      case 'O': return 'Other';
      case 'U': return 'Unknown';
      default: return gender;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 mr-3"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <User className="w-6 h-6 mr-2 text-blue-600" />
            Criminal Profile
          </h2>
        </div>
        
        <div className="flex space-x-2">
          {!isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </>
                )}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <span className="text-red-800">{errors.submit}</span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {['details', 'crimes', 'evidence', 'documents'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'details' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Section */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                {criminal.profile_picture_url ? (
                  <img
                    src={criminal.profile_picture_url}
                    alt={`${criminal.first_name} ${criminal.last_name}`}
                    className="w-32 h-32 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 text-gray-400" />
                )}
              </div>
              
              <h3 className="text-xl font-bold text-gray-800">
                {criminal.first_name} {criminal.last_name}
              </h3>
              
              {criminal.alias && (
                <p className="text-gray-600 italic">"{criminal.alias}"</p>
              )}
              
              <div className="mt-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getThreatLevelColor(criminal.threat_level)}`}>
                  {criminal.threat_level} Threat
                </span>
              </div>
              
              <div className="mt-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  criminal.is_incarcerated 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                  {criminal.is_incarcerated ? 'In Custody' : 'At Large'}
                </span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-6 bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-800 mb-4">Quick Stats</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Crimes Count</span>
                  <span className="font-semibold">{criminal.crimes_count || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Evidence Items</span>
                  <span className="font-semibold">{criminal.evidence?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Documents</span>
                  <span className="font-semibold">{criminal.documents?.length || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="lg:col-span-2">
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-500" />
                Personal Details
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="first_name"
                      value={editedData.first_name}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.first_name ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  ) : (
                    <p className="text-gray-900">{criminal.first_name}</p>
                  )}
                  {errors.first_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="last_name"
                      value={editedData.last_name}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.last_name ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  ) : (
                    <p className="text-gray-900">{criminal.last_name}</p>
                  )}
                  {errors.last_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alias/Nickname</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="alias"
                      value={editedData.alias || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{criminal.alias || 'None'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  {isEditing ? (
                    <input
                      type="date"
                      name="date_of_birth"
                      value={editedData.date_of_birth || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{formatDate(criminal.date_of_birth)}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  {isEditing ? (
                    <select
                      name="gender"
                      value={editedData.gender}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                      <option value="O">Other</option>
                      <option value="U">Unknown</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">{getGenderText(criminal.gender)}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Threat Level</label>
                  {isEditing ? (
                    <select
                      name="threat_level"
                      value={editedData.threat_level}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="EXTREME">Extreme</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">{criminal.threat_level}</p>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Incarceration Status</label>
                {isEditing ? (
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="is_incarcerated"
                      checked={editedData.is_incarcerated}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Currently incarcerated</span>
                  </label>
                ) : (
                  <p className="text-gray-900">{criminal.is_incarcerated ? 'Yes' : 'No'}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mt-6 bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-800 mb-4">Description</h4>
              {isEditing ? (
                <textarea
                  name="description"
                  value={editedData.description || ''}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter description..."
                />
              ) : (
                <p className="text-gray-900 whitespace-pre-wrap">
                  {criminal.description || 'No description available.'}
                </p>
              )}
            </div>

            {/* Physical Characteristics */}
            <div className="mt-6 bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-800 mb-4">Physical Characteristics</h4>
              {isEditing ? (
                <textarea
                  name="physical_characteristics"
                  value={editedData.physical_characteristics || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter physical characteristics..."
                />
              ) : (
                <p className="text-gray-900 whitespace-pre-wrap">
                  {criminal.physical_characteristics || 'No physical characteristics recorded.'}
                </p>
              )}
            </div>

            {/* System Information */}
            <div className="mt-6 bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-800 mb-4">System Information</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">ID:</span>
                  <p className="text-gray-900 font-mono">{criminal.id}</p>
                </div>
                <div>
                  <span className="text-gray-600">Created:</span>
                  <p className="text-gray-900">{formatDateTime(criminal.created_at)}</p>
                </div>
                <div>
                  <span className="text-gray-600">Last Updated:</span>
                  <p className="text-gray-900">{formatDateTime(criminal.updated_at)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Other Tabs Content */}
      {activeTab === 'crimes' && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="font-semibold text-gray-800 mb-4">Associated Crimes</h4>
          {criminal.crimes_count > 0 ? (
            <p className="text-gray-600">Crimes list would be displayed here.</p>
          ) : (
            <p className="text-gray-600">No crimes associated with this criminal.</p>
          )}
        </div>
      )}

      {activeTab === 'evidence' && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="font-semibold text-gray-800 mb-4">Evidence</h4>
          {criminal.evidence && criminal.evidence.length > 0 ? (
            <p className="text-gray-600">Evidence list would be displayed here.</p>
          ) : (
            <p className="text-gray-600">No evidence associated with this criminal.</p>
          )}
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="font-semibold text-gray-800 mb-4">Documents</h4>
          {criminal.documents && criminal.documents.length > 0 ? (
            <p className="text-gray-600">Documents list would be displayed here.</p>
          ) : (
            <p className="text-gray-600">No documents associated with this criminal.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CriminalProfile;




//form handler
const [selectedCriminal, setSelectedCriminal] = useState(null);

// Handle back navigation
const handleBack = () => {
  setSelectedCriminal(null);
};

// Handle criminal update
const handleCriminalUpdate = (updatedCriminal) => {
  // Update criminal list state
  console.log('Criminal updated:', updatedCriminal);
};

// Render the profile
{selectedCriminal && (
  <CriminalProfile 
    criminal={selectedCriminal}
    onBack={handleBack}
    onUpdate={handleCriminalUpdate}
  />
)}