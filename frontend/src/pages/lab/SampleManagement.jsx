import React, { useState, useEffect } from 'react';
import { FaSearch, FaCheck, FaFlask, FaClipboardCheck, FaFileAlt, FaTimesCircle, FaPlus } from 'react-icons/fa';
import { MdOutlineDone } from 'react-icons/md';
import Layout from '../../components/Layout';
import { 
  getTestBookings, 
  markSampleCollected, 
  markProcessing, 
  markReviewed, 
  markCompleted, 
  cancelTestBooking,
  getAllTests,
  getAllPatients,
  getAllDoctors,
  bookTest
} from '../../services/api';

const SampleManagement = () => {
  // State for samples in different statuses
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('booked');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelNotes, setCancelNotes] = useState('');
  
  // State for booking modal
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [tests, setTests] = useState([]);
  const [bookingFormData, setBookingFormData] = useState({
    patient_id: '',
    doctor_id: '',
    test_id: '',
    notes: ''
  });
  const [bookingErrors, setBookingErrors] = useState({});

  // Tabs for the different statuses
  const tabs = [
    { id: 'booked', label: 'Booked', color: 'yellow' },
    { id: 'sample_collected', label: 'Collected', color: 'green' },
    { id: 'processing', label: 'Processing', color: 'blue' },
    { id: 'reviewed', label: 'Reviewed', color: 'purple' },
    { id: 'completed', label: 'Completed', color: 'gray' }
  ];

  useEffect(() => {
    fetchSamples(activeTab);
  }, [activeTab]);

  const fetchSamples = async (status) => {
    try {
      setLoading(true);
      // Use the status directly as the parameter name
      const response = await getTestBookings({ status: status });
      setSamples(response);
      setError(null);
    } catch (err) {
      setError(`Failed to fetch samples in ${status} status`);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkSampleCollected = async (sampleId) => {
    try {
      setLoading(true);
      await markSampleCollected(sampleId);
      fetchSamples(activeTab);
      setError(null);
    } catch (err) {
      setError('Failed to mark sample as collected: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleMarkProcessing = async (sampleId) => {
    try {
      setLoading(true);
      await markProcessing(sampleId);
      fetchSamples(activeTab);
      setError(null);
    } catch (err) {
      setError('Failed to mark sample as processing: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleMarkReviewed = async (sampleId) => {
    try {
      setLoading(true);
      await markReviewed(sampleId);
      fetchSamples(activeTab);
      setError(null);
    } catch (err) {
      setError('Failed to mark sample as reviewed: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleMarkCompleted = async (sampleId) => {
    try {
      setLoading(true);
      await markCompleted(sampleId);
      fetchSamples(activeTab);
      setError(null);
    } catch (err) {
      setError('Failed to mark sample as completed: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleShowCancelModal = (booking) => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
  };

  const handleCancel = async () => {
    try {
      setLoading(true);
      await cancelTestBooking(selectedBooking.id, cancelNotes);
      setShowCancelModal(false);
      setCancelNotes('');
      setSelectedBooking(null);
      fetchSamples(activeTab);
      setError(null);
    } catch (err) {
      setError('Failed to cancel test booking: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleOpenBookingModal = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch data needed for booking form
      const [patientsResponse, doctorsResponse, testsResponse] = await Promise.all([
        getAllPatients(),
        getAllDoctors(),
        getAllTests()
      ]);

      setPatients(patientsResponse);
      setDoctors(doctorsResponse);
      setTests(testsResponse);
      setShowBookingModal(true);
    } catch (err) {
      setError('Failed to load booking form data: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleBookingInputChange = (e) => {
    const { name, value } = e.target;
    setBookingFormData({
      ...bookingFormData,
      [name]: value
    });
  };

  const handleBookTest = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setBookingErrors({});
      
      // Validate form
      const errors = {};
      if (!bookingFormData.patient_id) errors.patient_id = 'Patient is required';
      if (!bookingFormData.doctor_id) errors.doctor_id = 'Doctor is required';
      if (!bookingFormData.test_id) errors.test_id = 'Test is required';
      
      if (Object.keys(errors).length > 0) {
        setBookingErrors(errors);
        setLoading(false);
        return;
      }
      
      // Submit booking
      await bookTest(bookingFormData);
      
      // Reset form and close modal
      setBookingFormData({
        patient_id: '',
        doctor_id: '',
        test_id: '',
        notes: ''
      });
      setShowBookingModal(false);
      
      // Refresh the samples list
      fetchSamples('booked');
      
      setError(null);
    } catch (err) {
      setError('Failed to book test: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const filteredSamples = samples.filter(sample => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      (sample.id && sample.id.toString().includes(query)) ||
      (sample.patient?.name && sample.patient.name.toLowerCase().includes(query)) ||
      (sample.test?.name && sample.test.name.toLowerCase().includes(query))
    );
  });

  // Get the appropriate action button based on the current status
  const getActionButton = (sample) => {
    switch (activeTab) {
      case 'booked':
        return (
          <button
            onClick={() => handleMarkSampleCollected(sample.id)}
            className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 flex items-center"
            disabled={loading}
          >
            <FaCheck className="mr-1" /> Mark Collected
          </button>
        );
      case 'sample_collected':
        return (
          <button
            onClick={() => handleMarkProcessing(sample.id)}
            className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 flex items-center"
            disabled={loading}
          >
            <FaFlask className="mr-1" /> Start Processing
          </button>
        );
      case 'processing':
        return (
          <button
            onClick={() => handleMarkReviewed(sample.id)}
            className="bg-purple-600 text-white px-3 py-1 rounded-md hover:bg-purple-700 flex items-center"
            disabled={loading}
          >
            <FaClipboardCheck className="mr-1" /> Mark Reviewed
          </button>
        );
      case 'reviewed':
        return (
          <button
            onClick={() => handleMarkCompleted(sample.id)}
            className="bg-gray-600 text-white px-3 py-1 rounded-md hover:bg-gray-700 flex items-center"
            disabled={loading}
          >
            <MdOutlineDone className="mr-1" /> Mark Completed
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Sample Management</h1>
          <div className="flex items-center mt-4 sm:mt-0 gap-4">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search samples..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <button
              onClick={handleOpenBookingModal}
              className="bg-indigo-600 text-white px-3 py-2 rounded-md hover:bg-indigo-700 flex items-center whitespace-nowrap"
            >
              <FaPlus className="mr-2" /> Book New Sample
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 border border-red-400 rounded">
            {error}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mb-6 border-b overflow-x-auto">
          <div className="flex whitespace-nowrap">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 ${activeTab === tab.id ? `border-b-2 border-${tab.color}-600 text-${tab.color}-600` : 'text-gray-600'}`}
              >
                {tab.label} Samples
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Test</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSamples.map(sample => (
                  <tr key={sample.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">#{sample.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{sample.patient?.name || 'Unknown Patient'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{sample.test?.name || 'Unknown Test'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(sample.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm flex gap-2">
                      {getActionButton(sample)}
                      
                      {activeTab !== 'completed' && (
                        <button
                          onClick={() => handleShowCancelModal(sample)}
                          className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 flex items-center"
                          disabled={loading}
                        >
                          <FaTimesCircle className="mr-1" /> Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredSamples.length === 0 && !loading && (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      No {activeTab.replace('_', ' ')} samples found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {loading && (
            <div className="p-4 text-center">
              <div className="text-gray-500">Loading samples...</div>
            </div>
          )}
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Cancel Test Booking</h3>
            <p className="mb-4">
              Are you sure you want to cancel this test booking for {selectedBooking?.patient?.name}?
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for cancellation (optional)
              </label>
              <textarea
                value={cancelNotes}
                onChange={(e) => setCancelNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg"
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelNotes('');
                  setSelectedBooking(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
                onClick={handleCancel}
                disabled={loading}
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Book New Sample Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-lg font-medium mb-4">Book New Test Sample</h3>
            <form onSubmit={handleBookTest}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Patient*
                </label>
                <select
                  name="patient_id"
                  value={bookingFormData.patient_id}
                  onChange={handleBookingInputChange}
                  className={`w-full px-3 py-2 border rounded-lg ${bookingErrors.patient_id ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select Patient</option>
                  {patients.map(patient => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name}
                    </option>
                  ))}
                </select>
                {bookingErrors.patient_id && (
                  <p className="mt-1 text-sm text-red-500">{bookingErrors.patient_id}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Test*
                </label>
                <select
                  name="test_id"
                  value={bookingFormData.test_id}
                  onChange={handleBookingInputChange}
                  className={`w-full px-3 py-2 border rounded-lg ${bookingErrors.test_id ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select Test</option>
                  {tests.map(test => (
                    <option key={test.id} value={test.id}>
                      {test.name}
                    </option>
                  ))}
                </select>
                {bookingErrors.test_id && (
                  <p className="mt-1 text-sm text-red-500">{bookingErrors.test_id}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Doctor*
                </label>
                <select
                  name="doctor_id"
                  value={bookingFormData.doctor_id}
                  onChange={handleBookingInputChange}
                  className={`w-full px-3 py-2 border rounded-lg ${bookingErrors.doctor_id ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select Doctor</option>
                  {doctors.map(doctor => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name}
                    </option>
                  ))}
                </select>
                {bookingErrors.doctor_id && (
                  <p className="mt-1 text-sm text-red-500">{bookingErrors.doctor_id}</p>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (optional)
                </label>
                <textarea
                  name="notes"
                  value={bookingFormData.notes}
                  onChange={handleBookingInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg"
                  onClick={() => {
                    setShowBookingModal(false);
                    setBookingFormData({
                      patient_id: '',
                      doctor_id: '',
                      test_id: '',
                      notes: ''
                    });
                    setBookingErrors({});
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
                  disabled={loading}
                >
                  Book Test
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default SampleManagement;
