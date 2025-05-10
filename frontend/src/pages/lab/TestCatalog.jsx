import React, { useState, useEffect } from 'react';
import { FaFlask, FaSearch, FaClock, FaMoneyBill, FaUtensils, FaVial } from 'react-icons/fa';
import { getAllTests, getCategories } from '../../services/api';
import Layout from '../../components/Layout';
import ViewTestModal from '../../components/test/ViewTestModal';
import { formatPrice } from '../../utils/formatters';

const TestCatalog = () => {
  const [tests, setTests] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTest, setSelectedTest] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [testsResponse, categoriesResponse] = await Promise.all([
        getAllTests(),
        getCategories()
      ]);
      setTests(testsResponse);
      setCategories(categoriesResponse);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const filteredTests = tests.filter(test => {
    const matchesSearch = searchQuery.toLowerCase() === '' ||
      test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || test.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <Layout>
        <div className="p-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Loading tests...</div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Lab Test Catalog</h1>
          <p className="text-gray-600">Comprehensive diagnostic test catalog with Indian healthcare standards</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search tests by name, category, or description..."
                className="w-full p-3 pl-10 pr-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          
          <div className="w-full sm:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTests.map((test) => (
            <div 
              key={test.id} 
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{test.name}</h3>
                    <div className="mt-1">
                      <span className={`inline-block px-2 py-1 text-xs rounded-full bg-${test.category_color}-100 text-${test.category_color}-800`}>
                        {test.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={() => {
                        setSelectedTest(test);
                        setViewModalOpen(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      <FaVial className="text-lg" />
                    </button>
                  </div>
                </div>

                {test.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {test.description}
                  </p>
                )}

                <div className="border-t pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <FaClock className="mr-2" />
                      <span>{test.formatted_turn_around_time}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FaMoneyBill className="mr-2" />
                      <span>{formatPrice(test.price)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FaFlask className="mr-2" />
                      <span>{test.parameters.length} parameters</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FaUtensils className="mr-2" />
                      <span>{test.fasting_required ? 'Fasting Required' : 'No Fasting'}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-sm text-gray-500">
                  {test.specimen_requirements && (
                    <div className="mb-1">
                      <span className="font-medium">Specimen: </span>
                      {test.specimen_requirements}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTests.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No tests found matching your search criteria.</p>
          </div>
        )}

        <ViewTestModal
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          test={selectedTest}
        />
      </div>
    </Layout>
  );
};

export default TestCatalog;
