import React from 'react';
import { FaFileAlt, FaDownload, FaShare, FaEye } from 'react-icons/fa';
import Layout from '../../components/Layout';

const MyReports = () => {
  const reports = [
    {
      id: 1,
      testName: 'Complete Blood Count',
      date: '2024-02-15',
      doctor: 'Dr. Sarah Smith',
      status: 'Complete',
      type: 'Blood Test'
    },
    {
      id: 2,
      testName: 'Lipid Profile',
      date: '2024-02-10',
      doctor: 'Dr. Michael Johnson',
      status: 'Processing',
      type: 'Blood Test'
    }
  ];

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">My Test Reports</h1>
          <p className="text-gray-600">Access and manage your test reports</p>
        </div>

        <div className="grid gap-6">
          {reports.map((report) => (
            <div key={report.id} className="bg-white rounded-lg shadow-md">
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-4">
                      <FaFileAlt className="text-2xl text-indigo-600 mr-3" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {report.testName}
                        </h3>
                        <p className="text-sm text-gray-600">{report.type}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Date</p>
                        <p className="font-medium">{report.date}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Doctor</p>
                        <p className="font-medium">{report.doctor}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold mb-4 
                      ${report.status === 'Complete' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {report.status}
                    </span>
                    {report.status === 'Complete' && (
                      <div className="flex space-x-2">
                        <button className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                          <FaEye className="mr-2" />
                          View
                        </button>
                        <button className="flex items-center px-3 py-2 border border-indigo-600 text-indigo-600 rounded hover:bg-indigo-50">
                          <FaDownload className="mr-2" />
                          Download
                        </button>
                        <button className="flex items-center px-3 py-2 border border-indigo-600 text-indigo-600 rounded hover:bg-indigo-50">
                          <FaShare className="mr-2" />
                          Share
                        </button>
                      </div>
                    )}
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

export default MyReports;
