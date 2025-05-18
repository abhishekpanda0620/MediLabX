import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaCheck,
  FaFlask,
  FaClipboardCheck,
  FaFileAlt,
  FaTimesCircle,
  FaPlus,
  FaDownload,
  FaEye,
  FaPen,
  FaUserPlus,
  FaUser,
  FaSms,
  FaEnvelope,
} from "react-icons/fa";
import { MdOutlineDone } from "react-icons/md";
import Layout from "../../components/Layout";
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
  getTestReports,
  createPatient,
} from "../../services/api";
import GenerateReportModal from "../../components/reports/GenerateReportModal";
import PatientForm from "../../components/patients/PatientForm";
import { FormField, Alert } from "../../components/common";

const SampleManagement = () => {
  // State for samples in different statuses
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("booked");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelNotes, setCancelNotes] = useState("");

  // State for booking modal
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [tests, setTests] = useState([]);
  const [bookingFormData, setBookingFormData] = useState({
    patient_id: "",
    doctor_id: "",
    test_id: "",
    notes: "",
    delivery_method: "email",
  });
  const [bookingErrors, setBookingErrors] = useState({});

  // New state for patient creation
  const [isCreatingNewPatient, setIsCreatingNewPatient] = useState(false);
  const [newPatientData, setNewPatientData] = useState({
    name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    gender: "",
    address: "",
    medical_history: "",
  });
  const [newPatientErrors, setNewPatientErrors] = useState({});
  const [patientCreationSuccess, setPatientCreationSuccess] = useState(false);

  // Fix: Remove redundant state and keep only one set of report modal state
  const [showGenerateReportModal, setShowGenerateReportModal] = useState(false);
  const [selectedSampleForReport, setSelectedSampleForReport] = useState(null);
  const [reportModalLoading, setReportModalLoading] = useState(false);
  const [isEditingReport, setIsEditingReport] = useState(false); // New state to track if editing existing report
  const [viewOnly, setViewOnly] = useState(false); // Add viewOnly state

  // Tabs for the different statuses
  const tabs = [
    { id: "booked", label: "Booked", color: "yellow" },
    { id: "sample_collected", label: "Collected", color: "green" },
    { id: "processing", label: "Processing", color: "blue" },
    { id: "reviewed", label: "Reviewed", color: "purple" },
    { id: "completed", label: "Completed", color: "gray" },
  ];

  useEffect(() => {
    fetchSamples(activeTab);
  }, [activeTab]);

  // Load initial data when component mounts
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        // Load doctors and patients in background
        const [patientsResponse, doctorsResponse, testsResponse] =
          await Promise.all([getAllPatients(), getAllDoctors(), getAllTests()]);

        setPatients(patientsResponse);
        setDoctors(doctorsResponse);
        setTests(testsResponse);
      } catch (err) {
        setError(
          "Failed to load initial data: " +
            (err.response?.data?.message || err.message)
        );
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Fetch samples with their reports
  const fetchSamples = async (status) => {
    try {
      setLoading(true);
      // Use the status directly as the parameter name
      const response = await getTestBookings({ status: status });
      
      // Ensure hasReport is a boolean value for all samples
      const samplesWithBooleanFlags = response.map(sample => ({
        ...sample,
        hasReport: sample.hasReport === true // Convert to strict boolean
      }));
      
      
      setSamples(samplesWithBooleanFlags);
    } catch (err) {
      console.error("Error fetching samples:", err);
      setError(
        "Failed to fetch samples: " +
          (err.response?.data?.message || err.message)
      );
      setSamples([]);
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
      setError(
        "Failed to mark sample as collected: " +
          (err.response?.data?.message || err.message)
      );
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
      setError(
        "Failed to mark sample as processing: " +
          (err.response?.data?.message || err.message)
      );
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
      setError(
        "Failed to mark as reviewed: " +
          (err.response?.data?.message || err.message)
      );
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
      setError(
        "Failed to mark as completed: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  // Handler for patient form input changes
  const handleNewPatientInputChange = (e) => {
    const { name, value } = e.target;
    setNewPatientData({
      ...newPatientData,
      [name]: value,
    });
  };

  // Toggle between creating a new patient and selecting an existing one
  const togglePatientCreation = () => {
    setIsCreatingNewPatient(!isCreatingNewPatient);
    setNewPatientErrors({});
    setPatientCreationSuccess(false);

    // Reset patient_id when switching to create new patient
    if (!isCreatingNewPatient) {
      setBookingFormData({
        ...bookingFormData,
        patient_id: "",
      });
    }
  };

  // Create a new patient
  const handleCreatePatient = async () => {
    try {
      setLoading(true);
      setNewPatientErrors({});

      // Validate form
      const errors = {};
      if (!newPatientData.name) errors.name = "Name is required";
      if (!newPatientData.email) errors.email = "Email is required";
      if (!newPatientData.phone) errors.phone = "Phone number is required";

      if (Object.keys(errors).length > 0) {
        setNewPatientErrors(errors);
        setLoading(false);
        return;
      }

      // Create patient
      const response = await createPatient(newPatientData);

      // Update patients list and select the new patient
      setPatients([...patients, response]);
      setBookingFormData({
        ...bookingFormData,
        patient_id: response.id.toString(),
      });

      // Show success message
      setPatientCreationSuccess(true);

      // Reset creation form and switch back to selection
      setTimeout(() => {
        setPatientCreationSuccess(false);
        setIsCreatingNewPatient(false);
      }, 2000);

      setError(null);
    } catch (err) {
      setError(
        "Failed to create patient: " +
          (err.response?.data?.message || err.message)
      );
      if (err.response?.data?.errors) {
        setNewPatientErrors(err.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenBookingModal = async () => {
    try {
      setLoading(true);
      setError(null);
      setIsCreatingNewPatient(false);
      setNewPatientData({
        name: "",
        email: "",
        phone: "",
        date_of_birth: "",
        gender: "",
        address: "",
        medical_history: "",
      });

      // Fetch data needed for booking form
      const [patientsResponse, doctorsResponse, testsResponse] =
        await Promise.all([getAllPatients(), getAllDoctors(), getAllTests()]);

      setPatients(patientsResponse);
      setDoctors(doctorsResponse);
      setTests(testsResponse);
      setShowBookingModal(true);
    } catch (err) {
      setError(
        "Failed to load booking form data: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBookingInputChange = (e) => {
    const { name, value } = e.target;
    setBookingFormData({
      ...bookingFormData,
      [name]: value,
    });
  };

  const handleBookTest = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setBookingErrors({});

      // Validate form
      const errors = {};
      if (!isCreatingNewPatient && !bookingFormData.patient_id) {
        errors.patient_id = "Patient is required";
      }
      if (!bookingFormData.doctor_id) errors.doctor_id = "Doctor is required";
      if (!bookingFormData.test_id) errors.test_id = "Test is required";

      if (Object.keys(errors).length > 0) {
        setBookingErrors(errors);
        setLoading(false);
        return;
      }

      // Submit booking
      await bookTest(bookingFormData);

      // Reset form and close modal
      setBookingFormData({
        patient_id: "",
        doctor_id: "",
        test_id: "",
        notes: "",
        delivery_method: "email",
      });
      setShowBookingModal(false);
      setIsCreatingNewPatient(false);

      // Refresh the samples list
      fetchSamples("booked");

      setError(null);
    } catch (err) {
      setError(
        "Failed to book test: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  // Handler for viewing/editing a report
  const handleViewReport = async (sample) => {
    try {
      // Get the latest report for this sample
      const reports = await getTestReports({ test_booking_id: sample.id });
      
      // Get the sample with the existing report
      const sampleWithReport = {
        ...sample,
        existing_report: reports && reports.length > 0 ? reports[0] : null
      };
      
      setSelectedSampleForReport(sampleWithReport);
      setIsEditingReport(true);
      setViewOnly(false);
      setShowGenerateReportModal(true);
    } catch (err) {
      console.error("Error fetching report for viewing:", err);
      setError("Failed to fetch report details: " + (err.message || "Unknown error"));
    }
  };

  // Refresh the current tab after an action
  const refreshCurrentTab = () => {
    fetchSamples(activeTab);
  };

  // Handle generating a new report
  const handleGenerateReport = async (sample) => {
    try {
      // Set the selected sample for the report modal
      setSelectedSampleForReport(sample);
      
      // Set modal state to "create new" mode
      setIsEditingReport(false);
      setViewOnly(false);
      
      // Show the report generation modal
      setShowGenerateReportModal(true);
      
    } catch (err) {
      console.error("Error preparing to generate report:", err);
      setError("Failed to prepare report generation: " + (err.message || "Unknown error"));
    }
  };

  // Updated function to properly find and download reports
  const handleDownloadReport = async (sample) => {
    try {
      setLoading(true);
      setError(null);


      // Try different ways to get the report ID
      let reportId = null;

      // Method 1: Check if report_id is directly available
      if (sample.report_id) {
        reportId = sample.report_id;
      }
      // Method 2: Check if latest_report or test_report property exists
      else if (sample.latest_report?.id) {
        reportId = sample.latest_report.id;
      } else if (sample.test_report?.id) {
        reportId = sample.test_report.id;
      }
      // Method 3: If no report ID found, fetch reports for this test booking
      else {
        console.log("No direct report ID found, fetching reports...");
        try {
          // Fetch all reports for this test booking
          const reports = await getTestReports({ test_booking_id: sample.id });

          if (reports && reports.length > 0) {
            // Get the most recent validated report
            const validatedReport = reports.find(
              (r) => r.status === "validated"
            );
            if (validatedReport) {
              reportId = validatedReport.id;
            } else {
              // If no validated report, use the latest report
              reportId = reports[0].id;
            }
          }
        } catch (err) {
          console.error("Error fetching reports:", err);
        }
      }

      if (!reportId) {
        setError(
          "No report found for this test. The report may not have been generated or validated yet."
        );
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
      setError(
        "Failed to download report: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };


const handleDeliverReport = async (sample, method) => {
  try {
    setLoading(true);
    setError(null);
    
    // Find the report for this test booking
    const reportResponse = await getTestReports({ test_booking_id: sample.id });
    const report = reportResponse.find(r => r.test_booking_id === sample.id);
    
    if (!report) {
      setError(`No report found for this test booking`);
      return;
    }
    
    // Call the appropriate delivery API based on the method
    if (method === 'email') {
      await deliverReportByEmail(report.id);
      setError(null);
      // Show success message
      alert('Report has been sent to patient\'s email successfully');
    } 
    else if (method === 'sms') {
      await deliverReportBySMS(report.id);
      setError(null);
      // Show success message
      alert('SMS notification has been sent to patient\'s phone successfully');
    }
    else if (method === 'in_person') {
      // Mark as ready for in-person collection
      await markReportForCollection(report.id);
      setError(null);
      // Show success message
      alert('Report has been marked as ready for in-person collection');
    }
    
  } catch (err) {
    setError(`Failed to deliver report: ${err.response?.data?.message || err.message}`);
  } finally {
    setLoading(false);
  }
};
  // Render the book sample modal with the new patient creation option
  const renderBookSampleModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-medium mb-4">Book New Test Sample</h3>
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-medium">Patient Information</h4>
            <button
              type="button"
              onClick={togglePatientCreation}
              className="text-sm flex items-center text-indigo-600 hover:text-indigo-800"
            >
              {isCreatingNewPatient ? (
                <>Select Existing Patient</>
              ) : (
                <>
                  <FaUserPlus className="mr-1" /> Add New Patient
                </>
              )}
            </button>
          </div>

          {/* Show success alert when patient is created */}
          {patientCreationSuccess && (
            <Alert
              type="success"
              title="Patient created successfully"
              message="The new patient has been added and selected for this test booking."
              onDismiss={() => setPatientCreationSuccess(false)}
            />
          )}

          {isCreatingNewPatient ? (
            // Show patient creation form
            <div className="mt-4 border p-4 rounded-lg bg-gray-50">
              <PatientForm
                patientData={newPatientData}
                onChange={handleNewPatientInputChange}
                errors={newPatientErrors}
              />

              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleCreatePatient}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  disabled={loading}
                >
                  <FaUserPlus className="inline-block mr-2" />
                  Create Patient
                </button>
              </div>
            </div>
          ) : (
            // Show patient selection dropdown
            <div className="mt-2">
              <FormField
                label="Patient"
                id="patient-select"
                name="patient_id"
                type="select"
                value={bookingFormData.patient_id}
                onChange={handleBookingInputChange}
                error={bookingErrors.patient_id}
                required
                options={[
                  ...patients.map((patient) => ({
                    value: patient.id,
                    label: patient.name,
                  })),
                ]}
              />
            </div>
          )}
        </div>

        <form onSubmit={handleBookTest}>
          <div className="mb-4">
            <FormField
              label=" Test"
              id="test-select"
              name="test_id"
              type="select"
              value={bookingFormData.test_id}
              onChange={handleBookingInputChange}
              error={bookingErrors.test_id}
              required
              options={[
                ...tests.map((test) => ({
                  value: test.id,
                  label: test.name,
                })),
              ]}
            />
          </div>

          <div className="mb-4">
            <FormField
              label="Doctor"
              id="doctor-select"
              name="doctor_id"
              type="select"
              value={bookingFormData.doctor_id}
              onChange={handleBookingInputChange}
              error={bookingErrors.doctor_id}
              required
              options={[
                ...doctors.map((doctor) => ({
                  value: doctor.id,
                  label: doctor.name,
                })),
              ]}
            />
          </div>
          <div className="mb-4">
            <FormField
              label="Report Delivery Method"
              id="delivery-method"
              name="delivery_method"
              type="select"
              value={bookingFormData.delivery_method}
              onChange={handleBookingInputChange}
              required
              options={[
                { value: "email", label: "Email" },
                { value: "sms", label: "SMS" },
                { value: "in_person", label: "In-Person Collection" },
              ]}
            />
          </div>
          <div className="mb-6">
            <FormField
              label="Notes (optional)"
              id="test-notes"
              name="notes"
              type="textarea"
              placeholder="Additional notes or instructions"
              value={bookingFormData.notes}
              onChange={handleBookingInputChange}
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              onClick={() => {
                setShowBookingModal(false);
                setBookingFormData({
                  patient_id: "",
                  doctor_id: "",
                  test_id: "",
                  notes: "",
                });
                setBookingErrors({});
                setIsCreatingNewPatient(false);
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              disabled={
                loading || (isCreatingNewPatient && !patientCreationSuccess)
              }
            >
              Book Test
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Return JSX with the updated book sample modal
  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Sample Management
          </h1>
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
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 ${
                  activeTab === tab.id
                    ? `border-b-2 border-${tab.color}-600 text-${tab.color}-600`
                    : "text-gray-600"
                }`}
              >
                {tab.label} Samples
              </button>
            ))}
          </div>
        </div>

        {/* Sample list table */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          {loading ? (
            <div className="p-4 text-center">Loading samples...</div>
          ) : samples.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No samples found for this status.
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Test
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {samples.map((sample) => (
                  <tr key={sample.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{sample.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sample.patient ? sample.patient.name : "Unknown"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sample.test ? sample.test.name : "Unknown"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sample.doctor ? sample.doctor.name : "Unknown"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(sample.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          sample.status === "booked"
                            ? "bg-yellow-100 text-yellow-800"
                            : sample.status === "sample_collected"
                            ? "bg-green-100 text-green-800"
                            : sample.status === "processing"
                            ? "bg-blue-100 text-blue-800"
                            : sample.status === "reviewed"
                            ? "bg-purple-100 text-purple-800"
                            : sample.status === "completed"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {sample.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {activeTab === "booked" && (
                        <button
                          onClick={() => handleMarkSampleCollected(sample.id)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                          title="Mark as Collected"
                        >
                          <FaCheck className="inline" /> Collect
                        </button>
                      )}
                      {activeTab === "sample_collected" && (
                        <button
                          onClick={() => handleMarkProcessing(sample.id)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                          title="Mark as Processing"
                        >
                          <FaFlask className="inline" /> Process
                        </button>
                      )}
                      {activeTab === "processing" && (
                        <>
                          {console.log("Sample in UI:", sample)}
                          {console.log("hasReport type:", typeof sample.hasReport, "value:", sample.hasReport)}
                          
                          {/* Special case: For old data or when hasReport is undefined/null/not a boolean */}
                          {(sample.hasReport === undefined || sample.hasReport === null) && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleGenerateReport(sample)}
                                className="text-green-600 hover:text-green-900 mr-3"
                                title="Generate Report (fallback)"
                              >
                                <FaFileAlt className="inline mr-1" /> Generate Report (Legacy)
                              </button>
                              <button
                                className="text-gray-600 hover:text-gray-900 mr-3"
                                title="Refresh Data"
                                onClick={refreshCurrentTab}
                              >
                                Refresh Data
                              </button>
                            </div>
                          )}
                          
                          {/* When hasReport is explicitly false */}
                          {sample.hasReport === false && (
                            <button
                              onClick={() => handleGenerateReport(sample)}
                              className="text-green-600 hover:text-green-900 mr-3"
                              title="Generate Report"
                            >
                              <FaFileAlt className="inline mr-1" /> Generate Report
                            </button>
                          )}
                          
                          {/* When hasReport is explicitly true */}
                          {sample.hasReport === true && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleViewReport(sample)}
                                className="text-purple-600 hover:text-purple-900 mr-3"
                                title="Edit Report"
                              >
                                <FaPen className="inline mr-1" /> Edit Report
                              </button>
                              <button
                                onClick={() => handleMarkReviewed(sample.id)}
                                className="text-indigo-600 hover:text-indigo-900 mr-3"
                                title="Submit for Review"
                              >
                                <FaClipboardCheck className="inline mr-1" /> Submit for Review
                              </button>
                            </div>
                          )}
                        </>
                      )}
                      {activeTab === "reviewed" && (
                        <button
                          onClick={() => handleMarkCompleted(sample.id)}
                          className="text-gray-600 hover:text-gray-900 mr-3"
                          title="Mark as Completed"
                        >
                          <MdOutlineDone className="inline" /> Complete
                        </button>
                      )}
                      {sample.status === "completed" && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleDownloadReport(sample)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Download Report"
                          >
                            <FaDownload className="inline mr-1" /> Download
                          </button>
                          <div className="relative group">
                            <button
                              className="text-green-600 hover:text-green-900"
                              title="Deliver Report"
                            >
                              <FaEnvelope className="inline mr-1" /> Deliver
                            </button>
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                              <button
                                onClick={() =>
                                  handleDeliverReport(sample, "email")
                                }
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                <FaEnvelope className="inline mr-2" /> Email to
                                Patient
                              </button>
                              <button
                                onClick={() =>
                                  handleDeliverReport(sample, "sms")
                                }
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                <FaSms className="inline mr-2" /> Send SMS Link
                              </button>
                              <button
                                onClick={() =>
                                  handleDeliverReport(sample, "in_person")
                                }
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                <FaUser className="inline mr-2" /> Mark for
                                Collection
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Show our new booking modal */}
        {showBookingModal && renderBookSampleModal()}

        {/* Cancel Modal - kept the same */}
        {/* ... existing code ... */}

        {/* Generate Report Modal - kept the same */}
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
      </div>
    </Layout>
  );
};

export default SampleManagement;
