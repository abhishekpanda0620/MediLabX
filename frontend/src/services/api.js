import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api"; // Change if needed

// Axios instance with default headers
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach Authorization header dynamically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* =================== 🔹 AUTH API 🔹 =================== */
// Login User
export const loginUser = async (email, password) => {
  const response = await api.post("/login", { email, password });
  return {
    token: response.data.token,
    user: response.data.user,
  };
};

// Register User
export const registerUser = async (userData) => {
  const response = await api.post("/register", userData);
  return response.data;
};

// Logout User
export const logoutUser = async () => {
  await api.post("/logout");
  localStorage.removeItem("token");
};

/* =================== 🔹 USER API 🔹 =================== */
// Get logged-in user details
export const getUserData = async () => {
  const response = await api.get("/user");
  return response.data;
};

// Get all users (Admin only)
export const getAllUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

/* =================== 🔹 TESTS API 🔹 =================== */
// Get list of all test categories
export const getCategories = async () => {
  const response = await api.get("/test-categories");
  return response.data.categories;
};

// Get list of all available tests
export const getAllTests = async () => {
  const response = await api.get("/test-templates");
  return response.data;
};

// Create a new test template
export const createTest = async (testData) => {
  const data = {
    name: testData.name,
    description: testData.description,
    category: testData.category,
    code: testData.code,
    turn_around_time: testData.turn_around_time,
    specimen_requirements: testData.specimen_requirements,
    preparation_instructions: testData.preparation_instructions,
    price: testData.price,
    fasting_required: testData.fasting_required || false,
    fasting_duration: testData.fasting_duration,
    parameters: testData.parameters.map(param => ({
      parameter_name: param.parameter_name,
      unit: param.unit,
      normal_range: param.normal_range,
      description: param.description,
      reference_ranges: param.reference_ranges,
      critical_low: param.critical_low,
      critical_high: param.critical_high,
      interpretation_guide: param.interpretation_guide,
      method: param.method,
      instrument: param.instrument
    }))
  };
  
  const response = await api.post("/test-template", data);
  return response.data;
};

// Update an existing test template
export const updateTest = async (testId, testData) => {
  const data = {
    name: testData.name,
    description: testData.description,
    category: testData.category,
    code: testData.code,
    turn_around_time: testData.turn_around_time,
    specimen_requirements: testData.specimen_requirements,
    preparation_instructions: testData.preparation_instructions,
    price: testData.price,
    fasting_required: testData.fasting_required || false,
    fasting_duration: testData.fasting_duration,
    parameters: testData.parameters.map(param => ({
      parameter_name: param.parameter_name,
      unit: param.unit,
      normal_range: param.normal_range,
      description: param.description,
      reference_ranges: param.reference_ranges,
      critical_low: param.critical_low,
      critical_high: param.critical_high,
      interpretation_guide: param.interpretation_guide,
      method: param.method,
      instrument: param.instrument
    }))
  };

  const response = await api.put(`/test-template/${testId}`, data);
  return response.data;
};

// Delete a test template
export const deleteTest = async (testId) => {
  const response = await api.delete(`/test-template/${testId}`);
  return response.data;
};

// Book a test
export const bookTest = async (testData) => {
  const response = await api.post("/test-bookings", testData);
  return response.data;
};

/* =================== 🔹 REPORTS API 🔹 =================== */
// Get reports for a patient
export const getPatientReports = async (patientId) => {
  const response = await api.get(`/reports?patient_id=${patientId}`);
  return response.data;
};

// Submit test results (Lab Technician or Pathologist)
export const submitTestResults = async (reportId, testValues) => {
  const response = await api.post(`/reports/${reportId}`, { testValues });
  return response.data;
};

/* =================== 🔹 APPOINTMENTS API 🔹 =================== */
// Get all appointments
export const getAppointments = async () => {
  const response = await api.get("/appointments");
  return response.data;
};

// Book an appointment
export const bookAppointment = async (appointmentData) => {
  const response = await api.post("/appointments", appointmentData);
  return response.data;
};

/* =================== 🔹 ADMIN API 🔹 =================== */
// Get dashboard statistics
export const getAdminDashboardStats = async () => {
  const response = await api.get("/admin/stats");
  return response.data;
};

// Manage staff (Add or remove)
export const manageStaff = async (staffData) => {
  const response = await api.post("/admin/staff", staffData);
  return response.data;
};

