import { useState, useEffect } from 'react';
import { getTestWithParameters } from '../services/api';

/**
 * Custom hook to manage report form state and loading
 */
export const useReportForm = (testData, isEditing, viewOnly) => {
  const [parameters, setParameters] = useState([]);
  const [interpretation, setInterpretation] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingParameters, setLoadingParameters] = useState(false);
  const [error, setError] = useState(null);
  const [reportStatus, setReportStatus] = useState('');

  useEffect(() => {
    const fetchParameters = async () => {
      if (testData && testData.test && testData.test.id && (!testData.test.parameters || !testData.test.parameters.length)) {
        try {
          setLoadingParameters(true);
          const completeTest = await getTestWithParameters(testData.test.id);
          if (completeTest && completeTest.parameters) {
            // If editing an existing report, merge with existing values
            if (isEditing && testData.existing_report && testData.existing_report.test_results) {
              const paramsWithValues = completeTest.parameters.map(param => {
                // Find matching test result from existing report
                const existingResult = testData.existing_report.test_results.find(
                  result => result.parameter_id === param.id
                );
                
                return {
                  ...param,
                  value: existingResult ? existingResult.value : ''
                };
              });
              setParameters(paramsWithValues);
            } else {
              // New report, initialize with empty values
              const paramsWithValues = completeTest.parameters.map(param => ({
                ...param,
                value: ''
              }));
              setParameters(paramsWithValues);
            }
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
    // Update parameter value immediately without timeout
    setParameters(prevParams => {
      const newParams = [...prevParams];
      if (newParams[index]) {
        newParams[index] = {
          ...newParams[index],
          value: value
        };
      }
      return newParams;
    });
  };

  const validateData = () => {
    const errors = {};
    let isValid = true;

    parameters.forEach((param, index) => {
      if (!param.value || param.value.trim() === '') {
        errors[`parameters.${index}.value`] = `${param.name} is required`;
        isValid = false;
      }
    });

    setValidationErrors(errors);
    return isValid;
  };

  return {
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
  };
};
