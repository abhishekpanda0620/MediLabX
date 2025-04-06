import React, { useState, useEffect } from 'react';
import { FaSearch, FaCheck } from 'react-icons/fa';
import Layout from '../../components/Layout';
import { getTestBookings, markSampleCollected } from '../../services/api';

const SampleManagement = () => {
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSamples();
  }, []);

  const fetchSamples = async () => {
    try {
      setLoading(true);
      const response = await getTestBookings({ status: 'pending' });
      setSamples(response);
    } catch (err) {
      setError('Failed to fetch samples');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkCollected = async (sampleId) => {
    try {
      setLoading(true);
      await markSampleCollected(sampleId);
      fetchSamples(); // Refresh the list after marking as collected
    } catch (err) {
      setError('Failed to mark sample as collected');
    } finally {
      setLoading(false);
    }
  };

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

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 border border-red-400 rounded">
            {error}
          </div>
        )}

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
                  <td className="px-6 py-4 whitespace-nowrap">{sample.patient.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(sample.received_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => handleMarkCollected(sample.id)}
                      className="text-green-600 hover:text-green-900"
                      disabled={loading}
                    >
                      <FaCheck />
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