/* =================== 🔹 TEST REPORTS API 🔹 =================== */
// Get reports for a patient or lab technician
export const getTestReports = async (filters = {}) => {
  const response = await api.get('/reports', { params: filters });
  return response.data;
};

// Create new test report
export const createTestReport = async (testBookingId) => {
  const response = await api.post(`/test-bookings/${testBookingId}/reports`);
  return response.data;
};

// Submit test report
export const submitTestReport = async (reportId, data) => {
  const response = await api.post(`/reports/${reportId}/submit`, data);
  return response.data;
};

// Download test report
export const downloadTestReport = async (reportId) => {
  const response = await api.get(`/reports/${reportId}/download`, {
    responseType: 'blob' // Ensure the response is treated as a file
  });

  // Create a download link for the file
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `test-report-${reportId}.pdf`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Review test report (Pathologist)
export const reviewTestReport = async (reportId, data) => {
  const response = await api.post(`/reports/${reportId}/review`, data);
  return response.data;
};

// Validate test report (Pathologist)
export const validateTestReport = async (reportId) => {
  const response = await api.post(`/reports/${reportId}/validate`);
  return response.data;
};

// Reject test report (Pathologist)
export const rejectTestReport = async (reportId, notes) => {
  const response = await api.post(`/reports/${reportId}/reject`, { notes });
  return response.data;
};

// Send notification to patient about report
export const sendReportNotification = async (reportId) => {
  const response = await api.post(`/reports/${reportId}/notify`);
  return response.data;
};

/* =================== 🔹 TEST RESULTS API 🔹 =================== */
// Validate test results
export const validateTestResults = async (reportId, results) => {
  const response = await api.post(`/test-reports/${reportId}/validate-results`, { results });
  return response.data;
};

// Get parameter reference ranges
export const getParameterReferenceRanges = async (parameterId, age, gender) => {
  const response = await api.get(`/test-parameters/${parameterId}/reference-ranges`, {
    params: { age, gender }
  });
  return response.data;
};

// Get test result statistics
export const getTestResultStatistics = async (parameterId, startDate, endDate) => {
  const response = await api.get('/test-results/statistics', {
    params: { parameter_id: parameterId, start_date: startDate, end_date: endDate }
  });
  return response.data;
};

/* =================== 🔹 TEST BOOKINGS API 🔹 =================== */
// Fetch test bookings with specific filters
export const getTestBookings = async (filters = {}) => {
  const response = await api.get('/test-bookings', { params: filters });
  return response.data;
};

// Mark a sample as collected
export const markSampleCollected = async (testBookingId) => {
  const response = await api.post(`/test-bookings/${testBookingId}/mark-sample-collected`);
  return response.data;
};

// Mark a sample as processing
export const markProcessing = async (testBookingId) => {
  const response = await api.post(`/test-bookings/${testBookingId}/mark-processing`);
  return response.data;
};

// Mark a test as reviewed
export const markReviewed = async (testBookingId) => {
  const response = await api.post(`/test-bookings/${testBookingId}/mark-reviewed`);
  return response.data;
};

// Mark a test as completed
export const markCompleted = async (testBookingId) => {
  const response = await api.post(`/test-bookings/${testBookingId}/mark-completed`);
  return response.data;
};

// Cancel a test booking
export const cancelTestBooking = async (testBookingId, notes = '') => {
  const response = await api.post(`/test-bookings/${testBookingId}/cancel`, { notes });
  return response.data;
};

/* =================== 🔹 PATIENTS and DOCTORS API 🔹 =================== */
// Get all patients
export const getAllPatients = async () => {
  try {
    const response = await api.get('/patients');
    return response.data;
  } catch (error) {
    console.error("Error fetching patients:", error);
    // Return some dummy data if API fails
    return [
      { id: 1, name: "John Doe" },
      { id: 2, name: "Jane Smith" }
    ];
  }
};

// Get all doctors
export const getAllDoctors = async () => {
  try {
    const response = await api.get('/doctors');
    return response.data;
  } catch (error) {
    console.error("Error fetching doctors:", error);
    // Return some dummy data if API fails
    return [
      { id: 1, name: "Dr. Sarah Johnson" },
      { id: 2, name: "Dr. Michael Brown" }
    ];
  }
};
