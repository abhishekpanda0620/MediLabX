import React, { useState, useEffect } from 'react';
import { FaFlask, FaSearch, FaClock, FaMoneyBill, FaUtensils } from 'react-icons/fa';
import { getAllTests } from '../../services/api';
import ViewTestModal from '../../components/test/ViewTestModal';

const TestCatalog = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTest, setSelectedTest] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

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

  const groupTestsByCategory = () => {
    const grouped = tests.reduce((acc, test) => {
      if (!acc[test.category]) {
        acc[test.category] = [];
      }
      acc[test.category].push(test);
      return acc;
    }, {});

    return Object.entries(grouped).map(([category, tests]) => ({
      name: category,
      tests,
      color: tests[0]?.category_color || 'gray'
    }));
  };

  const filteredCategories = groupTestsByCategory().filter(category => 
    category.tests.some(test => 
      test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading tests...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Test Catalog</h1>
        <p className="text-gray-600">Browse our comprehensive range of diagnostic tests</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="mb-6">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className={`text-xl font-semibold mb-4 text-${category.color}-600`}>
                {category.name}
              </div>
              <div className="space-y-4">
                {category.tests
                  .filter(test => 
                    test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    test.description?.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((test) => (
                    <div 
                      key={test.id} 
                      className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                      onClick={() => {
                        setSelectedTest(test);
                        setViewModalOpen(true);
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{test.name}</h4>
                          {test.description && (
                            <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                              {test.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2 text-sm">
                        <div className="flex items-center text-gray-600">
                          <FaClock className="mr-1" />
                          <span>{test.formatted_turn_around_time}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <FaMoneyBill className="mr-1" />
                          <span>{test.formatted_price}</span>
                        </div>
                        {test.fasting_required && (
                          <div className="flex items-center text-gray-600">
                            <FaUtensils className="mr-1" />
                            <span>Fasting Required</span>
                          </div>
                        )}
                        <div className="flex items-center text-gray-600">
                          <FaFlask className="mr-1" />
                          <span>{test.parameters.length} parameters</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCategories.length === 0 && (
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
  );
};

export default TestCatalog;
