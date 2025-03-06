import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { FaUser, FaCalendarAlt } from 'react-icons/fa';

const ReportGeneration = () => {
  const [patientName, setPatientName] = useState('');
  const [testDate, setTestDate] = useState('');
  const [testType, setTestType] = useState('Blood Test');
  const [reportContent, setReportContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // ...report generation logic...
    console.log({ patientName, testDate, testType, reportContent });
  };

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Generate Report</h1>
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Patient Name</label>
            <div className="relative">
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="Enter patient name"
                className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Test Date</label>
            <div className="relative">
              <input
                type="date"
                value={testDate}
                onChange={(e) => setTestDate(e.target.value)}
                className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Test Type</label>
            <select
              value={testType}
              onChange={(e) => setTestType(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option>Blood Test</option>
              <option>Urine Analysis</option>
              <option>X-Ray</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Content</label>
            <textarea
              value={reportContent}
              onChange={(e) => setReportContent(e.target.value)}
              rows="4"
              placeholder="Enter report details..."
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            ></textarea>
          </div>
          <button type="submit" className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
            Generate Report
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default ReportGeneration;
