import { useState } from 'react';

/**
 * Custom hook to handle PDF generation and preparation
 */
export const usePdfGeneration = () => {
  const [isPdfReady, setIsPdfReady] = useState(false);
  
  const prepareReportData = (parameters, interpretation, patientData, testData, viewOnly) => {
    // Safety check - if parameters is not an array or empty, return null
    if (!parameters || !Array.isArray(parameters) || parameters.length === 0) {
      return null;
    }
    
    // Check if any parameter has a value that is not an empty string
    const hasValidParameterValues = parameters.some(param => 
      param.value !== undefined && param.value !== null && param.value.toString().trim() !== ''
    );
    
    // If no parameters have valid values, return null to prevent PDF generation
    if (!hasValidParameterValues) {
      return null;
    }
    
    // Format reference ranges in a more detailed manner
    const enhancedParameters = parameters.map(param => {
      const isQualitative = param.is_qualitative || 
        (!param.min_range && !param.max_range && 
         (param.normal_range?.toLowerCase().includes('negative') || 
          param.normal_range?.toLowerCase().includes('positive')));
      
      return {
        name: param.parameter_name || param.name,
        value: param.value || '',
        range: param.normal_range,
        unit: param.unit,
        min_range: param.min_range || '',
        max_range: param.max_range || '',
        critical_low: param.critical_low || '',
        critical_high: param.critical_high || '',
        method: param.method || '',
        instrument: param.instrument || '',
        interpretation_guide: param.interpretation_guide || '',
        description: param.description || '',
        reference_ranges: param.reference_ranges || null,
        age_specific: param.age_specific || false,
        gender_specific: param.gender_specific || false,
        sub_name: param.sub_name || '',
        notes: param.notes || '',
        is_qualitative: isQualitative,
        clinical_significance: param.description || 
          `${param.name || param.parameter_name} is an important marker for ${
            (param.name || '').toLowerCase().includes('blood') || (param.unit || '').toLowerCase().includes('g/dl') ? 'assessing blood health' : 
            (param.name || '').toLowerCase().includes('liver') || (param.name || '').toLowerCase().includes('alt') || (param.name || '').toLowerCase().includes('ast') ? 'evaluating liver function' :
            (param.name || '').toLowerCase().includes('kidney') || (param.name || '').toLowerCase().includes('creatinine') ? 'monitoring kidney function' :
            (param.name || '').toLowerCase().includes('sugar') || (param.name || '').toLowerCase().includes('glucose') ? 'monitoring metabolic health' :
            (param.name || '').toLowerCase().includes('thyroid') || (param.name || '').toLowerCase().includes('tsh') ? 'assessing thyroid function' :
            'evaluating overall health status'
          }`
      };
    });

    return {
      patientName: patientData?.name || 'Unknown Patient',
      patientId: patientData?.id || '',
      patientAge: patientData?.age || 'N/A',
      patientGender: patientData?.gender || 'N/A',
      doctorName: testData?.doctor?.name || 'N/A',
      testId: testData?.id || '',
      testType: testData?.test?.name || 'Unknown Test',
      testDescription: testData?.test?.description || '',
      testMethod: testData?.test?.method || 'Standard Laboratory Method',
      specimenType: testData?.test?.specimen_requirements || 'Not specified',
      testDate: testData?.existing_report?.created_at 
        ? new Date(testData.existing_report.created_at).toLocaleDateString()
        : new Date().toLocaleDateString(),
      parameters: enhancedParameters,
      interpretation: interpretation,
      labTechnician: testData?.lab_technician?.name || 'Lab Technician',
      labTechnicianId: testData?.lab_technician?.id || '',
      status: viewOnly 
        ? (testData?.existing_report?.status || 'UNKNOWN').toUpperCase()
        : 'DRAFT - PENDING VALIDATION',
      isCritical: enhancedParameters.some(param => 
        param.value && 
        (
          (param.critical_low && parseFloat(param.value) < parseFloat(param.critical_low)) || 
          (param.critical_high && parseFloat(param.value) > parseFloat(param.critical_high))
        )
      )
    };
  };
  
  return {
    isPdfReady,
    setIsPdfReady,
    prepareReportData
  };
};
