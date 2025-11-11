import React, { useState } from 'react';
import { useAuth } from '../Context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    email: '',
    badge_number: '',
    rank: 'CONSTABLE',
    station: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [badgeError, setBadgeError] = useState('');
  const { register } = useAuth();

  const validatePassword = (password) => {
    const errors = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/(?=.*\d)/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      errors.push('Password must contain at least one special character (@$!%*?&)');
    }
    
    return errors;
  };

  const validateBadgeNumber = (badgeNumber) => {
    // Format: P followed by exactly 5 numbers
    const badgeRegex = /^P\d{5}$/;
    return badgeRegex.test(badgeNumber);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });

    // Validate password in real-time
    if (name === 'password') {
      const errors = validatePassword(value);
      setPasswordErrors(errors);
    }

    // Validate badge number in real-time
    if (name === 'badge_number') {
      if (value && !validateBadgeNumber(value)) {
        setBadgeError('Badge number must be in format: P followed by 5 numbers (e.g., P12345)');
      } else {
        setBadgeError('');
      }
    }

    // Clear password mismatch error when either password field changes
    if (name === 'password' || name === 'confirmPassword') {
      setError(prevError => 
        prevError.includes('Passwords do not match') ? '' : prevError
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Check password strength
    const passwordValidationErrors = validatePassword(formData.password);
    if (passwordValidationErrors.length > 0) {
      setError('Please fix password requirements before submitting');
      setPasswordErrors(passwordValidationErrors);
      setLoading(false);
      return;
    }

    // Validate badge number format
    if (!validateBadgeNumber(formData.badge_number)) {
      setError('Badge number must be in format: P followed by 5 numbers (e.g., P12345)');
      setLoading(false);
      return;
    }

    // Remove confirmPassword from the data sent to the API
    const { confirmPassword, ...registerData } = formData;

    const result = await register(registerData);
    
    if (result.success) {
      alert('Registration successful! Your account is pending activation by a Commissioner or Inspector. You will be notified once activated.');
      window.location.href = '/login';
    } else {
      setError(typeof result.error === 'object' 
        ? JSON.stringify(result.error) 
        : result.error
      );
    }
    setLoading(false);
  };

  const isPasswordValid = passwordErrors.length === 0 && formData.password.length > 0;
  const passwordsMatch = formData.password === formData.confirmPassword;
  const isConfirmPasswordTouched = formData.confirmPassword.length > 0;
  const isBadgeNumberValid = validateBadgeNumber(formData.badge_number) || formData.badge_number.length === 0;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700 px-4 py-8">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Police Officer Registration
        </h2>
        
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-4">
          <p className="text-sm">
            <strong>Note:</strong> After registration, your account will need to be activated by a Commissioner or Inspector before you can log in.
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                First Names:
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name:
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username:
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password:
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  formData.password.length > 0
                    ? isPasswordValid
                      ? 'border-green-500'
                      : 'border-red-500'
                    : 'border-gray-300'
                }`}
              />
              
              {/* Password Requirements */}
              {formData.password.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-700 mb-1">Password must contain:</p>
                  <ul className="text-xs space-y-1">
                    <li className={formData.password.length >= 8 ? 'text-green-600' : 'text-red-600'}>
                      ✓ At least 8 characters
                    </li>
                    <li className={/(?=.*[a-z])/.test(formData.password) ? 'text-green-600' : 'text-red-600'}>
                      ✓ One lowercase letter
                    </li>
                    <li className={/(?=.*[A-Z])/.test(formData.password) ? 'text-green-600' : 'text-red-600'}>
                      ✓ One uppercase letter
                    </li>
                    <li className={/(?=.*\d)/.test(formData.password) ? 'text-green-600' : 'text-red-600'}>
                      ✓ One number
                    </li>
                    <li className={/(?=.*[@$!%*?&])/.test(formData.password) ? 'text-green-600' : 'text-red-600'}>
                      ✓ One special character (@$!%*?&)
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password:
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isConfirmPasswordTouched
                    ? passwordsMatch
                      ? 'border-green-500'
                      : 'border-red-500'
                    : 'border-gray-300'
                }`}
              />
              
              {/* Password Match Indicator */}
              {isConfirmPasswordTouched && (
                <div className="mt-2">
                  <p className={`text-sm ${passwordsMatch ? 'text-green-600' : 'text-red-600'}`}>
                    {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="badge_number" className="block text-sm font-medium text-gray-700 mb-1">
                Badge Number:
              </label>
              <input
                type="text"
                id="badge_number"
                name="badge_number"
                value={formData.badge_number}
                onChange={handleChange}
                required
                placeholder="P12345"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  formData.badge_number.length > 0
                    ? isBadgeNumberValid
                      ? 'border-green-500'
                      : 'border-red-500'
                    : 'border-gray-300'
                }`}
              />
              {badgeError && (
                <p className="text-red-600 text-xs mt-1">{badgeError}</p>
              )}
              <p className="text-gray-500 text-xs mt-1">
                Format: P followed by 5 numbers (e.g., P12345)
              </p>
            </div>

            <div>
              <label htmlFor="rank" className="block text-sm font-medium text-gray-700 mb-1">
                Rank:
              </label>
              <select
                id="rank"
                name="rank"
                value={formData.rank}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="CONSTABLE">Constable</option>
                <option value="SERGEANT">Sergeant</option>
                <option value="INSPECTOR">Inspector</option>
                <option value="CAPTAIN">Commissioner</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="station" className="block text-sm font-medium text-gray-700 mb-1">
              Station:
            </label>
            <input
              type="text"
              id="station"
              name="station"
              value={formData.station}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Central Station"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !isPasswordValid || !passwordsMatch || !isBadgeNumberValid}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
            Login here
          </a>
        </p>
        <p className="text-center text-gray-600 mt-6">
          <a href="/" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Back to Home
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;