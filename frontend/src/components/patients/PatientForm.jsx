import React from 'react';
import { FormField } from '../common';

/**
 * Patient form component for creating new patients
 * 
 * @param {Object} props
 * @param {Object} props.patientData - The patient data object
 * @param {Function} props.onChange - Function to handle input changes
 * @param {Object} props.errors - Validation errors object
 * @returns {React.ReactElement}
 */
function PatientForm({ patientData, onChange, errors = {} }) {
  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' }
  ];

  const bloodGroupOptions = [
    { value: 'A+', label: 'A+' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B-', label: 'B-' },
    { value: 'AB+', label: 'AB+' },
    { value: 'AB-', label: 'AB-' },
    { value: 'O+', label: 'O+' },
    { value: 'O-', label: 'O-' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        label="Full Name"
        id="patient-name"
        name="name"
        type="text"
        placeholder="Full name"
        value={patientData.name || ''}
        onChange={onChange}
        error={errors.name}
        required
      />
      
      <FormField
        label="Email"
        id="patient-email"
        name="email"
        type="email"
        placeholder="Email address"
        value={patientData.email || ''}
        onChange={onChange}
        error={errors.email}
        required
      />
      
      <FormField
        label="Phone Number"
        id="patient-phone"
        name="phone"
        type="tel"
        placeholder="Phone number"
        value={patientData.phone || ''}
        onChange={onChange}
        error={errors.phone}
        required
      />
      
      <FormField
        label="Date of Birth"
        id="patient-dob"
        name="date_of_birth"
        type="date"
        value={patientData.date_of_birth || ''}
        onChange={onChange}
        error={errors.date_of_birth}
      />
      
      <FormField
        label="Gender"
        id="patient-gender"
        name="gender"
        type="select"
        options={genderOptions}
        value={patientData.gender || ''}
        onChange={onChange}
        error={errors.gender}
      />
      
      <FormField
        label="Blood Group"
        id="patient-blood-group"
        name="blood_group"
        type="select"
        options={bloodGroupOptions}
        value={patientData.blood_group || ''}
        onChange={onChange}
        error={errors.blood_group}
      />
      
      <FormField
        label="Address"
        id="patient-address"
        name="address"
        type="text"
        placeholder="Address"
        value={patientData.address || ''}
        onChange={onChange}
        error={errors.address}
      />
      
      <div className="md:col-span-2">
        <FormField
          label="Medical History"
          id="patient-medical-history"
          name="medical_history"
          type="textarea"
          placeholder="Any relevant medical history"
          value={patientData.medical_history || ''}
          onChange={onChange}
          error={errors.medical_history}
        />
      </div>
    </div>
  );
}

export default PatientForm;
