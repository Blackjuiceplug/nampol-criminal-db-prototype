import React from 'react';
import { Activity, Users, FileText, Database, BarChart3, Shield, Archive, UserCog} from 'lucide-react';

const Sidebar = ({ activeSection, onSectionChange }) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: <Activity size={18} /> },
    { id: 'records', label: 'Records', icon: <Archive size={18} /> }, 
    { id: 'officers', label: 'Officers', icon: <UserCog size={18} /> },
    { id: 'criminals', label: 'Criminals', icon: <Users size={18} /> },
    { id: 'cases', label: 'Crimes', icon: <FileText size={18} /> },
    { id: 'evidence', label: 'Evidence', icon: <Database size={18} /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={18} /> },
  ];

  return (
    <div className="w-64 bg-blue-900 text-white shadow-lg">
      <div className="p-6">
        <h1 className="text-xl font-bold flex items-center">
          <Shield className="mr-2" /> PoliceDB
        </h1>
        <p className="text-blue-200 text-sm mt-1">Criminal Intelligence</p>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`w-full px-6 py-3 flex items-center transition-all duration-200 ${
              activeSection === item.id ? 'bg-blue-800' : 'hover:bg-blue-800'
            }`}
          >
            {item.icon}
            <span className="ml-3">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;