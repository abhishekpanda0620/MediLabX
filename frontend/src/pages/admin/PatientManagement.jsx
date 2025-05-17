import React, { useState, useEffect } from 'react';
import { FaUserPlus, FaSearch, FaEdit, FaTrash, FaUser, FaEnvelope, FaIdCard, FaPhone, FaCalendar, FaVenusMars } from 'react-icons/fa';
import Layout from '../../components/Layout';
import { DataTable, DataTableHelpers, Modal, ConfirmationDialog, Alert, Button } from '../../components/common';
import ModalFooter from '../../components/common/ModalFooter';
import { getAllPatients, createPatient, updatePatient, deletePatient } from '../../services/api';
import PatientForm from '../../components/patients/PatientForm';

const PatientManagement = () => {
  const [patients, setPatients] = useState([]);

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

  // Fetch all patients from API
  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const data = await getAllPatients();
      setPatients(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch patients: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
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
    
    if (!formData.name?.trim()) errors.name = 'Name is required';
    if (!formData.email?.trim()) errors.email = 'Email is required';
    if (formData.email?.trim() && !/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
    if (!formData.phone?.trim()) errors.phone = 'Phone number is required';
    
    return errors;
  };

  // Open modal for adding new patient
  const handleAddPatient = () => {
    setModalMode('add');
    setFormData({
      name: '',
      email: '',
      phone: '',
      gender: '',
      date_of_birth: '',
      address: '',
      medical_history: '',
      blood_group: '',
      emergency_contact: ''
    });
    setFormErrors({});
    setCurrentPatient(null);
    setShowModal(true);
  };

  // Open modal for editing patient
  const handleEditPatient = (patient) => {
    setModalMode('edit');
    setCurrentPatient(patient);
    setFormData({
      name: patient.name || '',
      email: patient.email || '',
      phone: patient.phone || '',
      gender: patient.gender || '',
      date_of_birth: patient.date_of_birth || '',
      address: patient.address || '',
      medical_history: patient.medical_history || '',
      blood_group: patient.blood_group || '',
      emergency_contact: patient.emergency_contact || ''
    });
    setFormErrors({});
    setShowModal(true);
  };

  // Delete patient
  const handleDelete = (patient) => {
    setPatientToDelete(patient);
    setShowConfirmation(true);
  };

  const confirmDelete = async () => {
    if (!patientToDelete) return;
    
    setLoading(true);
    try {
      await deletePatient(patientToDelete.id);
      await fetchPatients();
      setShowConfirmation(false);
      setPatientToDelete(null);
    } catch (err) {
      setError('Failed to delete patient: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Submit form (add or edit patient)
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setLoading(true);
    
    try {
      if (modalMode === 'add') {
        // Create new patient with user account
        await createPatient({
          ...formData,
          create_user: true,
          is_active: true
        });
      } else {
        // Update existing patient
        await updatePatient(currentPatient.id, formData);
      }
      
      // Refresh patients list
      await fetchPatients();
      setShowModal(false);
    } catch (err) {
      setError('Failed to save patient: ' + (err.response?.data?.message || err.message));
      if (err.response?.data?.errors) {
        setFormErrors(err.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  // Search functionality
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      fetchPatients();
      return;
    }

    // Filter patients locally based on search query
    const searchTermLower = searchQuery.toLowerCase();
    const filteredPatients = patients.filter(patient => 
      patient.name?.toLowerCase().includes(searchTermLower) || 
      patient.email?.toLowerCase().includes(searchTermLower) ||
      patient.phone?.toLowerCase().includes(searchTermLower)
    );
    setPatients(filteredPatients);
  };

  // DataTable columns definition
  const columns = [
    { header: 'Name', accessor: 'name', className: 'font-medium text-gray-800' },
    { header: 'Email', accessor: 'email', className: 'text-gray-600' },
    { header: 'Phone', accessor: 'phone', render: (patient) => patient.phone || '-' },
    { 
      header: 'Gender', 
      accessor: 'gender',
      render: (patient) => (
        <span className="capitalize">{patient.gender || '-'}</span>
      )
    },
    { 
      header: 'Blood Group', 
      accessor: 'blood_group',
      render: (patient) => (
        <span className="font-medium">{patient.blood_group || '-'}</span>
      )
    },
    { 
      header: 'Status', 
      accessor: 'is_active',
      render: (patient) => (
        <DataTableHelpers.Badge 
          text={patient.is_active ? 'Active' : 'Inactive'} 
          type={patient.is_active ? 'success' : 'warning'} 
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
            type="button"
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
          <div className="flex justify-end space-x-4">
            <ModalFooter.CancelButton onClick={() => setShowModal(false)} />
            <ModalFooter.SubmitButton
              onClick={handleSubmit}
              label={modalMode === 'add' ? 'Add Patient' : 'Update Patient'}
              isLoading={loading}
              disabled={loading}
            />
          </div>
        }
        size="md"
      >
        <PatientForm
          patientData={formData}
          onChange={handleInputChange}
          errors={formErrors}
        />
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
