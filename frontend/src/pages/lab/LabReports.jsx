import React, { useState, useEffect } from 'react';
import { FaFileAlt, FaEye, FaDownload, FaShare, FaSearch, FaBell, FaSpinner, FaCheck, FaTimes } from 'react-icons/fa';
import Layout from '../../components/Layout';
import { getTestReports, sendReportNotification, downloadTestReport } from '../../services/api';

const LabReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationStatus, setNotificationStatus] = useState({});
  const [selectedReport, setSelectedReport] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      // Add a showAll parameter to bypass restrictive filters in the backend
      const response = await getTestReports({ showAll: true });
      console.log("API Response - Test Reports:", response);
      setReports(response);
      setError(null);
    } catch (err) {
      console.error("Error fetching reports:", err); // Detailed error logging
      setError('Failed to load reports: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSendNotification = async (reportId) => {
    try {
      setNotificationStatus(prev => ({ ...prev, [reportId]: 'sending' }));
      await sendReportNotification(reportId);
      setNotificationStatus(prev => ({ ...prev, [reportId]: 'sent' }));
      
      // Reset notification status after 3 seconds
      setTimeout(() => {
        setNotificationStatus(prev => {
          const newStatus = { ...prev };
          delete newStatus[reportId];
          return newStatus;
        });
      }, 3000);
    } catch (err) {
      console.error('Notification error:', err);
      setError(`Failed to send notification: ${err.message || 'Unknown error'}`);
      setNotificationStatus(prev => ({ ...prev, [reportId]: 'error' }));
      
      // Reset error notification status after 5 seconds
      setTimeout(() => {
        setNotificationStatus(prev => {
          const newStatus = { ...prev };
          delete newStatus[reportId];
          return newStatus;
        });
      }, 5000);
    }
  };

  const handleDownload = async (reportId) => {
    try {
      const downloadSuccessful = await downloadTestReport(reportId);
      if (!downloadSuccessful) {
        setError('Failed to download report. Please ensure the report is validated and try again.');
      }
    } catch (error) {
      console.error('Error downloading report:', error);
      setError('Failed to generate or download the report. Please try again later.');
    }
  };
  
  const handleViewReport = (report) => {
    setSelectedReport(report);
    setShowReportModal(true);
  };

  const closeModal = () => {
    setShowReportModal(false);
    setSelectedReport(null);
  };

  const filteredReports = reports.filter(report => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      (report.id && report.id.toString().includes(query)) ||
      (report.testBooking?.patient?.name && report.testBooking.patient.name.toLowerCase().includes(query)) ||
      (report.testBooking?.test?.name && report.testBooking.test.name.toLowerCase().includes(query)) ||
      (report.status && report.status.toLowerCase().includes(query))
    );
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Layout>
      <div className="p-6 max-h-screen overflow-auto">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Lab Reports</h1>
          <div className="mt-4 sm:mt-0 relative">
            <input
              type="text"
              placeholder="Search reports..."
              className="pl-10 pr-4 py-2 border rounded-lg w-full sm:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 border border-red-400 rounded">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-10">
            <FaSpinner className="animate-spin text-3xl text-indigo-600 mx-auto mb-3" />
            <p>Loading reports...</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredReports.length > 0 ? (
              filteredReports.map(report => (
                <div key={report.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-4">
                        <FaFileAlt className="text-2xl text-indigo-600 mr-3" />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {report.testBooking?.test?.name || 'Unknown Test'}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Patient: {report.testBooking?.patient?.name || 'Unknown Patient'}
                          </p>
                          <p className="text-sm text-gray-600">
                            Date: {formatDate(report.created_at)}
                          </p>
                          <div className="mt-1">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              report.status === 'validated' ? 'bg-green-200 text-green-800' :
                              report.status === 'reviewed' ? 'bg-purple-200 text-purple-800' :
                              report.status === 'submitted' ? 'bg-blue-200 text-blue-800' :
                              report.status === 'rejected' ? 'bg-red-200 text-red-800' :
                              'bg-gray-200 text-gray-800'
                            }`}>
                              {report.status?.charAt(0).toUpperCase() + report.status?.slice(1) || 'Unknown'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
                      <button 
                        className="flex items-center px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                        onClick={() => handleViewReport(report)}
                        title="View Report Details"
                      >
                        <FaEye className="mr-2" />
                        View
                      </button>
                      
                      <button 
                        className={`flex items-center px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 ${
                          report.status !== 'validated' ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        onClick={() => handleDownload(report.id)}
                        disabled={report.status !== 'validated'}
                        title={report.status !== 'validated' ? 'Report must be validated to download' : 'Download Report'}
                      >
                        <FaDownload className="mr-2" />
                        Download
                      </button>
                      
                      <button
                        onClick={() => report.status === 'validated' && handleSendNotification(report.id)}
                        className={`flex items-center px-3 py-2 rounded ${
                          notificationStatus[report.id] === 'sent'
                            ? 'bg-green-600 text-white'
                            : report.status === 'validated' 
                              ? 'border border-indigo-600 text-indigo-600 hover:bg-indigo-50'
                              : 'border border-gray-400 text-gray-400 opacity-50 cursor-not-allowed'
                        }`}
                        disabled={
                          report.status !== 'validated' ||
                          notificationStatus[report.id] === 'sending' ||
                          notificationStatus[report.id] === 'sent'
                        }
                        title={report.status !== 'validated' ? 'Report must be validated to send notification' : 'Notify Patient'}
                      >
                        {notificationStatus[report.id] === 'sending' ? (
                          <>
                            <FaSpinner className="mr-2 animate-spin" /> Sending...
                          </>
                        ) : notificationStatus[report.id] === 'sent' ? (
                          <>
                            <FaCheck className="mr-2" /> Sent
                          </>
                        ) : (
                          <>
                            <FaShare className="mr-2" /> Notify Patient
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 bg-white rounded-lg shadow-md">
                <p className="text-gray-500">No reports found</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Report Detail Modal */}
      {showReportModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center border-b pb-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Report Details</h2>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                  <FaTimes className="text-xl" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Test Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="mb-2"><span className="font-medium">Test:</span> {selectedReport.testBooking?.test?.name || 'N/A'}</p>
                    <p className="mb-2"><span className="font-medium">Category:</span> {selectedReport.testBooking?.test?.category || 'N/A'}</p>
                    <p className="mb-2"><span className="font-medium">Test Code:</span> {selectedReport.testBooking?.test?.code || 'N/A'}</p>
                    <p className="mb-2">
                      <span className="font-medium">Status:</span> 
                      <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                        selectedReport.status === 'validated' ? 'bg-green-200 text-green-800' :
                        selectedReport.status === 'reviewed' ? 'bg-purple-200 text-purple-800' :
                        selectedReport.status === 'submitted' ? 'bg-blue-200 text-blue-800' :
                        selectedReport.status === 'rejected' ? 'bg-red-200 text-red-800' :
                        'bg-gray-200 text-gray-800'
                      }`}>
                        {selectedReport.status?.charAt(0).toUpperCase() + selectedReport.status?.slice(1) || 'Unknown'}
                      </span>
                    </p>
                    <p><span className="font-medium">Created:</span> {formatDate(selectedReport.created_at)}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Patient Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="mb-2"><span className="font-medium">Name:</span> {selectedReport.testBooking?.patient?.name || 'N/A'}</p>
                    <p className="mb-2"><span className="font-medium">Email:</span> {selectedReport.testBooking?.patient?.email || 'N/A'}</p>
                    <p><span className="font-medium">Doctor:</span> {selectedReport.testBooking?.doctor?.name || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {selectedReport.test_results && selectedReport.test_results.length > 0 ? (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Test Results</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parameter</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Result</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Normal Range</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedReport.test_results.map((result, index) => {
                          const parameter = selectedReport.testBooking?.test?.parameters?.find(
                            p => p.id === result.parameter_id
                          );
                          
                          let valueStatus = 'normal';
                          if (parameter) {
                            // Parse the normal range and check if the result is within range
                            const rangeMatch = parameter.normal_range?.match(/(\d+(\.\d+)?)-(\d+(\.\d+)?)/);
                            if (rangeMatch) {
                              const minValue = parseFloat(rangeMatch[1]);
                              const maxValue = parseFloat(rangeMatch[3]);
                              const resultValue = parseFloat(result.value);
                              
                              if (resultValue < minValue) valueStatus = 'low';
                              if (resultValue > maxValue) valueStatus = 'high';
                            }
                          }
                          
                          return (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap">{parameter?.parameter_name || 'Unknown'}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{result.value}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{parameter?.unit || 'N/A'}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{parameter?.normal_range || 'N/A'}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  valueStatus === 'low' ? 'bg-blue-200 text-blue-800' :
                                  valueStatus === 'high' ? 'bg-red-200 text-red-800' :
                                  'bg-green-200 text-green-800'
                                }`}>
                                  {valueStatus === 'low' ? 'Below Normal' :
                                   valueStatus === 'high' ? 'Above Normal' : 'Normal'}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center text-gray-500">
                  No test results available
                </div>
              )}
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Technician Notes</h3>
                  <div className="bg-gray-50 p-4 rounded-lg min-h-[100px]">
                    {selectedReport.technician_notes || 'No technician notes provided'}
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    Lab Technician: {selectedReport.labTechnician?.name || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Submitted: {formatDate(selectedReport.submitted_at)}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Pathologist Notes</h3>
                  <div className="bg-gray-50 p-4 rounded-lg min-h-[100px]">
                    {selectedReport.pathologist_notes || 'No pathologist notes provided'}
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    Pathologist: {selectedReport.pathologist?.name || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Reviewed: {formatDate(selectedReport.reviewed_at)}
                  </p>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Conclusion</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  {selectedReport.conclusion || 'No conclusion provided'}
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <button 
                  className={`flex items-center px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 ${
                    selectedReport.status !== 'validated' ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={() => selectedReport.status === 'validated' && handleDownload(selectedReport.id)}
                  disabled={selectedReport.status !== 'validated'}
                >
                  <FaDownload className="mr-2" />
                  Download PDF
                </button>
                <button
                  onClick={closeModal}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default LabReports;
