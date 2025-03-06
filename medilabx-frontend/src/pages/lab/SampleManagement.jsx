import React from 'react';
import { FaSearch, FaEdit, FaTrash } from 'react-icons/fa';
import Layout from '../../components/Layout';

const SampleManagement = () => {
  const samples = [
    { id: 1, sampleId: 'S123', patient: 'Alice Johnson', received: '2024-03-01' },
    { id: 2, sampleId: 'S124', patient: 'Bob Smith', received: '2024-03-02' },
  ];

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Sample Management</h1>
          <div className="relative mt-4 sm:mt-0">
            <input
              type="text"
              placeholder="Search samples..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sample ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Received</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {samples.map(sample => (
                <tr key={sample.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{sample.sampleId}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{sample.patient}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{sample.received}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                      <FaEdit />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default SampleManagement;
