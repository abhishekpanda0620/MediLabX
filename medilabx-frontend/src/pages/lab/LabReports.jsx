import React from 'react';
import { FaFileAlt, FaEye, FaDownload, FaShare } from 'react-icons/fa';
import Layout from '../../components/Layout';

const LabReports = () => {
  const reports = [
    { id: 1, title: 'X-Ray - Chest', date: '2024-03-01', status: 'Ready' },
    { id: 2, title: 'Ultrasound - Abdomen', date: '2024-03-02', status: 'Pending' },
  ];

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Lab Reports</h1>
        <div className="grid gap-6">
          {reports.map(report => (
            <div key={report.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-4">
                    <FaFileAlt className="text-2xl text-indigo-600 mr-3" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {report.title}
                      </h3>
                      <p className="text-sm text-gray-600">{report.date}</p>
                    </div>
                  </div>
                </div>
                {report.status === 'Ready' && (
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
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default LabReports;
