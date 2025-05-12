import { useState } from 'react';

/**
 * Custom hook to handle PDF generation and preparation
 */
export const usePdfGeneration = () => {
  const [isPdfReady, setIsPdfReady] = useState(false);
  
  const prepareReportData = (parameters, interpretation, patientData, testData, viewOnly) => {
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
  
  return {
    isPdfReady,
    setIsPdfReady,
    prepareReportData
  };
};
