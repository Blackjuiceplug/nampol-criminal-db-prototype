import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, FileText, User, Clock, AlertCircle,
  CheckCircle, XCircle, Filter, Download, RefreshCw,
  Eye, Edit, Trash2, Calendar, Shield, MapPin
} from 'lucide-react';

const CaseList = ({ searchQuery }) => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [crimeTypeFilter, setCrimeTypeFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [apiStatus, setApiStatus] = useState('connecting');

  // Fetch crimes from API
  const fetchCrimes = async () => {
    try {
      setLoading(true);
      setError(null);
      setApiStatus('connecting');

      const response = await fetch('http://localhost:8000/api/crimes/', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCases(data);
      setApiStatus('connected');

    } catch (error) {
      console.error('Error fetching crimes:', error);
      setError(`Failed to load crimes: ${error.message}`);
      setApiStatus('error');
      // Fallback to mock data if API fails
      setCases([
        { 
          id: "1",
          crime_type: "ROBBERY", 
          description: "Armed robbery at Central Bank downtown",
          date_committed: "2024-01-15",
          location: "Central Bank, Downtown",
          status: "OPEN",
          criminal: { first_name: "John", last_name: "Doe", id: "1" },
          criminal_name: "John Doe",
          arresting_officer_name: "Det. Johnson"
        },
        { 
          id: "2",
          crime_type: "THEFT", 
          description: "High-value jewelry store robbery",
          date_committed: "2024-01-10",
          location: "Jewelry Store, Main Street",
          status: "CLOSED",
          criminal: { first_name: "Sarah", last_name: "Miller", id: "2" },
          criminal_name: "Sarah Miller",
          arresting_officer_name: "Det. Martinez"
        },
        { 
          id: "3",
          crime_type: "FRAUD", 
          description: "Large-scale online banking fraud scheme",
          date_committed: "2024-01-18",
          location: "Online",
          status: "OPEN",
          criminal: { first_name: "Robert", last_name: "Johnson", id: "3" },
          criminal_name: "Robert Johnson",
          arresting_officer_name: "Det. Chen"
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrimes();
  }, []);

  // Filter crimes based on search and filters
  const filteredCases = cases.filter(crime => {
    // Search filter
    const matchesSearch = !searchQuery || 
      (crime.description && crime.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (crime.location && crime.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (crime.criminal_name && crime.criminal_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (crime.arresting_officer_name && crime.arresting_officer_name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || 
      (crime.status && crime.status === statusFilter);
    
    // Crime type filter
    const matchesCrimeType = crimeTypeFilter === 'all' || 
      (crime.crime_type && crime.crime_type === crimeTypeFilter);
    
    return matchesSearch && matchesStatus && matchesCrimeType;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case "OPEN": return "bg-blue-100 text-blue-800 border border-blue-200";
      case "UNDER_INVESTIGATION": return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "CLOSED": return "bg-green-100 text-green-800 border border-green-200";
      case "CONVICTED": return "bg-purple-100 text-purple-800 border border-purple-200";
      default: return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case "OPEN": return "Open";
      case "CLOSED": return "Closed";
      case "CONVICTED": return "Convicted";
      default: return status;
    }
  };

  const getCrimeTypeText = (crimeType) => {
    switch(crimeType) {
      case "THEFT": return "Theft";
      case "ASSAULT": return "Assault";
      case "BURGLARY": return "Burglary";
      case "ROBBERY": return "Robbery";
      case "DRUGS": return "Drug Offense";
      case "FRAUD": return "Fraud";
      case "HOMICIDE": return "Homicide";
      default: return crimeType;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-4 text-gray-600">Loading crimes...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Crime Management</h2>
          <p className="text-gray-600">Manage and track criminal cases</p>
        </div>
        <div className="flex items-center space-x-4">
          {apiStatus === 'connected' ? (
            <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm">
              <CheckCircle className="w-4 h-4 mr-1" />
              <span>API Connected</span>
            </div>
          ) : (
            <div className="flex items-center text-red-600 bg-red-50 px-3 py-1 rounded-full text-sm">
              <AlertCircle className="w-4 h-4 mr-1" />
              <span>Using Fallback Data</span>
            </div>
          )}
          <button 
            onClick={fetchCrimes}
            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </button>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search crimes by description, location, criminal, or officer..."
              value={searchQuery}
              readOnly
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex space-x-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="CLOSED">Closed</option>
              <option value="CONVICTED">Convicted</option>
            </select>
            
            <select
              value={crimeTypeFilter}
              onChange={(e) => setCrimeTypeFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Crime Types</option>
              <option value="THEFT">Theft</option>
              <option value="ASSAULT">Assault</option>
              <option value="BURGLARY">Burglary</option>
              <option value="ROBBERY">Robbery</option>
              <option value="DRUGS">Drug Offense</option>
              <option value="FRAUD">Fraud</option>
              <option value="HOMICIDE">Homicide</option>
            </select>
            
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center"
            >
              <Filter className="h-4 w-4 mr-1" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 flex justify-between items-center">
        <p className="text-gray-600">
          Showing {filteredCases.length} of {cases.length} crimes
          {(searchQuery || statusFilter !== 'all' || crimeTypeFilter !== 'all') && ' (filtered)'}
        </p>
        <button className="text-blue-600 hover:text-blue-800 flex items-center text-sm">
          <Download className="h-4 w-4 mr-1" />
          Export Data
        </button>
      </div>

      {/* Crimes Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">ID</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Crime Type</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Description</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Criminal</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Date</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Location</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Arresting Officer</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredCases.length === 0 ? (
              <tr>
                <td colSpan="9" className="px-6 py-8 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchQuery || statusFilter !== 'all' || crimeTypeFilter !== 'all'
                      ? 'No matching crimes found' 
                      : 'No crimes in database'
                    }
                  </h3>
                  <p className="text-gray-500">
                    {searchQuery || statusFilter !== 'all' || crimeTypeFilter !== 'all'
                      ? 'Try adjusting your search or filter criteria.'
                      : 'Get started by adding your first crime record.'
                    }
                  </p>
                </td>
              </tr>
            ) : (
              filteredCases.map(crime => (
                <tr key={crime.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {crime.id.substring(0, 8)}...
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {getCrimeTypeText(crime.crime_type)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {crime.description}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {crime.criminal_name || `${crime.criminal?.first_name} ${crime.criminal?.last_name}`}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(crime.status)}`}>
                      {getStatusText(crime.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDate(crime.date_committed)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                      {crime.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {crime.arresting_officer_name || 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <span className="text-red-800">{error}</span>
          </div>
          <p className="text-sm text-red-600 mt-2">
            Please check that your Django server is running and the API endpoints are configured correctly.
          </p>
        </div>
      )}
    </div>
  );
};

export default CaseList;