import React, { useState, useEffect } from "react";
import { FaCheck, FaPen, FaDownload, FaEnvelope, FaCheckCircle } from "react-icons/fa";
import Layout from "../../components/Layout";
import {
  getAllPatients,
  getAllTests,
  getAllDoctors,
  bookTest,
  createPatient,
  getTestWithParameters,
  markSampleCollected,
  markProcessing,
  getTestReports,
  downloadTestReport,
  sendReportNotification,
  markCompleted,
  markReviewed
} from "../../services/api";
import GenerateReportModal from "../../components/reports/GenerateReportModal";
import { Alert } from "../../components/common";
import { toast } from "react-toastify";

// Import the modular components
import { 
  PatientSelection, 
  TestSelection, 
  BookingForm, 
  ReportGeneration 
} from "../../components/integrated-case";

/**
 * IntegratedCaseReport - A streamlined workflow to create a case and generate a report
 * This page allows lab staff to:
 * 1. Register a new patient or select an existing one
 * 2. Select a test from the test catalog
 * 3. Book the test and automatically progress through all required states:
 *    - Initial booking (status: booked)
 *    - Sample collection (status: sample_collected)
 *    - Processing (status: processing)
 * 4. Directly generate the test report
 *
 * This integrated workflow automates all state transitions required by the backend API,
 * ensuring that the test is in the correct state (processing) for report generation.
 */
