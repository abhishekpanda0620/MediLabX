import React, { useState } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import ReportTemplate from './ReportTemplate';
import { FaDownload, FaEye, FaPrint } from 'react-icons/fa';
import { downloadTestReport } from '../../services/api';

const ReportViewer = ({ testBooking, report, onClose }) => {
  const [showPreview, setShowPreview] = useState(false);

  const reportData = {
    patientName: testBooking.patient.name,
    patientId: testBooking.patient.id,
    testDate: new Date(testBooking.created_at).toLocaleDateString(),
    testType: testBooking.test.name,
    parameters: report.test_results.map(result => ({
      name: result.parameter_name,
      value: result.value,
      unit: result.unit,
      range: result.normal_range,
      status: getResultStatus(result)
    })),
    labTechnician: testBooking.lab_technician?.name,
    pathologist: testBooking.pathologist?.name,
    reportDate: new Date().toLocaleDateString()
  };

  const getResultStatus = (result) => {
    const value = parseFloat(result.value);
    if (result.critical_low && value < parseFloat(result.critical_low)) return 'Critical Low';
    if (result.critical_high && value > parseFloat(result.critical_high)) return 'Critical High';
    const [min, max] = result.normal_range.split('-').map(parseFloat);
    if (value < min) return 'Low';
    if (value > max) return 'High';
    return 'Normal';
  };

  const handleDownload = async () => {
    try {
      const blob = await downloadTestReport(report.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `test-report-${testBooking.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading report:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-4">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Test Report</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
        </div>

        <div className="space-y-6">
          {showPreview ? (
            <PDFViewer style={{ width: '100%', height: '70vh' }}>
              <ReportTemplate data={reportData} />
            </PDFViewer>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-700">Patient Information</h3>
                  <p className="text-gray-600">{reportData.patientName}</p>
                  <p className="text-gray-600">ID: {reportData.patientId}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700">Test Information</h3>
                  <p className="text-gray-600">{reportData.testType}</p>
                  <p className="text-gray-600">Date: {reportData.testDate}</p>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-700 mb-2">Test Results</h3>
                <div className="bg-gray-50 rounded-lg divide-y">
                  {reportData.parameters.map((param, index) => (
                    <div key={index} className="p-3 flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-800">{param.name}</p>
                        <p className="text-sm text-gray-600">Normal Range: {param.range}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-800">{param.value} {param.unit}</p>
                        <p className={`text-sm ${
                          param.status === 'Normal' ? 'text-green-600' :
                          param.status.includes('Critical') ? 'text-red-600' : 'text-yellow-600'
                        }`}>
                          {param.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-700">Lab Technician</h3>
                  <p className="text-gray-600">{reportData.labTechnician}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700">Pathologist</h3>
                  <p className="text-gray-600">{reportData.pathologist}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center px-4 py-2 text-indigo-600 hover:text-indigo-800"
            >
              <FaEye className="mr-2" />
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              <FaPrint className="mr-2" />
              Print
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <FaDownload className="mr-2" />
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportViewer;