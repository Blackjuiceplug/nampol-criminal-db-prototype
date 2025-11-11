import React from 'react';
import { User, MapPin, AlertCircle, Eye } from 'lucide-react';

const CriminalCard = ({ criminal, onViewDetails }) => {
  const getThreatColor = (level) => {
    switch (level) {
      case 'HIGH': return 'bg-red-100 text-red-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      {/* Criminal Image */}
      <div className="relative">
        <img
          src={criminal.profile_picture || `https://ui-avatars.com/api/?name=${criminal.first_name}+${criminal.last_name}&background=random`}
          alt={`${criminal.first_name} ${criminal.last_name}`}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getThreatColor(criminal.threat_level)}`}>
            {criminal.threat_level}
          </span>
        </div>
      </div>

      {/* Criminal Info */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-800 mb-1">
          {criminal.first_name} {criminal.last_name}
        </h3>
        
        {criminal.alias && (
          <p className="text-gray-600 text-sm mb-2">"{criminal.alias}"</p>
        )}

        <div className="flex items-center text-sm text-gray-600 mb-2">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{criminal.last_known_location}</span>
        </div>

        {criminal.description && (
          <p className="text-gray-700 text-sm mb-3 line-clamp-2">{criminal.description}</p>
        )}

        <div className="flex justify-between items-center">
          <span className={`px-2 py-1 rounded text-xs ${
            criminal.is_incarcerated ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {criminal.is_incarcerated ? 'Incarcerated' : 'At Large'}
          </span>
          
          <span className="text-sm text-gray-500">
            {criminal.crimes_count || 0} crimes
          </span>
        </div>

        <button
          onClick={() => onViewDetails(criminal)}
          className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center"
        >
          <Eye className="w-4 h-4 mr-2" />
          View Profile
        </button>
      </div>
    </div>
  );
};

export default CriminalCard;