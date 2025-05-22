import React from "react";
import { FaCheck, FaPen, FaCheckCircle, FaDownload, FaEnvelope } from "react-icons/fa";

const ReportGeneration = ({
  bookingData,
  reportGenerationSuccess,
  isLoadingReports,
  generatedReports,
  notificationStatus,
  handleEditReport,
  handleDownloadReport,
  handleSendNotification,
  handleGenerateReport,
  handleReset,
  hideReportsTable = false
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      

      <div className="bg-purple-50 border border-purple-200 p-4 rounded-xl mb-4">
        <div className="flex items-center">
          <FaCheck className="text-purple-500 mr-2" />
          <span className="font-medium">
            Test processed and ready for reporting!
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Booking ID: {bookingData.id} | Status: completed
          {bookingData.doctor && (
            <> | Referred by: {bookingData.doctor.name}</>
          )}
        </p>
        <p className="text-sm text-gray-600 mt-1">
          <span className="font-medium">
            Automatic workflow completed:
          </span>{" "}
          Test booked → Sample collected → Test processing → Completed
        </p>
      </div>

      {/* Display success message when report is generated */}
      {reportGenerationSuccess && (
        <div className="bg-green-100 border border-green-300 rounded-lg p-4 mb-4 flex items-center">
          <FaCheckCircle className="text-green-600 mr-2 text-xl" />
          <div>
            <p className="font-medium text-green-800">Report generated successfully!</p>
            <p className="text-sm text-green-700">
              The report has been created and is available for download and patient notification.
            </p>
          </div>
        </div>
      )}

      {/* Display generated reports list */}
      {reportGenerationSuccess && !hideReportsTable && (
        <div className="mt-4 mb-6">
          <h3 className="text-lg font-medium mb-3">Available Reports</h3>
          {isLoadingReports ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading reports...</p>
            </div>
          ) : generatedReports.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Report ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Generated Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {generatedReports.map((report) => (
                    <tr key={report.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{report.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(report.created_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {report.is_finalized ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <FaCheck className="mr-1" /> Finalized
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Draft
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditReport(report.id)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                          >
                            <FaPen className="mr-1" /> Edit
                          </button>
                          <button
                            onClick={() => handleDownloadReport(report.id)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                          >
                            <FaDownload className="mr-1" /> Download
                          </button>
                          <button
                            onClick={() => handleSendNotification(report.id)}
                            disabled={notificationStatus[report.id] === 'loading' || notificationStatus[report.id] === 'sent'}
                            className={`inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md 
                              ${notificationStatus[report.id] === 'sent' 
                                ? 'text-green-700 bg-green-100' 
                                : notificationStatus[report.id] === 'error'
                                ? 'text-red-700 bg-red-100 hover:bg-red-200'
                                : notificationStatus[report.id] === 'loading'
                                ? 'text-gray-500 bg-gray-100 cursor-not-allowed'
                                : 'text-indigo-700 bg-indigo-100 hover:bg-indigo-200'
                              }`}
                          >
                            {notificationStatus[report.id] === 'loading' ? (
                              <>
                                <span className="animate-spin h-4 w-4 mr-1 border-b-2 border-indigo-700 rounded-full"></span> Sending...
                              </>
                            ) : notificationStatus[report.id] === 'sent' ? (
                              <>
                                <FaCheckCircle className="mr-1" /> Notified
                              </>
                            ) : notificationStatus[report.id] === 'error' ? (
                              <>
                                <FaEnvelope className="mr-1" /> Retry
                              </>
                            ) : (
                              <>
                                <FaEnvelope className="mr-1" /> Notify Patient
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-6 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-500">No reports generated yet.</p>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-center mt-4">
        {generatedReports && generatedReports.length > 0 ? (
          <button
            className="px-6 py-3 bg-purple-600 text-white rounded-lg flex items-center mr-4"
            onClick={() => handleEditReport(generatedReports[0].id)}
          >
            <FaPen className="mr-2" />
            View Report
          </button>
        ) : (
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded-lg flex items-center mr-4"
            onClick={handleGenerateReport}
          >
            <FaPen className="mr-2" />
            Generate Report
          </button>
        )}
        <button
          className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg"
          onClick={handleReset}
        >
          Start New Case
        </button>
      </div>
    </div>
  );
};

export default ReportGeneration;
