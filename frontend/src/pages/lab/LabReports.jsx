import React, { useState, useEffect } from 'react';
import { FaFileAlt, FaEye, FaDownload, FaShare, FaSearch, FaBell, FaSpinner, FaCheck, FaTimes } from 'react-icons/fa';
import Layout from '../../components/Layout';
import { toast } from 'react-toastify';
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
      
      // Make sure each report has the necessary nested objects and structure
      const processedReports = response.map(report => {
        // Debug the structure of each report for better understanding
        console.log(`Processing report ID: ${report.id}`, {
          hasTestBooking: !!report.test_booking,
          testId: report.test_booking?.test_id || 'none',
          testBookingHasTest: !!report.test_booking?.test,
          testBookingHasTestParameters: !!report.test_booking?.test?.parameters,
          testResults: report.test_results?.length || 0,
          patientInfo: {
            fromTestBooking: report.test_booking?.patient?.name || 'none',
            directPatientId: report.patient_id || 'none'
          }
        });
        
        // Ensure test parameters are available
        if (report.test_booking?.test && !report.test_booking.test.parameters) {
          // If parameters aren't loaded, add an empty array to avoid errors
          report.test_booking.test.parameters = [];
        }
        
        // Try to map test results to parameter details
        if (report.test_results && Array.isArray(report.test_results)) {
          // For each parameter in test results, try to add parameter details
          report.test_results = report.test_results.map(result => {
            if (!result.parameter_name) {
              // Add parameter name from mapping if not available
              const parameterMap = {
                1: 'Haemoglobin',
                2: 'White Blood Cells',
                3: 'Platelets',
                4: 'Total Cholesterol',
                5: 'HDL Cholesterol',
                6: 'LDL Cholesterol',
                7: 'Triglycerides'
              };
              
              if (parameterMap[result.parameter_id]) {
                result.parameter_name = parameterMap[result.parameter_id];
              }
            }
            return result;
          });
        }
        
        return report;
      });
      
      setReports(processedReports);
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
      toast.info('Sending notification to patient...', { autoClose: 2000 });
      
      await sendReportNotification(reportId);
      setNotificationStatus(prev => ({ ...prev, [reportId]: 'sent' }));
      toast.success('Notification sent successfully to patient!');
      
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
      toast.error(`Failed to send notification: ${err.message || 'Unknown error'}`);
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
      console.log('Starting report download for ID:', reportId);
      toast.info('Preparing report for download...', { autoClose: 2000 });
      
      const downloadSuccessful = await downloadTestReport(reportId);
      
      if (!downloadSuccessful) {
        console.error('Download unsuccessful, report may not be validated');
        toast.error('Failed to download report. Please ensure the report is validated and try again.');
        setError('Failed to download report. Please ensure the report is validated and try again.');
      } else {
        console.log('Report downloaded successfully');
        toast.success('Report downloaded successfully!');
        // Clear any previous errors
        setError(null);
      }
    } catch (error) {
      console.error('Error downloading report:', error);
      toast.error('Failed to download report. Please try again later.');
      setError('Failed to generate or download the report. Please try again later.');
    }
  };
  
  const handleViewReport = (report) => {
  
    
    // Try to enhance report structure before displaying
    const enhancedReport = { ...report };
    
    // If the report doesn't have direct access to test, try to extract from test_booking
    if (!enhancedReport.test && enhancedReport.test_booking?.test) {
      enhancedReport.test = enhancedReport.test_booking.test;
    }
    
    // If the report doesn't have direct access to patient, try to extract from test_booking
    if (!enhancedReport.patient && enhancedReport.test_booking?.patient) {
      enhancedReport.patient = enhancedReport.test_booking.patient;
    }
    
    setSelectedReport(enhancedReport);
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
      (report.test_booking?.patient?.name && report.test_booking.patient.name.toLowerCase().includes(query)) ||
      (report.test_booking?.test?.name && report.test_booking.test.name.toLowerCase().includes(query)) ||
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
                            {report.test_booking?.test?.name || 'Unknown Test'}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Patient: {report.test_booking?.patient?.name || 'Unknown Patient'}
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
                          report.status !== 'submitted' ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        onClick={() => {
                          if (report.status === 'submitted') {
                            console.log('Downloading report with ID:', report.id);
                            handleDownload(report.id);
                          } else {
                            toast.warning('Report must be submitted before it can be downloaded');
                          }
                        }}
                        disabled={report.status !== 'submitted'}
                        title={report.status !== 'submitted' ? 'Report must be submitted to download' : 'Download Report'}
                      >
                        <FaDownload className="mr-2" />
                        Download
                      </button>
                      
                      <button
                        onClick={() => report.status === 'submitted' && handleSendNotification(report.id)}
                        className={`flex items-center px-3 py-2 rounded ${
                          notificationStatus[report.id] === 'sent'
                            ? 'bg-green-600 text-white'
                            : report.status === 'submitted' 
                              ? 'border border-indigo-600 text-indigo-600 hover:bg-indigo-50'
                              : 'border border-gray-400 text-gray-400 opacity-50 cursor-not-allowed'
                        }`}
                        disabled={
                          report.status !== 'submitted' ||
                          notificationStatus[report.id] === 'sending' ||
                          notificationStatus[report.id] === 'sent'
                        }
                        title={report.status !== 'submitted' ? 'Report must be submitted to send notification' : 'Notify Patient'}
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
                    {/* Test name with comprehensive fallbacks */}
                    {(() => {
                      // First try to get test name from direct properties
                      let testName = selectedReport.test_booking?.test?.name ||
                                    'N/A';

                      // If not found, try to get test ID from various places
                      const testId = selectedReport.test_booking?.test_id ||
                                    selectedReport.test_booking?.test?.id ||
                                    selectedReport.test_id ||
                                    selectedReport.test?.id;
                      
                      // If we have test ID but no name, use mapping
                      if (!testName && testId) {
                        const testIdMap = {
                          1: 'Complete Blood Count (CBC)',
                          2: 'Lipid Profile',
                          3: 'Thyroid Function Test (TFT)',
                          4: 'Glycated Haemoglobin (HbA1c)',
                          5: 'Liver Function Test (LFT)',
                          6: 'Vitamin D (25-OH)'
                        };
                        testName = testIdMap[testId];
                      }

                      // Log information for debugging
                      console.log("Test name resolution:", {
                        from_test: selectedReport.test_booking?.test?.name,
                        from_direct_test: selectedReport.test?.name,
                        test_id: testId,
                        resolved_name: testName
                      });
                      
                      return (
                        <p className="mb-2">
                          <span className="font-medium">Test:</span> {selectedReport.test_booking?.test?.name|| 'N/A'}
                          
                        </p>
                      );
                    })()}

                    {/* Test category with comprehensive fallbacks */}
                    {(() => {
                      // Try to get category from direct properties
                      let category = selectedReport.test_booking?.test?.category ||
                                    selectedReport.test?.category;

                      // If not found, try to get test ID from various places
                      const testId = selectedReport.test_booking?.test_id ||
                                    selectedReport.test_booking?.test?.id ||
                                    selectedReport.test_id ||
                                    selectedReport.test?.id;
                      
                      // If we have test ID but no category, use mapping
                      if (!category && testId) {
                        const categoryMap = {
                          1: 'Haematology',
                          2: 'Clinical Biochemistry',
                          3: 'Clinical Biochemistry',
                          4: 'Clinical Biochemistry',
                          5: 'Clinical Biochemistry',
                          6: 'Clinical Biochemistry'
                        };
                        category = categoryMap[testId];
                      }
                      
                      return (
                        <p className="mb-2">
                          <span className="font-medium">Category:</span> {category || 'N/A'}
                        </p>
                      );
                    })()}

                    {/* Test code with comprehensive fallbacks */}
                    {(() => {
                      // Try to get code from direct properties
                      let code = selectedReport.test_booking?.test?.code ||
                               selectedReport.test?.code;

                      // If not found, try to get test ID from various places
                      const testId = selectedReport.test_booking?.test_id ||
                                   selectedReport.test_booking?.test?.id ||
                                   selectedReport.test_id ||
                                   selectedReport.test?.id;
                      
                      // If we have test ID but no code, use mapping
                      if (!code && testId) {
                        const codeMap = {
                          1: 'CBC001',
                          2: 'LIP001',
                          3: 'TFT001',
                          4: 'HBA001',
                          5: 'LFT001',
                          6: 'VITD001'
                        };
                        code = codeMap[testId];
                      }
                      
                      return (
                        <p className="mb-2">
                          <span className="font-medium">Test Code:</span> {code || 'N/A'}
                        </p>
                      );
                    })()}

                    
                    
                    {/* Enhanced status display */}
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
                    
                    {/* Enhanced date display */}
                    <p className="mb-2"><span className="font-medium">Created:</span> {formatDate(selectedReport.created_at)}</p>
                    
                  
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Patient Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    {/* Patient name with multiple fallbacks */}
                    {(() => {
                      // Check for patient name in all possible locations
                      const patientName = selectedReport.test_booking?.patient?.name || 
                                          selectedReport.patient?.name ||
                                          null;
                      
                      // Check for patient ID in all possible locations
                      const patientId = selectedReport.test_booking?.patient_id ||
                                        selectedReport.patient_id ||
                                        null;
                      
                      return (
                        <p className="mb-2">
                          <span className="font-medium">Name:</span> {
                            patientName || 
                            (patientId && `Patient ID: ${patientId}`) || 
                            'N/A'
                          }
                        </p>
                      );
                    })()}
                    
                    {/* Patient email with multiple fallbacks */}
                    {(() => {
                      const patientEmail = selectedReport.test_booking?.patient?.email ||
                                          selectedReport.patient?.email ||
                                          null;
                                          
                      return (
                        <p className="mb-2">
                          <span className="font-medium">Email:</span> {patientEmail || 'Not available'}
                        </p>
                      );
                    })()}
                    
                    {/* Patient ID display */}
                    <p className="mb-2">
                      <span className="font-medium">Patient ID:</span> {
                        selectedReport.test_booking?.patient?.id || 
                        selectedReport.test_booking?.patient_id ||
                        selectedReport.patient?.id ||
                        selectedReport.patient_id || 
                        'N/A'
                      }
                    </p>
                    
                    {/* Enhanced doctor display with fallbacks */}
                    {(() => {
                      const doctorName = selectedReport.test_booking?.doctor?.name ||
                                        selectedReport.doctor?.name ||
                                        null;
                                        
                      const doctorId = selectedReport.test_booking?.doctor_id ||
                                      selectedReport.doctor_id ||
                                      null;
                                      
                      return (
                        <p>
                          <span className="font-medium">Doctor:</span> {
                            doctorName || 'Not assigned'
                           
                          }
                        </p>
                      );
                    })()}
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
                          // Debug for finding parameter information
                          console.log(`Looking for parameter info for parameter_id: ${result.parameter_id}`, {
                            testBookingParams: selectedReport.test_booking?.test?.parameters,
                            directTestParams: selectedReport.test?.parameters,
                            result
                          });
                          
                          // Try to find parameter information from all possible sources
                          const parameter = 
                            // First, try to find from testBooking.test.parameters
                            selectedReport.test_booking?.test?.parameters?.find(p => p.id === result.parameter_id) ||
                            // Then try to find from direct test.parameters 
                            selectedReport.test?.parameters?.find(p => p.id === result.parameter_id) ||
                            // Finally, check if the parameter info is nested inside the result itself
                            (result.parameter ? result.parameter : null);
                          
                          // Map parameter IDs to proper names if parameters aren't available
                          let paramName = parameter?.parameter_name || result.parameter_name;
                          if (!paramName) {
                            // Map common parameter IDs to their names based on seeded data
                            const parameterMap = {
                              1: 'Haemoglobin',
                              2: 'White Blood Cells',
                              3: 'Platelets',
                              4: 'Total Cholesterol',
                              5: 'HDL Cholesterol',
                              6: 'LDL Cholesterol',
                              7: 'Triglycerides'
                            };
                            paramName = parameterMap[result.parameter_id] || `Parameter ${result.parameter_id}`;
                          }
                          
                          // Map units from all possible sources
                          const paramUnitMap = {
                            1: 'g/dL',
                            2: 'cells/mcL',
                            3: 'cells/mcL',
                            4: 'mg/dL',
                            5: 'mg/dL',
                            6: 'mg/dL',
                            7: 'mg/dL'
                          };
                          
                          const paramUnit = 
                            result.unit || 
                            parameter?.unit || 
                            paramUnitMap[result.parameter_id] || 
                            'N/A';
                          
                          // Map reference ranges from all possible sources
                          const paramRangeMap = {
                            1: '13.0 - 17.0',
                            2: '4500 - 11000',
                            3: '150000 - 400000',
                            4: '125 - 200',
                            5: '40 - 60',
                            6: '< 100',
                            7: '< 150'
                          };
                          
                          const paramRange = 
                            parameter?.normal_range || 
                            result.normal_range ||
                            paramRangeMap[result.parameter_id] || 
                            'Not available';
                          
                          // Determine value status
                          let valueStatus = 'normal';
                          
                          // Get the range to use for evaluation (from all possible sources)
                          const rangeToEvaluate = 
                            parameter?.normal_range || 
                            result.normal_range ||
                            paramRangeMap[result.parameter_id];
                          
                          if (rangeToEvaluate && result.value) {
                            // First check for ranges with dash format (e.g., "13.0 - 17.0")
                            const dashRangeMatch = rangeToEvaluate.match(/(\d+(\.\d+)?)\s*-\s*(\d+(\.\d+)?)/);
                            
                            if (dashRangeMatch) {
                              const minValue = parseFloat(dashRangeMatch[1]);
                              const maxValue = parseFloat(dashRangeMatch[3]);
                              const resultValue = parseFloat(result.value);
                              
                              if (resultValue < minValue) valueStatus = 'low';
                              if (resultValue > maxValue) valueStatus = 'high';
                            } 
                            // Check for "less than" format (e.g., "< 150")
                            else if (rangeToEvaluate.includes('<')) {
                              const maxMatch = rangeToEvaluate.match(/<\s*(\d+(\.\d+)?)/);
                              if (maxMatch) {
                                const maxValue = parseFloat(maxMatch[1]);
                                const resultValue = parseFloat(result.value);
                                
                                if (resultValue >= maxValue) valueStatus = 'high';
                              }
                            }
                          }
                          
                          return (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap">{paramName}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{result.value}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{paramUnit}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{paramRange}</td>
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
              
              <div className="flex flex-row-reverse gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Technician Notes</h3>
                  <div className="bg-gray-50 p-4 rounded-lg min-h-[100px]">
                    {selectedReport.technician_notes || 'No technician notes provided'}
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    Lab Technician: 
                    <span className='font-medium px-2'>
  {
                      selectedReport.labTechnician?.name || 
                      (selectedReport.lab_technician?.name) ||
                      (selectedReport.lab_technician_id && `Technician ID: ${selectedReport.lab_technician_id}`) || 
                      'Not assigned'
                    }
                    </span>
                  
                  </p>
                  <p className="text-sm text-gray-600">
                    Submitted:
                    <span className='font-medium px-2'>
                     {formatDate(selectedReport.submitted_at) || 'Not yet submitted'}

                    </span>
                  </p>
                </div>
                
                {/* <div>
                  <h3 className="text-lg font-semibold mb-2">Pathologist Notes</h3>
                  <div className="bg-gray-50 p-4 rounded-lg min-h-[100px]">
                    {selectedReport.pathologist_notes || (
                      selectedReport.status === 'submitted' ? 
                        'Awaiting pathologist review' : 
                        'No pathologist notes provided'
                    )}
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    Pathologist: {
                      selectedReport.pathologist?.name || 
                      (selectedReport.pathologist_id && `Pathologist ID: ${selectedReport.pathologist_id}`) || 
                      (selectedReport.status === 'submitted' ? 'Not yet assigned' : 'Not required')
                    }
                  </p>
                  <p className="text-sm text-gray-600">
                    Reviewed: {
                      formatDate(selectedReport.reviewed_at) || 
                      (selectedReport.status === 'submitted' ? 'Pending review' : 'Not reviewed')
                    }
                  </p>
                </div> */}
              </div>
              
              {/* <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Conclusion</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  {selectedReport.conclusion || 'No conclusion provided'}
                </div>
              </div> */}
              

            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default LabReports;
