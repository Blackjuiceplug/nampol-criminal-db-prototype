import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell,
  LineChart, Line, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { 
  Download, Filter, Calendar, TrendingUp, Users, Shield, Clock, AlertCircle,
  CheckCircle, XCircle, RefreshCw, Database, MapPin, BarChart3
} from 'lucide-react';

const Analytics = () => {
  const [crimeData, setCrimeData] = useState([]);
  const [criminalData, setCriminalData] = useState([]);
  const [evidenceData, setEvidenceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');
  const [apiStatus, setApiStatus] = useState('connecting');

  // Fetch all data from APIs
  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setApiStatus('connecting');

      // Fetch crimes data
      const crimesResponse = await fetch('http://localhost:8000/api/crimes/', {
        credentials: 'include',
      });
      const crimesData = await crimesResponse.json();

      // Fetch criminals data
      const criminalsResponse = await fetch('http://localhost:8000/api/criminals/', {
        credentials: 'include',
      });
      const criminalsData = await criminalsResponse.json();

      // Fetch evidence data
      const evidenceResponse = await fetch('http://localhost:8000/api/criminal-evidence/', {
        credentials: 'include',
      });
      const evidenceData = await evidenceResponse.json();

      setCrimeData(crimesData);
      setCriminalData(criminalsData);
      setEvidenceData(evidenceData);
      setApiStatus('connected');

    } catch (error) {
      console.error('Error fetching analytics data:', error);
      setApiStatus('error');
      // Fallback to sample data
      setCrimeData([
        { crime_type: 'THEFT', status: 'CLOSED', date_committed: '2024-01-15' },
        { crime_type: 'ASSAULT', status: 'OPEN', date_committed: '2024-01-20' },
        { crime_type: 'BURGLARY', status: 'CONVICTED', date_committed: '2024-02-05' },
        { crime_type: 'FRAUD', status: 'OPEN', date_committed: '2024-02-10' },
        { crime_type: 'ROBBERY', status: 'CLOSED', date_committed: '2024-02-15' },
      ]);
      setCriminalData([
        { threat_level: 'HIGH', is_incarcerated: true },
        { threat_level: 'MEDIUM', is_incarcerated: false },
        { threat_level: 'LOW', is_incarcerated: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  // Process data for charts
  const processCrimeTypeData = () => {
    const crimeTypeCount = {};
    crimeData.forEach(crime => {
      crimeTypeCount[crime.crime_type] = (crimeTypeCount[crime.crime_type] || 0) + 1;
    });

    return Object.entries(crimeTypeCount).map(([name, value]) => ({
      name: name.charAt(0) + name.slice(1).toLowerCase(),
      value
    }));
  };

  const processStatusData = () => {
    const statusCount = {};
    crimeData.forEach(crime => {
      statusCount[crime.status] = (statusCount[crime.status] || 0) + 1;
    });

    return Object.entries(statusCount).map(([name, value]) => ({
      name: name.charAt(0) + name.slice(1).toLowerCase(),
      value
    }));
  };

  const processThreatLevelData = () => {
    const threatLevelCount = {};
    criminalData.forEach(criminal => {
      threatLevelCount[criminal.threat_level] = (threatLevelCount[criminal.threat_level] || 0) + 1;
    });

    return Object.entries(threatLevelCount).map(([name, value]) => ({
      name,
      value
    }));
  };

  const processMonthlyTrendData = () => {
    // Group crimes by month
    const monthlyData = {};
    crimeData.forEach(crime => {
      if (crime.date_committed) {
        const month = new Date(crime.date_committed).toLocaleString('default', { month: 'short' });
        monthlyData[month] = (monthlyData[month] || 0) + 1;
      }
    });

    return Object.entries(monthlyData).map(([month, cases]) => ({
      month,
      cases
    }));
  };

  const processEvidenceTypeData = () => {
    const evidenceTypeCount = {};
    evidenceData.forEach(evidence => {
      evidenceTypeCount[evidence.evidence_type] = (evidenceTypeCount[evidence.evidence_type] || 0) + 1;
    });

    return Object.entries(evidenceTypeCount).map(([name, value]) => ({
      name: name.charAt(0) + name.slice(1).toLowerCase(),
      value
    }));
  };

  // Calculate statistics
  const totalCases = crimeData.length;
  const totalCriminals = criminalData.length;
  const incarcerated = criminalData.filter(c => c.is_incarcerated).length;
  const atLarge = totalCriminals - incarcerated;
  const closedCases = crimeData.filter(c => c.status === 'CLOSED' || c.status === 'CONVICTED').length;
  const clearanceRate = totalCases > 0 ? Math.round((closedCases / totalCases) * 100) : 0;

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-2" />
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Crime Analytics Dashboard</h2>
          <p className="text-gray-600">Data-driven insights for law enforcement</p>
        </div>
        <div className="flex items-center space-x-4">
          {apiStatus === 'connected' ? (
            <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm">
              <CheckCircle className="w-4 h-4 mr-1" />
              <span>Live Data</span>
            </div>
          ) : (
            <div className="flex items-center text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full text-sm">
              <AlertCircle className="w-4 h-4 mr-1" />
              <span>Sample Data</span>
            </div>
          )}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button 
            onClick={fetchAnalyticsData}
            className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <Users className="w-8 h-8 text-blue-500" />
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Cases</h3>
          <p className="text-3xl font-bold text-gray-800">{totalCases}</p>
          <p className="text-sm text-gray-500">Criminal incidents recorded</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Clearance Rate</h3>
          <p className="text-3xl font-bold text-gray-800">{clearanceRate}%</p>
          <p className="text-sm text-gray-500">Cases successfully resolved</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <Shield className="w-8 h-8 text-purple-500" />
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Criminals in Custody</h3>
          <p className="text-3xl font-bold text-gray-800">{incarcerated}</p>
          <p className="text-sm text-gray-500">{atLarge} currently at large</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <Database className="w-8 h-8 text-orange-500" />
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Evidence Collected</h3>
          <p className="text-3xl font-bold text-gray-800">{evidenceData.length}</p>
          <p className="text-sm text-gray-500">Items in evidence database</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Crime Type Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
            Crime Type Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={processCrimeTypeData()}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {processCrimeTypeData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Case Status Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
            Case Status Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={processStatusData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-purple-500" />
            Monthly Cases Trend
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={processMonthlyTrendData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="cases" stroke="#8884d8" fill="#8884d8" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Threat Level Analysis */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
            Criminal Threat Level Analysis
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={processThreatLevelData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#FF8042" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Evidence Type Analysis */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <Database className="w-5 h-5 mr-2 text-blue-500" />
            Evidence Type Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={processEvidenceTypeData()}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {processEvidenceTypeData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Incarceration Rate */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-green-500" />
            Incarceration Status
          </h3>
          <div className="text-center">
            <div className="flex justify-center items-center mb-4">
              <div className="relative" style={{ width: 200, height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'In Custody', value: incarcerated },
                        { name: 'At Large', value: atLarge }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      <Cell fill="#00C49F" />
                      <Cell fill="#FF8042" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{Math.round((incarcerated / totalCriminals) * 100)}%</div>
                    <div className="text-sm text-gray-500">In Custody</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm">In Custody: {incarcerated}</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                <span className="text-sm">At Large: {atLarge}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Summary */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Data Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{totalCases}</div>
            <div className="text-sm text-blue-800">Total Cases</div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{closedCases}</div>
            <div className="text-sm text-green-800">Closed Cases</div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{totalCriminals}</div>
            <div className="text-sm text-purple-800">Total Criminals</div>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{evidenceData.length}</div>
            <div className="text-sm text-orange-800">Evidence Items</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;