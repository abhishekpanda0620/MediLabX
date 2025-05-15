import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaEye } from 'react-icons/fa';
import Layout from '../../components/Layout';
import AddTestModal from '../../components/test/AddTestModal';
import EditTestModal from '../../components/test/EditTestModal';
import DeleteTestModal from '../../components/test/DeleteTestModal';
import ViewTestModal from '../../components/test/ViewTestModal';
import { getAllTests, createTest, updateTest, deleteTest } from '../../services/api';
import { DataTable, DataTableHelpers, Alert, FormField } from '../../components/common';

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

  // Table column definitions for DataTable
  const columns = [
    {
      header: 'Name',
      accessor: 'name',
    },
    {
      header: 'Parameters',
      accessor: 'parameters',
      render: (test) => test.parameters.length
    },
    {
      header: 'Created At',
      accessor: 'created_at',
      render: (test) => new Date(test.created_at).toLocaleDateString()
    },
    {
      header: 'Updated At',
      accessor: 'updated_at',
      render: (test) => new Date(test.updated_at).toLocaleDateString()
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (test) => (
        <div className="flex space-x-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedTest(test);
              setIsViewModalOpen(true);
            }}
            className="text-indigo-600 hover:text-indigo-900"
            title="View test details"
          >
            <FaEye />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              clearErrors();
              setSelectedTest(test);
              setIsEditModalOpen(true);
            }}
            className="text-indigo-600 hover:text-indigo-900"
            title="Edit test"
          >
            <FaEdit />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              clearErrors();
              setSelectedTest(test);
              setIsDeleteModalOpen(true);
            }}
            className="text-red-600 hover:text-red-900"
            title="Delete test"
          >
            <FaTrash />
          </button>
        </div>
      )
    }
  ];

  // Define mobile cards render function
  const renderMobileCard = (test) => (
    <div key={test.id} className="bg-white rounded-lg shadow-sm mb-4 p-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-medium text-gray-900">{test.name}</h3>
          <p className="text-sm text-gray-500">{test.parameters.length} parameters</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setSelectedTest(test);
              setIsViewModalOpen(true);
            }}
            className="text-indigo-600 text-xl hover:text-indigo-900"
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
  );

  return (
    <Layout>
      <div className="p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Test Management</h1>
          <button 
            onClick={() => {
              clearErrors();
              setIsAddModalOpen(true);
            }}
            className="flex cursor-pointer items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 w-full lg:w-auto justify-center"
          >
            <FaPlus className="mr-2" />
            Add New Test
          </button>
        </div>

        {error && (
          <Alert
            type="error"
            title={error}
            onDismiss={() => setError(null)}
          />
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b">
            <FormField
              id="search-tests"
              type="text"
              placeholder="Search tests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<FaSearch className="text-gray-400" />}
            />
          </div>

          {/* Mobile View */}
          <div className="block lg:hidden">
            {filteredTests.length > 0 ? (
              filteredTests.map(renderMobileCard)
            ) : (
              <div className="py-8 text-center text-gray-500">No tests found</div>
            )}
          </div>

          {/* Desktop View */}
          <div className="hidden lg:block">
            <DataTable
              columns={columns}
              data={filteredTests}
              loading={loading}
              emptyMessage="No tests found"
              onRowClick={(test) => {
                setSelectedTest(test);
                setIsViewModalOpen(true);
              }}
            />
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
