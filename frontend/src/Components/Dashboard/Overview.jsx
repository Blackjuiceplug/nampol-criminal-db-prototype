import React, { useState, useEffect } from 'react';
import { 
  Users, FileText, Shield, BarChart3, Plus, AlertTriangle, 
  Clock, TrendingUp, Search, Download, Bell, Calendar,
  MapPin, Eye, ArrowUp, ArrowDown, UserCheck, UserX, RefreshCw,
  Activity, Database, AlertCircle, CheckCircle
} from 'lucide-react';

const Overview = () => {
  const [stats, setStats] = useState({
    totalCriminals: 0,
    activeCases: 0,
    officers: 0,
    clearanceRate: 0,
    incarcerated: 0,
    atLarge: 0
  });
  
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState('connecting');
  const [lastUpdated, setLastUpdated] = useState('');

  // Fetch data from APIs
  useEffect(() => {
    fetchOverviewData();
  }, []);

  const fetchOverviewData = async () => {
    try {
      setLoading(true);
      setApiStatus('connecting');

      // Fetch criminals data
      const criminalsResponse = await fetch('http://localhost:8000/api/criminals/', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!criminalsResponse.ok) {
        throw new Error(`Criminals API error: ${criminalsResponse.status}`);
      }

      const criminalsData = await criminalsResponse.json();

      // Fetch cases data (you'll need to create this endpoint)
      const casesResponse = await fetch('http://localhost:8000/api/crimes/', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      let casesData = [];
      if (casesResponse.ok) {
        casesData = await casesResponse.json();
      }

      // Fetch officers data (you'll need to create this endpoint)
      const officersResponse = await fetch('http://localhost:8000/api/officers/', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      let officersData = [];
      if (officersResponse.ok) {
        officersData = await officersResponse.json();
      }

      // Calculate statistics
      const totalCriminals = criminalsData.length;
      const incarcerated = criminalsData.filter(c => c.is_incarcerated).length;
      const atLarge = totalCriminals - incarcerated;
      const activeCases = casesData.filter(c => c.status === 'OPEN').length;
      const totalOfficers = officersData.length;

      // Calculate clearance rate (simplified)
      const totalCases = casesData.length;
      const closedCases = casesData.filter(c => c.status === 'CLOSED' || c.status === 'CONVICTED').length;
      const clearanceRate = totalCases > 0 ? Math.round((closedCases / totalCases) * 100) : 0;

      setStats({
        totalCriminals,
        activeCases,
        officers: totalOfficers,
        clearanceRate,
        incarcerated,
        atLarge
      });

      // Generate recent activity from the data
      const activity = generateRecentActivity(criminalsData, casesData);
      setRecentActivity(activity);

      setApiStatus('connected');
      setLastUpdated(new Date().toLocaleTimeString());

    } catch (error) {
      console.error('Error fetching overview data:', error);
      setApiStatus('error');
      // Fallback to mock data if API fails
      setStats({
        totalCriminals: 1247,
        activeCases: 356,
        officers: 48,
        clearanceRate: 78,
        incarcerated: 893,
        atLarge: 354
      });
      setRecentActivity([
        { id: 1, type: 'new_criminal', name: 'Marcus Johnson', time: '2 minutes ago', priority: 'high' },
        { id: 2, type: 'case_update', name: 'Case #CR-2024-0012', time: '15 minutes ago', priority: 'medium' },
        { id: 3, type: 'arrest', name: 'Sarah Miller apprehended', time: '1 hour ago', priority: 'high' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const generateRecentActivity = (criminals, cases) => {
    const activity = [];
    
    // Add recent criminals
    const recentCriminals = criminals
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 3);
    
    recentCriminals.forEach(criminal => {
      activity.push({
        id: criminal.id,
        type: 'new_criminal',
        name: `${criminal.first_name} ${criminal.last_name}`,
        time: formatRelativeTime(new Date(criminal.created_at)),
        priority: criminal.threat_level === 'HIGH' || criminal.threat_level === 'EXTREME' ? 'high' : 'medium'
      });
    });

    // Add recent case updates (if cases data is available)
    if (cases && cases.length > 0) {
      const recentCases = cases
        .sort((a, b) => new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at))
        .slice(0, 2);
      
      recentCases.forEach(caseItem => {
        activity.push({
          id: caseItem.id,
          type: 'case_update',
          name: `Case ${caseItem.case_number || `#${caseItem.id.slice(0, 8)}`}`,
          time: formatRelativeTime(new Date(caseItem.updated_at || caseItem.created_at)),
          priority: 'medium'
        });
      });
    }

    return activity.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);
  };

  const formatRelativeTime = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'new_criminal': return <UserCheck className="w-4 h-4" />;
      case 'case_update': return <FileText className="w-4 h-4" />;
      case 'arrest': return <Shield className="w-4 h-4" />;
      case 'warning': return <AlertCircle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-2" />
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header with API status */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Police Dashboard Overview</h1>
          <p className="text-gray-600">Real-time monitoring of criminal database system</p>
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
            onClick={fetchOverviewData}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-sm text-gray-500">Total</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{stats.totalCriminals}</h3>
          <p className="text-gray-600 text-sm">Criminals in Database</p>
          <div className="mt-2 text-xs text-gray-500">
            {stats.incarcerated} incarcerated • {stats.atLarge} at large
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-lg bg-green-100 text-green-600">
              <FileText className="w-6 h-6" />
            </div>
            <span className="text-sm text-gray-500">Active</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{stats.activeCases}</h3>
          <p className="text-gray-600 text-sm">Recent Crimes</p>
          <div className="mt-2 text-xs text-gray-500">
            {stats.clearanceRate}% clearance rate
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-lg bg-purple-100 text-purple-600">
              <Shield className="w-6 h-6" />
            </div>
            <span className="text-sm text-gray-500">Deployed</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{stats.officers}</h3>
          <p className="text-gray-600 text-sm">Police Officers</p>
          <div className="mt-2 text-xs text-gray-500">
            Active personnel
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-orange-500">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-lg bg-orange-100 text-orange-600">
              <BarChart3 className="w-6 h-6" />
            </div>
            <span className="text-sm text-gray-500">Success</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{stats.clearanceRate}%</h3>
          <p className="text-gray-600 text-sm">Clearance Rate</p>
          <div className="mt-2 text-xs text-gray-500">
            Cases resolved
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-blue-600" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="bg-blue-50 text-blue-800 p-4 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200">
              <Users className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm font-medium">Add Criminal</span>
            </button>
            <button className="bg-green-50 text-green-800 p-4 rounded-lg hover:bg-green-100 transition-colors border border-green-200">
              <FileText className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm font-medium">New Case</span>
            </button>
            <button className="bg-purple-50 text-purple-800 p-4 rounded-lg hover:bg-purple-100 transition-colors border border-purple-200">
              <Shield className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm font-medium">Manage Officers</span>
            </button>
            <button className="bg-orange-50 text-orange-800 p-4 rounded-lg hover:bg-orange-100 transition-colors border border-orange-200">
              <BarChart3 className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm font-medium">Generate Report</span>
            </button>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Database className="w-5 h-5 mr-2 text-purple-600" />
            System Status
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
              <span className="text-green-800 font-medium">Database</span>
              <div className="flex items-center text-green-600">
                <CheckCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">Online</span>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
              <span className="text-green-800 font-medium">API Connection</span>
              <div className="flex items-center text-green-600">
                <CheckCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">Stable</span>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
              <span className="text-blue-800 font-medium">Last Update</span>
              <div className="flex items-center text-blue-600">
                <Clock className="w-4 h-4 mr-1" />
                <span className="text-sm">{lastUpdated || 'Just now'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <Bell className="w-5 h-5 mr-2 text-orange-600" />
            Recent Activity
          </h2>
          <span className="text-sm text-gray-500">{recentActivity.length} activities</span>
        </div>
        <div className="space-y-3">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity) => (
              <div key={activity.id} className={`flex items-center justify-between p-3 rounded-lg border ${getPriorityColor(activity.priority)}`}>
                <div className="flex items-center">
                  <div className="p-2 rounded-full mr-3 bg-white">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div>
                    <p className="font-medium">{activity.name}</p>
                    <p className="text-sm text-gray-600 capitalize">{activity.type.replace('_', ' ')}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Activity className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No recent activity</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer with update info */}
      <div className="text-center text-sm text-gray-500">
        <p>Data fetched from police database API • System operational</p>
        {lastUpdated && <p>Last updated: {lastUpdated}</p>}
      </div>
    </div>
  );
};

export default Overview;