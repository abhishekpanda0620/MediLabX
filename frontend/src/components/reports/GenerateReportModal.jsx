import React, { useState, useEffect } from 'react';
import { FaUserMd, FaFlask, FaQrcode } from 'react-icons/fa';
import { useReportForm } from '../../hooks/useReportForm';
import { createTestReport, submitTestReport, getUserData } from '../../services/api';
import ReportParametersSection from './ReportParametersSection';
import ReportInterpretationSection from './ReportInterpretationSection';
import { toast } from 'react-toastify';

const GenerateReportModal = ({ isOpen, onClose, testData, patientData, isEditing = false, viewOnly = false }) => {
  // Use custom hooks
  const {
    parameters,
    interpretation,
    setInterpretation,
    validationErrors,
    setValidationErrors,
    loading,
    setLoading,
    loadingParameters,
    error,
    setError,
    reportStatus,
    updateParameterValue,
    validateData
  } = useReportForm(testData, isEditing, viewOnly);

  // Add state for current user
  const [user, setUser] = useState(null);
  
  // Add state for critical values
  const [isCritical, setIsCritical] = useState(false);
  
  // Fetch current user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserData();
        setUser(userData);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to fetch user data");
      }
    };
    
    fetchUserData();
  }, []);

  // Handle form submission
  const handleGenerateReport = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Validate the form data
      const isValid = validateData();
      if (!isValid) {
        setLoading(false);
        return;
      }
      
      if (!user) {
        setError("User data not available. Please refresh the page and try again.");
        setLoading(false);
        return;
      }
      
      // Prepare report data
      const reportData = {
        test_booking_id: testData.id,
        lab_technician_id: user.id,
        status: 'draft',
        test_results: parameters.map(param => ({
          parameter_id: param.id,
          value: param.value,
          unit: param.unit
        })),
        technician_notes: interpretation,
        is_critical: isCritical
      };
      
      let response;
      
      if (isEditing && testData.existing_report) {
        // Update existing report
        response = await submitTestReport(testData.existing_report.id, reportData);
      } else {
        // Create new report
        const newReport = await createTestReport(testData.id);
        // Then submit the test results
        response = await submitTestReport(newReport.id, reportData);
      }
      
      // Show success message
      toast.success(`Report ${isEditing ? 'updated' : 'generated'} successfully!`);
      
      // Close the modal and refresh the samples list
      handleClose();
      
    } catch (err) {
      console.error("Error generating report:", err);
      setError(`Failed to ${isEditing ? 'update' : 'generate'} report: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Add a function to safely close the modal
  const handleClose = () => {
    // Call the original onClose function
    if (onClose && typeof onClose === 'function') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {viewOnly ? 'View Report' : isEditing ? 'Edit Report' : 'Generate Report'}
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>

          {/* Validation Errors */}
          {!viewOnly && Object.keys(validationErrors).length > 0 && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-300 rounded-md">
              <p className="text-yellow-700 font-medium">Please correct the following errors:</p>
              <ul className="list-disc pl-5">
                {Object.values(validationErrors).map((error, index) => (
                  <li key={index} className="text-yellow-700">{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 text-red-600 text-sm">{error}</div>
          )}

          {loadingParameters ? (
            <div className="flex justify-center p-4">
              <p>Loading test parameters...</p>
            </div>
          ) : (
            <>



              {/* Only show essential info at the top */}
              <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
               
                <div className="text-sm flex flex-row-reverse flex-grow text-gray-600">Report Date: {new Date().toLocaleDateString()}</div>
              </div>

              {/* Accordion for full report details, matching PDF layout */}
              <div className="mb-6">
                <details className="border rounded-md">
                  <summary className="cursor-pointer px-4 py-2 font-medium bg-gray-50 hover:bg-gray-100 rounded-t-md">Show Full Report Details</summary>
                  <div className="px-4 py-3 space-y-4">
                    {/* Patient Information */}
                    <div>
                      <div className="font-semibold text-gray-700 mb-1">Patient Information</div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div><span className="font-medium">Name:</span> {patientData?.name || 'N/A'}</div>
                        <div><span className="font-medium">Patient ID:</span> {patientData?.id || 'N/A'}</div>
                        <div><span className="font-medium">Gender:</span> {patientData?.gender || 'Not specified'}</div>
                        <div><span className="font-medium">DOB:</span> {patientData?.date_of_birth ? new Date(patientData.date_of_birth).toLocaleDateString() : 'Not specified'}</div>
                      </div>
                    </div>
                    {/* Test Information */}
                    <div>
                      <div className="font-semibold text-gray-700 mb-1 mt-2">Test Information</div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div><span className="font-medium">Test Name:</span> {testData?.test?.name || testData?.name || 'N/A'}</div>
                        <div><span className="font-medium">Test Code:</span> {testData?.test?.code || testData?.code || 'N/A'}</div>
                        <div><span className="font-medium">Sample Collection:</span> {testData?.sample_collection_time ? new Date(testData.sample_collection_time).toLocaleString() : 'Not available'}</div>
                        <div><span className="font-medium">Referred By:</span> {testData?.doctor?.name || 'N/A'}</div>
                        <div><span className="font-medium">Report Status:</span> {testData?.status ? testData.status.toUpperCase() : 'N/A'}</div>
                      </div>
                    </div>
                  </div>
                </details>
              </div>

              {/* Parameters Section with Enhanced Reference Values */}
              {parameters.length > 0 ? (
                <ReportParametersSection 
                  parameters={parameters} 
                  updateParameterValue={updateParameterValue}
                  validationErrors={validationErrors}
                  viewOnly={viewOnly}
                  showDetailedBioReference={true}
                  testDetails={testData?.test || {}}
                />
              ) : (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
                  No test parameters found for this test. Cannot generate report.
                </div>
              )}

              {/* Interpretation Section */}
              <ReportInterpretationSection
                interpretation={interpretation}
                setInterpretation={setInterpretation}
                viewOnly={viewOnly}
                isCritical={isCritical}
                setIsCritical={setIsCritical}
                showDetailedBioReference={true}
              />

              {/* Show report details in view mode */}
              {viewOnly && testData?.existing_report && (
                <div className="mb-6">
                  <h3 className="text-md font-medium text-gray-700 mb-2">Report Details</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Report metadata details */}
                      {/* ...existing code... */}
                    </div>
                  </div>
                </div>
              )}

       

              {/* PDF Preview Section has been removed */}

              {/* Lab Accreditation Details */}
              <div className="mb-6 mt-8 border-t pt-4 text-xs text-gray-500">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-medium">MediLabX Pathology Lab</div>
                  <div>NABL Accredited (ISO 15189:2012)</div>
                </div>
                <div className="flex justify-between">
                  <div>License No: XYZ123456</div>
                  <div>Report ID: REP-{testData?.id}-{new Date().toISOString().slice(0,10)}</div>
                </div>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              {viewOnly ? 'Close' : 'Cancel'}
            </button>
            
            {/* Don't show the generate/update button in view-only mode */}
            {!viewOnly && (
              <button
                onClick={handleGenerateReport}
                disabled={loading || loadingParameters || parameters.length === 0}
                className={`px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 ${
                  (loading || loadingParameters || parameters.length === 0) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Saving...' : isEditing ? 'Update Report' : 'Generate Report'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateReportModal;