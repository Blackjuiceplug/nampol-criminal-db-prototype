import React, { useState } from 'react';
import { Shield, Bell, User, LogOut, Search, X } from 'lucide-react';

const Header = ({ user, onLogout, searchQuery, onSearchChange }) => {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutDialog(false);
    onLogout();
  };

  const handleCancelLogout = () => {
    setShowLogoutDialog(false);
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <Shield className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-xl font-bold text-gray-800">Police Database System</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <button className="p-2 rounded-full hover:bg-gray-100 relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800">Officer {user}</p>
                <p className="text-xs text-gray-500">Criminal Investigations</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                <User className="w-5 h-5" />
              </div>
              <button
                onClick={handleLogoutClick}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Logout Confirmation Dialog */}
      {showLogoutDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Confirm Logout</h3>
              <button 
                onClick={handleCancelLogout}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to logout from the Police Database System?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelLogout}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;