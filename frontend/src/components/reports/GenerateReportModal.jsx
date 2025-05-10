import React, { useState } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import { createTestReport, submitTestReport } from '../../services/api';
import ReportTemplate from './ReportTemplate';

const GenerateReportModal = ({ isOpen, onClose, testData, patientData }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [interpretation, setInterpretation] = useState('');

  const handleGenerateReport = async () => {
    try {
      setLoading(true);
      setError(null);

      // First create a draft report
      const report = await createTestReport(testData.id);
      
      // Then submit the report with results
      await submitTestReport(report.id, {
        test_results: testData.parameters.map(param => ({
          parameter_id: param.id,
          value: param.value,
          unit: param.unit
        })),
        technician_notes: interpretation
      });

      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Generate Report</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Interpretation
            </label>
            <textarea
              value={interpretation}
              onChange={(e) => setInterpretation(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              rows={4}
              placeholder="Enter your interpretation of the test results..."
            />
          </div>

          <div className="mb-6 h-[500px]">
            <PDFViewer className="w-full h-full">
              <ReportTemplate
                data={{
                  patientName: patientData.name,
                  patientId: patientData.id,
                  testType: testData.test_type,
                  testDate: new Date().toLocaleDateString(),
                  parameters: testData.parameters.map(param => ({
                    name: param.parameter_name,
                    value: param.value,
                    range: param.normal_range,
                    unit: param.unit
                  })),
                  interpretation: interpretation,
                  labTechnician: testData.lab_technician?.name || 'Not assigned',
                  pathologist: testData.pathologist?.name || 'Not assigned'
                }}
              />
            </PDFViewer>
          </div>

          {error && (
            <div className="mb-4 text-red-600 text-sm">{error}</div>
          )}

          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerateReport}
              disabled={loading}
              className={`px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Generating...' : 'Generate Report'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateReportModal;