import axios from "axios";

// In Vite, environment variables must be prefixed with VITE_ and accessed via import.meta.env
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'; 

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

// Get a single test with complete parameters
export const getTestWithParameters = async (testId) => {
  try {
    const response = await api.get(`/test-templates/${testId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching test parameters:", error);
    throw error;
  }
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


// Staff Management API
export const getAllStaff = async () => {
  const response = await api.get("/staffs");
  return response.data;
};

export const getStaffMember = async (id) => {
  const response = await api.get(`/staffs/${id}`);
  return response.data;
};

export const createStaffMember = async (staffData) => {
  const response = await api.post("/staffs", staffData);
  return response.data;
};

export const updateStaffMember = async (id, staffData) => {
  const response = await api.put(`/staffs/${id}`, staffData);
  return response.data;
};

export const deleteStaffMember = async (id) => {
  const response = await api.delete(`/staffs/${id}`);
  return response.data;
};

export const searchStaff = async (searchParams) => {
  const response = await api.get("/staffs/search", { params: searchParams });
  return response.data;
};

export const getStaffRoles = async () => {
  const response = await api.get("/staff-roles");
  return response.data.roles;
};

/* =================== 🔹 TEST REPORTS API 🔹 =================== */
// Get reports for a patient or lab technician
export const getTestReports = async (filters = {}) => {
  try {
    const response = await api.get('/reports', { params: filters });
    console.log('Reports response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching test reports:', error);
    // Return empty array instead of throwing to prevent breaking the UI
    return [];
  }
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
  try {
    console.log("Attempting to download report ID:", reportId);
    
    const response = await api.get(`/reports/${reportId}/download`, {
      responseType: 'blob' // Ensure the response is treated as a file
    });
    
    console.log("Download response received:", response);
    
    // Check if the response is valid blob and not JSON error
    const contentType = response.headers['content-type'];
    if (contentType && contentType.includes('application/json')) {
      // This means we got an error response instead of a PDF
      const reader = new FileReader();
      reader.onload = function() {
        const error = JSON.parse(reader.result);
        console.error('Error downloading report:', error);
        alert(`Failed to download report: ${error.message || 'Unknown error'}`);
      };
      reader.readAsText(response.data);
      return false;
    }

    // Create a download link for the file
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `test-report-${reportId}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the object URL to avoid memory leaks
    setTimeout(() => window.URL.revokeObjectURL(url), 100);
    
    return true;
  } catch (error) {
    console.error('Error downloading report:', error);
    alert('Failed to download report. Please check browser console for details.');
    return false;
  }
};

// Get cached report or generate new one
export const getReportPreview = async (reportId) => {
  try {
    const response = await api.get(`/reports/${reportId}/preview`);
    return response.data;
  } catch (error) {
    console.error("Error getting report preview:", error);
    throw error;
  }
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
  try {
    const response = await api.post(`/reports/${reportId}/notify`);
    return response.data;
  } catch (error) {
    console.error("Error sending notification:", error);
    throw new Error(error.response?.data?.message || "Failed to send notification");
  }
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
  try {
    console.log('Fetching test bookings with filters:', filters);
    const response = await api.get('/test-bookings', { params: filters });
    console.log('Test bookings response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching test bookings:', error);
    throw error;
  }
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
    throw error;
  }
};

// Get the current user's patient record
export const getCurrentPatient = async () => {
  try {
    const response = await api.get('/patients/current');
    return response.data;
  } catch (error) {
    console.error("Error fetching current patient record:", error);
    throw error;
  }
};

// Get a single patient
export const getPatient = async (id) => {
  try {
    const response = await api.get(`/patients/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching patient ${id}:`, error);
    throw error;
  }
};

// Create a new patient
export const createPatient = async (patientData) => {
  try {
    const response = await api.post('/patients', patientData);
    return response.data;
  } catch (error) {
    console.error("Error creating patient:", error);
    throw error;
  }
};

// Update a patient
export const updatePatient = async (id, patientData) => {
  try {
    const response = await api.put(`/patients/${id}`, patientData);
    return response.data;
  } catch (error) {
    console.error(`Error updating patient ${id}:`, error);
    throw error;
  }
};

// Delete a patient
export const deletePatient = async (id) => {
  try {
    const response = await api.delete(`/patients/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting patient ${id}:`, error);
    throw error;
  }
};


// Get all doctors
export const getAllDoctors = async () => {
  try {
    const response = await api.get('/doctors');
    console.log("Doctors fetched:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching doctors:", error);
    throw error;
  }
};

// Get a single doctor
export const getDoctor = async (id) => {
  try {
    const response = await api.get(`/doctors/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching doctor ${id}:`, error);
    throw error;
  }
};

// Create a new doctor
export const createDoctor = async (doctorData) => {
  try {
    const response = await api.post('/doctors', doctorData);
    return response.data;
  } catch (error) {
    console.error("Error creating doctor:", error);
    throw error;
  }
};

// Update a doctor
export const updateDoctor = async (id, doctorData) => {
  try {
    const response = await api.put(`/doctors/${id}`, doctorData);
    return response.data;
  } catch (error) {
    console.error(`Error updating doctor ${id}:`, error);
    throw error;
  }
};

// Delete a doctor
export const deleteDoctor = async (id) => {
  try {
    const response = await api.delete(`/doctors/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting doctor ${id}:`, error);
    throw error;
  }
};

// Get the current user's doctor record
export const getCurrentDoctor = async () => {
  try {
    const response = await api.get('/doctors/current');
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // No doctor record found for this user
      return null;
    }
    throw error;
  }
};

/* =================== 🔹 TEST PACKAGES API 🔹 =================== */
// Get all test packages
export const getTestPackages = async () => {
  const response = await api.get('/test-packages');
  return response.data;
};

// Get a single test package
export const getTestPackage = async (packageId) => {
  const response = await api.get(`/test-packages/${packageId}`);
  return response.data;
};

// Create a new test package
export const createTestPackage = async (packageData) => {
  const response = await api.post('/test-packages', packageData);
  return response.data;
};

// Update an existing test package
export const updateTestPackage = async (packageId, packageData) => {
  const response = await api.put(`/test-packages/${packageId}`, packageData);
  return response.data;
};

// Delete a test package
export const deleteTestPackage = async (packageId) => {
  const response = await api.delete(`/test-packages/${packageId}`);
  return response.data;
};

// Get available tests for creating packages
export const getAvailableTests = async () => {
  const response = await api.get('/available-tests');
  return response.data;
};

/* =================== 🔹 DASHBOARD STATS API 🔹 =================== */
// Get admin dashboard statistics
export const getAdminDashboardStats = async () => {
  const response = await api.get("/admin/dashboard-stats");
  return response.data;
};

// Get doctor dashboard statistics
export const getDoctorDashboardStats = async () => {
  const response = await api.get("/doctor/dashboard-stats");
  return response.data;
};

// Get lab technician dashboard statistics
export const getLabDashboardStats = async () => {
  const response = await api.get("/lab/dashboard-stats");
  return response.data;
};

// Get patient dashboard statistics
export const getPatientDashboardStats = async () => {
  const response = await api.get("/patient/dashboard-stats");
  return response.data;
};
