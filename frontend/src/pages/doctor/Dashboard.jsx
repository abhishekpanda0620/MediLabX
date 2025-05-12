import React, { useState, useEffect } from 'react';
import { FaUserInjured, FaCalendarCheck, FaFileAlt, FaClock } from 'react-icons/fa';
import Layout from '../../components/Layout';
import { getDoctorDashboardStats } from '../../services/api';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDoctorDashboardStats();
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
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Doctor Dashboard</h1>

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
                    <p className="text-sm text-gray-500">My Patients</p>
                    <p className="text-xl font-semibold">{stats.patientCount}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <FaCalendarCheck className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Test Bookings</p>
                    <p className="text-xl font-semibold">{stats.bookingStats.total}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    <FaFileAlt className="text-green-600 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Complete Reports</p>
                    <p className="text-xl font-semibold">{stats.reportStats.totalValidated}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="bg-yellow-100 p-3 rounded-full mr-4">
                    <FaClock className="text-yellow-600 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Pending Reports</p>
                    <p className="text-xl font-semibold">{stats.reportStats.pending}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Recent Test Bookings */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Recent Test Bookings</h2>
                  <Link to="/doctor/bookings" className="text-sm text-indigo-600 hover:text-indigo-800">View All</Link>
                </div>
                <div className="space-y-4">
                  {stats.recentBookings.length > 0 ? (
                    stats.recentBookings.map((booking) => (
                      <div key={booking.id} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-medium">{booking.patient.name}</h3>
                            <p className="text-sm text-gray-500">{booking.test.name}</p>
                          </div>
                          <div className="text-right">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                              booking.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                              booking.status === 'booked' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                            <p className="text-xs text-gray-500 mt-1">{new Date(booking.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No recent bookings</p>
                  )}
                </div>
              </div>

              {/* Latest Reports */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Latest Reports</h2>
                  <Link to="/doctor/reports" className="text-sm text-indigo-600 hover:text-indigo-800">View All</Link>
                </div>
                <div className="space-y-4">
                  {stats.latestReports.length > 0 ? (
                    stats.latestReports.map((report) => (
                      <div key={report.id} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-medium">{report.testBooking.patient.name}</h3>
                            <p className="text-sm text-gray-500">{report.testBooking.test.name}</p>
                          </div>
                          <div className="text-right">
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Validated</span>
                            <p className="text-xs text-gray-500 mt-1">{new Date(report.validated_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No validated reports</p>
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
