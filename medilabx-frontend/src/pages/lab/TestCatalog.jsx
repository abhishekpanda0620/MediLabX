import React from 'react';
import { FaFlask, FaSearch } from 'react-icons/fa';
import Layout from '../../components/Layout';

const TestCatalog = () => {
  const testCategories = [
    {
      name: 'Blood Tests',
      tests: ['Complete Blood Count', 'Diabetes Test', 'Thyroid Panel'],
      icon: '🩸'
    },
    {
      name: 'Urine Analysis',
      tests: ['Basic Metabolic Panel', 'Pregnancy Test'],
      icon: '🧪'
    },
    {
      name: 'Imaging',
      tests: ['X-Ray', 'Ultrasound', 'CT Scan'],
      icon: '📷'
    }
  ];

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Test Catalog</h1>
          <p className="text-gray-600">Explore the tests available at our laboratory</p>
        </div>
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search for tests..."
            className="w-full p-3 pl-10 pr-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testCategories.map((category, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="text-3xl mb-4">{category.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">{category.name}</h3>
                <ul className="space-y-2">
                  {category.tests.map((test, testIdx) => (
                    <li key={testIdx} className="flex items-center text-gray-600">
                      <FaFlask className="mr-2 text-indigo-600" />
                      {test}
                    </li>
                  ))}
                </ul>
                <button className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default TestCatalog;
