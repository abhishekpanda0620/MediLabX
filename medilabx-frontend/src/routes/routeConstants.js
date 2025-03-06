export const ROUTES = {
  // Public Routes
  HOME: '/',
  SIGN_IN: '/signin',
  SIGN_UP: '/signup',

  // Protected Routes - Patient
  DASHBOARD: '/dashboard',
  APPOINTMENTS: '/appointments',
  MY_REPORTS: '/my-reports',
  MY_PROFILE: '/profile',

  // Protected Routes - Admin
  ADMIN_DASHBOARD: '/admin',
  STAFF_MANAGEMENT: '/admin/staff',
  TEST_MANAGEMENT: '/admin/tests',
  BILLING_MANAGEMENT: '/admin/billing',

  // Protected Routes - Doctor
  DOCTOR_DASHBOARD: '/doctor',
  PATIENT_MANAGEMENT: '/doctor/patients',
  REPORT_GENERATION: '/doctor/reports',

  // Protected Routes - Lab Staff
  LAB_DASHBOARD: '/lab',
  SAMPLE_MANAGEMENT: '/lab/samples',
  TEST_CATALOG: '/tests',
  LAB_REPORTS: '/lab/reports',

  // Common Protected Routes
  SETTINGS: '/settings',
  NOTIFICATIONS: '/notifications',
};
