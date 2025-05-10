import React from 'react';

const PatientDashboard = () => {
  return (
    <div>
      <h1>Patient Dashboard</h1>
      <section>
        <h2>Your Appointments</h2>
        {/* List of appointments will be displayed here */}
      </section>
      <section>
        <h2>Your Test Reports</h2>
        {/* List of test reports will be displayed here */}
      </section>
      <section>
        <h2>Notifications</h2>
        {/* Notifications will be displayed here */}
      </section>
    </div>
  );
};

export default PatientDashboard;