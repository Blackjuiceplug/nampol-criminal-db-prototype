import React, { useState, useEffect } from 'react';
import { 
  User, Search, Plus, Filter, Download, MoreVertical, 
  Shield, AlertCircle, Edit, Trash2, Eye, FileText,
  Wifi, WifiOff, RefreshCw, CheckCircle, XCircle, Database,
  MapPin, Scale, Calendar, Fingerprint, Clock, Award,
  Mail, Phone, Globe, Camera, X, Save, Upload,
  SaveAll, Image, UserPlus, Lock, Unlock, Flag,
  BarChart3, Users, ShieldAlert, Activity, ChevronDown,
  Building, Heart, Brain, Pill, Wine, Target
} from 'lucide-react';

const CriminalList = () => {
  const [criminals, setCriminals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [threatFilter, setThreatFilter] = useState('all');
  const [selectedCriminal, setSelectedCriminal] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [apiStatus, setApiStatus] = useState('connecting');
  const [apiMessage, setApiMessage] = useState('Connecting to criminal database...');
  const [showApiAlert, setShowApiAlert] = useState(true);
  const [editingCriminal, setEditingCriminal] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [fullCriminalData, setFullCriminalData] = useState(null);
  const [loadingFullData, setLoadingFullData] = useState(false);

  // Fetch all criminals
  const fetchCriminals = async () => {
    try {
      setLoading(true);
      setApiStatus('connecting');
      setApiMessage('Connecting to criminal database...');
      setShowApiAlert(true);

      const response = await fetch('http://localhost:8000/api/criminals/', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      setCriminals(data);
      setApiStatus('connected');
      setApiMessage('Successfully connected to criminal database API');
      
      setTimeout(() => setShowApiAlert(false), 3000);
      
    } catch (error) {
      console.error('Error fetching criminals:', error);
      setApiStatus('error');
      setApiMessage(`Failed to connect to API: ${error.message}`);
      setCriminals([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch complete criminal data for modal
  const fetchFullCriminalData = async (criminalId) => {
    setLoadingFullData(true);
    try {
      const response = await fetch(`http://localhost:8000/api/criminals/${criminalId}/`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setFullCriminalData(data);
        setEditingCriminal(data);
      }
    } catch (error) {
      console.error('Error fetching criminal details:', error);
    } finally {
      setLoadingFullData(false);
    }
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'Unknown';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  useEffect(() => {
    fetchCriminals();
    const intervalId = setInterval(fetchCriminals, 30000);
    return () => clearInterval(intervalId);
  }, []);

  // Filter criminals
  const filteredCriminals = criminals.filter(criminal => {
    const matchesSearch = !searchQuery || 
      criminal.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      criminal.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (criminal.alias && criminal.alias.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'incarcerated' && criminal.is_incarcerated) ||
      (statusFilter === 'at_large' && !criminal.is_incarcerated);
    
    const matchesThreat = threatFilter === 'all' || criminal.threat_level === threatFilter;
    
    return matchesSearch && matchesStatus && matchesThreat;
  });

  const viewCriminalDetails = async (criminal) => {
    setSelectedCriminal(criminal);
    setShowDetailModal(true);
    await fetchFullCriminalData(criminal.id);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setEditingCriminal(fullCriminalData || selectedCriminal);
    }
  };

  const handleEditChange = (field, value) => {
    setEditingCriminal(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaveLoading(true);
      const response = await fetch(`http://localhost:8000/api/criminals/${editingCriminal.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(editingCriminal),
      });

      if (response.ok) {
        const updatedCriminal = await response.json();
        setSelectedCriminal(updatedCriminal);
        setEditingCriminal(updatedCriminal);
        setFullCriminalData(updatedCriminal);
        setIsEditing(false);
        await fetchCriminals();
      } else {
        throw new Error('Failed to update criminal record');
      }
    } catch (error) {
      console.error('Error updating criminal:', error);
      alert('Failed to update criminal record. Please try again.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingCriminal(fullCriminalData || selectedCriminal);
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Get threat level styling
  const getThreatLevelColor = (level) => {
    switch (level) {
      case 'EXTREME': return 'bg-red-100 text-red-800 border-red-200';
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LOW': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getThreatLevelIcon = (level) => {
    switch (level) {
      case 'EXTREME': return <ShieldAlert className="h-4 w-4" />;
      case 'HIGH': return <AlertCircle className="h-4 w-4" />;
      case 'MEDIUM': return <Activity className="h-4 w-4" />;
      case 'LOW': return <User className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  // Get initials for avatar
  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  // Statistics
  const stats = {
    total: criminals.length,
    incarcerated: criminals.filter(c => c.is_incarcerated).length,
    atLarge: criminals.filter(c => !c.is_incarcerated).length,
    extremeThreat: criminals.filter(c => c.threat_level === 'EXTREME').length,
    highThreat: criminals.filter(c => c.threat_level === 'HIGH').length,
    violentOffenders: criminals.filter(c => c.violent_offender).length,
    escapeRisks: criminals.filter(c => c.escape_risk).length,
  };

  // Field display component
  const FieldDisplay = ({ label, value, icon: Icon, className = "" }) => (
    <div className={className}>
      <label className="flex items-center text-sm font-medium text-gray-500 mb-1">
        {Icon && <Icon className="h-4 w-4 mr-2" />}
        {label}
      </label>
      <p className="text-sm text-gray-900 font-medium">
        {value || 'Not specified'}
      </p>
    </div>
  );

  // Editable field component
  const EditableField = ({ label, name, value, type = "text", options, className = "" }) => (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-500 mb-1">{label}</label>
      {type === "select" ? (
        <select
          name={name}
          value={value || ''}
          onChange={(e) => handleEditChange(name, e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea
          name={name}
          value={value || ''}
          onChange={(e) => handleEditChange(name, e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      ) : type === "checkbox" ? (
        <label className="flex items-center">
          <input
            type="checkbox"
            name={name}
            checked={value || false}
            onChange={(e) => handleEditChange(name, e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">{label}</span>
        </label>
      ) : (
        <input
          type={type}
          name={name}
          value={value || ''}
          onChange={(e) => handleEditChange(name, e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      )}
    </div>
  );

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

  const displayData = fullCriminalData || selectedCriminal;
  const displayEditingData = editingCriminal || fullCriminalData || selectedCriminal;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Criminal Database</h1>
                <p className="text-sm text-gray-600">Namibian Police Force - Criminal Records Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={fetchCriminals}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                <Plus className="h-4 w-4" />
                <span>Add Record</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* API Status Alert */}
      {showApiAlert && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className={`rounded-lg p-4 flex items-center justify-between ${
            apiStatus === 'connected' 
              ? 'bg-green-50 border border-green-200' 
              : apiStatus === 'error'
              ? 'bg-red-50 border border-red-200'
              : 'bg-blue-50 border border-blue-200'
          }`}>
            <div className="flex items-center space-x-3">
              {apiStatus === 'connected' ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : apiStatus === 'error' ? (
                <XCircle className="h-5 w-5 text-red-600" />
              ) : (
                <Database className="h-5 w-5 text-blue-600 animate-pulse" />
              )}
              <span className="text-sm font-medium">{apiMessage}</span>
            </div>
            <button 
              onClick={() => setShowApiAlert(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Enhanced Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Records', value: stats.total, icon: Users, color: 'blue' },
            { label: 'In Custody', value: stats.incarcerated, icon: Shield, color: 'green' },
            { label: 'At Large', value: stats.atLarge, icon: AlertCircle, color: 'red' },
            { label: 'High+ Threat', value: stats.extremeThreat + stats.highThreat, icon: BarChart3, color: 'purple' },
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`bg-${stat.color}-100 p-3 rounded-lg`}>
                    <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Violent Offenders', value: stats.violentOffenders, icon: Target, color: 'red' },
            { label: 'Escape Risks', value: stats.escapeRisks, icon: Unlock, color: 'orange' },
            { label: 'Extreme Threat', value: stats.extremeThreat, icon: ShieldAlert, color: 'red' },
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-xl font-semibold text-gray-900">{stat.value}</p>
                </div>
                <div className={`bg-${stat.color}-100 p-2 rounded-lg`}>
                  <stat.icon className={`h-5 w-5 text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, alias, nationality, or address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
              >
                <option value="all">All Statuses</option>
                <option value="incarcerated">In Custody</option>
                <option value="at_large">At Large</option>
              </select>
              
              <select
                value={threatFilter}
                onChange={(e) => setThreatFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
              >
                <option value="all">All Threat Levels</option>
                <option value="EXTREME">Extreme</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>

              <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <Filter className="h-4 w-4" />
                <span>More Filters</span>
              </button>

              <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Criminal Records</h2>
            <p className="text-sm text-gray-600 mt-1">
              Showing {filteredCriminals.length} of {criminals.length} records
              {searchQuery && ` for "${searchQuery}"`}
            </p>
          </div>
        </div>

        {/* Criminal Records Table */}
        {loading ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading criminal database...</p>
            <p className="text-gray-500 text-sm mt-2">Please wait while we fetch the records</p>
          </div>
        ) : filteredCriminals.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery || statusFilter !== 'all' || threatFilter !== 'all' 
                ? 'No matching records found' 
                : 'No criminal records found'
              }
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              {searchQuery || statusFilter !== 'all' || threatFilter !== 'all'
                ? 'Try adjusting your search criteria or filters to find what you\'re looking for.'
                : 'Start by adding criminal records to build your database.'
              }
            </p>
            <button className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
              <Plus className="h-4 w-4" />
              <span>Add First Record</span>
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Criminal
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Personal Details
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Threat Level
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Crimes
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCriminals.map(criminal => (
                    <tr key={criminal.id} className="hover:bg-gray-50 cursor-pointer">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {criminal.profile_picture_url ? (
                              <img 
                                src={`http://localhost:8000${criminal.profile_picture_url}`} 
                                alt={`${criminal.first_name} ${criminal.last_name}`}
                                className="h-10 w-10 rounded-full object-cover border border-gray-300"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm border border-gray-300">
                                {getInitials(criminal.first_name, criminal.last_name)}
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {criminal.first_name} {criminal.last_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {criminal.alias ? `"${criminal.alias}"` : 'No alias'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {criminal.nationality || 'Nationality not specified'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {criminal.date_of_birth ? `${calculateAge(criminal.date_of_birth)} years` : 'Age unknown'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          criminal.is_incarcerated 
                            ? "bg-green-100 text-green-800" 
                            : "bg-red-100 text-red-800"
                        }`}>
                          {criminal.is_incarcerated ? "In Custody" : "At Large"}
                        </span>
                        {criminal.escape_risk && (
                          <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            Escape Risk
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getThreatLevelColor(criminal.threat_level)}`}>
                          {getThreatLevelIcon(criminal.threat_level)}
                          <span className="ml-1">{criminal.threat_level}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 text-gray-400 mr-1" />
                          {criminal.crimes_count || 0} crimes
                        </div>
                        {criminal.violent_offender && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 mt-1">
                            Violent
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button 
                            onClick={() => viewCriminalDetails(criminal)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button 
                            className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50"
                            title="Edit Record"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Enhanced Criminal Detail Modal */}
        {showDetailModal && selectedCriminal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-y-auto">
              {/* Header */}
              <div className="bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl sticky top-0 bg-white/95 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Shield className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {displayData?.first_name} {displayData?.last_name}
                      </h2>
                      <p className="text-sm text-gray-600">
                        Criminal Record #{displayData?.id?.substring(0, 8)} • {displayData?.nationality || 'Nationality not specified'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {isEditing ? (
                      <>
                        <button 
                          onClick={handleCancelEdit}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Cancel Editing"
                        >
                          <X className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={handleSave}
                          disabled={saveLoading}
                          className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Save Changes"
                        >
                          {saveLoading ? (
                            <RefreshCw className="h-5 w-5 animate-spin" />
                          ) : (
                            <Save className="h-5 w-5" />
                          )}
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={handleEditToggle}
                          className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Record"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => setShowDetailModal(false)}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Close"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Status Badges */}
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    displayData?.is_incarcerated 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    {displayData?.is_incarcerated ? "In Custody" : "At Large"}
                  </span>
                  
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getThreatLevelColor(displayData?.threat_level)}`}>
                    {getThreatLevelIcon(displayData?.threat_level)}
                    <span className="ml-1">{displayData?.threat_level} Threat</span>
                  </span>
                  
                  {displayData?.alias && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                      AKA: "{displayData.alias}"
                    </span>
                  )}

                  {displayData?.escape_risk && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                      <Unlock className="h-3 w-3 mr-1" />
                      Escape Risk
                    </span>
                  )}

                  {displayData?.violent_offender && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                      <Target className="h-3 w-3 mr-1" />
                      Violent Offender
                    </span>
                  )}
                </div>

                {/* Navigation Tabs */}
                <div className="flex space-x-1 mt-4 border-b border-gray-200">
                  {['overview', 'personal', 'physical', 'criminal', 'medical', 'incarceration'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                        activeTab === tab
                          ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Loading State */}
              {loadingFullData && (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-sm text-gray-600">Loading complete criminal data...</span>
                </div>
              )}

              {/* Main Content */}
              {!loadingFullData && displayData && (
                <div className="p-6">
                  {/* Overview Tab */}
                  {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Profile Column */}
                      <div className="lg:col-span-1">
                        <div className="bg-gray-50 rounded-lg p-6">
                          {displayData?.profile_picture_url ? (
                            <img 
                              src={`http://localhost:8000${displayData.profile_picture_url}`} 
                              alt={`${displayData.first_name} ${displayData.last_name}`}
                              className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-white shadow-lg"
                            />
                          ) : (
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-2xl mx-auto border-4 border-white shadow-lg">
                              {getInitials(displayData.first_name, displayData.last_name)}
                            </div>
                          )}
                          
                          <div className="mt-6 space-y-4">
                            <FieldDisplay 
                              label="Date of Birth" 
                              value={formatDate(displayData.date_of_birth)} 
                              icon={Calendar}
                            />
                            <FieldDisplay 
                              label="Age" 
                              value={displayData.date_of_birth ? `${calculateAge(displayData.date_of_birth)} years` : 'Unknown'} 
                              icon={User}
                            />
                            <FieldDisplay 
                              label="Place of Birth" 
                              value={displayData.place_of_birth} 
                              icon={MapPin}
                            />
                            <FieldDisplay 
                              label="Nationality" 
                              value={displayData.nationality} 
                              icon={Globe}
                            />
                          </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="bg-white border border-gray-200 rounded-lg p-4 mt-4">
                          <h4 className="font-medium text-gray-900 mb-3">Quick Stats</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Crimes Count:</span>
                              <span className="font-medium">{displayData.crimes_count || 0}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">High Risk:</span>
                              <span className={`font-medium ${displayData.is_high_risk ? 'text-red-600' : 'text-green-600'}`}>
                                {displayData.is_high_risk ? 'Yes' : 'No'}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Created:</span>
                              <span className="font-medium">{formatDate(displayData.created_at)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Details Column */}
                      <div className="lg:col-span-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Personal Information */}
                          <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                              <User className="h-5 w-5 mr-2 text-blue-600" />
                              Personal Information
                            </h3>
                            <div className="space-y-4">
                              <FieldDisplay label="Full Name" value={displayData.full_name} />
                              <FieldDisplay label="Alias" value={displayData.alias} />
                              <FieldDisplay label="Gender" value={displayData.gender === 'M' ? 'Male' : displayData.gender === 'F' ? 'Female' : displayData.gender === 'O' ? 'Other' : 'Unknown'} />
                              <FieldDisplay label="Marital Status" value={displayData.marital_status?.toLowerCase().replace('_', ' ')} />
                              <FieldDisplay label="Education Level" value={displayData.education_level?.toLowerCase().replace('_', ' ')} />
                              <FieldDisplay label="Employment Status" value={displayData.employment_status?.toLowerCase().replace('_', ' ')} />
                              <FieldDisplay label="Occupation" value={displayData.occupation} />
                            </div>
                          </div>

                          {/* Contact Information */}
                          <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                              <MapPin className="h-5 w-5 mr-2 text-green-600" />
                              Contact Information
                            </h3>
                            <div className="space-y-4">
                              <FieldDisplay label="Last Known Address" value={displayData.last_known_address} />
                              <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Phone Numbers</label>
                                {displayData.phone_numbers?.length > 0 ? (
                                  <div className="space-y-1">
                                    {displayData.phone_numbers.map((phone, index) => (
                                      <div key={index} className="flex items-center text-sm text-gray-900">
                                        <Phone className="h-3 w-3 mr-2 text-gray-400" />
                                        {phone}
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-sm text-gray-500">No phone numbers recorded</p>
                                )}
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Email Addresses</label>
                                {displayData.email_addresses?.length > 0 ? (
                                  <div className="space-y-1">
                                    {displayData.email_addresses.map((email, index) => (
                                      <div key={index} className="flex items-center text-sm text-gray-900">
                                        <Mail className="h-3 w-3 mr-2 text-gray-400" />
                                        {email}
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-sm text-gray-500">No email addresses recorded</p>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Physical Description */}
                          <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                              <User className="h-5 w-5 mr-2 text-purple-600" />
                              Physical Description
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                              <FieldDisplay label="Height" value={displayData.height} />
                              <FieldDisplay label="Weight" value={displayData.weight} />
                              <FieldDisplay label="Eye Color" value={displayData.eye_color} />
                              <FieldDisplay label="Hair Color" value={displayData.hair_color} />
                              <FieldDisplay label="Build" value={displayData.build} />
                              <FieldDisplay label="Complexion" value={displayData.complexion} />
                            </div>
                            {displayData.distinguishing_marks && (
                              <FieldDisplay label="Distinguishing Marks" value={displayData.distinguishing_marks} className="mt-4" />
                            )}
                            {displayData.physical_characteristics && (
                              <FieldDisplay label="Physical Characteristics" value={displayData.physical_characteristics} className="mt-4" />
                            )}
                          </div>

                          {/* Biometric Data */}
                          <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                              <Fingerprint className="h-5 w-5 mr-2 text-orange-600" />
                              Biometric Data
                            </h3>
                            <div className="space-y-4">
                              <FieldDisplay label="Fingerprint Code" value={displayData.fingerprint_code} />
                              <FieldDisplay label="DNA Profile" value={displayData.dna_profile} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Personal Information Tab */}
                  {activeTab === 'personal' && (
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                        <User className="h-5 w-5 mr-2 text-blue-600" />
                        Detailed Personal Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FieldDisplay label="First Name" value={displayData.first_name} />
                        <FieldDisplay label="Last Name" value={displayData.last_name} />
                        <FieldDisplay label="Full Name" value={displayData.full_name} />
                        <FieldDisplay label="Alias/Nickname" value={displayData.alias} />
                        <FieldDisplay label="Date of Birth" value={formatDate(displayData.date_of_birth)} />
                        <FieldDisplay label="Age" value={displayData.date_of_birth ? `${calculateAge(displayData.date_of_birth)} years` : 'Unknown'} />
                        <FieldDisplay label="Place of Birth" value={displayData.place_of_birth} />
                        <FieldDisplay label="Nationality" value={displayData.nationality} />
                        <FieldDisplay label="Gender" value={displayData.gender === 'M' ? 'Male' : displayData.gender === 'F' ? 'Female' : displayData.gender === 'O' ? 'Other' : 'Unknown'} />
                        <FieldDisplay label="Marital Status" value={displayData.marital_status?.toLowerCase().replace('_', ' ')} />
                        <FieldDisplay label="Education Level" value={displayData.education_level?.toLowerCase().replace('_', ' ')} />
                        <FieldDisplay label="Employment Status" value={displayData.employment_status?.toLowerCase().replace('_', ' ')} />
                        <FieldDisplay label="Occupation" value={displayData.occupation} />
                        <div className="md:col-span-2 lg:col-span-3">
                          <FieldDisplay label="Last Known Address" value={displayData.last_known_address} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Physical Characteristics Tab */}
                  {activeTab === 'physical' && (
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                        <User className="h-5 w-5 mr-2 text-purple-600" />
                        Physical Characteristics
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FieldDisplay label="Height" value={displayData.height} />
                        <FieldDisplay label="Weight" value={displayData.weight} />
                        <FieldDisplay label="Eye Color" value={displayData.eye_color} />
                        <FieldDisplay label="Hair Color" value={displayData.hair_color} />
                        <FieldDisplay label="Build" value={displayData.build} />
                        <FieldDisplay label="Complexion" value={displayData.complexion} />
                        <div className="md:col-span-2 lg:col-span-3">
                          <FieldDisplay label="Distinguishing Marks" value={displayData.distinguishing_marks} />
                        </div>
                        <div className="md:col-span-2 lg:col-span-3">
                          <FieldDisplay label="Physical Characteristics" value={displayData.physical_characteristics} />
                        </div>
                        <div className="md:col-span-2 lg:col-span-3">
                          <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                            <Fingerprint className="h-4 w-4 mr-2 text-orange-600" />
                            Biometric Data
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FieldDisplay label="Fingerprint Code" value={displayData.fingerprint_code} />
                            <FieldDisplay label="DNA Profile" value={displayData.dna_profile} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Criminal Profile Tab */}
                  {activeTab === 'criminal' && (
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                        <ShieldAlert className="h-5 w-5 mr-2 text-red-600" />
                        Criminal Profile
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-6">
                          <FieldDisplay label="Threat Level" value={displayData.threat_level} />
                          <FieldDisplay label="Crimes Count" value={displayData.crimes_count || 0} />
                          <div className="flex items-center space-x-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              displayData.is_high_risk ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {displayData.is_high_risk ? 'High Risk' : 'Low Risk'}
                            </span>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              displayData.violent_offender ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {displayData.violent_offender ? 'Violent Offender' : 'Non-Violent'}
                            </span>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              displayData.escape_risk ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {displayData.escape_risk ? 'Escape Risk' : 'Low Escape Risk'}
                            </span>
                          </div>
                          <FieldDisplay label="Known Associates" value={displayData.known_associates} />
                          <FieldDisplay label="Gang Affiliations" value={displayData.gang_affiliations} />
                          <FieldDisplay label="Weapons Preference" value={displayData.weapons_preference} />
                        </div>
                        <div className="space-y-6">
                          <FieldDisplay 
                            label="Criminal History" 
                            value={displayData.criminal_history} 
                            className="md:col-span-2"
                          />
                          <FieldDisplay 
                            label="Modus Operandi" 
                            value={displayData.modus_operandi} 
                            className="md:col-span-2"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Medical & Psychological Tab */}
                  {activeTab === 'medical' && (
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                        <Heart className="h-5 w-5 mr-2 text-green-600" />
                        Medical & Psychological Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-6">
                          <h4 className="font-medium text-gray-900 flex items-center">
                            <Heart className="h-4 w-4 mr-2 text-green-600" />
                            Medical Information
                          </h4>
                          <FieldDisplay label="Medical Conditions" value={displayData.medical_conditions} />
                          <FieldDisplay label="Drug Use History" value={displayData.drug_use_history} />
                          <FieldDisplay label="Alcohol Use History" value={displayData.alcohol_use_history} />
                        </div>
                        <div className="space-y-6">
                          <h4 className="font-medium text-gray-900 flex items-center">
                            <Brain className="h-4 w-4 mr-2 text-purple-600" />
                            Psychological Information
                          </h4>
                          <FieldDisplay label="Psychological Profile" value={displayData.psychological_profile} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Incarceration Information Tab */}
                  {activeTab === 'incarceration' && (
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                        <Building className="h-5 w-5 mr-2 text-blue-600" />
                        Incarceration Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FieldDisplay 
                          label="Incarceration Status" 
                          value={displayData.is_incarcerated ? 'In Custody' : 'At Large'} 
                        />
                        <FieldDisplay label="Current Facility" value={displayData.current_facility} />
                        <FieldDisplay label="Incarceration Date" value={formatDate(displayData.incarceration_date)} />
                        <FieldDisplay label="Expected Release Date" value={formatDate(displayData.expected_release_date)} />
                        <FieldDisplay label="Escape Risk" value={displayData.escape_risk ? 'Yes' : 'No'} />
                        <FieldDisplay label="Violent Offender" value={displayData.violent_offender ? 'Yes' : 'No'} />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-xl sticky bottom-0 bg-white/95 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Record ID: #{displayData?.id} • 
                    Created: {formatDate(displayData?.created_at)} • 
                    Last updated: {formatDate(displayData?.updated_at)}
                  </div>
                  <div className="flex items-center space-x-3">
                    {isEditing ? (
                      <>
                        <button
                          onClick={handleCancelEdit}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSave}
                          disabled={saveLoading}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center"
                        >
                          {saveLoading ? (
                            <>
                              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              Save Changes
                            </>
                          )}
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => setShowDetailModal(false)}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Close
                        </button>
                        <button
                          onClick={handleEditToggle}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Record
                        </button>
                        <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center">
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CriminalList;