import React, { useState, useEffect } from 'react';
import { FaTimes, FaSpinner, FaMale, FaFemale, FaUserFriends } from 'react-icons/fa';
import { getAvailableTests, createTestPackage, updateTestPackage } from '../../services/api';

const TestPackageModal = ({ isOpen, onClose, packageData, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discount_percentage: 0,
    gender: 'both', // Default to 'both'
    is_active: true,
    test_ids: []
  });
  const [availableTests, setAvailableTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTests, setSelectedTests] = useState([]);
  const [totalRegularPrice, setTotalRegularPrice] = useState(0);
  
  // Fetch available tests when modal opens
  useEffect(() => {
    const fetchTests = async () => {
      try {
        setTestLoading(true);
        const tests = await getAvailableTests();
        setAvailableTests(tests);
      } catch (err) {
        setError('Failed to load available tests: ' + (err.response?.data?.message || err.message));
      } finally {
        setTestLoading(false);
      }
    };
    
    fetchTests();
    
    // If editing existing package, populate form data
    if (packageData) {
      setFormData({
        name: packageData.name,
        description: packageData.description || '',
        price: packageData.price.toString(),
        discount_percentage: packageData.discount_percentage || 0,
        gender: packageData.gender || 'both', // Add gender
        is_active: packageData.is_active,
        test_ids: packageData.tests.map(test => test.id)
      });
      setSelectedTests(packageData.tests);
      setTotalRegularPrice(packageData.total_regular_price);
    }
  }, [packageData]);
  
  // Calculate total regular price when selected tests change
  useEffect(() => {
    const total = selectedTests.reduce((sum, test) => sum + parseFloat(test.price), 0);
    setTotalRegularPrice(total);
    
    // If price is not manually set, update it to match total
    if (!formData.manualPriceEntry) {
      setFormData(prev => ({
        ...prev,
        price: total.toFixed(2)
      }));
    }
  }, [selectedTests]);
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      // Mark price as manually entered if the user changes it
      ...(name === 'price' ? { manualPriceEntry: true } : {})
    }));
  };
  
  const handleTestSelection = (e) => {
    const testId = parseInt(e.target.value);
    const isChecked = e.target.checked;
    
    // Update selected test IDs
    setFormData(prev => {
      const updatedTestIds = isChecked
        ? [...prev.test_ids, testId]
        : prev.test_ids.filter(id => id !== testId);
      
      return {
        ...prev,
        test_ids: updatedTestIds
      };
    });
    
    // Update selected tests objects for price calculation
    setSelectedTests(prev => {
      if (isChecked) {
        const testToAdd = availableTests.find(test => test.id === testId);
        return [...prev, testToAdd];
      } else {
        return prev.filter(test => test.id !== testId);
      }
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Validate form
      if (!formData.name || !formData.price || formData.test_ids.length === 0) {
        setError('Please fill in all required fields and select at least one test.');
        setLoading(false);
        return;
      }
      
      // Format data for submission
      const packageToSubmit = {
        ...formData,
        price: parseFloat(formData.price),
        discount_percentage: parseFloat(formData.discount_percentage || 0)
      };
      
      // Create or update package
      if (packageData) {
        await updateTestPackage(packageData.id, packageToSubmit);
      } else {
        await createTestPackage(packageToSubmit);
      }
      
      // Close modal and refresh data
      onClose();
      onSuccess();
    } catch (err) {
      setError('Failed to save package: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };
  
  // Calculate savings
  const savings = totalRegularPrice - parseFloat(formData.price || 0);
  const savingsPercentage = totalRegularPrice > 0 
    ? ((savings / totalRegularPrice) * 100).toFixed(2) 
    : 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              {packageData ? 'Edit Package' : 'Create New Package'}
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <FaTimes size={24} />
            </button>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 border border-red-400 rounded">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Package Name *
                </label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Enter package name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Package Price (₹) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Enter package price"
                  required
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Gender *
              </label>
              <div className="flex space-x-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === 'male'}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <FaMale className="ml-2 mr-1 text-blue-600" />
                  <span className="ml-1">Male Only</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === 'female'}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <FaFemale className="ml-2 mr-1 text-pink-600" />
                  <span className="ml-1">Female Only</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="both"
                    checked={formData.gender === 'both'}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <FaUserFriends className="ml-2 mr-1 text-purple-600" />
                  <span className="ml-1">Both Genders</span>
                </label>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg"
                rows={3}
                placeholder="Enter package description"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount Percentage (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  name="discount_percentage"
                  value={formData.discount_percentage}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Enter discount percentage"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-indigo-600 rounded"
                />
                <label htmlFor="is_active" className="ml-2 text-sm font-medium text-gray-700">
                  Package is active and available for booking
                </label>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Tests for this Package *
              </label>
              
              {testLoading ? (
                <div className="text-center py-4">
                  <FaSpinner className="animate-spin text-indigo-600 mx-auto mb-2" size={24} />
                  <p>Loading tests...</p>
                </div>
              ) : (
                <div className="border rounded-lg p-4 max-h-64 overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {availableTests.map(test => (
                      <div key={test.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`test-${test.id}`}
                          value={test.id}
                          checked={formData.test_ids.includes(test.id)}
                          onChange={handleTestSelection}
                          className="h-4 w-4 text-indigo-600 rounded"
                        />
                        <label htmlFor={`test-${test.id}`} className="ml-2 text-sm">
                          {test.name} - <span className="text-gray-600">₹{test.price}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="text-md font-medium text-gray-800 mb-2">Package Summary</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-600">Total Tests Selected:</div>
                <div className="font-medium">{selectedTests.length}</div>
                
                <div className="text-gray-600">Regular Value:</div>
                <div className="font-medium">₹{totalRegularPrice.toFixed(2)}</div>
                
                <div className="text-gray-600">Package Price:</div>
                <div className="font-medium">₹{parseFloat(formData.price || 0).toFixed(2)}</div>
                
                <div className="text-gray-600">Customer Savings:</div>
                <div className="font-medium text-green-600">
                  ₹{savings.toFixed(2)} ({savingsPercentage}%)
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || testLoading}
                className={`px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 ${
                  (loading || testLoading) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <>
                    <FaSpinner className="inline-block animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  packageData ? 'Update Package' : 'Create Package'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TestPackageModal;
