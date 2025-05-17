import React from 'react';
import { FormField } from '../common';

/**
 * Doctor form component for creating and editing doctors
 * 
 * @param {Object} props
 * @param {Object} props.doctorData - The doctor data object
 * @param {Function} props.onChange - Function to handle input changes
 * @param {Object} props.errors - Validation errors object
 * @returns {React.ReactElement}
 */
function DoctorForm({ doctorData, onChange, errors = {} }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        label="Full Name"
        id="doctor-name"
        name="name"
        type="text"
        placeholder="Full name"
        value={doctorData.name || ''}
        onChange={onChange}
        error={errors.name}
        required
      />
      
      <FormField
        label="Email"
        id="doctor-email"
        name="email"
        type="email"
        placeholder="Email address"
        value={doctorData.email || ''}
        onChange={onChange}
        error={errors.email}
        required
      />
      
      <FormField
        label="Phone Number"
        id="doctor-phone"
        name="phone"
        type="tel"
        placeholder="Phone number"
        value={doctorData.phone || ''}
        onChange={onChange}
        error={errors.phone}
      />
      
      <FormField
        label="Specialization"
        id="doctor-specialization"
        name="specialization"
        type="text"
        placeholder="Specialization (e.g., Cardiology)"
        value={doctorData.specialization || ''}
        onChange={onChange}
        error={errors.specialization}
        required
      />
      
      <FormField
        label="Qualification"
        id="doctor-qualification"
        name="qualification"
        type="text"
        placeholder="Qualification (e.g., MD, PhD)"
        value={doctorData.qualification || ''}
        onChange={onChange}
        error={errors.qualification}
      />
      
      <FormField
        label="License Number"
        id="doctor-license-number"
        name="license_number"
        type="text"
        placeholder="Medical license number"
        value={doctorData.license_number || ''}
        onChange={onChange}
        error={errors.license_number}
      />
      
      <div className="md:col-span-2">
        <FormField
          label="Bio"
          id="doctor-bio"
          name="bio"
          type="textarea"
          placeholder="Professional bio and experience"
          value={doctorData.bio || ''}
          onChange={onChange}
          error={errors.bio}
        />
      </div>
    </div>
  );
}

export default DoctorForm;
