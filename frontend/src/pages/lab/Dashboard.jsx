import React, { useState, useEffect } from 'react';
import { FaFlask, FaVial, FaFileAlt, FaExclamationTriangle } from 'react-icons/fa';
import Layout from '../../components/Layout';
import { getLabDashboardStats } from '../../services/api';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getLabDashboardStats();
        setStats(data);
        setError(null);
      } catch (err) {
        setError('Failed to load dashboard statistics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="p-6">
          <div className="text-center py-10">
            <div className="text-gray-500">Loading dashboard statistics...</div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Lab Technician Dashboard</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 border border-red-400 rounded">
            {error}
          </div>
        )}

        {stats && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="bg-yellow-100 p-3 rounded-full mr-4">
                    <FaFlask className="text-yellow-600 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Awaiting Collection</p>
                    <p className="text-xl font-semibold">{stats.sampleStats.awaiting}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <FaVial className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Processing</p>
                    <p className="text-xl font-semibold">{stats.sampleStats.collected + stats.sampleStats.processing}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    <FaFileAlt className="text-green-600 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Completed Reports</p>
                    <p className="text-xl font-semibold">{stats.reportStats.validated}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="bg-red-100 p-3 rounded-full mr-4">
                    <FaExclamationTriangle className="text-red-600 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Rejected Reports</p>
                    <p className="text-xl font-semibold">{stats.reportStats.rejected}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Priority Samples */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Priority Samples</h2>
                  <Link to="/lab/samples" className="text-sm text-indigo-600 hover:text-indigo-800">View All</Link>
                </div>
                <div className="space-y-4">
                  {stats.prioritySamples.length > 0 ? (
                    stats.prioritySamples.map((sample) => (
                      <div key={sample.id} className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-medium">{sample?.patient.name}</h3>
                            <p className="text-sm text-gray-500">{sample?.test.name}</p>
                          </div>
                          <div className="text-right">
                            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                              Collected {new Date(sample?.sample_collection_time).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No priority samples</p>
                  )}
                </div>
              </div>

              {/* Recent Reports */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Recent Reports</h2>
                  <Link to="/lab/reports" className="text-sm text-indigo-600 hover:text-indigo-800">View All</Link>
                </div>
                <div className="space-y-4">
                  {stats.recentReports.length > 0 ? (
                    stats.recentReports.map((report) => (
                      <div key={report?.id} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-medium">{report?.testBooking?.patient?.name}</h3>
                            <p className="text-sm text-gray-500">{report?.testBooking?.test?.name}</p>
                          </div>
                          <div className="text-right">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              report?.status === 'validated' ? 'bg-green-100 text-green-800' :
                              report?.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                              report?.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {report?.status.charAt(0).toUpperCase() + report?.status.slice(1)}
                            </span>
                            <p className="text-xs text-gray-500 mt-1">{new Date(report?.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No recent reports</p>
                  )}
                </div>
              </div>
            </div>

            {/* Report Status Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Your Reports Summary</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Draft</p>
                  <p className="text-2xl font-semibold text-gray-700">{stats.reportStats.draft}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-700">Submitted</p>
                  <p className="text-2xl font-semibold text-blue-700">{stats.reportStats.submitted}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-700">Validated</p>
                  <p className="text-2xl font-semibold text-green-700">{stats.reportStats.validated}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm text-red-700">Rejected</p>
                  <p className="text-2xl font-semibold text-red-700">{stats.reportStats.rejected}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
