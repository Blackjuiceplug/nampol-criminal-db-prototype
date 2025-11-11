import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, Filter, Download, RefreshCw, Eye, 
  Trash2, FileText, AlertCircle, CheckCircle, XCircle,
  Clock, Database, Image, Video, File, Shield, User
} from 'lucide-react';

const EvidenceList = ({ searchQuery }) => {
  const [evidenceItems, setEvidenceItems] = useState([]);
  const [criminals, setCriminals] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [evidenceTypeFilter, setEvidenceTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [apiStatus, setApiStatus] = useState('connecting');
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState('');

  // Fetch criminals from API
  const fetchCriminals = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/criminals/', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Create a map of criminal IDs to names
      const criminalsMap = {};
      data.forEach(criminal => {
        criminalsMap[criminal.id] = `${criminal.first_name} ${criminal.last_name}`;
      });
      
      setCriminals(criminalsMap);
      return criminalsMap;
    } catch (error) {
      console.error('Error fetching criminals:', error);
      return {};
    }
  };

  // Fetch evidence from API
  const fetchEvidence = async () => {
    try {
      setLoading(true);
      setError(null);
      setApiStatus('connecting');

      // Fetch criminals first
      const criminalsMap = await fetchCriminals();

      // Then fetch evidence
      const response = await fetch('http://localhost:8000/api/criminal-evidence/', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Enhance evidence data with criminal names
      const enhancedEvidence = data.map(evidence => ({
        ...evidence,
        criminal_name: criminalsMap[evidence.criminal] || 'Unknown Criminal'
      }));
      
      setEvidenceItems(enhancedEvidence);
      setApiStatus('connected');

    } catch (error) {
      console.error('Error fetching evidence:', error);
      setError(`Failed to load evidence: ${error.message}`);
      setApiStatus('error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvidence();
  }, []);

  // Use either the prop searchQuery or local search query
  const activeSearchQuery = searchQuery || localSearchQuery;

  // Filter evidence based on search and filters
  const filteredEvidence = evidenceItems.filter(evidence => {
    // Search filter - now includes criminal names
    const matchesSearch = !activeSearchQuery || 
      (evidence.description && evidence.description.toLowerCase().includes(activeSearchQuery.toLowerCase())) ||
      (evidence.criminal_name && evidence.criminal_name.toLowerCase().includes(activeSearchQuery.toLowerCase())) ||
      (evidence.case_number && evidence.case_number.toLowerCase().includes(activeSearchQuery.toLowerCase()));
    
    // Evidence type filter
    const matchesEvidenceType = evidenceTypeFilter === 'all' || 
      (evidence.evidence_type && evidence.evidence_type === evidenceTypeFilter);
    
    // Status filter - Since your API doesn't have status, we'll use a placeholder
    const matchesStatus = statusFilter === 'all';
    
    return matchesSearch && matchesEvidenceType && matchesStatus;
  });

  const getEvidenceTypeIcon = (type) => {
    switch(type) {
      case "PHOTO": return <Image className="w-4 h-4" />;
      case "VIDEO": return <Video className="w-4 h-4" />;
      case "AUDIO": return <File className="w-4 h-4" />;
      case "DOCUMENT": return <FileText className="w-4 h-4" />;
      case "WEAPON": return <Shield className="w-4 h-4" />;
      default: return <File className="w-4 h-4" />;
    }
  };

  const getEvidenceTypeText = (type) => {
    switch(type) {
      case "PHOTO": return "Photograph";
      case "VIDEO": return "Video Recording";
      case "AUDIO": return "Audio Recording";
      case "DOCUMENT": return "Document";
      case "WEAPON": return "Weapon";
      case "OTHER": return "Other Evidence";
      default: return type;
    }
  };

  const getFileType = (fileUrl) => {
    if (!fileUrl) return 'unknown';
    
    const extension = fileUrl.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension)) {
      return 'image';
    } else if (['mp4', 'avi', 'mov', 'wmv', 'flv'].includes(extension)) {
      return 'video';
    } else if (['mp3', 'wav', 'ogg', 'aac'].includes(extension)) {
      return 'audio';
    } else if (['pdf', 'doc', 'docx', 'txt'].includes(extension)) {
      return 'document';
    }
    return 'unknown';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleViewEvidence = (evidence) => {
    setSelectedEvidence(evidence);
    setShowViewModal(true);
  };

  const handleDownloadEvidence = (evidence) => {
    if (evidence.file) {
      const link = document.createElement('a');
      link.href = evidence.file;
      link.download = evidence.description || 'evidence_file';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleSearchChange = (e) => {
    setLocalSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setLocalSearchQuery('');
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-4 text-gray-600">Loading evidence...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Evidence Management</h2>
          <p className="text-gray-600">Manage and track criminal evidence</p>
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
              <span>API Connection Failed</span>
            </div>
          )}
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search evidence by description, criminal name, or case number..."
              value={activeSearchQuery}
              onChange={handleSearchChange}
              className="pl-10 pr-10 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {activeSearchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <div className="flex space-x-2">
            <select
              value={evidenceTypeFilter}
              onChange={(e) => setEvidenceTypeFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="PHOTO">Photograph</option>
              <option value="VIDEO">Video</option>
              <option value="AUDIO">Audio</option>
              <option value="DOCUMENT">Document</option>
              <option value="WEAPON">Weapon</option>
              <option value="OTHER">Other</option>
            </select>
            
            <button 
              onClick={fetchEvidence}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </button>
          </div>
        </div>
        
        {/* Search Tips */}
        {activeSearchQuery && (
          <div className="mt-3 text-sm text-gray-500">
            <p>Searching in: Evidence Description, Criminal Names, and Case Numbers</p>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-4 flex justify-between items-center">
        <p className="text-gray-600">
          Showing {filteredEvidence.length} of {evidenceItems.length} evidence items
          {(activeSearchQuery || evidenceTypeFilter !== 'all' || statusFilter !== 'all') && ' (filtered)'}
        </p>
        {activeSearchQuery && (
          <button 
            onClick={clearSearch}
            className="text-gray-500 hover:text-gray-700 text-sm flex items-center"
          >
            Clear search
          </button>
        )}
      </div>

      {/* Evidence Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvidence.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Database className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {activeSearchQuery || evidenceTypeFilter !== 'all'
                ? 'No matching evidence found' 
                : 'No evidence in database'
              }
            </h3>
            <p className="text-gray-500">
              {activeSearchQuery || evidenceTypeFilter !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'Evidence will appear here once added to the system.'
              }
            </p>
            {activeSearchQuery && (
              <button
                onClick={clearSearch}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          filteredEvidence.map(evidence => (
            <div key={evidence.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {/* Evidence Preview */}
              <div className="h-48 bg-gray-100 relative overflow-hidden">
                {evidence.file ? (
                  getFileType(evidence.file) === 'image' ? (
                    <img 
                      src={evidence.file} 
                      alt={evidence.description}
                      className="w-full h-full object-cover"
                    />
                  ) : getFileType(evidence.file) === 'document' ? (
                    <div className="w-full h-full flex items-center justify-center bg-blue-50">
                      <FileText className="h-16 w-16 text-blue-400" />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                      <File className="h-16 w-16 text-gray-400" />
                    </div>
                  )
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-50">
                    <File className="h-16 w-16 text-gray-400" />
                  </div>
                )}
                
                {/* Evidence Type Badge */}
                <div className="absolute top-3 left-3">
                  <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded-md text-xs flex items-center">
                    {getEvidenceTypeIcon(evidence.evidence_type)}
                    <span className="ml-1">{getEvidenceTypeText(evidence.evidence_type)}</span>
                  </span>
                </div>
              </div>

              {/* Evidence Details */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                  {evidence.description}
                </h3>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    <span className="font-medium">{evidence.criminal_name}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Collected: {formatDate(evidence.date_collected)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                  <button 
                    onClick={() => handleViewEvidence(evidence)}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center font-medium"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </button>
                  
                  <div className="flex space-x-2">
                    {evidence.file && (
                      <button 
                        onClick={() => handleDownloadEvidence(evidence)}
                        className="text-gray-600 hover:text-gray-800 p-1 rounded"
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* View Evidence Modal */}
      {showViewModal && selectedEvidence && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Evidence Details</h3>
                <button 
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Evidence File Preview */}
                {selectedEvidence.file && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Evidence File</h4>
                    {getFileType(selectedEvidence.file) === 'image' ? (
                      <img 
                        src={selectedEvidence.file} 
                        alt={selectedEvidence.description}
                        className="w-full max-h-96 object-contain rounded-lg border border-gray-200"
                      />
                    ) : (
                      <div className="border border-gray-200 rounded-lg p-8 text-center bg-gray-50">
                        <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Document File</p>
                        <a 
                          href={selectedEvidence.file} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline mt-2 inline-block"
                        >
                          View Original File
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {/* Evidence Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Evidence Type</h4>
                    <div className="flex items-center text-gray-600">
                      {getEvidenceTypeIcon(selectedEvidence.evidence_type)}
                      <span className="ml-2">{getEvidenceTypeText(selectedEvidence.evidence_type)}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Date Collected</h4>
                    <p className="text-gray-600">{formatDate(selectedEvidence.date_collected)}</p>
                  </div>

                  <div className="md:col-span-2">
                    <h4 className="font-semibold text-gray-700 mb-2">Description</h4>
                    <p className="text-gray-600">{selectedEvidence.description}</p>
                  </div>

                  <div className="md:col-span-2">
                    <h4 className="font-semibold text-gray-700 mb-2">Criminal</h4>
                    <p className="text-gray-600 font-medium">{selectedEvidence.criminal_name}</p>
                  </div>

                  {selectedEvidence.file && (
                    <div className="md:col-span-2">
                      <h4 className="font-semibold text-gray-700 mb-2">File URL</h4>
                      <a 
                        href={selectedEvidence.file} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 break-all"
                      >
                        {selectedEvidence.file}
                      </a>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  {selectedEvidence.file && (
                    <button 
                      onClick={() => handleDownloadEvidence(selectedEvidence)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download File
                    </button>
                  )}
                  <button 
                    onClick={() => setShowViewModal(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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

export default EvidenceList;