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
  localStorage.setItem("token", response.data.token);
  return response.data.user;
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
