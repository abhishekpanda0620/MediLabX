import React from 'react';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import ReportTemplate from './ReportTemplate';
import { FaDownload } from 'react-icons/fa';
import { useReportForm } from '../../hooks/useReportForm';
import { usePdfGeneration } from '../../hooks/usePdfGeneration';
import { generateOrUpdateReport } from '../../services/reportService';
import ReportParametersSection from './ReportParametersSection';
import ReportInterpretationSection from './ReportInterpretationSection';

const GenerateReportModal = ({ isOpen, onClose, testData, patientData, isEditing = false, viewOnly = false }) => {
  // Use custom hooks
  const {
    parameters,
    interpretation,
    setInterpretation,
    validationErrors,
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

  // Handle form submission
  const handleGenerateReport = async () => {
    try {
      // Validate the data first
      if (!validateData()) {
        setError('Please fill all required test parameters');
        return;
      }

      setLoading(true);
      setError(null);

      const result = await generateOrUpdateReport(
        testData.id,
        parameters,
        interpretation,
        isEditing ? testData.existing_report : null
      );

      if (result.success) {
        onClose();
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error("Report generation error:", err);
      setError(err.response?.data?.message || 'Failed to generate report');
    } finally {
      setLoading(false);
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
              onClick={onClose}
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
              {/* Parameters Section */}
              {parameters.length > 0 ? (
                <ReportParametersSection 
                  parameters={parameters} 
                  updateParameterValue={updateParameterValue}
                  validationErrors={validationErrors}
                  viewOnly={viewOnly}
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

              {/* PDF Preview Section */}
              {parameters.length > 0 && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-md font-medium text-gray-700">Report Preview</h3>
                    {isPdfReady && (
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
                    )}
                  </div>
                  <div className="h-[500px]">
                    <PDFViewer className="w-full h-full" onRender={() => setIsPdfReady(true)}>
                      <ReportTemplate data={reportData} />
                    </PDFViewer>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Action Buttons */}
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