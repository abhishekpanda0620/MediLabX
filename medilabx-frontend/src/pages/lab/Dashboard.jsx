import React from 'react';
import { FaVials, FaUserFriends, FaChartBar } from 'react-icons/fa';
import Layout from '../../components/Layout';

const LabDashboard = () => {
  const stats = [
    { id: 1, name: 'Total Samples', value: '120', icon: FaVials, color: 'bg-blue-500' },
    { id: 2, name: 'Processed Samples', value: '85', icon: FaUserFriends, color: 'bg-green-500' },
    { id: 3, name: 'Pending Reports', value: '10', icon: FaChartBar, color: 'bg-yellow-500' },
  ];

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Lab Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map(stat => (
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
        {/* ...additional lab charts and activity sections... */}
      </div>
    </Layout>
  );
};

export default LabDashboard;
