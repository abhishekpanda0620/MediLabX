import React, { useState, useEffect } from 'react';
import { FaCalendarCheck, FaClipboardCheck, FaSpinner, FaTimesCircle, FaFileAlt } from 'react-icons/fa';
import Layout from '../../components/Layout';
import { getPatientDashboardStats } from '../../services/api';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getPatientDashboardStats();
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
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Patient Dashboard</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 border border-red-400 rounded">
            {error}
          </div>
        )}

        {stats && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="bg-yellow-100 p-3 rounded-full mr-4">
                    <FaCalendarCheck className="text-yellow-600 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Booked Tests</p>
                    <p className="text-xl font-semibold">{stats.bookingStats.booked}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <FaSpinner className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Processing</p>
                    <p className="text-xl font-semibold">{stats.bookingStats.processing}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    <FaClipboardCheck className="text-green-600 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Completed</p>
                    <p className="text-xl font-semibold">{stats.bookingStats.completed}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="bg-red-100 p-3 rounded-full mr-4">
                    <FaTimesCircle className="text-red-600 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Cancelled</p>
                    <p className="text-xl font-semibold">{stats.bookingStats.cancelled}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Test Bookings */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Recent Test Bookings</h2>
                  <Link to="/patient/bookings" className="text-sm text-indigo-600 hover:text-indigo-800">View All</Link>
                </div>
                <div className="space-y-4">
                  {stats.recentBookings.length > 0 ? (
                    stats.recentBookings.map((booking) => (
                      <div key={booking.id} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-medium">{booking.test.name}</h3>
                            <p className="text-sm text-gray-500">Dr. {booking.doctor.name}</p>
                          </div>
                          <div className="text-right">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                              booking.status === 'processing' || booking.status === 'sample_collected' ? 'bg-blue-100 text-blue-800' :
                              booking.status === 'booked' ? 'bg-yellow-100 text-yellow-800' :
                              booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {booking.status.replace('_', ' ').charAt(0).toUpperCase() + booking.status.replace('_', ' ').slice(1)}
                            </span>
                            <p className="text-xs text-gray-500 mt-1">{new Date(booking.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No recent test bookings</p>
                  )}
                </div>
              </div>

              {/* Recent Test Reports */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">
                    Recent Reports
                    {stats.unreadReports > 0 && (
                      <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                        {stats.unreadReports} New
                      </span>
                    )}
                  </h2>
                  <Link to="/patient/reports" className="text-sm text-indigo-600 hover:text-indigo-800">View All</Link>
                </div>
                <div className="space-y-4">
                  {stats.recentReports.length > 0 ? (
                    stats.recentReports.map((report) => (
                      <div key={report.id} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-medium">{report.testBooking.test.name}</h3>
                            <div className="flex items-center text-sm text-gray-500">
                              <FaFileAlt className="mr-1" />
                              <span>Report #{report.id}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <Link 
                              to={`/patient/reports/${report.id}`}
                              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                            >
                              View Report
                            </Link>
                            <p className="text-xs text-gray-500 mt-1">{new Date(report.validated_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No reports available</p>
                  )}
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