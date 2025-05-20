import React, { useState, useEffect } from "react";
import { FaSearch, FaUserPlus, FaFlask, FaCheck, FaPen } from "react-icons/fa";
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
} from "../../services/api";
import PatientForm from "../../components/patients/PatientForm";
import GenerateReportModal from "../../components/reports/GenerateReportModal";
import { FormField, Alert } from "../../components/common";

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
    // Optionally reset everything to start fresh
    handleReset();
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
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">
          Create Case & Generate Report
        </h1>

        {error && (
          <Alert type="error" message={error} onClose={() => setError(null)} />
        )}

        {/* Step 1: Patient Selection or Registration */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Step 1: Select or Register Patient
          </h2>

          {!selectedPatient ? (
            <>
              <div className="flex items-center mb-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Search patients by name, email, or phone..."
                    value={patientSearch}
                    onChange={(e) => setPatientSearch(e.target.value)}
                  />
                  <FaSearch className="absolute right-3 top-3 text-gray-400" />
                </div>
                <button
                  className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center"
                  onClick={() => setIsCreatingPatient(true)}
                >
                  <FaUserPlus className="mr-2" />
                  New Patient
                </button>
              </div>

              {isCreatingPatient ? (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">
                    Register New Patient
                  </h3>
                  <PatientForm
                    patientData={newPatientData}
                    onChange={handlePatientInputChange}
                    errors={patientErrors}
                  />
                  <div className="flex justify-end mt-4">
                    <button
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg mr-2"
                      onClick={() => setIsCreatingPatient(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                      onClick={handleCreatePatient}
                      disabled={loading}
                    >
                      {loading ? "Creating..." : "Create Patient"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  {filteredPatients.length > 0 ? (
                    filteredPatients.map((patient) => (
                      <div
                        key={patient.id}
                        className="border rounded-lg p-4 cursor-pointer hover:bg-blue-50"
                        onClick={() => selectPatient(patient)}
                      >
                        <h3 className="font-semibold">{patient.name}</h3>
                        <p className="text-sm text-gray-600">{patient.email}</p>
                        <p className="text-sm text-gray-600">{patient.phone}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 col-span-3">
                      No patients found. Try a different search or register a
                      new patient.
                    </p>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{selectedPatient.name}</h3>
                <p className="text-sm text-gray-600">{selectedPatient.email}</p>
                <p className="text-sm text-gray-600">{selectedPatient.phone}</p>
              </div>
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg"
                onClick={() => setSelectedPatient(null)}
              >
                Change Patient
              </button>
            </div>
          )}
        </div>

        {/* Step 2: Test Selection */}
        {selectedPatient && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Step 2: Select Test</h2>

            {!selectedTest ? (
              <>
                <div className="flex items-center mb-4">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder="Search tests by name, code, or category..."
                      value={testSearch}
                      onChange={(e) => setTestSearch(e.target.value)}
                    />
                    <FaSearch className="absolute right-3 top-3 text-gray-400" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  {filteredTests.length > 0 ? (
                    filteredTests.map((test) => (
                      <div
                        key={test.id}
                        className="border rounded-lg p-4 cursor-pointer hover:bg-blue-50"
                        onClick={() => selectTest(test)}
                      >
                        <div className="flex justify-between">
                          <h3 className="font-semibold">{test.name}</h3>
                          <span className="text-sm bg-gray-200 px-2 py-1 rounded">
                            {test.code}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{test.category}</p>
                        <p className="text-sm font-semibold mt-2">
                          ₹{formatPrice(test.price)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 col-span-3">
                      No tests found. Try a different search.
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{selectedTest.name}</h3>
                  <p className="text-sm text-gray-600">
                    {selectedTest.code} | {selectedTest.category}
                  </p>
                  <p className="text-sm font-semibold">
                    ₹{formatPrice(selectedTest.price)}
                  </p>
                </div>
                <button
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg"
                  onClick={() => setSelectedTest(null)}
                >
                  Change Test
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Additional Details & Book Test */}
        {selectedPatient && selectedTest && !bookingSuccess && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              Step 3: Integrated Workflow
            </h2>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-4">
              <h3 className="font-semibold text-blue-800">
                Streamlined Process
              </h3>
              <p className="text-sm text-gray-700 mt-1">
                This integrated workflow will automatically:
              </p>
              <ul className="list-disc text-sm text-gray-700 ml-6 mt-1">
                <li>Book the test</li>
                <li>Mark sample as collected</li>
                <li>Mark test as processing</li>
                <li>Allow immediate report generation</li>
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Referred by Doctor"
                id="doctor-select"
                name="doctor_id"
                type="select"
                options={
                  loading
                    ? [{ value: "", label: "Loading doctors..." }]
                    : [
                        {
                          value: "",
                          label: "-- Select referring doctor (optional) --",
                        },
                        ...doctors.map((doctor) => ({
                          value: doctor.id,
                          label: doctor.name,
                        })),
                      ]
                }
                value={bookingDetails.doctor_id}
                onChange={handleBookingDetailsChange}
                disabled={loading}
              />

              <FormField
                label="Delivery Method"
                id="delivery-method"
                name="delivery_method"
                type="select"
                options={[
                  { value: "email", label: "Email" },
                  { value: "sms", label: "SMS" },
                  { value: "portal", label: "Patient Portal" },
                  { value: "print", label: "Print" },
                ]}
                value={bookingDetails.delivery_method}
                onChange={handleBookingDetailsChange}
              />

              <div className="md:col-span-2">
                <FormField
                  label="Notes"
                  id="booking-notes"
                  name="notes"
                  type="textarea"
                  placeholder="Any special instructions or notes..."
                  value={bookingDetails.notes}
                  onChange={handleBookingDetailsChange}
                />
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center"
                onClick={handleBookTest}
                disabled={loading}
              >
                <FaFlask className="mr-2" />
                {loading ? "Processing..." : "Book & Process Test"}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Generate Report */}
        {bookingSuccess && bookingData && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              Step 4: Generate Report
            </h2>

            <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-4">
              <div className="flex items-center">
                <FaCheck className="text-green-500 mr-2" />
                <span className="font-medium">
                  Test processed and ready for reporting!
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Booking ID: {bookingData.id} | Status: processing
                {bookingData.doctor && (
                  <> | Referred by: {bookingData.doctor.name}</>
                )}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-medium">
                  Automatic workflow completed:
                </span>{" "}
                Test booked → Sample collected → Test processing
              </p>
            </div>

            <div className="flex justify-center mt-4">
              <button
                className="px-6 py-3 bg-blue-600 text-white rounded-lg flex items-center mr-4"
                onClick={handleGenerateReport}
              >
                <FaPen className="mr-2" />
                Generate Report
              </button>

              <button
                className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg"
                onClick={handleReset}
              >
                Start New Case
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Report Generation Modal */}
      {showReportModal && testWithParameters && (
        <>
          {console.log(
            "Rendering modal with test data:",
            JSON.stringify(testWithParameters, null, 2)
          )}
          <GenerateReportModal
            isOpen={showReportModal}
            onClose={handleCloseReportModal}
            testData={testWithParameters}
            patientData={selectedPatient}
            isEditing={false}
            viewOnly={false}
          />
        </>
      )}
    </Layout>
  );
};

export default IntegratedCaseReport;
