import React from 'react';
import { FaUsers, FaFileAlt, FaCalendarAlt, FaBell } from 'react-icons/fa';
import Layout from '../../components/Layout';

const DoctorDashboard = () => {
  const stats = [
    { id: 1, name: 'Assigned Patients', value: '12', icon: FaUsers, color: 'bg-blue-500' },
    { id: 2, name: 'Pending Reports', value: '4', icon: FaFileAlt, color: 'bg-green-500' },
    { id: 3, name: 'Appointments', value: '5', icon: FaCalendarAlt, color: 'bg-yellow-500' },
    { id: 4, name: 'Notifications', value: '3', icon: FaBell, color: 'bg-purple-500' },
  ];

  const recentActivity = [
    { id: 1, action: 'New patient assigned', time: '1 hour ago' },
    { id: 2, action: 'Report submitted', time: '3 hours ago' },
    { id: 3, action: 'Appointment rescheduled', time: '1 day ago' },
  ];

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Doctor Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {stats.map((stat) => (
            <div key={stat.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-full`}>
                  <stat.icon className="text-white text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-gray-500 text-sm">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-800">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map(act => (
              <div key={act.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span>{act.action}</span>
                <span className="text-sm text-gray-500">{act.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DoctorDashboard;
