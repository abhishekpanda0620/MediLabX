import React, { useState, useEffect } from 'react';
import { Modal, Button, Spin } from 'antd';
import ReportGenerator from './ReportGenerator';
import { getTestReports, downloadTestReport } from '../../services/api';

const ReportModal = ({ isOpen, onClose, testBookingData }) => {
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    if (isOpen && testBookingData) {
      loadReportData();
    }
  }, [isOpen, testBookingData]);

  const loadReportData = async () => {
    try {
      setLoading(true);
      const data = await getTestReports({ test_booking_id: testBookingData.id });
      setReportData(data[0]); // Get the latest report
    } catch (error) {
      console.error('Error loading report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const blob = await downloadTestReport(reportData.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `test-report-${testBookingData.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading report:', error);
    }
  };

  return (
    <Modal
      title="Test Report"
      open={isOpen}
      onCancel={onClose}
      width={1000}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
        <Button key="download" type="primary" onClick={handleDownload}>
          Download PDF
        </Button>
      ]}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large" />
        </div>
      ) : (
        reportData && (
          <ReportGenerator
            testData={reportData.testBooking.test}
            patientData={reportData.testBooking.patient}
            testResults={reportData.test_results}
          />
        )
      )}
    </Modal>
  );
};

export default ReportModal;