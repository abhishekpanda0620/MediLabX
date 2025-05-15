import React, { useState, useEffect } from 'react';
import { FaUserPlus, FaSearch, FaEdit, FaTrash, FaTimes, FaUser, FaEnvelope, FaLock, FaIdBadge } from 'react-icons/fa';
import Layout from '../../components/Layout';
import TableWrapper from '../../components/common/TableWrapper';
import { getAllStaff, createStaffMember, updateStaffMember, deleteStaffMember, searchStaff, getStaffRoles } from '../../services/api';
import { useAuth } from '../../context/authContext';

const StaffManagement = () => {
  // For transitions/animations
  const modalTransitionClasses = "transition-all duration-300 ease-in-out";
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
          <div className="mb-4 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-sm flex items-center">
            <FaTimes className="text-red-500 mr-3" />
            <div>
              <p className="font-medium">{error}</p>
              <p className="text-sm text-red-600 mt-0.5">Please try again or contact system administrator.</p>
            </div>
          </div>
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

        <TableWrapper>
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex justify-center items-center space-x-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-500"></div>
                      <span className="text-gray-500">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : staffMembers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No staff members found
                  </td>
                </tr>
              ) : (
                staffMembers.map((staff) => (
                  <tr 
                    key={staff.id} 
                    className="hover:bg-gray-50 transition-colors duration-150 ease-in-out"
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">{staff.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{staff.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap capitalize">
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                        {staff.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${
                        staff.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {staff.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center space-x-3">
                        <button 
                          className="p-1.5 bg-indigo-50 rounded-full text-indigo-600 hover:bg-indigo-100 hover:text-indigo-800 transition-colors duration-150"
                          onClick={() => handleEditStaff(staff)}
                          title="Edit staff"
                        >
                          <FaEdit />
                        </button>
                        {/* Don't allow deleting yourself */}
                        {user && user.id !== staff.id && (
                          <button 
                            className="p-1.5 bg-red-50 rounded-full text-red-600 hover:bg-red-100 hover:text-red-800 transition-colors duration-150"
                            onClick={() => handleDelete(staff)}
                            title="Delete staff"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </TableWrapper>
      </div>

      {/* Add/Edit Staff Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div 
            className={`relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 transform ${modalTransitionClasses} ${showModal ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-indigo-700 to-indigo-500 rounded-t-xl p-5 text-white">
              <h3 className="text-xl font-bold flex items-center">
                {modalMode === 'add' ? (
                  <>
                    <FaUserPlus className="mr-3" /> 
                    Add New Staff Member
                  </>
                ) : (
                  <>
                    <FaEdit className="mr-3" /> 
                    Edit Staff Member
                  </>
                )}
              </h3>
              <button 
                className="absolute top-4 right-4 text-white hover:text-gray-200 focus:outline-none transition-colors duration-200"
                onClick={() => setShowModal(false)}
                aria-label="Close"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="px-6 py-5">
                {/* Name Field */}
                <div className="mb-5">
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="name">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-gray-400" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`pl-10 w-full px-4 py-3 rounded-lg border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} 
                        focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200`}
                      placeholder="Enter staff name"
                    />
                  </div>
                  {formErrors.name && (
                    <p className="mt-1 text-red-500 text-sm">{formErrors.name}</p>
                  )}
                </div>
                
                {/* Email Field */}
                <div className="mb-5">
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`pl-10 w-full px-4 py-3 rounded-lg border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} 
                        focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200`}
                      placeholder="Enter staff email"
                    />
                  </div>
                  {formErrors.email && (
                    <p className="mt-1 text-red-500 text-sm">{formErrors.email}</p>
                  )}
                </div>
                
                {/* Password Field */}
                <div className="mb-5">
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
                    {modalMode === 'add' ? 'Password' : 'New Password (leave blank to keep current)'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`pl-10 w-full px-4 py-3 rounded-lg border ${formErrors.password ? 'border-red-500' : 'border-gray-300'} 
                        focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200`}
                      placeholder={modalMode === 'add' ? "Enter password" : "Enter new password (optional)"}
                    />
                  </div>
                  {formErrors.password && (
                    <p className="mt-1 text-red-500 text-sm">{formErrors.password}</p>
                  )}
                </div>
                
                {/* Role Field */}
                <div className="mb-3">
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="role">
                    Staff Role
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaIdBadge className="text-gray-400" />
                    </div>
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className={`pl-10 w-full px-4 py-3 rounded-lg border ${formErrors.role ? 'border-red-500' : 'border-gray-300'} 
                        focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 bg-white`}
                    >
                      <option value="">Select a role</option>
                      {availableRoles.map((role) => (
                        <option key={role} value={role} className="capitalize">
                          {role.replace('_', ' ')}
                        </option>
                      ))}
                    </select>
                  </div>
                  {formErrors.role && (
                    <p className="mt-1 text-red-500 text-sm">{formErrors.role}</p>
                  )}
                </div>
              </div>
              
              {/* Modal Footer */}
              <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex justify-end space-x-3">
                <button
                  type="button"
                  className="py-2.5 px-5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-200"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-md hover:shadow-lg transition-all duration-200"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    modalMode === 'add' ? 'Add Staff' : 'Update Staff'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className={`relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 transform ${modalTransitionClasses} ${showConfirmation ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <div className="bg-red-500 text-white px-6 py-4 rounded-t-xl">
              <h3 className="text-xl font-bold flex items-center">
                <FaTrash className="mr-3" /> Confirm Deletion
              </h3>
            </div>
            <div className="p-6">
              <div className="bg-red-50 rounded-lg p-4 mb-5 border-l-4 border-red-500">
                <p className="text-red-800">
                  Are you sure you want to delete <span className="font-semibold">{staffToDelete?.name}</span>?
                </p>
                <p className="text-sm text-red-700 mt-1">
                  This action cannot be undone and will permanently remove this staff member.
                </p>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="py-2.5 px-5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-200"
                  onClick={() => {
                    setShowConfirmation(false);
                    setStaffToDelete(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="py-2.5 px-5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-medium hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-md hover:shadow-lg transition-all duration-200"
                  onClick={confirmDelete}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Deleting...
                    </span>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default StaffManagement;
