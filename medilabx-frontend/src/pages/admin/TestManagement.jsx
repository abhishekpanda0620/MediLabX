import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaEye } from 'react-icons/fa';
import Layout from '../../components/Layout';
import AddTestModal from '../../components/test/AddTestModal';
import EditTestModal from '../../components/test/EditTestModal';
import DeleteTestModal from '../../components/test/DeleteTestModal';
import ViewTestModal from '../../components/test/ViewTestModal';
import { getAllTests, createTest, updateTest, deleteTest } from '../../services/api';

const TestManagement = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const response = await getAllTests();
      setTests(response);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tests');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTest = async (testData) => {
    try {
      const response = await createTest(testData);
      setTests([...tests, response]);
      setIsAddModalOpen(false);
      setValidationErrors({});
      setError(null);
    } catch (err) {
      if (err.response?.status === 422) {
        setValidationErrors(err.response.data.errors);
      } else {
        setError(err.response?.data?.message || 'Failed to create test');
      }
    }
  };

  const handleEditTest = async (testData) => {
    try {
      const response = await updateTest(testData.id, testData);
      setTests(tests.map(test => test.id === testData.id ? response : test));
      setIsEditModalOpen(false);
      setValidationErrors({});
      setError(null);
    } catch (err) {
      if (err.response?.status === 422) {
        setValidationErrors(err.response.data.errors);
      } else {
        setError(err.response?.data?.message || 'Failed to update test');
      }
    }
  };

  const handleDeleteTest = async (testId) => {
    try {
      await deleteTest(testId);
      setTests(tests.filter(test => test.id !== testId));
      setIsDeleteModalOpen(false);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete test');
    }
  };

  // Filter tests based on search query
  const filteredTests = tests.filter(test => 
    test.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading tests...</div>
        </div>
      </div>
    </Layout>
  );

  const clearErrors = () => {
    setError(null);
    setValidationErrors({});
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Test Management</h1>
          <button 
            onClick={() => {
              clearErrors();
              setIsAddModalOpen(true);
            }}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 w-full sm:w-auto justify-center"
          >
            <FaPlus className="mr-2" />
            Add New Test
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b">
            <div className="relative">
              <input
                type="text"
                placeholder="Search tests..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="overflow-x-auto">
            {/* Mobile View */}
            <div className="sm:hidden">
              {filteredTests.map((test) => (
                <div key={test.id} className="p-4 border-b border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-gray-900">{test.name}</h3>
                      <span className="inline-block mt-1 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        {test.parameters.length} parameters
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedTest(test);
                          setIsViewModalOpen(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => {
                          clearErrors();
                          setSelectedTest(test);
                          setIsEditModalOpen(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => {
                          clearErrors();
                          setSelectedTest(test);
                          setIsDeleteModalOpen(true);
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    Updated {new Date(test.updated_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View */}
            <table className="hidden sm:table min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parameters</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created At</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Updated At</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTests.map((test) => (
                  <tr key={test.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{test.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
                        {test.parameters.length} parameters
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(test.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(test.updated_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => {
                          setSelectedTest(test);
                          setIsViewModalOpen(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        <FaEye />
                      </button>
                      <button 
                        onClick={() => {
                          clearErrors();
                          setSelectedTest(test);
                          setIsEditModalOpen(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        onClick={() => {
                          clearErrors();
                          setSelectedTest(test);
                          setIsDeleteModalOpen(true);
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AddTestModal
        isOpen={isAddModalOpen}
        onClose={() => {
          clearErrors();
          setIsAddModalOpen(false);
        }}
        onAdd={handleAddTest}
        validationErrors={validationErrors}
      />

      <EditTestModal
        isOpen={isEditModalOpen}
        onClose={() => {
          clearErrors();
          setIsEditModalOpen(false);
        }}
        onEdit={handleEditTest}
        test={selectedTest}
        validationErrors={validationErrors}
      />

      <DeleteTestModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          clearErrors();
          setIsDeleteModalOpen(false);
        }}
        onDelete={handleDeleteTest}
        test={selectedTest}
      />

      <ViewTestModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        test={selectedTest}
      />
    </Layout>
  );
};

export default TestManagement;
