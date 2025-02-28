
## Frontend

The project is organized as follows:

```
medilabx-frontend
├── public
│   
├── src
│   ├── assets
│   │   └── styles
│   │       └── index.css   # Global styles for the application
│   ├── components
│   │   ├── AdminPanel.jsx           # Component for admin functionalities
│   │   ├── AppointmentBooking.jsx    # Component for booking appointments
│   │   ├── DoctorPanel.jsx           # Component for doctor functionalities
│   │   ├── HomePage.jsx              # Component for the home page
│   │   ├── LabStaffPanel.jsx         # Component for lab staff functionalities
│   │   └── PatientDashboard.jsx      # Component for patient dashboard
│   ├── pages
│   │   ├── auth
│   │   │   ├── Signin.jsx
│   │   │   ├── Signup.jsx
│   │   ├── AdminPanelPage.jsx        # Page for the Admin Panel
│   │   ├── AppointmentBookingPage.jsx # Page for booking appointments
│   │   ├── DoctorPanelPage.jsx       # Page for the Doctor Panel
│   │   ├── Home.jsx                  # Main landing page
│   │   ├── LabStaffPanelPage.jsx     # Page for the Lab Staff Panel
│   │   └── PatientDashboardPage.jsx  # Page for the Patient Dashboard
│   ├── App.jsx                       # Main application component
│   ├── index.jsx                     # Entry point for the React application
│   └── main.jsx                      # Initializes the React application
├── package.json                      # Configuration file for npm
├── .gitignore                        # Specifies files to ignore by Git
├── index.html                        # Main HTML file
└── README.md                         # Documentation for the project
```

## Features

- **Home**: Overview of services and options for login/signup.
- **Patient Dashboard**: View appointments, test reports, and notifications.
- **Book Appointment Page**: Select test types, schedule appointments, and handle payments.
- **Lab Staff Panel**: Upload test results and manage appointments.
- **Doctor Panel**: Review reports and provide comments.
- **Admin Panel**: Manage users, payments, and analytics.

## Getting Started

1. Clone the repository:
   ```
   git clone git@github.com:abhishekpanda0620/MediLabX.git
   ```

2. Navigate to the project directory:
   ```
   cd medilabx-frontend
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm start
   ```