import { useState, useCallback } from 'react';
import { 
  getTestBookings, 
  markSampleCollected, 
  markProcessing, 
  markReviewed, 
  markCompleted, 
  cancelTestBooking,
  getTestWithParameters,
  getTestReports
} from '../services/api';

/**
 * Custom hook for managing lab samples
 */
export const useSampleManagement = () => {
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch samples by status
  const fetchSamples = useCallback(async (status) => {
    try {
      setLoading(true);
      const response = await getTestBookings({ status });
      setSamples(response);
      setError(null);
    } catch (err) {
      setError(`Failed to fetch samples in ${status} status`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle status transitions
  const updateSampleStatus = useCallback(async (sampleId, action) => {
    try {
      setLoading(true);
      
      switch(action) {
        case 'collect':
          await markSampleCollected(sampleId);
          break;
        case 'process':
          await markProcessing(sampleId);
          break;
        case 'review':
          await markReviewed(sampleId);
          break;
        case 'complete':
          await markCompleted(sampleId);
          break;
        default:
          throw new Error(`Unknown action: ${action}`);
      }
      
      setError(null);
      return true;
    } catch (err) {
      setError(`Failed to update sample status: ${err.message || 'Unknown error'}`);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle sample cancellation
  const cancelSample = useCallback(async (sampleId, notes = '') => {
    try {
      setLoading(true);
      await cancelTestBooking(sampleId, notes);
      setError(null);
      return true;
    } catch (err) {
      setError(`Failed to cancel sample: ${err.message || 'Unknown error'}`);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Prepare sample for report generation
  const prepareSampleForReport = useCallback(async (sample) => {
    try {
      setLoading(true);
      
      // Check for existing reports
      let existingReport = null;
      const reports = await getTestReports({ test_booking_id: sample.id });
      
      if (reports && reports.length > 0) {
        existingReport = reports[0];
      }
      
      // Get complete test data with parameters
      const completeTest = await getTestWithParameters(sample.test.id);
      
      if (!completeTest || !completeTest.parameters || completeTest.parameters.length === 0) {
        setError("No parameters found for this test");
        return null;
      }
      
      // Create a properly formatted test data object
      const formattedTestData = {
        id: sample.id,
        test: {
          ...completeTest,
          name: completeTest.name || sample.test?.name,
        },
        parameters: completeTest.parameters.map(param => {
          // Pre-fill with existing values if available
          if (existingReport && existingReport.test_results) {
            const existingResult = existingReport.test_results.find(
              r => r.parameter_id === param.id
            );
            
            if (existingResult) {
              return {
                ...param,
                value: existingResult.value
              };
            }
          }
          return param;
        }),
        patient: sample.patient,
        lab_technician: sample.lab_technician,
        existing_report: existingReport 
      };
      
      setError(null);
      return { 
        formattedData: formattedTestData, 
        isEditing: existingReport !== null
      };
    } catch (err) {
      setError(`Failed to prepare report: ${err.message || 'Unknown error'}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    samples,
    loading,
    error,
    setError,
    fetchSamples,
    updateSampleStatus,
    cancelSample,
    prepareSampleForReport
  };
};
