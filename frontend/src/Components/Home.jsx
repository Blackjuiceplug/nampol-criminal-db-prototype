import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, Search, FileText, 
  ArrowRight, Lock, Fingerprint, BarChart3, Camera
} from 'lucide-react';

const CriminalProfilingWelcome = () => {
  const [isLoginHovered, setIsLoginHovered] = useState(false);
  const navigate = useNavigate(); // Add this hook

  // Add this function to handle login button click
  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-gray-800 text-white overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700/50 px-8 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            {/* Small NPF Logo */}
            <div className="w-12 h-12 flex items-center justify-center">
              <img 
                src="/Emblem_of_the_Namibian_Police_Force.svg" 
                alt="Namibian Police Force Emblem" 
                className="w-12 h-12 object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold">Namibian Police Force</h1>
              <p className="text-blue-300 text-sm">Criminal Profiling System</p>
            </div>
          </div>
          
          <button
            onClick={handleLoginClick} // Add this onClick handler
            onMouseEnter={() => setIsLoginHovered(true)}
            onMouseLeave={() => setIsLoginHovered(false)}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm"
          >
            <Lock className="w-4 h-4" />
            <span>Officer Login</span>
            <ArrowRight className={`w-4 h-4 transition-transform ${isLoginHovered ? 'translate-x-1' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-start pt-8 h-[calc(100vh-140px)] overflow-y-auto">
        {/* Large Logo and Title Section */}
        <div className="flex flex-col items-center justify-center mb-12 space-y-6">
          <div className="w-40 h-40 flex items-center justify-center bg-blue-900/30 rounded-full p-6 border-4 border-blue-600/30 shadow-2xl">
            <img 
              src="/Emblem_of_the_Namibian_Police_Force.svg" 
              alt="Namibian Police Force Emblem" 
              className="w-full h-full object-contain"
            />
          </div>
          <div className="text-center">
            <h2 className="text-5xl font-bold mb-2">Criminal Profiling System</h2>
            <p className="text-xl text-slate-300">Namibian Police Force</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-8 text-center space-y-12 pb-12">
          {/* Hero Text */}
          <div className="space-y-4">
            <p className="text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
              Advanced digital platform for criminal investigation, evidence management, 
              and crime pattern analysis for Namibian law enforcement.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-4 gap-8">
            {[
              { 
                icon: <Search className="w-8 h-8" />, 
                title: 'Criminal Profiles', 
                description: 'Comprehensive suspect databases with biometric data',
                color: 'blue'
              },
              { 
                icon: <FileText className="w-8 h-8" />, 
                title: 'Crime Records', 
                description: 'Digital crime scene documentation and case files',
                color: 'red'
              },
              { 
                icon: <Camera className="w-8 h-8" />, 
                title: 'Evidence Management', 
                description: 'Secure storage and tracking of physical evidence',
                color: 'green'
              },
              { 
                icon: <BarChart3 className="w-8 h-8" />, 
                title: 'Crime Analytics', 
                description: 'Pattern recognition and predictive crime mapping',
                color: 'purple'
              }
            ].map((feature, index) => (
              <div key={index} className="group">
                <div className={`bg-slate-800/40 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 h-full transform transition-all duration-300 hover:scale-105 hover:bg-slate-800/60`}>
                  <div className={`w-16 h-16 bg-${feature.color}-600/20 rounded-lg flex items-center justify-center mb-4 mx-auto border border-${feature.color}-600/30 group-hover:bg-${feature.color}-600/30 transition-colors`}>
                    <div className={`text-${feature.color}-400`}>
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* System Capabilities */}
          <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl p-8 border border-slate-700/50 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-6 flex items-center justify-center">
              <Fingerprint className="w-6 h-6 mr-3 text-red-400" />
              System Capabilities
            </h3>
            <div className="grid grid-cols-2 gap-8 text-slate-300">
              <div className="space-y-3">
                <h4 className="font-semibold text-white mb-3 text-left">Criminal Intelligence</h4>
                <div className="space-y-2 text-sm text-left">
                  <div>• Suspect identification & tracking</div>
                  <div>• Criminal history profiles</div>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-white mb-3 text-left">Investigation Tools</h4>
                <div className="space-y-2 text-sm text-left">
                  <div>• Crime scene documentation</div>
                  <div>• Evidence chain of custody</div>
                </div>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-red-900/20 backdrop-blur-sm rounded-lg p-6 border border-red-700/30 max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-3 mb-3">
              <Lock className="w-5 h-5 text-red-400" />
              <h4 className="font-bold text-red-300">RESTRICTED ACCESS</h4>
              <Lock className="w-5 h-5 text-red-400" />
            </div>
            <p className="text-red-200 text-sm">
              This system contains sensitive criminal intelligence data. 
              Access is restricted to authorized law enforcement personnel only.
            </p>
          </div>

          {/* Call to Action */}
          <div className="space-y-4">
            <p className="text-lg text-slate-300">Authorized personnel access</p>
            <button
              onClick={handleLoginClick} // Add this onClick handler
              onMouseEnter={() => setIsLoginHovered(true)}
              onMouseLeave={() => setIsLoginHovered(false)}
              className="bg-red-600 hover:bg-red-700 px-12 py-4 rounded-lg font-bold text-xl transition-all duration-300 flex items-center space-x-3 mx-auto shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              <Lock className="w-6 h-6" />
              <span>Access System</span>
              <ArrowRight className={`w-6 h-6 transition-transform ${isLoginHovered ? 'translate-x-1' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-slate-900/50 backdrop-blur-sm border-t border-slate-700/50 py-4">
        <div className="max-w-7xl mx-auto px-8 flex justify-between items-center text-sm text-slate-400">
          <div>© 2024 Namibian Police Force - Criminal Profiling System</div>
          <div className="flex items-center space-x-4">
            <span>Emergency: 10111</span>
            <span>•</span>
            <span>Confidential System</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CriminalProfilingWelcome;