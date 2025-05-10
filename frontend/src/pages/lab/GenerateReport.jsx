import React, { useState, useEffect } from 'react';
import { FaFileAlt, FaFlask } from 'react-icons/fa';
import Layout from '../../components/Layout';
import { getTestReports, createTestReport, submitTestReport, getTestBookings } from '../../services/api';
import ReportTemplate from '../../components/reports/ReportTemplate';
import { PDFViewer } from '@react-pdf/renderer';

const GenerateReport = () => {
  const [loading, setLoading] = useState(false);
  const [testBookings, setTestBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [testResults, setTestResults] = useState([]);
  const [technicianNotes, setTechnicianNotes] = useState('');
  const [error, setError] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetchTestBookings();
  }, []);

  const fetchTestBookings = async () => {
    try {
      // Change from getTestReports to getTestBookings
      const response = await getTestBookings({ status: 'processing' });
      setTestBookings(response);
    } catch (err) {
      setError('Failed to fetch test bookings');
    }
  };

  const handleTestResultChange = (parameterId, value) => {
    setTestResults(prev => {
      const existing = prev.find(r => r.parameter_id === parameterId);
      if (existing) {
        return prev.map(r => r.parameter_id === parameterId ? { ...r, value } : r);
      }
      return [...prev, { parameter_id: parameterId, value }];
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      // Create draft report
      const report = await createTestReport(selectedBooking.id);
      
      // Submit report with results
      await submitTestReport(report.id, {
        test_results: testResults,
        technician_notes: technicianNotes
      });

      // Reset form
      setSelectedBooking(null);
      setTestResults([]);
      setTechnicianNotes('');
      setShowPreview(false);
      
      // Refresh bookings
      fetchTestBookings();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const renderPreview = () => {
    if (!selectedBooking || !selectedBooking.test || !selectedBooking.patient) return null;

    const reportData = {
      patientName: selectedBooking.patient.name,
      patientId: selectedBooking.patient.id,
      testType: selectedBooking.test.name,
      testDate: new Date(selectedBooking.created_at).toLocaleDateString(),
      parameters: (selectedBooking.test.parameters || []).map(param => {
        const result = testResults.find(r => r.parameter_id === param.id);
        return {
          name: param.parameter_name,
          value: result?.value || '',
          unit: param.unit,
          range: param.normal_range,
          status: result?.value ? 'Pending Validation' : 'Not Available'
        };
      }),
      labTechnician: selectedBooking.lab_technician?.name || 'Current User',
      pathologist: 'Pending Review',
      reportDate: new Date().toLocaleDateString()
    };

    return (
      <PDFViewer style={{ width: '100%', height: '600px' }}>
        <ReportTemplate data={reportData} />
      </PDFViewer>
    );
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Generate Test Report</h1>
          <p className="text-gray-600">Create and submit test reports for processing samples</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Test Booking
              </label>
              <select
                value={selectedBooking?.id || ''}
                onChange={(e) => setSelectedBooking(testBookings.find(b => b.id === Number(e.target.value)))}
                className="w-full p-2 border rounded-lg"
                required
              >
                <option value="">Select a test booking...</option>
                {testBookings.map(booking => (
                  <option key={booking.id} value={booking.id}>
                    {booking.test.name} - {booking.patient.name} ({new Date(booking.created_at).toLocaleDateString()})
                  </option>
                ))}
              </select>
            </div>

            {selectedBooking && selectedBooking.test && selectedBooking.test.parameters && (
              <>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Test Parameters</h3>
                  {selectedBooking.test.parameters.map(param => (
                    <div key={param.id} className="grid grid-cols-2 gap-4 items-center">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          {param.parameter_name} ({param.unit})
                        </label>
                        <p className="text-sm text-gray-500">Normal Range: {param.normal_range}</p>
                      </div>
                      <input
                        type="number"
                        step="any"
                        value={testResults.find(r => r.parameter_id === param.id)?.value || ''}
                        onChange={(e) => handleTestResultChange(param.id, e.target.value)}
                        className="p-2 border rounded-lg"
                        required
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Technician Notes
                  </label>
                  <textarea
                    value={technicianNotes}
                    onChange={(e) => setTechnicianNotes(e.target.value)}
                    rows={4}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter any additional notes or observations..."
                  />
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className="mb-4 text-indigo-600 hover:text-indigo-800"
                  >
                    {showPreview ? 'Hide Preview' : 'Show Preview'}
                  </button>

                  {showPreview && renderPreview()}
                </div>
              </>
            )}

            <div className="flex justify-end space-x-4">
              <button
                type="submit"
                disabled={loading || !selectedBooking}
                className={`px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading ? 'Generating...' : 'Generate Report'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default GenerateReport;