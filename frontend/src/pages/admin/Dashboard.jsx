import React, { useState, useEffect } from 'react';
import { FaUserMd, FaUserInjured, FaFlask, FaMicroscope, FaFileAlt, FaVial, FaCalendarCheck } from 'react-icons/fa';
import Layout from '../../components/Layout';
import { getAdminDashboardStats } from '../../services/api';
import { Chart, registerables } from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register Chart.js components
Chart.register(...registerables);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAdminDashboardStats();
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

  const chartData = {
    labels: [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ],
    datasets: [
      {
        label: 'Revenue (₹)',
        data: stats ? Object.values(stats.monthlyRevenue) : [],
        backgroundColor: 'rgba(79, 70, 229, 0.6)',
        borderColor: 'rgba(79, 70, 229, 1)',
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Revenue'
      },
    },
  };

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
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

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
                  <div className="bg-indigo-100 p-3 rounded-full mr-4">
                    <FaUserInjured className="text-indigo-600 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Patients</p>
                    <p className="text-xl font-semibold">{stats.usersByRole.patients}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    <FaUserMd className="text-green-600 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Doctors</p>
                    <p className="text-xl font-semibold">{stats.usersByRole.doctors}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <FaFlask className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Lab Technicians</p>
                    <p className="text-xl font-semibold">{stats.usersByRole.labTechnicians}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="bg-purple-100 p-3 rounded-full mr-4">
                    <FaMicroscope className="text-purple-600 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Pathologists</p>
                    <p className="text-xl font-semibold">{stats.usersByRole.pathologists}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Test Booking Statistics */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">Test Booking Statistics</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Total Bookings</p>
                    <p className="text-2xl font-semibold">{stats.bookingStats.total}</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-sm text-yellow-700">Booked</p>
                    <p className="text-2xl font-semibold text-yellow-700">{stats.bookingStats.booked}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-700">Processing</p>
                    <p className="text-2xl font-semibold text-blue-700">{stats.bookingStats.processing}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-700">Completed</p>
                    <p className="text-2xl font-semibold text-green-700">{stats.bookingStats.completed}</p>
                  </div>
                </div>
              </div>

              {/* Report Statistics */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">Report Statistics</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Total Reports</p>
                    <p className="text-2xl font-semibold">{stats.reportStats.total}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-700">Pending</p>
                    <p className="text-2xl font-semibold text-blue-700">{stats.reportStats.pending}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-700">Validated</p>
                    <p className="text-2xl font-semibold text-green-700">{stats.reportStats.validated}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue Chart */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Revenue Overview</h2>
              <div className="h-80">
                <Bar data={chartData} options={chartOptions} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Popular Tests */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">Popular Tests</h2>
                <div className="space-y-4">
                  {stats.popularTests.map((test, index) => (
                    <div key={test.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="bg-indigo-100 h-8 w-8 rounded-full flex items-center justify-center mr-3">
                          <span className="text-indigo-600 font-medium">{index + 1}</span>
                        </div>
                        <span className="font-medium">{test.name}</span>
                      </div>
                      <span className="bg-gray-100 px-2 py-1 rounded text-sm">{test.count} bookings</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Overview */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">System Overview</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-indigo-50 p-4 rounded-lg flex items-center">
                    <FaVial className="text-indigo-600 text-xl mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Available Tests</p>
                      <p className="text-xl font-semibold">{stats.testCount}</p>
                    </div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg flex items-center">
                    <FaFileAlt className="text-purple-600 text-xl mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Test Packages</p>
                      <p className="text-xl font-semibold">{stats.packageCount}</p>
                    </div>
                  </div>
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
