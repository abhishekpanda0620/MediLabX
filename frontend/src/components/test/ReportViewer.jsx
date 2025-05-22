import React from 'react';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import TestReport from './TestReport';

const ReportViewer = ({ test, results, patient, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[90vw] h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Test Report Preview</h2>
          <div className="flex gap-2">
            <PDFDownloadLink
              document={<TestReport test={test} results={results} patient={patient} />}
              fileName={`lab-report-${patient && patient.name ? String(patient.name).replace(/[^A-Za-z0-9_-]+/g, '-') : 'patient'}-${(() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}_${String(d.getHours()).padStart(2,'0')}-${String(d.getMinutes()).padStart(2,'0')}-${String(d.getSeconds()).padStart(2,'0')}`; })()}.pdf`}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              {({ loading }) =>
                loading ? 'Generating PDF...' : 'Download PDF'
              }
            </PDFDownloadLink>
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
        
        <div className="flex-1 w-full">
          <PDFViewer style={{ width: '100%', height: '100%' }}>
            <TestReport test={test} results={results} patient={patient} />
          </PDFViewer>
        </div>
      </div>
    </div>
  );
};

export default ReportViewer;