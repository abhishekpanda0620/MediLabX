import React from 'react';
import Layout from '../../components/Layout';

const Notifications = () => {
  const notifications = [
    { id: 1, message: 'Your test report is ready.', time: '2 hours ago' },
    { id: 2, message: 'Appointment confirmed for 2024-03-05.', time: '1 day ago' },
  ];

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Notifications</h1>
        <div className="space-y-4">
          {notifications.map(note => (
            <div key={note.id} className="bg-white rounded-lg shadow-md p-4">
              <p className="text-gray-700">{note.message}</p>
              <span className="text-sm text-gray-500">{note.time}</span>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Notifications;
