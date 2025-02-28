import React from 'react';
import Layout from '../components/Layout';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FaFileAlt, FaCalendarCheck, FaClipboardList, FaBell } from 'react-icons/fa';

const PatientDashboardPage = () => {
  // Test history data
  const testData = [
    { name: 'Jan', tests: 4 },
    { name: 'Feb', tests: 3 },
    { name: 'Mar', tests: 5 },
    { name: 'Apr', tests: 2 },
    { name: 'May', tests: 6 },
    { name: 'Jun', tests: 4 },
  ];

  // Test types data for pie chart
  const testTypesData = [
    { name: 'Blood Tests', value: 35 },
    { name: 'Urine Tests', value: 25 },
    { name: 'X-Ray', value: 20 },
    { name: 'Other', value: 20 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Stats data
  const stats = [
    { id: 1, name: 'Total Tests', stat: '42', icon: FaFileAlt, color: 'bg-blue-500' },
    { id: 2, name: 'Appointments', stat: '3', icon: FaCalendarCheck, color: 'bg-green-500' },
    { id: 3, name: 'Pending Reports', stat: '2', icon: FaClipboardList, color: 'bg-yellow-500' },
    { id: 4, name: 'Notifications', stat: '5', icon: FaBell, color: 'bg-purple-500' },
  ];

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header Section */}
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">Patient Dashboard</h1>
            <p className="mt-2 text-sm text-gray-700 max-w-2xl">
              Welcome back! Here's an overview of your health records and upcoming appointments.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.id}
              className="relative overflow-hidden rounded-lg bg-white p-4 sm:px-6 shadow hover:shadow-lg transition-shadow duration-300"
            >
              <dt>
                <div className={`absolute rounded-md p-3 ${item.color}`}>
                  <item.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" aria-hidden="true" />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500">{item.name}</p>
              </dt>
              <dd className="ml-16 flex items-baseline pb-2 sm:pb-3">
                <p className="text-xl sm:text-2xl font-semibold text-gray-900">{item.stat}</p>
              </dd>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Test History Chart */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Test History</h2>
            <div className="h-64 sm:h-80 lg:h-96">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={testData}
                  margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="tests" 
                    stroke="#6366f1" 
                    fill="#818cf8"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Test Types Distribution */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Test Types Distribution</h2>
            <div className="h-64 sm:h-80 lg:h-96">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={testTypesData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius="90%"
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => 
                      window.innerWidth < 640 ? 
                        `${(percent * 100).toFixed(0)}%` : 
                        `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {testTypesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Tests Table */}
        <div className="mt-6 sm:mt-8">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow overflow-hidden">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Recent Tests</h2>
            <div className="overflow-x-auto -mx-4 sm:-mx-6">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-900">Test Name</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-900">Date</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-900">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 sm:px-6 py-3 text-xs sm:text-sm text-gray-900">Blood Test</td>
                      <td className="px-4 sm:px-6 py-3 text-xs sm:text-sm text-gray-500">2025-02-25</td>
                      <td className="px-4 sm:px-6 py-3">
                        <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold text-green-800">
                          Completed
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PatientDashboardPage;