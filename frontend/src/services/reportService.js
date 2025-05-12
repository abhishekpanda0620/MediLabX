import { createTestReport, submitTestReport } from './api';

/**
 * Generate or update a report
 */
export const generateOrUpdateReport = async (testId, parameters, interpretation, existingReport = null) => {
  try {
    if (existingReport) {
      // Update existing report
      await submitTestReport(existingReport.id, {
        test_results: parameters.map(param => ({
          parameter_id: param.id,
          value: param.value,
          unit: param.unit
        })),
        technician_notes: interpretation
      });
      return { success: true };
    } else {
      // First create a draft report
      const report = await createTestReport(testId);
      
      // Then submit the report with results
      await submitTestReport(report.id, {
        test_results: parameters.map(param => ({
          parameter_id: param.id,
          value: param.value,
          unit: param.unit
        })),
        technician_notes: interpretation
      });
      return { success: true, reportId: report.id };
    }
  } catch (err) {
    console.error("Report submission error:", err);
    return { 
      success: false, 
      error: err.response?.data?.message || 'Failed to submit report'
    };
  }
};
