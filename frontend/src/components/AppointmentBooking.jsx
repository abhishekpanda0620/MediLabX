import React, { useState } from 'react';

const AppointmentBooking = () => {
  const [testType, setTestType] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [paymentInfo, setPaymentInfo] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle appointment booking logic here
  };

  return (
    <div>
      <h2>Book an Appointment</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="testType">Select Test Type:</label>
          <select
            id="testType"
            value={testType}
            onChange={(e) => setTestType(e.target.value)}
            required
          >
            <option value="">--Select--</option>
            <option value="bloodTest">Blood Test</option>
            <option value="urineTest">Urine Test</option>
            <option value="xRay">X-Ray</option>
            <option value="mri">MRI</option>
          </select>
        </div>
        <div>
          <label htmlFor="appointmentDate">Appointment Date:</label>
          <input
            type="date"
            id="appointmentDate"
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="paymentInfo">Payment Information:</label>
          <input
            type="text"
            id="paymentInfo"
            value={paymentInfo}
            onChange={(e) => setPaymentInfo(e.target.value)}
            required
          />
        </div>
        <button type="submit">Book Appointment</button>
      </form>
    </div>
  );
};

export default AppointmentBooking;