// components/OfficerList.js - UPDATED VERSION
import React, { useState, useEffect } from 'react';
import { 
  User, Search, Shield, RefreshCw, Eye, 
  UserCheck, UserX, Crown, Award, Star,
  AlertCircle, MapPin, Badge, Mail,
  Users, Activity, Lock, Unlock
} from 'lucide-react';

const OfficerList = () => {
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [selectedOfficer, setSelectedOfficer] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  // Direct API call to check auth status
  const checkCurrentUser = async () => {
    try {
      setAuthLoading(true);
      const response = await fetch('http://localhost:8000/api/auth/check/', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.authenticated) {
          setCurrentUser({
            username: data.user,
            first_name: data.first_name,
            last_name: data.last_name,
            rank: data.officer?.rank,
            badge_number: data.officer?.badge_number,
            station: data.officer?.station,
            can_activate_users: data.officer?.can_activate_users,
            is_active: data.officer?.is_active,
            officer_id: data.officer?.id
          });
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setAuthLoading(false);
    }
  };

  // Fetch officers from API
  const fetchOfficers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/officers/', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setOfficers(data);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching officers:', error);
      alert('Failed to load officers');
    } finally {
      setLoading(false);
    }
  };

  // Activate/deactivate officer
  const handleActivation = async (officerId, activate) => {
    setActionLoading(officerId);
    try {
      const response = await fetch(`http://localhost:8000/api/officers/${officerId}/activate/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCSRFToken(),
        },
        credentials: 'include',
        body: JSON.stringify({ is_active: activate }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(`✅ ${result.message}`);
        fetchOfficers();
      } else {
        const errorData = await response.json();
        alert(`❌ ${errorData.error || 'Failed to update officer status'}`);
      }
    } catch (error) {
      alert('❌ Network error. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const getCSRFToken = () => {
    const name = 'csrftoken';
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return '';
  };

  useEffect(() => {
    checkCurrentUser();
    fetchOfficers();
  }, []);

  // Filter officers
  const filteredOfficers = officers.filter(officer => 
    !searchQuery || 
    officer.user?.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    officer.user?.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    officer.badge_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    officer.station.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // NEW: Permission checking - Captain and Commissioner can activate/deactivate
  const canActivateOfficers = currentUser ? 
    (currentUser.rank === 'CAPTAIN' || currentUser.rank === 'COMMISSIONER') : 
    false;

  const currentUserRank = currentUser?.rank;
  const currentUserBadge = currentUser?.badge_number;

  // NEW: Check if current user can activate specific officer
  const canActivateThisOfficer = (targetOfficer) => {
    if (!canActivateOfficers) return false;
    if (currentUserBadge === targetOfficer.badge_number) return false; // Can't modify self
    
    // Captain and Commissioner can activate/deactivate all ranks except themselves
    return true;
  };

  // UI helpers
  const getRankColor = (rank) => {
    switch (rank) {
      case 'COMMISSIONER': return 'bg-red-100 text-red-800 border-red-300';
      case 'CAPTAIN': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'INSPECTOR': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'SERGEANT': return 'bg-green-100 text-green-800 border-green-300';
      case 'CONSTABLE': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 'COMMISSIONER': return <Award className="h-4 w-4" />;
      case 'CAPTAIN': return <Crown className="h-4 w-4" />;
      case 'INSPECTOR': return <Award className="h-4 w-4" />;
      case 'SERGEANT': return <Star className="h-4 w-4" />;
      case 'CONSTABLE': return <Shield className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const viewOfficerDetails = (officer) => {
    setSelectedOfficer(officer);
    setShowDetailModal(true);
  };

  // NEW: Stats calculations
  const activeOfficers = officers.filter(o => o.is_active).length;
  const inactiveOfficers = officers.filter(o => !o.is_active).length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Police Officers Database</h1>
          <p className="text-gray-600">Manage and monitor police officer accounts</p>
        </div>
        <div className="flex items-center space-x-4">
          {canActivateOfficers && currentUser && (
            <div className="bg-green-100 border border-green-300 rounded-lg px-3 py-2">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  {currentUserRank} • Account Management Permissions
                </span>
              </div>
            </div>
          )}
          <button 
            onClick={() => {
              checkCurrentUser();
              fetchOfficers();
            }}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4 flex items-center border">
          <div className="rounded-full bg-blue-100 p-3 mr-4">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Officers</p>
            <p className="text-xl font-bold">{officers.length}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 flex items-center border">
          <div className="rounded-full bg-green-100 p-3 mr-4">
            <UserCheck className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Active Officers</p>
            <p className="text-xl font-bold">{activeOfficers}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 flex items-center border">
          <div className="rounded-full bg-yellow-100 p-3 mr-4">
            <UserX className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Inactive Officers</p>
            <p className="text-xl font-bold">{inactiveOfficers}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 flex items-center border">
          <div className="rounded-full bg-purple-100 p-3 mr-4">
            <Activity className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Your Permissions</p>
            <p className="text-xl font-bold">
              {canActivateOfficers ? 'Manager' : 'Viewer'}
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg p-4 mb-6 shadow-sm border">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search officers by name, badge number, or station..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* NEW: Permission Status Badge */}
          <div className={`px-4 py-2 rounded-lg border ${
            canActivateOfficers 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-gray-50 border-gray-200 text-gray-600'
          }`}>
            <div className="flex items-center space-x-2">
              {canActivateOfficers ? (
                <>
                  <Unlock className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    You can activate/deactivate officers
                  </span>
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    View-only access
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Officers Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Officers List</h2>
            <p className="text-sm text-gray-600">
              Showing {filteredOfficers.length} of {officers.length} officers
            </p>
          </div>
          {canActivateOfficers && (
            <div className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200">
              🔧 Account Management Permissions Active
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading officers...</span>
          </div>
        ) : filteredOfficers.length === 0 ? (
          <div className="text-center py-12">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No officers found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Officer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Badge & Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Station</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOfficers.map((officer) => (
                  <tr key={officer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-sm mr-3">
                          {getInitials(officer.user?.first_name, officer.user?.last_name)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {officer.user?.first_name} {officer.user?.last_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {officer.user?.username}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="text-sm font-mono font-bold text-gray-900">
                          {officer.badge_number}
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRankColor(officer.rank)}`}>
                          {getRankIcon(officer.rank)}
                          <span className="ml-1">{officer.rank}</span>
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                        {officer.station}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        officer.is_active ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                      }`}>
                        {officer.is_active ? <UserCheck className="h-3 w-3 mr-1" /> : <UserX className="h-3 w-3 mr-1" />}
                        {officer.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => viewOfficerDetails(officer)}
                          className="text-blue-600 hover:text-blue-900 flex items-center px-3 py-1 border border-blue-300 rounded hover:bg-blue-50"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </button>
                        
                        {/* NEW: Simplified activation logic for Captain/Commissioner */}
                        {canActivateThisOfficer(officer) && (
                          actionLoading === officer.id ? (
                            <div className="flex items-center px-3 py-1 border border-gray-300 rounded bg-gray-50">
                              <RefreshCw className="h-4 w-4 mr-1 animate-spin text-gray-500" />
                              <span className="text-gray-500">Processing...</span>
                            </div>
                          ) : officer.is_active ? (
                            <button
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to deactivate ${officer.user?.first_name} ${officer.user?.last_name}? This will prevent them from accessing the system.`)) {
                                  handleActivation(officer.id, false);
                                }
                              }}
                              className="text-red-600 hover:text-red-900 flex items-center px-3 py-1 border border-red-300 rounded hover:bg-red-50"
                            >
                              <UserX className="h-4 w-4 mr-1" />
                              Deactivate
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to activate ${officer.user?.first_name} ${officer.user?.last_name}? This will grant them system access.`)) {
                                  handleActivation(officer.id, true);
                                }
                              }}
                              className="text-green-600 hover:text-green-900 flex items-center px-3 py-1 border border-green-300 rounded hover:bg-green-50"
                            >
                              <UserCheck className="h-4 w-4 mr-1" />
                              Activate
                            </button>
                          )
                        )}

                        {/* Show current user indicator */}
                        {currentUserBadge === officer.badge_number && (
                          <span className="text-blue-600 flex items-center px-3 py-1 border border-blue-300 rounded bg-blue-50">
                            <User className="h-4 w-4 mr-1" />
                            You
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Officer Detail Modal */}
      {showDetailModal && selectedOfficer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Officer Details</h3>
              <button 
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <UserX className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-xl">
                  {getInitials(selectedOfficer.user?.first_name, selectedOfficer.user?.last_name)}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900">
                    {selectedOfficer.user?.first_name} {selectedOfficer.user?.last_name}
                  </h4>
                  <p className="text-gray-600 flex items-center">
                    <Badge className="h-4 w-4 mr-1" />
                    Badge: {selectedOfficer.badge_number}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">Rank</label>
                  <p className={`text-lg font-semibold ${getRankColor(selectedOfficer.rank)} px-2 py-1 rounded inline-block`}>
                    {selectedOfficer.rank}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Station</label>
                  <p className="text-lg font-semibold">{selectedOfficer.station}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Username</label>
                  <p className="text-lg font-semibold">{selectedOfficer.user?.username}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-lg font-semibold flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                    {selectedOfficer.user?.email || 'Not provided'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <p className={`text-lg font-semibold ${
                    selectedOfficer.is_active ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {selectedOfficer.is_active ? 'Active' : 'Inactive'}
                  </p>
                </div>
              </div>

              {/* NEW: Enhanced Account Management Section */}
              {canActivateThisOfficer(selectedOfficer) && (
                <div className="border-t border-gray-200 pt-4">
                  <h5 className="text-md font-semibold mb-3 flex items-center">
                    <Activity className="h-4 w-4 mr-2 text-blue-600" />
                    Account Management
                  </h5>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-3">
                      As a {currentUserRank}, you can manage this officer's account status.
                    </p>
                    <div className="flex space-x-3">
                      {selectedOfficer.is_active ? (
                        <button
                          onClick={async () => {
                            if (window.confirm(`Are you sure you want to deactivate ${selectedOfficer.user?.first_name} ${selectedOfficer.user?.last_name}? This will immediately revoke their system access.`)) {
                              await handleActivation(selectedOfficer.id, false);
                              setShowDetailModal(false);
                            }
                          }}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center"
                        >
                          <Lock className="h-4 w-4 mr-2" />
                          Deactivate Account
                        </button>
                      ) : (
                        <button
                          onClick={async () => {
                            if (window.confirm(`Are you sure you want to activate ${selectedOfficer.user?.first_name} ${selectedOfficer.user?.last_name}? This will grant them full system access.`)) {
                              await handleActivation(selectedOfficer.id, true);
                              setShowDetailModal(false);
                            }
                          }}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
                        >
                          <Unlock className="h-4 w-4 mr-2" />
                          Activate Account
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfficerList;