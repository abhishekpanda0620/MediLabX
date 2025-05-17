import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import Layout from '../../components/Layout';
import DoctorForm from '../../components/doctors/DoctorForm';
import { FormField, Alert, Modal, DataTable, DataTableHelpers, Button, Badge, ConfirmationDialog } from '../../components/common';
import ModalFooter from '../../components/common/ModalFooter';
import { getAllDoctors, createDoctor, updateDoctor, deleteDoctor } from '../../services/api';

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [currentDoctor, setCurrentDoctor] = useState({});
  const [formErrors, setFormErrors] = useState({});
  
  // Confirmation dialog state
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState(null);
  
  // Fetch all doctors on component mount
  useEffect(() => {
    fetchDoctors();
  }, []);
  
  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await getAllDoctors();
      setDoctors(response);
      setError(null);
    } catch (err) {
      setError('Failed to fetch doctors: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };
  
  const openCreateModal = () => {
    setCurrentDoctor({});
    setFormErrors({});
    setModalMode('create');
    setIsModalOpen(true);
  };
  
  const openEditModal = (doctor) => {
    setCurrentDoctor(doctor);
    setFormErrors({});
    setModalMode('edit');
    setIsModalOpen(true);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentDoctor({
      ...currentDoctor,
      [name]: value
    });
  };
  
  const handleSubmit = async () => {
    try {
      setLoading(true);
      setFormErrors({});
      
      // Validate form
      const errors = {};
      if (!currentDoctor.name) errors.name = 'Name is required';
      if (!currentDoctor.email) errors.email = 'Email is required';
      if (!currentDoctor.specialization) errors.specialization = 'Specialization is required';
      
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        setLoading(false);
        return;
      }
      
      if (modalMode === 'create') {
        // Create doctor with user account
        await createDoctor({
          ...currentDoctor,
          create_user: true
        });
        setSuccess('Doctor created successfully');
      } else {
        // Update doctor
        await updateDoctor(currentDoctor.id, currentDoctor);
        setSuccess('Doctor updated successfully');
      }
      
      // Refresh the doctor list
      await fetchDoctors();
      setIsModalOpen(false);
    } catch (err) {
      setError('Failed to save doctor: ' + (err.response?.data?.message || err.message));
      if (err.response?.data?.errors) {
        setFormErrors(err.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = (doctor) => {
    setDoctorToDelete(doctor);
    setShowConfirmation(true);
  };
  
  const confirmDelete = async () => {
    try {
      setLoading(true);
      await deleteDoctor(doctorToDelete.id);
      setSuccess('Doctor deleted successfully');
      
      // Refresh the doctor list
      await fetchDoctors();
      setShowConfirmation(false);
      setDoctorToDelete(null);
    } catch (err) {
      setError('Failed to delete doctor: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };
  
  // Filter doctors based on search query
  const filteredDoctors = doctors.filter(doctor => 
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialization?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const columns = [
    { 
      header: 'Name', 
      accessor: 'name',
      cell: (row) => <div className="font-medium">{row.name}</div>
    },
    { 
      header: 'Email', 
      accessor: 'email' 
    },
    { 
      header: 'Phone', 
      accessor: 'phone',
      cell: (row) => row.phone || '-' 
    },
    { 
      header: 'Specialization', 
      accessor: 'specialization',
      cell: (row) => <Badge color="blue">{row.specialization}</Badge>
    },
    { 
      header: 'Qualification', 
      accessor: 'qualification',
      cell: (row) => row.qualification || '-' 
    },
    { 
      header: 'Status', 
      accessor: 'is_active',
      cell: (row) => (
        <DataTableHelpers.Badge 
          text={row.is_active ? 'Active' : 'Inactive'} 
          type={row.is_active ? 'success' : 'warning'} 
        />
      )
    },
    {
      header: 'Actions',
      cell: (row) => (
        <DataTableHelpers.Actions
          actions={[
            {
              icon: <FaEdit className="h-4 w-4" />,
              type: 'primary',
              label: 'Edit doctor',
              onClick: () => openEditModal(row)
            },
            {
              icon: <FaTrash className="h-4 w-4" />,
              type: 'danger',
              label: 'Delete doctor',
              onClick: () => handleDelete(row)
            }
          ]}
          item={row}
        />
      )
    }
  ];
  
  return (
    <Layout title="Doctor Management">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Doctor Management</h1>
          <p className="text-gray-600">Manage doctor records and information</p>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}
        
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search doctors..."
              className="w-full p-3 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button 
            className="flex items-center px-5 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 shadow-md hover:shadow-lg transition-all duration-200"
            onClick={openCreateModal}
            type="button"
          >
            <FaPlus className="mr-2" />
            Add New Doctor
          </button>
        </div>
        
        {/* Doctor Data Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading && <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
          </div>}
          
          {!loading && (
            <>
              {filteredDoctors.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No doctors found. Add a new doctor to get started.
                </div>
              ) : (
                <DataTable 
                  columns={columns} 
                  data={filteredDoctors}
                  emptyMessage="No doctors found"
                  loading={loading}
                />
              )}
            </>
          )}
        </div>
      </div>
      
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'create' ? 'Add New Doctor' : 'Edit Doctor'}
        icon={modalMode === 'create' ? <FaPlus /> : <FaEdit />}
        footer={
          <div className="flex justify-end space-x-4">
            <ModalFooter.CancelButton onClick={() => setIsModalOpen(false)} />
            <ModalFooter.SubmitButton
              onClick={handleSubmit}
              label={modalMode === 'create' ? 'Create Doctor' : 'Update Doctor'}
              isLoading={loading}
              disabled={loading}
            />
          </div>
        }
      >
        <DoctorForm
          doctorData={currentDoctor}
          onChange={handleInputChange}
          errors={formErrors}
        />
      </Modal>
      
      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => {
          setShowConfirmation(false);
          setDoctorToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete ${doctorToDelete?.name}?`}
        description="This action cannot be undone and will permanently remove this doctor's record."
        type="danger"
        confirmText="Delete"
        loading={loading}
      />
    </Layout>
  );
};

export default DoctorManagement;
