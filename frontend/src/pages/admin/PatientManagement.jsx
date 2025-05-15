import React, { useState, useEffect } from 'react';
import { FaUserPlus, FaSearch, FaEdit, FaTrash, FaUser, FaEnvelope, FaIdCard, FaPhone, FaCalendar, FaVenusMars } from 'react-icons/fa';
import Layout from '../../components/Layout';
import { DataTable, DataTableHelpers, Modal, ModalFooter, FormField, ConfirmationDialog, Alert } from '../../components/common';

// This is an example component to demonstrate the use of shared components
// In a real application, you would connect this to actual API services

const PatientManagement = () => {
  // Example patients data
  const [patients, setPatients] = useState([
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@example.com',
      gender: 'Male',
      dob: '1985-05-15',
      phone: '123-456-7890',
      status: 'Active'
    },
    {
      id: 2,
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      gender: 'Female',
      dob: '1990-08-22',
      phone: '987-654-3210',
      status: 'Active'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      gender: 'Male',
      dob: '1978-12-03',
      phone: '555-123-4567',
      status: 'Inactive'
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [currentPatient, setCurrentPatient] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gender: '',
    dob: '',
    phone: '',
  });
  const [formErrors, setFormErrors] = useState({});

  // Confirmation dialog state
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);

  // Search functionality (example implementation)
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      // Reset to full list
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const filteredPatients = patients.filter(patient => 
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        patient.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setPatients(filteredPatients);
      setLoading(false);
    }, 500); // Simulate API delay
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null,
      });
    }
  };

  // Form validation
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
    if (!formData.gender) errors.gender = 'Gender is required';
    if (!formData.dob) errors.dob = 'Date of Birth is required';
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    
    return errors;
  };

  // Open modal for adding new patient
  const handleAddPatient = () => {
    setModalMode('add');
    setFormData({
      name: '',
      email: '',
      gender: '',
      dob: '',
      phone: '',
    });
    setFormErrors({});
    setShowModal(true);
  };

  // Open modal for editing patient
  const handleEditPatient = (patient) => {
    setModalMode('edit');
    setCurrentPatient(patient);
    setFormData({
      name: patient.name,
      email: patient.email,
      gender: patient.gender,
      dob: patient.dob,
      phone: patient.phone,
    });
    setFormErrors({});
    setShowModal(true);
  };

  // Delete patient
  const handleDelete = (patient) => {
    setPatientToDelete(patient);
    setShowConfirmation(true);
  };

  const confirmDelete = () => {
    if (!patientToDelete) return;
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setPatients(patients.filter(p => p.id !== patientToDelete.id));
      setShowConfirmation(false);
      setPatientToDelete(null);
      setLoading(false);
    }, 800);
  };

  // Submit form (add or edit patient)
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (modalMode === 'add') {
        const newPatient = {
          id: Date.now(), // Generate temporary ID
          ...formData,
          status: 'Active'
        };
        setPatients([...patients, newPatient]);
      } else {
        // Update existing patient
        setPatients(patients.map(p => 
          p.id === currentPatient.id ? { ...p, ...formData } : p
        ));
      }
      
      setShowModal(false);
      setLoading(false);
    }, 800);
  };

  // DataTable columns definition
  const columns = [
    { header: 'Name', accessor: 'name', className: 'font-medium text-gray-800' },
    { header: 'Email', accessor: 'email', className: 'text-gray-600' },
    { header: 'Phone', accessor: 'phone' },
    { 
      header: 'Gender', 
      accessor: 'gender',
      render: (patient) => (
        <span className="capitalize">{patient.gender}</span>
      )
    },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (patient) => (
        <DataTableHelpers.Badge 
          text={patient.status} 
          type={patient.status === 'Active' ? 'success' : 'warning'} 
        />
      )
    },
    {
      header: 'Actions',
      render: (patient) => (
        <DataTableHelpers.Actions
          actions={[
            {
              icon: <FaEdit />,
              type: 'primary',
              label: 'Edit patient',
              onClick: () => handleEditPatient(patient)
            },
            {
              icon: <FaTrash />,
              type: 'danger',
              label: 'Delete patient',
              onClick: () => handleDelete(patient)
            }
          ]}
          item={patient}
        />
      )
    }
  ];

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Patient Management</h1>
          <p className="text-gray-600">Manage patient records and information</p>
        </div>

        {error && (
          <Alert 
            type="error"
            title={error}
            message="Please try again or contact system administrator."
            onDismiss={() => setError(null)}
          />
        )}

        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full p-3 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm"
            />
            <FaSearch 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer" 
              onClick={handleSearch}
            />
          </div>
          <button 
            className="flex items-center px-5 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 shadow-md hover:shadow-lg transition-all duration-200"
            onClick={handleAddPatient}
          >
            <FaUserPlus className="mr-2" />
            Add New Patient
          </button>
        </div>

        {/* Patient Data Table */}
        <DataTable
          columns={columns}
          data={patients}
          loading={loading}
          emptyMessage="No patients found"
        />
      </div>

      {/* Add/Edit Patient Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalMode === 'add' ? 'Add New Patient' : 'Edit Patient'}
        icon={modalMode === 'add' ? <FaUserPlus /> : <FaEdit />}
        footer={
          <>
            <ModalFooter.CancelButton onClick={() => setShowModal(false)} />
            <ModalFooter.SubmitButton
              onClick={handleSubmit}
              label={modalMode === 'add' ? 'Add Patient' : 'Update Patient'}
              isLoading={loading}
              disabled={loading}
            />
          </>
        }
        size="md"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(e); }}>
          <FormField
            id="name"
            name="name"
            label="Full Name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            error={formErrors.name}
            icon={<FaUser className="text-gray-400" />}
            placeholder="Enter patient name"
            required
          />
          
          <FormField
            id="email"
            name="email"
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            error={formErrors.email}
            icon={<FaEnvelope className="text-gray-400" />}
            placeholder="Enter patient email"
            required
          />
          
          <FormField
            id="phone"
            name="phone"
            label="Phone Number"
            type="text"
            value={formData.phone}
            onChange={handleInputChange}
            error={formErrors.phone}
            icon={<FaPhone className="text-gray-400" />}
            placeholder="Enter phone number"
            required
          />
          
          <FormField
            id="dob"
            name="dob"
            label="Date of Birth"
            type="date"
            value={formData.dob}
            onChange={handleInputChange}
            error={formErrors.dob}
            icon={<FaCalendar className="text-gray-400" />}
            required
          />
          
          <FormField
            id="gender"
            name="gender"
            label="Gender"
            type="select"
            value={formData.gender}
            onChange={handleInputChange}
            error={formErrors.gender}
            icon={<FaVenusMars className="text-gray-400" />}
            options={['Male', 'Female', 'Other']}
            required
          />
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => {
          setShowConfirmation(false);
          setPatientToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete ${patientToDelete?.name}?`}
        description="This action cannot be undone and will permanently remove this patient's record."
        type="danger"
        confirmText="Delete"
        loading={loading}
      />
    </Layout>
  );
};

export default PatientManagement;
