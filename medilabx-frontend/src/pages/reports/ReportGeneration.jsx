import React from 'react';
import { FaUser, FaCalendar, FaFlask, FaFileAlt } from 'react-icons/fa';

const ReportGeneration = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Generate Report</h1>
        <p className="text-gray-600">Create detailed test reports for patients</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Patient Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter patient name"
                />
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <FaCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Type
              </label>
              <div className="relative">
                <select className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                  <option>Blood Test</option>
                  <option>Urine Analysis</option>
                  <option>X-Ray</option>
                </select>
                <FaFlask className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Template
              </label>
              <div className="relative">
                <select className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                  <option>Standard Template</option>
                  <option>Detailed Template</option>
                  <option>Custom Template</option>
                </select>
                <FaFileAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test Results
            </label>
            <textarea
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              rows="4"
              placeholder="Enter test results and observations..."
            ></textarea>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Preview
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Generate Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportGeneration;
