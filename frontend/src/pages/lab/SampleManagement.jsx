import React, { useState, useEffect } from 'react';
import { FaSearch, FaCheck, FaFlask, FaClipboardCheck, FaFileAlt, FaTimesCircle, FaPlus, FaDownload, FaEye } from 'react-icons/fa';
import { MdOutlineDone } from 'react-icons/md';
import Layout from '../../components/Layout';
import { 
  getTestBookings, 
  markSampleCollected, 
  markProcessing, 
  markReviewed, 
  markCompleted, 
  cancelTestBooking,
  getAllTests,
  getAllPatients,
  getAllDoctors,
  bookTest,
  getTestWithParameters,
  downloadTestReport,
  getTestReports 
} from '../../services/api';
import GenerateReportModal from '../../components/reports/GenerateReportModal'; 

const SampleManagement = () => {
  // State for samples in different statuses
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('booked');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelNotes, setCancelNotes] = useState('');
  
  // State for booking modal
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [tests, setTests] = useState([]);
  const [bookingFormData, setBookingFormData] = useState({
    patient_id: '',
    doctor_id: '',
    test_id: '',
    notes: ''
  });
  const [bookingErrors, setBookingErrors] = useState({});

  // Fix: Remove redundant state and keep only one set of report modal state
  const [showGenerateReportModal, setShowGenerateReportModal] = useState(false);
  const [selectedSampleForReport, setSelectedSampleForReport] = useState(null);
  const [reportModalLoading, setReportModalLoading] = useState(false);
  const [isEditingReport, setIsEditingReport] = useState(false); // New state to track if editing existing report
  const [viewOnly, setViewOnly] = useState(false); // Add viewOnly state

  // Tabs for the different statuses
  const tabs = [
    { id: 'booked', label: 'Booked', color: 'yellow' },
    { id: 'sample_collected', label: 'Collected', color: 'green' },
    { id: 'processing', label: 'Processing', color: 'blue' },
    { id: 'reviewed', label: 'Reviewed', color: 'purple' },
    { id: 'completed', label: 'Completed', color: 'gray' }
  ];

  useEffect(() => {
    fetchSamples(activeTab);
  }, [activeTab]);

  // Fetch samples with their reports
  const fetchSamples = async (status) => {
    try {
      setLoading(true);
      // Use the status directly as the parameter name
      const response = await getTestBookings({ status: status });
      
      // If in processing tab, fetch reports for each sample
      if (status === 'processing') {
        // Add a delay to ensure reports are fetched
        const samplesWithReports = await Promise.all(response.map(async (sample) => {
          try {
            const reports = await getTestReports({ test_booking_id: sample.id });
            return {
              ...sample,
              hasReport: reports && reports.length > 0,
              report: reports && reports.length > 0 ? reports[0] : null
            };
          } catch (err) {
            console.error(`Error fetching reports for sample ${sample.id}:`, err);
            return { ...sample, hasReport: false };
          }
        }));
        
        setSamples(samplesWithReports);
      } else {
        setSamples(response);
      }
      
      setError(null);
    } catch (err) {
      setError(`Failed to fetch samples in ${status} status`);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkSampleCollected = async (sampleId) => {
    try {
      setLoading(true);
      await markSampleCollected(sampleId);
      fetchSamples(activeTab);
      setError(null);
    } catch (err) {
      setError('Failed to mark sample as collected: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleMarkProcessing = async (sampleId) => {
    try {
      setLoading(true);
      await markProcessing(sampleId);
      fetchSamples(activeTab);
      setError(null);
    } catch (err) {
      setError('Failed to mark sample as processing: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleMarkReviewed = async (sampleId) => {
    try {
      setLoading(true);
      await markReviewed(sampleId);
      fetchSamples(activeTab);
      setError(null);
    } catch (err) {
      setError('Failed to mark sample as reviewed: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleMarkCompleted = async (sampleId) => {
    try {
      setLoading(true);
      await markCompleted(sampleId);
      fetchSamples(activeTab);
      setError(null);
    } catch (err) {
      setError('Failed to mark sample as completed: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleShowCancelModal = (booking) => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
  };

  const handleCancel = async () => {
    try {
      setLoading(true);
      await cancelTestBooking(selectedBooking.id, cancelNotes);
      setShowCancelModal(false);
      setCancelNotes('');
      setSelectedBooking(null);
      fetchSamples(activeTab);
      setError(null);
    } catch (err) {
      setError('Failed to cancel test booking: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleOpenBookingModal = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch data needed for booking form
      const [patientsResponse, doctorsResponse, testsResponse] = await Promise.all([
        getAllPatients(),
        getAllDoctors(),
        getAllTests()
      ]);

      setPatients(patientsResponse);
      setDoctors(doctorsResponse);
      setTests(testsResponse);
      setShowBookingModal(true);
    } catch (err) {
      setError('Failed to load booking form data: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleBookingInputChange = (e) => {
    const { name, value } = e.target;
    setBookingFormData({
      ...bookingFormData,
      [name]: value
    });
  };

  const handleBookTest = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setBookingErrors({});
      
      // Validate form
      const errors = {};
      if (!bookingFormData.patient_id) errors.patient_id = 'Patient is required';
      if (!bookingFormData.doctor_id) errors.doctor_id = 'Doctor is required';
      if (!bookingFormData.test_id) errors.test_id = 'Test is required';
      
      if (Object.keys(errors).length > 0) {
        setBookingErrors(errors);
        setLoading(false);
        return;
      }
      
      // Submit booking
      await bookTest(bookingFormData);
      
      // Reset form and close modal
      setBookingFormData({
        patient_id: '',
        doctor_id: '',
        test_id: '',
        notes: ''
      });
      setShowBookingModal(false);
      
      // Refresh the samples list
      fetchSamples('booked');
      
      setError(null);
    } catch (err) {
      setError('Failed to book test: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Updated to handle existing reports
  const handleGenerateReport = async (sample) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Sample for report generation:", sample);
      
      // Check if the sample already has a report
      let existingReport = null;
      if (sample.hasReport && sample.report) {
        console.log("Sample already has a report:", sample.report);
        existingReport = sample.report;
        setIsEditingReport(true);
      } else {
        // Fetch reports for this test booking to double check
        const reports = await getTestReports({ test_booking_id: sample.id });
        console.log("Fetched reports:", reports);
        
        if (reports && reports.length > 0) {
          existingReport = reports[0];
          console.log("Found existing report:", existingReport);
          setIsEditingReport(true);
        } else {
          setIsEditingReport(false);
        }
      }
      
      // Always fetch the complete test data with parameters
      const completeTest = await getTestWithParameters(sample.test.id);
      console.log("Fetched complete test:", completeTest);
      
      if (completeTest && completeTest.parameters && completeTest.parameters.length > 0) {
        // Create a properly formatted test data object for the modal
        const formattedTestData = {
          id: sample.id,
          test: {
            ...completeTest,
            name: completeTest.name || sample.test?.name,
          },
          parameters: completeTest.parameters.map(param => {
            // If editing existing report, pre-fill with existing values
            if (existingReport && existingReport.test_results) {
              const existingResult = existingReport.test_results.find(
                r => r.parameter_id === param.id
              );
              
              if (existingResult) {
                return {
                  ...param,
                  value: existingResult.value
                };
              }
            }
            return param;
          }),
          patient: sample.patient,
          lab_technician: sample.lab_technician,
          existing_report: existingReport // Pass the existing report to the modal
        };
        
        console.log("Formatted test data for modal:", formattedTestData);
        
        setSelectedSampleForReport(formattedTestData);
        setShowGenerateReportModal(true);
      } else {
        setError("No parameters found for this test. Please contact the administrator to add test parameters.");
      }
    } catch (err) {
      console.error("Error preparing report:", err);
      setError('Failed to prepare report: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Updated function to properly find and download reports
  const handleDownloadReport = async (sample) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Sample for download:", sample);
      
      // Try different ways to get the report ID
      let reportId = null;
      
      // Method 1: Check if report_id is directly available
      if (sample.report_id) {
        reportId = sample.report_id;
        console.log("Found direct report_id:", reportId);
      } 
      // Method 2: Check if latest_report or test_report property exists
      else if (sample.latest_report?.id) {
        reportId = sample.latest_report.id;
        console.log("Found report via latest_report:", reportId);
      } 
      else if (sample.test_report?.id) {
        reportId = sample.test_report.id;
        console.log("Found report via test_report:", reportId);
      }
      // Method 3: If no report ID found, fetch reports for this test booking
      else {
        console.log("No direct report ID found, fetching reports...");
        try {
          // Fetch all reports for this test booking
          const reports = await getTestReports({ test_booking_id: sample.id });
          console.log("Fetched reports:", reports);
          
          if (reports && reports.length > 0) {
            // Get the most recent validated report
            const validatedReport = reports.find(r => r.status === 'validated');
            if (validatedReport) {
              reportId = validatedReport.id;
              console.log("Found validated report:", reportId);
            } else {
              // If no validated report, use the latest report
              reportId = reports[0].id;
              console.log("Using latest report:", reportId);
            }
          }
        } catch (err) {
          console.error("Error fetching reports:", err);
        }
      }
      
      if (!reportId) {
        setError("No report found for this test. The report may not have been generated or validated yet.");
        setLoading(false);
        return;
      }
      
      console.log("Downloading report with ID:", reportId);
      
      // Call the API to download the report
      const success = await downloadTestReport(reportId);
      
      if (!success) {
        setError("Failed to download the report. Please try again.");
      }
    } catch (err) {
      console.error("Error downloading report:", err);
      setError('Failed to download report: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Add function to handle viewing report details
  const handleViewReport = async (sample) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Sample for view:", sample);
      
      // Fetch reports for this test booking
      const reports = await getTestReports({ test_booking_id: sample.id });
      console.log("Fetched reports:", reports);
      
      if (!reports || reports.length === 0) {
        setError("No report found for this test");
        setLoading(false);
        return;
      }
      
      // Get the latest report
      const report = reports[0];
      
      // Always fetch the complete test data with parameters
      const completeTest = await getTestWithParameters(sample.test.id);
      console.log("Fetched complete test:", completeTest);
      
      if (completeTest && completeTest.parameters && completeTest.parameters.length > 0) {
        // Map the test parameters with the values from the report
        const parametersWithValues = completeTest.parameters.map(param => {
          const resultEntry = report.test_results.find(r => r.parameter_id === param.id);
          return {
            ...param,
            value: resultEntry ? resultEntry.value : ''
          };
        });
        
        // Create a properly formatted test data object for the modal
        const formattedTestData = {
          id: sample.id,
          test: {
            ...completeTest,
            name: completeTest.name || sample.test?.name,
          },
          parameters: parametersWithValues,
          patient: sample.patient,
          lab_technician: sample.lab_technician,
          pathologist: sample.pathologist,
          existing_report: report
        };
        
        console.log("Formatted test data for view:", formattedTestData);
        
        // Set view only mode
        setViewOnly(true);
        setSelectedSampleForReport(formattedTestData);
        setShowGenerateReportModal(true);
      } else {
        setError("Could not load test parameters");
      }
    } catch (err) {
      console.error("Error fetching report details:", err);
      setError('Failed to load report details: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const filteredSamples = samples.filter(sample => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      (sample.id && sample.id.toString().includes(query)) ||
      (sample.patient?.name && sample.patient.name.toLowerCase().includes(query)) ||
      (sample.test?.name && sample.test.name.toLowerCase().includes(query))
    );
  });

  // Get the appropriate action button based on the current status
  const getActionButton = (sample) => {
    switch (activeTab) {
      case 'booked':
        return (
          <button
            onClick={() => handleMarkSampleCollected(sample.id)}
            className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 flex items-center"
            disabled={loading}
          >
            <FaCheck className="mr-1" /> Mark Collected
          </button>
        );
      case 'sample_collected':
        return (
          <button
            onClick={() => handleMarkProcessing(sample.id)}
            className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 flex items-center"
            disabled={loading}
          >
            <FaFlask className="mr-1" /> Start Processing
          </button>
        );
      case 'processing':
        return (
          <div className="flex gap-2">
            <button
              onClick={() => handleGenerateReport(sample)}
              className="bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700 flex items-center"
              disabled={loading}
            >
              <FaFileAlt className="mr-1" /> 
              {sample.hasReport ? 'Edit Report' : 'Generate Report'}
            </button>
            <button
              onClick={() => handleMarkReviewed(sample.id)}
              className="bg-purple-600 text-white px-3 py-1 rounded-md hover:bg-purple-700 flex items-center"
              disabled={loading}
            >
              <FaClipboardCheck className="mr-1" /> Mark Reviewed
            </button>
          </div>
        );
      case 'reviewed':
        return (
          <div className="flex gap-2">
            <button
              onClick={() => handleViewReport(sample)}
              className="bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700 flex items-center"
              disabled={loading}
            >
              <FaEye className="mr-1" /> View Report
            </button>
            <button
              onClick={() => handleMarkCompleted(sample.id)}
              className="bg-gray-600 text-white px-3 py-1 rounded-md hover:bg-gray-700 flex items-center"
              disabled={loading}
            >
              <MdOutlineDone className="mr-1" /> Mark Completed
            </button>
          </div>
        );
      case 'completed':
        return (
          <div className="flex gap-2">
            <button
              onClick={() => handleViewReport(sample)}
              className="bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700 flex items-center"
              disabled={loading}
            >
              <FaEye className="mr-1" /> View Report
            </button>
            <button
              onClick={() => handleDownloadReport(sample)}
              className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 flex items-center"
              disabled={loading}
            >
              <FaDownload className="mr-1" /> Download PDF
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  // Add a refresh function to update the UI after generating or editing a report
  const refreshCurrentTab = async () => {
    await fetchSamples(activeTab);
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Sample Management</h1>
          <div className="flex items-center mt-4 sm:mt-0 gap-4">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search samples..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <button
              onClick={handleOpenBookingModal}
              className="bg-indigo-600 text-white px-3 py-2 rounded-md hover:bg-indigo-700 flex items-center whitespace-nowrap"
            >
              <FaPlus className="mr-2" /> Book New Sample
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 border border-red-400 rounded">
            {error}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mb-6 border-b overflow-x-auto">
          <div className="flex whitespace-nowrap">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 ${activeTab === tab.id ? `border-b-2 border-${tab.color}-600 text-${tab.color}-600` : 'text-gray-600'}`}
              >
                {tab.label} Samples
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Test</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  {/* Update the Actions column to be visible for all tabs */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSamples.map(sample => (
                  <tr key={sample.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{sample.patient?.name || 'Unknown Patient'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{sample.test?.name || 'Unknown Test'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(sample.created_at).toLocaleDateString()}
                    </td>
                    {/* Update the Actions cell to be visible for all tabs */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm flex gap-2">
                      {getActionButton(sample)}
                      
                      {activeTab !== 'completed' && (
                        <button
                          onClick={() => handleShowCancelModal(sample)}
                          className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 flex items-center"
                          disabled={loading}
                        >
                          <FaTimesCircle className="mr-1" /> Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredSamples.length === 0 && !loading && (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      No {activeTab.replace('_', ' ')} samples found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {loading && (
            <div className="p-4 text-center">
              <div className="text-gray-500">Loading samples...</div>
            </div>
          )}
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Cancel Test Booking</h3>
            <p className="mb-4">
              Are you sure you want to cancel this test booking for {selectedBooking?.patient?.name}?
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for cancellation (optional)
              </label>
              <textarea
                value={cancelNotes}
                onChange={(e) => setCancelNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg"
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelNotes('');
                  setSelectedBooking(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
                onClick={handleCancel}
                disabled={loading}
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Book New Sample Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-lg font-medium mb-4">Book New Test Sample</h3>
            <form onSubmit={handleBookTest}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Patient*
                </label>
                <select
                  name="patient_id"
                  value={bookingFormData.patient_id}
                  onChange={handleBookingInputChange}
                  className={`w-full px-3 py-2 border rounded-lg ${bookingErrors.patient_id ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select Patient</option>
                  {patients.map(patient => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name}
                    </option>
                  ))}
                </select>
                {bookingErrors.patient_id && (
                  <p className="mt-1 text-sm text-red-500">{bookingErrors.patient_id}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Test*
                </label>
                <select
                  name="test_id"
                  value={bookingFormData.test_id}
                  onChange={handleBookingInputChange}
                  className={`w-full px-3 py-2 border rounded-lg ${bookingErrors.test_id ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select Test</option>
                  {tests.map(test => (
                    <option key={test.id} value={test.id}>
                      {test.name}
                    </option>
                  ))}
                </select>
                {bookingErrors.test_id && (
                  <p className="mt-1 text-sm text-red-500">{bookingErrors.test_id}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Doctor*
                </label>
                <select
                  name="doctor_id"
                  value={bookingFormData.doctor_id}
                  onChange={handleBookingInputChange}
                  className={`w-full px-3 py-2 border rounded-lg ${bookingErrors.doctor_id ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select Doctor</option>
                  {doctors.map(doctor => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name}
                    </option>
                  ))}
                </select>
                {bookingErrors.doctor_id && (
                  <p className="mt-1 text-sm text-red-500">{bookingErrors.doctor_id}</p>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (optional)
                </label>
                <textarea
                  name="notes"
                  value={bookingFormData.notes}
                  onChange={handleBookingInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg"
                  onClick={() => {
                    setShowBookingModal(false);
                    setBookingFormData({
                      patient_id: '',
                      doctor_id: '',
                      test_id: '',
                      notes: ''
                    });
                    setBookingErrors({});
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
                  disabled={loading}
                >
                  Book Test
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Generate Report Modal */}
      {showGenerateReportModal && selectedSampleForReport && (
        <GenerateReportModal
          isOpen={showGenerateReportModal}
          onClose={() => {
            setShowGenerateReportModal(false);
            setSelectedSampleForReport(null);
            setIsEditingReport(false);
            setViewOnly(false); // Reset viewOnly state
            refreshCurrentTab(); // Refresh the UI after closing the modal
          }}
          testData={selectedSampleForReport}
          patientData={selectedSampleForReport.patient || {}}
          isEditing={isEditingReport}
          viewOnly={viewOnly}
        />
      )}
    </Layout>
  );
};

export default SampleManagement;
