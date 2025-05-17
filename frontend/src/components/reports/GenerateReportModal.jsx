import React, { useState, useEffect } from 'react';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import ReportTemplate from './ReportTemplate';
import { FaDownload, FaUserMd, FaFlask, FaQrcode } from 'react-icons/fa';
import { useReportForm } from '../../hooks/useReportForm';
import { usePdfGeneration } from '../../hooks/usePdfGeneration';
import { generateOrUpdateReport } from '../../services/reportService';
import { createTestReport, submitTestReport, getUserData } from '../../services/api';
import ReportParametersSection from './ReportParametersSection';
import ReportInterpretationSection from './ReportInterpretationSection';
import ErrorBoundary from '../common/ErrorBoundary';
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

  const {
    isPdfReady,
    setIsPdfReady,
    prepareReportData
  } = usePdfGeneration();

  // Add state for current user
  const [user, setUser] = useState(null);
  
  // Add state for critical values
  const [isCritical, setIsCritical] = useState(false);
  
  // Add state for digital signature
  const [useDigitalSignature, setUseDigitalSignature] = useState(false);

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
    // Reset PDF state before closing
    setIsPdfReady(false);
    
    // Call the original onClose function
    if (onClose && typeof onClose === 'function') {
      onClose();
    }
  };

  if (!isOpen) return null;

  // Prepare data for PDF rendering
  const reportData = prepareReportData(parameters, interpretation, patientData, testData, viewOnly);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
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
              {/* Information about enhanced reference values */}
              <div className="mb-4 p-3 bg-blue-50 rounded-md border border-blue-100 text-sm text-blue-700 flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-medium">Enhanced Test Parameter Information</p>
                  <p className="text-xs mt-1">
                    This report now includes comprehensive biological reference values, investigation details, 
                    and parameter-specific methodologies. Hover over parameters for additional context and click 
                    on parameter names to see detailed reference information.
                  </p>
                </div>
              </div>

              {/* Authentication section keeps the same */}
              {!viewOnly && (
                <div className="mb-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                  <h3 className="text-md font-medium text-indigo-800 mb-3">Report Authentication</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Lab Technician Report
                      </label>
                      <div className="p-2 border border-gray-300 rounded bg-white h-[38px]">
                        <span className="text-sm text-gray-700">
                          {user?.name || 'Loading...'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Digital Signature
                      </label>
                      <div className="flex items-center p-2 border border-gray-300 rounded bg-white h-[38px]">
                        <input 
                          type="checkbox" 
                          id="use-digital-signature"
                          checked={useDigitalSignature}
                          onChange={(e) => setUseDigitalSignature(e.target.checked)}
                          className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        />
                        <label htmlFor="use-digital-signature" className="ml-2 text-sm text-gray-700">
                          Apply Digital Signature
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

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

              {/* Enhanced Sample Information and Investigation Details Section */}
              <div className="mb-6">
                <h3 className="text-md font-medium text-gray-700 mb-2 border-b pb-2">Sample & Investigation Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                  <div className="flex items-start">
                    <FaFlask className="text-gray-400 mt-0.5 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Sample Type</p>
                      <p className="text-sm text-gray-600">
                        {testData?.test?.specimen_requirements || 'Not specified'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="text-gray-400 mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Collection Date & Time</p>
                      <p className="text-sm text-gray-600">
                        {testData?.sample_collection_time ? 
                          new Date(testData.sample_collection_time).toLocaleString('en-IN') : 'Not collected yet'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="text-gray-400 mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Lab Reference No.</p>
                      <p className="text-sm text-gray-600">
                        LRN-{new Date().getFullYear()}-{testData?.id.toString().padStart(6, '0')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <FaQrcode className="text-gray-400 mt-0.5 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Report Verification</p>
                      <p className="text-sm text-gray-600">
                        QR Code Authentication
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Enhanced Investigation Details */}
                <div className="mt-4 bg-gray-50 p-3 rounded-md">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Investigation Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                    <div>
                      <p className="text-xs font-medium text-gray-700">Test Name</p>
                      <p className="text-sm text-gray-800">{testData?.test?.name || 'Unknown Test'}</p>
                    </div>
                    {testData?.test?.code && (
                      <div>
                        <p className="text-xs font-medium text-gray-700">Test Code</p>
                        <p className="text-sm text-gray-800">{testData.test.code}</p>
                      </div>
                    )}
                    {testData?.test?.category && (
                      <div>
                        <p className="text-xs font-medium text-gray-700">Category</p>
                        <p className="text-sm text-gray-800">{testData.test.category}</p>
                      </div>
                    )}
                    {testData?.test?.method && (
                      <div>
                        <p className="text-xs font-medium text-gray-700">Method</p>
                        <p className="text-sm text-gray-800">{testData.test.method}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Add expanded descriptions for test methods */}
                  <div className="mt-3 border-t pt-2 border-gray-200">
                    <p className="text-xs font-medium text-gray-700 mb-1">Clinical Significance</p>
                    <p className="text-sm text-gray-600">
                      {testData?.test?.description || 'This test provides essential diagnostic information used to assess health status, diagnose conditions, and guide treatment decisions.'}
                    </p>
                  </div>
                  
                  {testData?.test?.preparation_instructions && (
                    <div className="mt-2">
                      <p className="text-xs font-medium text-gray-700">Patient Preparation</p>
                      <p className="text-sm text-gray-800">{testData.test.preparation_instructions}</p>
                    </div>
                  )}
                  
                  <div className="mt-3">
                    <p className="text-xs font-medium text-gray-700">Biological Reference Value Notes</p>
                    <p className="text-sm text-gray-600">
                      Biological reference values are derived from studies of healthy individuals and may vary based on method, equipment, 
                      and demographic factors. Values outside reference intervals are not necessarily abnormal and should be 
                      interpreted within clinical context.
                    </p>
                  </div>
                </div>
              </div>

              {/* PDF Preview Section */}
              {parameters.length > 0 && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-md font-medium text-gray-700">Report Preview</h3>
                    {isPdfReady && reportData && (
                      <ErrorBoundary
                        fallback={
                          <button
                            className="flex items-center px-3 py-1 bg-gray-100 text-gray-500 rounded-md cursor-not-allowed"
                            disabled
                          >
                            <FaDownload className="mr-2" /> PDF Generation Failed
                          </button>
                        }
                      >
                        <PDFDownloadLink
                          document={<ReportTemplate data={reportData} />}
                          fileName={`${patientData?.name || 'patient'}_${testData?.test?.name || 'test'}_${viewOnly ? '' : 'draft_'}report.pdf`}
                          className="flex items-center px-3 py-1 bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100 transition-colors"
                        >
                        {({ loading }) => 
                          loading ? 'Preparing PDF...' : (
                            <>
                              <FaDownload className="mr-2" /> Download {viewOnly ? '' : 'Draft '}PDF
                            </>
                          )
                        }
                        </PDFDownloadLink>
                      </ErrorBoundary>
                    )}
                  </div>
                  <div className="h-[500px]">
                    {reportData && Object.keys(reportData).length > 0 ? (
                      <ErrorBoundary
                        fallback={
                          <div className="flex items-center justify-center h-full bg-red-50 rounded-md border border-red-200">
                            <div className="text-center p-6">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>
                              <h3 className="text-lg font-medium text-gray-900 mb-2">PDF Preview Error</h3>
                              <p className="text-sm text-gray-500 mb-4">
                                There was an error displaying the PDF preview. This may happen when parameters have incomplete data.
                              </p>
                              <p className="text-xs text-gray-500">
                                You can continue entering values and try again, or save the report without previewing.
                              </p>
                            </div>
                          </div>
                        }
                      >
                        <PDFViewer className="w-full h-full" onRender={() => setIsPdfReady(true)}>
                          <ReportTemplate data={reportData} />
                        </PDFViewer>
                      </ErrorBoundary>
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gray-50 rounded-md border border-gray-200">
                        <div className="text-center p-6">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">PDF Preview Not Available</h3>
                          <p className="text-sm text-gray-500">
                            Please enter valid values for at least one parameter to generate a PDF preview.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

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