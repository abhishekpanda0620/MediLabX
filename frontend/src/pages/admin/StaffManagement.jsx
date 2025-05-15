import React, { useState, useEffect } from 'react';
import { FaUserPlus, FaSearch, FaEdit, FaTrash, FaTimes, FaUser, FaEnvelope, FaLock, FaIdBadge } from 'react-icons/fa';
import Layout from '../../components/Layout';
import { DataTable, DataTableHelpers, Modal, ModalFooter, FormField, ConfirmationDialog, Alert } from '../../components/common';
import { getAllStaff, createStaffMember, updateStaffMember, deleteStaffMember, searchStaff, getStaffRoles } from '../../services/api';
import { useAuth } from '../../context/authContext';

const StaffManagement = () => {
  const { user } = useAuth();
  const [staffMembers, setStaffMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [currentStaff, setCurrentStaff] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [availableRoles, setAvailableRoles] = useState([]);

  // Confirmation dialog state
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState(null);

  // Fetch staff data
  const fetchStaffData = async () => {
    setLoading(true);
    try {
      const data = await getAllStaff();
      setStaffMembers(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching staff:', err);
      setError('Failed to load staff data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch available roles
  const fetchRoles = async () => {
    try {
      const roles = await getStaffRoles();
      setAvailableRoles(roles);
    } catch (err) {
      console.error('Error fetching roles:', err);
    }
  };

  // Search staff
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchStaffData();
      return;
    }

    setLoading(true);
    try {
      const results = await searchStaff({ name: searchQuery });
      setStaffMembers(results);
      setError(null);
    } catch (err) {
      console.error('Error searching staff:', err);
      setError('Failed to search. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Initialize data
  useEffect(() => {
    fetchStaffData();
    fetchRoles();
  }, []);

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
    
    if (modalMode === 'add' && !formData.password.trim()) {
      errors.password = 'Password is required';
    } else if (formData.password && formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    
    if (!formData.role) errors.role = 'Role is required';
    
    return errors;
  };

  // Open modal for adding new staff
  const handleAddStaff = () => {
    setModalMode('add');
    setFormData({
      name: '',
      email: '',
      password: '',
      role: '',
    });
    setFormErrors({});
    setShowModal(true);
  };

  // Open modal for editing staff
  const handleEditStaff = (staff) => {
    setModalMode('edit');
    setCurrentStaff(staff);
    setFormData({
      name: staff.name,
      email: staff.email,
      password: '', // Password field starts empty for edits
      role: staff.role,
    });
    setFormErrors({});
    setShowModal(true);
  };

  // Delete staff member
  const handleDelete = async (staff) => {
    setStaffToDelete(staff);
    setShowConfirmation(true);
  };

  const confirmDelete = async () => {
    if (!staffToDelete) return;
    
    setLoading(true);
    try {
      await deleteStaffMember(staffToDelete.id);
      await fetchStaffData();
      setShowConfirmation(false);
      setStaffToDelete(null);
    } catch (err) {
      console.error('Error deleting staff:', err);
      setError('Failed to delete staff member. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Submit form (add or edit staff)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setLoading(true);
    try {
      if (modalMode === 'add') {
        await createStaffMember(formData);
      } else {
        // For editing, only include password if it was changed
        const updateData = {
          name: formData.name,
          email: formData.email,
          role: formData.role,
        };
        
        if (formData.password.trim()) {
          updateData.password = formData.password;
        }
        
        await updateStaffMember(currentStaff.id, updateData);
      }
      
      await fetchStaffData();
      setShowModal(false);
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(`Failed to ${modalMode === 'add' ? 'add' : 'update'} staff member. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Staff Management</h1>
          <p className="text-gray-600">Manage laboratory staff members and their roles</p>
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
              placeholder="Search staff members..."
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
            onClick={handleAddStaff}
          >
            <FaUserPlus className="mr-2" />
            Add New Staff
          </button>
        </div>

        <DataTable
          columns={[
            { header: 'Name', accessor: 'name', className: 'font-medium text-gray-800' },
            { header: 'Email', accessor: 'email', className: 'text-gray-600' },
            { 
              header: 'Role', 
              accessor: 'role', 
              render: (staff) => (
                <DataTableHelpers.Badge 
                  text={staff.role} 
                  type="primary" 
                />
              )
            },
            { 
              header: 'Status', 
              accessor: 'status',
              render: (staff) => (
                <DataTableHelpers.Badge 
                  text={staff.status} 
                  type={staff.status === 'Active' ? 'success' : 'warning'} 
                />
              )
            },
            {
              header: 'Actions',
              render: (staff) => (
                <DataTableHelpers.Actions
                  actions={[
                    {
                      icon: <FaEdit />,
                      type: 'primary',
                      label: 'Edit staff',
                      onClick: () => handleEditStaff(staff)
                    },
                    {
                      icon: <FaTrash />,
                      type: 'danger',
                      label: 'Delete staff',
                      onClick: () => handleDelete(staff),
                      shouldShow: (staff) => user && user.id !== staff.id
                    }
                  ]}
                  item={staff}
                />
              )
            }
          ]}
          data={staffMembers}
          loading={loading}
          emptyMessage="No staff members found"
        />
      </div>

      {/* Add/Edit Staff Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalMode === 'add' ? 'Add New Staff Member' : 'Edit Staff Member'}
        icon={modalMode === 'add' ? <FaUserPlus /> : <FaEdit />}
        footer={
          <>
            <ModalFooter.CancelButton onClick={() => setShowModal(false)} />
            <ModalFooter.SubmitButton
              onClick={handleSubmit}
              label={modalMode === 'add' ? 'Add Staff' : 'Update Staff'}
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
            placeholder="Enter staff name"
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
            placeholder="Enter staff email"
            required
          />
          
          <FormField
            id="password"
            name="password"
            label={modalMode === 'add' ? 'Password' : 'New Password (leave blank to keep current)'}
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            error={formErrors.password}
            icon={<FaLock className="text-gray-400" />}
            placeholder={modalMode === 'add' ? "Enter password" : "Enter new password (optional)"}
            required={modalMode === 'add'}
          />
          
          <FormField
            id="role"
            name="role"
            label="Staff Role"
            type="select"
            value={formData.role}
            onChange={handleInputChange}
            error={formErrors.role}
            icon={<FaIdBadge className="text-gray-400" />}
            options={availableRoles}
            required
          />
        </form>
      </Modal>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => {
          setShowConfirmation(false);
          setStaffToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete ${staffToDelete?.name}?`}
        description="This action cannot be undone and will permanently remove this staff member."
        type="danger"
        confirmText="Delete"
        loading={loading}
      />
    </Layout>
  );
};

export default StaffManagement;