const IntegratedCaseReport = () => {
  // Patient selection state
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientSearch, setPatientSearch] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [isCreatingPatient, setIsCreatingPatient] = useState(false);
  const [newPatientData, setNewPatientData] = useState({
    name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    gender: "",
    address: "",
    medical_history: "",
  });
  const [patientErrors, setPatientErrors] = useState({});

  // Test selection state
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [testSearch, setTestSearch] = useState("");
  const [filteredTests, setFilteredTests] = useState([]);

  // Booking state
  const [bookingDetails, setBookingDetails] = useState({
    doctor_id: "",
    notes: "",
    delivery_method: "email",
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Doctors list for referral
  const [doctors, setDoctors] = useState([]);

  // Report generation state
  const [showReportModal, setShowReportModal] = useState(false);
  const [testWithParameters, setTestWithParameters] = useState(null);
  const [reportGenerationSuccess, setReportGenerationSuccess] = useState(false);
  const [generatedReports, setGeneratedReports] = useState([]);
  const [notificationStatus, setNotificationStatus] = useState({});
  const [isLoadingReports, setIsLoadingReports] = useState(false);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        // Fetch patients, tests, and doctors in parallel
        const [patientsResponse, testsResponse, doctorsResponse] =
          await Promise.all([getAllPatients(), getAllTests(), getAllDoctors()]);

        setPatients(patientsResponse);
        setFilteredPatients(patientsResponse);

        setTests(testsResponse);
        setFilteredTests(testsResponse);

        setDoctors(doctorsResponse);
      } catch (err) {
        console.error("Error loading initial data:", err);
        setError("Failed to load data. Please try refreshing the page.");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Filter patients based on search input
  useEffect(() => {
    if (patientSearch) {
      const filtered = patients.filter(
        (patient) =>
          (patient.name &&
            patient.name.toLowerCase().includes(patientSearch.toLowerCase())) ||
          (patient.email &&
            patient.email
              .toLowerCase()
              .includes(patientSearch.toLowerCase())) ||
          (patient.phone && patient.phone.includes(patientSearch))
      );
      setFilteredPatients(filtered);
    } else {
      setFilteredPatients(patients);
    }
  }, [patientSearch, patients]);

  // Filter tests based on search input
  useEffect(() => {
    if (testSearch) {
      const filtered = tests.filter(
        (test) =>
          (test.name &&
            test.name.toLowerCase().includes(testSearch.toLowerCase())) ||
          (test.code &&
            test.code.toLowerCase().includes(testSearch.toLowerCase())) ||
          (test.category &&
            test.category.toLowerCase().includes(testSearch.toLowerCase()))
      );
      setFilteredTests(filtered);
    } else {
      setFilteredTests(tests);
    }
  }, [testSearch, tests]);

  // Handle new patient form input changes
  const handlePatientInputChange = (e) => {
    const { name, value } = e.target;
    setNewPatientData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle patient selection
  const selectPatient = (patient) => {
    setSelectedPatient(patient);
    // Clear any previous booking
    setBookingSuccess(false);
    setBookingData(null);
    // Reset doctor_id when patient changes
    setBookingDetails((prev) => ({
      ...prev,
      doctor_id: "",
    }));
  };

  // Handle test selection
  const selectTest = (test) => {
    setSelectedTest(test);
    // Clear any previous booking
    setBookingSuccess(false);
    setBookingData(null);
  };

  // Handle booking details changes
  const handleBookingDetailsChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Create new patient
  const handleCreatePatient = async () => {
    try {
      // Basic validation
      const errors = {};

      if (!newPatientData.name) errors.name = "Name is required";
      if (!newPatientData.email) errors.email = "Email is required";
      if (!newPatientData.phone) errors.phone = "Phone number is required";

      if (Object.keys(errors).length > 0) {
        setPatientErrors(errors);
        return;
      }

      setLoading(true);
      const createdPatient = await createPatient(newPatientData);

      // Add the new patient to the list and select it
      setPatients((prev) => [...prev, createdPatient]);
      setSelectedPatient(createdPatient);

      // Reset the form and close it
      setNewPatientData({
        name: "",
        email: "",
        phone: "",
        date_of_birth: "",
        gender: "",
        address: "",
        medical_history: "",
      });
      setIsCreatingPatient(false);
      setPatientErrors({});
    } catch (err) {
      console.error("Error creating patient:", err);
      setError(
        "Failed to create patient: " +
          (err.response?.data?.message || "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  };

  // Book the test and prepare for report generation
  const handleBookTest = async () => {
    if (!selectedPatient) {
      setError("Please select a patient first");
      return;
    }

    if (!selectedTest) {
      setError("Please select a test first");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Make sure we have valid IDs
      if (!selectedPatient.id) {
        setError("Invalid patient data. Please select a different patient.");
        setLoading(false);
        return;
      }

      if (!selectedTest.id) {
        setError("Invalid test data. Please select a different test.");
        setLoading(false);
        return;
      }

      // If doctor_id is provided, make sure it's valid
      if (
        bookingDetails.doctor_id &&
        !doctors.some(
          (d) => d.id.toString() === bookingDetails.doctor_id.toString()
        )
      ) {
        setError(
          "Invalid doctor selection. Please select a valid doctor or leave it blank."
        );
        setLoading(false);
        return;
      }

      // Book the test
      const bookingData = {
        patient_id: selectedPatient.id,
        test_id: selectedTest.id,
        doctor_id: bookingDetails.doctor_id || null,
        notes: bookingDetails.notes || "",
        delivery_method: bookingDetails.delivery_method || "email",
      };

      // Step 1: Book the test (status: booked)
      const response = await bookTest(bookingData);

      // Step 2: Mark sample as collected (status: sample_collected)
      await markSampleCollected(response.id);

      // Step 3: Mark as processing (status: processing)
      await markProcessing(response.id);

      // Mark as booked successfully
      setBookingSuccess(true);
      setBookingData(response);

      // Fetch complete test data with parameters for report generation
      const testParams = await getTestWithParameters(selectedTest.id);
      console.log("Test parameters fetched:", testParams);

      // Debug the actual structure of test parameters
      if (testParams && testParams.parameters) {
        console.log(
          "Parameters structure:",
          JSON.stringify(testParams.parameters[0], null, 2)
        );
      }

      // Prepare data for report modal - ensure it matches the structure expected by useReportForm
      const parameters =
        testParams && testParams.parameters
          ? testParams.parameters.map((param) => ({
              id: param.id,
              name: param.parameter_name, // This is required by ReportParametersSection
              parameter_name: param.parameter_name,
              unit: param.unit || "",
              normal_range: param.normal_range || "",
              min_range:
                param.min_range || param.normal_range?.split("-")[0]?.trim(),
              max_range:
                param.max_range || param.normal_range?.split("-")[1]?.trim(),
              value: "", // Required by ReportParametersSection component
              method: param.method || "",
              is_qualitative: param.is_qualitative || false,
              description: param.description || "",
              age_specific: param.age_specific || false,
              gender_specific: param.gender_specific || false,
              critical_low: param.critical_low || null,
              critical_high: param.critical_high || null,
            }))
          : [];

      setTestWithParameters({
        id: response.id,
        status: "processing",
        test: {
          id: selectedTest.id,
          name: selectedTest.name,
          code: selectedTest.code,
          category: selectedTest.category,
          parameters: parameters, // Add parameters to test object
        },
        parameters: parameters, // Also add parameters directly to the testData object
        patient: selectedPatient,
      });
    } catch (err) {
      console.error("Error booking test:", err);
      setError(
        "Failed to book test: " +
          (err.response?.data?.message || "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  };

  // Open the report generation modal
  const handleGenerateReport = () => {
    setShowReportModal(true);
  };

  // Reset the form to start over
  const handleReset = () => {
    setSelectedPatient(null);
    setSelectedTest(null);
    setBookingSuccess(false);
    setBookingData(null);
    setTestWithParameters(null);
    setBookingDetails({
      doctor_id: "",
      notes: "",
      delivery_method: "email",
    });
  };

  // Handle closing the report modal
  const handleCloseReportModal = () => {
    setShowReportModal(false);
    
    // Set report generation success and fetch the generated reports
    setReportGenerationSuccess(true);
    fetchGeneratedReports();
  };
  
  // Fetch reports generated for the current booking
  const fetchGeneratedReports = async () => {
    if (!bookingData?.id) return;
    
    try {
      setIsLoadingReports(true);
      const reports = await getTestReports({ test_booking_id: bookingData.id });
      console.log("Generated reports:", reports);
      setGeneratedReports(reports);
    } catch (err) {
      console.error("Error fetching reports:", err);
      setError("Failed to fetch generated reports: " + (err.message || "Unknown error"));
    } finally {
      setIsLoadingReports(false);
    }
  };
  
  // Handle downloading a report
  const handleDownloadReport = async (reportId) => {
    try {
      const success = await downloadTestReport(reportId);
      if (success) {
        toast.success("Report downloaded successfully");
      }
    } catch (err) {
      console.error("Error downloading report:", err);
      toast.error("Failed to download report: " + (err.message || "Unknown error"));
    }
  };
  
  // Handle sending notification to patient
  const handleSendNotification = async (reportId) => {
    try {
      setNotificationStatus(prev => ({ ...prev, [reportId]: 'loading' }));
      await sendReportNotification(reportId);
      setNotificationStatus(prev => ({ ...prev, [reportId]: 'sent' }));
      toast.success("Notification sent successfully");
    } catch (err) {
      console.error("Error sending notification:", err);
      setNotificationStatus(prev => ({ ...prev, [reportId]: 'error' }));
      toast.error("Failed to send notification: " + (err.message || "Unknown error"));
    }
  };
  
  // Handle editing an existing report
  const handleEditReport = (reportId) => {
    // Find the report in the generated reports list
    const reportToEdit = generatedReports.find(report => report.id === reportId);
    
    if (!reportToEdit) {
      toast.error("Unable to find report data");
      return;
    }
    
    // Set up the data for the report modal
    setTestWithParameters({
      id: bookingData.id,
      status: "completed",
      test: {
        id: selectedTest.id,
        name: selectedTest.name,
        code: selectedTest.code,
        category: selectedTest.category,
        parameters: reportToEdit.parameters || []
      },
      parameters: reportToEdit.parameters || [],
      patient: selectedPatient,
      report_id: reportId // Add the report ID to enable edit mode
    });
    
    // Open the modal in edit mode
    setShowReportModal(true);
  };

  // Handle marking a test as reviewed and then completed (sign off)
  const handleMarkCompleted = async (testBookingId) => {
    try {
      setLoading(true);
      // Step 1: Mark as reviewed (required before completion)
      await markReviewed(testBookingId);
      toast.info("Report reviewed successfully.");
      // Step 2: Mark as completed
      await markCompleted(testBookingId);
      toast.success("Report signed off and marked as completed!");
      // Refresh the generated reports to reflect new status
      fetchGeneratedReports();
    } catch (err) {
      console.error("Error marking report as completed:", err);
      toast.error("Failed to sign off report: " + (err.response?.data?.message || err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  // Format price safely for display
  const formatPrice = (price) => {
    if (price === null || price === undefined) return "N/A";

    // If price is a string, try to convert to number
    const numPrice = typeof price === "string" ? parseFloat(price) : price;

    // Check if it's a valid number after conversion
    if (!isNaN(numPrice) && typeof numPrice === "number") {
      return numPrice.toFixed(2);
    }

    // If conversion failed, just return the original value
    return price;
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-10 bg-white rounded-2xl shadow-lg border border-gray-100">
        <h1 className="text-4xl font-extrabold mb-10 text-center text-blue-800 tracking-tight drop-shadow-sm">
          Create Case & Generate Report
        </h1>

        {error && (
          <Alert type="error" message={error} onClose={() => setError(null)} />
        )}

        {/* Step 1: Patient Selection or Registration */}
        <div className="mb-10 p-6 bg-blue-50 rounded-xl border border-blue-100 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <span className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold text-lg">1</span>
            <span className="text-lg font-semibold text-blue-700">Select or Register Patient</span>
          </div>
          <PatientSelection
            patients={patients}
            patientSearch={patientSearch}
            setPatientSearch={setPatientSearch}
            filteredPatients={filteredPatients}
            isCreatingPatient={isCreatingPatient}
            setIsCreatingPatient={setIsCreatingPatient}
            newPatientData={newPatientData}
            handlePatientInputChange={handlePatientInputChange}
            patientErrors={patientErrors}
            handleCreatePatient={handleCreatePatient}
            selectPatient={selectPatient}
            loading={loading}
            selectedPatient={selectedPatient}
            setSelectedPatient={setSelectedPatient}
          />
        </div>

        {/* Step 2: Test Selection */}
        {selectedPatient && (
          <div className="mb-10 p-6 bg-green-50 rounded-xl border border-green-100 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <span className="w-8 h-8 flex items-center justify-center rounded-full bg-green-600 text-white font-bold text-lg">2</span>
              <span className="text-lg font-semibold text-green-700">Select Test</span>
            </div>
            <TestSelection
              testSearch={testSearch}
              setTestSearch={setTestSearch}
              filteredTests={filteredTests}
              selectTest={selectTest}
              formatPrice={formatPrice}
              selectedTest={selectedTest}
              setSelectedTest={setSelectedTest}
            />
          </div>
        )}

        {/* Step 3: Additional Details & Book Test */}
        {selectedPatient && selectedTest && !bookingSuccess && (
          <div className="mb-10 p-6 bg-yellow-50 rounded-xl border border-yellow-100 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <span className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-500 text-white font-bold text-lg">3</span>
              <span className="text-lg font-semibold text-yellow-700">Booking Details</span>
            </div>
            <BookingForm
              loading={loading}
              doctors={doctors}
              bookingDetails={bookingDetails}
              handleBookingDetailsChange={handleBookingDetailsChange}
              handleBookTest={handleBookTest}
            />
          </div>
        )}

        {/* Step 4: Generate Report */}
        {bookingSuccess && bookingData && (
          <div className="mb-10 p-6 bg-purple-50 rounded-xl border border-purple-100 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <span className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-600 text-white font-bold text-lg">4</span>
              <span className="text-lg font-semibold text-purple-700">Generate & Manage Report</span>
            </div>
            {/* Show the generated report view instead of a table */}
            {generatedReports && generatedReports.length > 0 ? (
              <div className="bg-white rounded-xl shadow p-6 border border-gray-100 mb-6">
                <h3 className="text-xl font-bold text-purple-700 mb-4">Latest Generated Report</h3>
                <div className="mb-4">
                  <div className="font-semibold text-gray-700">Report ID: <span className="text-gray-900">{generatedReports[0].id}</span></div>
                  <div className="text-gray-600">Status: <span className="font-semibold text-purple-700">{generatedReports[0].status}</span></div>
                  <div className="text-gray-600">Created: <span className="font-semibold">{new Date(generatedReports[0].created_at).toLocaleString()}</span></div>
                </div>
                <div className="flex gap-3">
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow"
                    onClick={() => handleDownloadReport(generatedReports[0].id)}
                  >
                    Download PDF
                  </button>
                  <button
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow"
                    onClick={() => handleSendNotification(generatedReports[0].id)}
                    disabled={notificationStatus[generatedReports[0].id] === 'loading'}
                  >
                    {notificationStatus[generatedReports[0].id] === 'loading' ? 'Sending...' : 'Send Email'}
                  </button>
                  <button
                    className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 shadow flex items-center gap-2"
                    onClick={() => handleMarkCompleted(bookingData.id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75A2.25 2.25 0 0014.25 4.5h-4.5A2.25 2.25 0 007.5 6.75v10.5A2.25 2.25 0 009.75 19.5h4.5a2.25 2.25 0 002.25-2.25V13.5m-6.75 0l2.25 2.25 4.5-4.5" />
                    </svg>
                    Sign Off
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-gray-500 italic mb-6">No report generated yet. Please generate a report.</div>
            )}
            <ReportGeneration
              bookingData={bookingData}
              reportGenerationSuccess={reportGenerationSuccess}
              isLoadingReports={isLoadingReports}
              generatedReports={generatedReports}
              notificationStatus={notificationStatus}
              handleEditReport={handleEditReport}
              handleDownloadReport={handleDownloadReport}
              handleSendNotification={handleSendNotification}
              handleGenerateReport={handleGenerateReport}
              handleReset={handleReset}
              hideReportsTable={true}
            />
          </div>
        )}
      </div>

      {/* Report Generation Modal */}
      {showReportModal && testWithParameters && (
        <GenerateReportModal
          isOpen={showReportModal}
          onClose={handleCloseReportModal}
          testData={testWithParameters}
          patientData={selectedPatient}
          isEditing={testWithParameters && testWithParameters.report_id ? true : false}
          viewOnly={false}
        />
      )}
    </Layout>
  );
};

export default IntegratedCaseReport;
