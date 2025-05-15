import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaTag, FaSearch, FaMale, FaFemale, FaUserFriends } from 'react-icons/fa';
import Layout from '../../components/Layout';
import TestPackageModal from '../../components/admin/TestPackageModal';
import { getTestPackages, deleteTestPackage, getAvailableTests } from '../../services/api';

const TestPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editPackage, setEditPackage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    fetchPackages();
  }, []);
  
  const fetchPackages = async () => {
    try {
      setLoading(true);
      const data = await getTestPackages();
      setPackages(data);
      setError(null);
    } catch (err) {
      setError('Failed to load test packages: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async (packageId) => {
    if (!window.confirm('Are you sure you want to delete this package?')) return;
    
    try {
      await deleteTestPackage(packageId);
      setPackages(packages.filter(pkg => pkg.id !== packageId));
    } catch (err) {
      setError('Failed to delete package: ' + (err.response?.data?.message || err.message));
    }
  };
  
  const handleEdit = (pkg) => {
    setEditPackage(pkg);
    setShowModal(true);
  };
  
  const handleAdd = () => {
    setEditPackage(null);
    setShowModal(true);
  };
  
  const filteredPackages = packages.filter(pkg => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return pkg.name.toLowerCase().includes(query) || 
      pkg.description?.toLowerCase().includes(query);
  });

  // Helper function to render gender icon
  const renderGenderIcon = (gender) => {
    switch (gender) {
      case 'male':
        return <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full flex items-center"><FaMale className="mr-1" /> Male</span>;
      case 'female':
        return <span className="ml-2 px-2 py-1 text-xs bg-pink-100 text-pink-800 rounded-full flex items-center"><FaFemale className="mr-1" /> Female</span>;
      default:
        return <span className="ml-2 px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full flex items-center"><FaUserFriends className="mr-1" /> Both</span>;
    }
  };
  
  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Test Packages</h1>
          <div className="flex space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search packages..."
                className="pl-10 pr-4 py-2 border rounded-lg w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <button
              onClick={handleAdd}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center"
            >
              <FaPlus className="mr-2" /> New Package
            </button>
          </div>
        </div>
        
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 border border-red-400 rounded">
            {error}
          </div>
        )}
        
        {loading ? (
          <p className="text-center py-8">Loading packages...</p>
        ) : filteredPackages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map(pkg => (
              <div key={pkg.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 mb-2">{pkg.name}</h2>
                      <div className="flex flex-wrap gap-1">
                        <span className="px-2 py-1 text-sm bg-green-100 text-green-800 rounded-full">
                          <FaTag className="inline-block mr-1" /> ₹{pkg.price}
                        </span>
                        {pkg.savings_percentage > 0 && (
                          <span className="px-2 py-1 text-sm bg-red-100 text-red-800 rounded-full">
                            Save {pkg.savings_percentage}%
                          </span>
                        )}
                        {renderGenderIcon(pkg.gender)}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEdit(pkg)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        onClick={() => handleDelete(pkg.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                  
                  {pkg.description && (
                    <p className="text-gray-600 mt-3 text-sm">{pkg.description}</p>
                  )}
                  
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Included Tests:</h3>
                    <ul className="text-sm text-gray-600">
                      {pkg.tests.map(test => (
                        <li key={test.id} className="mb-1">
                          • {test.name} <span className="text-gray-400">(₹{test.price})</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
              
                  
                  {!pkg.is_active && (
                    <div className="mt-2">
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                        Inactive
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-white rounded-lg shadow-md">
            <p className="text-gray-500">No test packages found</p>
            <button
              onClick={handleAdd}
              className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Create your first package
            </button>
          </div>
        )}
      </div>
      
      {showModal && (
        <TestPackageModal 
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          packageData={editPackage}
          onSuccess={fetchPackages}
        />
      )}
    </Layout>
  );
};

export default TestPackages;
