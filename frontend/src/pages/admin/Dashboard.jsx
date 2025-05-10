import React from 'react';
import { FaUserMd, FaUsers, FaFlask, FaFileInvoiceDollar } from 'react-icons/fa';
import Layout from '../../components/Layout';

const AdminDashboard = () => {
  const stats = [
    { title: 'Total Staff', value: '24', icon: FaUserMd, color: 'bg-blue-500' },
    { title: 'Active Patients', value: '156', icon: FaUsers, color: 'bg-green-500' },
    { title: 'Tests Today', value: '32', icon: FaFlask, color: 'bg-purple-500' },
    { title: 'Revenue', value: '$5,230', icon: FaFileInvoiceDollar, color: 'bg-yellow-500' }
  ];

  const recentActivity = [
    { id: 1, action: 'New staff member added', time: '2 hours ago' },
    { id: 2, action: 'Test prices updated', time: '4 hours ago' },
    { id: 3, action: 'System maintenance scheduled', time: '1 day ago' }
  ];

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-full`}>
                  <stat.icon className="text-white text-xl" />
                </div>
                <div className="ml-4">
                  <h3 className="text-gray-500 text-sm">{stat.title}</h3>
                  <p className="text-2xl font-semibold text-gray-800">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100">
                Add New Staff
              </button>
              <button className="p-4 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100">
                Manage Tests
              </button>
              <button className="p-4 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100">
                View Reports
              </button>
              <button className="p-4 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100">
                Update Pricing
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span>{activity.action}</span>
                  <span className="text-sm text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
