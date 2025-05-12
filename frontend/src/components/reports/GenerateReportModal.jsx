import React, { useState, useEffect, useRef } from 'react';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { createTestReport, submitTestReport, getTestWithParameters } from '../../services/api';
import ReportTemplate from './ReportTemplate';
import { FaDownload } from 'react-icons/fa';

const GenerateReportModal = ({ isOpen, onClose, testData, patientData, isEditing = false, viewOnly = false }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [interpretation, setInterpretation] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [parameters, setParameters] = useState([]);
  const [loadingParameters, setLoadingParameters] = useState(false);
  const [isPdfReady, setIsPdfReady] = useState(false);
  const [reportStatus, setReportStatus] = useState(''); // Add missing state variable

  useEffect(() => {
    // If testData is provided but parameters are missing, fetch them
    const fetchParameters = async () => {
      if (testData && testData.test && testData.test.id && (!testData.test.parameters || !testData.test.parameters.length)) {
        try {
          setLoadingParameters(true);
          const completeTest = await getTestWithParameters(testData.test.id);
          if (completeTest && completeTest.parameters) {
            // Create parameters with empty values for input
            const paramsWithValues = completeTest.parameters.map(param => ({
              ...param,
              value: ''
            }));
            setParameters(paramsWithValues);
          } else {
            setError("Could not load test parameters");
          }
        } catch (err) {
          console.error("Error loading parameters:", err);
          setError("Failed to load test parameters: " + (err.message || "Unknown error"));
        } finally {
          setLoadingParameters(false);
        }
      } else if (testData && testData.parameters) {
        // Use the parameters provided directly
        setParameters(testData.parameters);
      }
    };

    fetchParameters();
    
    // Initialize with existing interpretation if editing or viewing
    if ((isEditing || viewOnly) && testData.existing_report) {
      if (testData.existing_report.technician_notes) {
        setInterpretation(testData.existing_report.technician_notes);
      }
      
      // Set report status for view mode
      if (viewOnly) {
        const statusMap = {
          'draft': 'DRAFT',
          'submitted': 'SUBMITTED',
          'reviewed': 'REVIEWED',
          'validated': 'VALIDATED',
          'rejected': 'REJECTED'
        };
        
        const reportStatus = statusMap[testData.existing_report.status] || 'UNKNOWN';
        setReportStatus(reportStatus);
      }
    }
  }, [testData, isEditing, viewOnly]);

  const updateParameterValue = (index, value) => {
    setParameters(prevParams => {
      const newParams = [...prevParams];
      newParams[index] = {
        ...newParams[index],
        value: value
      };
      return newParams;
    });
  };

  const validateData = () => {
    const errors = {};
    let isValid = true;

    // Check if all parameters have values
    parameters.forEach((param, index) => {
      if (!param.value || param.value.trim() === '') {
        errors[`parameter_${index}`] = `${param.parameter_name} is required`;
        isValid = false;
      }
    });

    setValidationErrors(errors);
    return isValid;
  };

  const handleGenerateReport = async () => {
    try {
      // Validate the data first
      if (!validateData()) {
        setError('Please fill all required test parameters');
        return;
      }

      setLoading(true);
      setError(null);

      if (isEditing && testData.existing_report) {
        // Update the existing report
        await submitTestReport(testData.existing_report.id, {
          test_results: parameters.map(param => ({
            parameter_id: param.id,
            value: param.value,
            unit: param.unit
          })),
          technician_notes: interpretation
        });
      } else {
        // First create a draft report
        const report = await createTestReport(testData.id);
        
        // Then submit the report with results
        await submitTestReport(report.id, {
          test_results: parameters.map(param => ({
            parameter_id: param.id,
            value: param.value,
            unit: param.unit
          })),
          technician_notes: interpretation
        });
      }

      onClose();
    } catch (err) {
      console.error("Report generation error:", err);
      setError(err.response?.data?.message || 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const prepareReportData = () => {
    return {
      patientName: patientData?.name || 'Unknown Patient',
      patientId: patientData?.id || '',
      testType: testData?.test?.name || 'Unknown Test',
      testDate: testData?.existing_report?.created_at 
        ? new Date(testData.existing_report.created_at).toLocaleDateString()
        : new Date().toLocaleDateString(),
      parameters: parameters.map(param => ({
        name: param.parameter_name,
        value: param.value || '',
        range: param.normal_range,
        unit: param.unit
      })),
      interpretation: interpretation,
      labTechnician: testData?.lab_technician?.name || 'Not assigned',
      pathologist: testData?.pathologist?.name || 'Not assigned',
      status: viewOnly 
        ? (testData?.existing_report?.status || 'UNKNOWN').toUpperCase()
        : 'DRAFT - NOT VALIDATED'
    };
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {viewOnly ? 'View Report' : isEditing ? 'Edit Report' : 'Generate Report'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>

          {/* Parameter validation warnings - only show when not in view mode */}
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

          {error && (
            <div className="mb-4 text-red-600 text-sm">{error}</div>
          )}

          {loadingParameters ? (
            <div className="flex justify-center p-4">
              <p>Loading test parameters...</p>
            </div>
          ) : (
            <>
              {/* Test parameters input fields */}
              {parameters.length > 0 ? (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Test Parameters</h3>
                  <div className="space-y-3">
                    {parameters.map((param, index) => (
                      <div key={param.id || index} className="grid grid-cols-3 gap-2 items-center">
                        <div className="text-gray-700">
                          {param.parameter_name}
                        </div>
                        <div>
                          {viewOnly ? (
                            <div className="px-3 py-2 border rounded-lg bg-gray-50">
                              {param.value || ''}
                            </div>
                          ) : (
                            <input
                              type="text"
                              value={param.value || ''}
                              onChange={(e) => updateParameterValue(index, e.target.value)}
                              className={`w-full px-3 py-2 border rounded-lg ${
                                validationErrors[`parameter_${index}`] ? 'border-red-500' : ''
                              }`}
                              placeholder="Enter value"
                            />
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {param.unit} {param.normal_range ? `(${param.normal_range})` : ''}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
                  No test parameters found for this test. Cannot generate report.
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Interpretation
                </label>
                {viewOnly ? (
                  <div className="w-full px-3 py-2 border rounded-lg bg-gray-50 min-h-[100px]">
                    {interpretation}
                  </div>
                ) : (
                  <textarea
                    value={interpretation}
                    onChange={(e) => setInterpretation(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                    rows={4}
                    placeholder="Enter your interpretation of the test results..."
                  />
                )}
              </div>

              {/* Show report status in view mode */}
              {viewOnly && testData?.existing_report && (
                <div className="mb-6">
                  <h3 className="text-md font-medium text-gray-700 mb-2">Report Details</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-500">Status:</span>
                        <div className="font-medium">
                          {testData.existing_report.status.toUpperCase()}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Created:</span>
                        <div className="font-medium">
                          {new Date(testData.existing_report.created_at).toLocaleString()}
                        </div>
                      </div>
                      {testData.existing_report.submitted_at && (
                        <div>
                          <span className="text-sm text-gray-500">Submitted:</span>
                          <div className="font-medium">
                            {new Date(testData.existing_report.submitted_at).toLocaleString()}
                          </div>
                        </div>
                      )}
                      {testData.existing_report.reviewed_at && (
                        <div>
                          <span className="text-sm text-gray-500">Reviewed:</span>
                          <div className="font-medium">
                            {new Date(testData.existing_report.reviewed_at).toLocaleString()}
                          </div>
                        </div>
                      )}
                      {testData.existing_report.validated_at && (
                        <div>
                          <span className="text-sm text-gray-500">Validated:</span>
                          <div className="font-medium">
                            {new Date(testData.existing_report.validated_at).toLocaleString()}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {parameters.length > 0 && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-md font-medium text-gray-700">Report Preview</h3>
                    {isPdfReady && (
                      <PDFDownloadLink
                        document={<ReportTemplate data={prepareReportData()} />}
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
                    )}
                  </div>
                  <div className="h-[500px]">
                    <PDFViewer className="w-full h-full" onRender={() => setIsPdfReady(true)}>
                      <ReportTemplate data={prepareReportData()} />
                    </PDFViewer>
                  </div>
                </div>
              )}
            </>
          )}

          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
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