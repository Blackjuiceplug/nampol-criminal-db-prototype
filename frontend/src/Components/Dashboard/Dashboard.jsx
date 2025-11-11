// src/Components/Dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from "../../Context/AuthContext";  
import Header from "../Layout/Header";
import Sidebar from "../Layout/Sidebar";
import Overview from "./Overview";
import CriminalList from "../Criminals/CriminalList";
import CaseList from "../Cases/CaseList";
import EvidenceList from "../Evidence/EvidenceList";
import Analytics from "../Analytics/Analytics";
import RecordManagement from "../Records/RecordManagement"; 
import OfficerList from '../Officers/OfficerList';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [apiStatus, setApiStatus] = useState('checking');
  const [apiErrorDetails, setApiErrorDetails] = useState('');

  // Check API connection status
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        // First check if we're online
        if (!navigator.onLine) {
          setApiStatus('offline');
          setApiErrorDetails('Your device is not connected to the internet.');
          return;
        }

        const response = await fetch('/api/auth/check/', {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          setApiStatus('connected');
          setApiErrorDetails('');
        } else {
          setApiStatus('error');
          setApiErrorDetails(`Server returned status: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        setApiStatus('error');
        setApiErrorDetails(error.message || 'Unknown error occurred');
        console.error('API connection error:', error);
      }
    };

    checkApiStatus();

    // Listen for online/offline events
    const handleOnline = () => checkApiStatus();
    const handleOffline = () => {
      setApiStatus('offline');
      setApiErrorDetails('Your device is not connected to the internet.');
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <div className="flex-1 flex flex-col">
        <Header 
          user={user} 
          onLogout={logout} 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          apiStatus={apiStatus}
        />
        
        <main className="flex-1 overflow-auto">
          {apiStatus === 'error' || apiStatus === 'offline' ? (
            <div className="p-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-red-800 mb-2">
                  {apiStatus === 'offline' ? 'Offline' : 'Connection Error'}
                </h3>
                <p className="text-red-700 mb-3">
                  {apiStatus === 'offline' 
                    ? 'Your device is not connected to the internet. Please check your connection.'
                    : 'Unable to connect to the server. Please check your internet connection and make sure the backend server is running.'
                  }
                </p>
                {apiErrorDetails && (
                  <details className="text-sm text-red-600">
                    <summary className="cursor-pointer">Error details</summary>
                    <pre className="mt-2 p-2 bg-red-100 rounded overflow-auto">{apiErrorDetails}</pre>
                  </details>
                )}
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-red-800 mb-2">Troubleshooting steps:</h4>
                  <ul className="text-sm text-red-700 list-disc pl-5 space-y-1">
                    <li>Ensure the Django backend server is running</li>
                    <li>Check that you're using the correct API URL</li>
                    <li>Verify CORS is configured properly in your Django settings</li>
                    <li>Check browser console for detailed error messages</li>
                  </ul>
                </div>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
                >
                  Retry Connection
                </button>
              </div>
            </div>
          ) : apiStatus === 'checking' ? (
            <div className="p-6">
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <span className="ml-4 text-gray-600">Connecting to server...</span>
              </div>
            </div>
          ) : (
            <>
              {activeSection === 'overview' && <Overview />}
              {activeSection === 'criminals' && (
                <CriminalList searchQuery={searchQuery} apiStatus={apiStatus} />
              )}
              {activeSection === 'cases' && <CaseList searchQuery={searchQuery} />}
              {activeSection === 'officers' && <OfficerList searchQuery={searchQuery} />}
              {activeSection === 'evidence' && <EvidenceList searchQuery={searchQuery} />}
              {activeSection === 'records' && <RecordManagement searchQuery={searchQuery} />}
              {activeSection === 'analytics' && <Analytics />}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;