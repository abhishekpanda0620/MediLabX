import React from 'react';
import { FaCalendarAlt, FaClock, FaUserMd, FaFileMedical } from 'react-icons/fa';
import Layout from '../../components/Layout';

const Appointments = () => {
  const appointments = [
    {
      id: 1,
      testName: 'Complete Blood Count',
      date: '2024-02-20',
      time: '10:00 AM',
      doctor: 'Dr. Sarah Smith',
      status: 'Upcoming',
      type: 'Blood Test'
    },
    {
      id: 2,
      testName: 'X-Ray Chest',
      date: '2024-02-22',
      time: '2:30 PM',
      doctor: 'Dr. Michael Johnson',
      status: 'Confirmed',
      type: 'Radiology'
    }
  ];

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">My Appointments</h1>
          <p className="text-gray-600">Manage your upcoming and past appointments</p>
        </div>

        <div className="mb-6">
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
            Schedule New Appointment
          </button>
        </div>

        <div className="grid gap-6">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {appointment.testName}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <FaCalendarAlt className="mr-2 text-indigo-600" />
                      <span>{appointment.date}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaClock className="mr-2 text-indigo-600" />
                      <span>{appointment.time}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaUserMd className="mr-2 text-indigo-600" />
                      <span>{appointment.doctor}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaFileMedical className="mr-2 text-indigo-600" />
                      <span>{appointment.type}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold mb-4 
                    ${appointment.status === 'Upcoming' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                    {appointment.status}
                  </span>
                  <div className="space-x-2">
                    <button className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded hover:bg-indigo-50">
                      Reschedule
                    </button>
                    <button className="px-4 py-2 border border-red-600 text-red-600 rounded hover:bg-red-50">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Appointments;
