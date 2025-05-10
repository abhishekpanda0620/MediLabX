import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
    borderBottom: 1,
    paddingBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 5,
    color: '#666',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    backgroundColor: '#f3f4f6',
    padding: 5,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    width: '50%',
    fontWeight: 'bold',
    fontSize: 10,
  },
  value: {
    width: '50%',
    fontSize: 10,
  },
  table: {
    display: 'table',
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tableHeader: {
    backgroundColor: '#f3f4f6',
    fontWeight: 'bold',
  },
  tableCell: {
    flex: 1,
    padding: 5,
    fontSize: 10,
    textAlign: 'left',
  },
  footer: {
    marginTop: 20,
    fontSize: 10,
    textAlign: 'center',
    color: '#666',
  },
});

const ReportGenerator = ({ testData, patientData, testResults }) => {
  return (
    <PDFViewer style={{ width: '100%', height: '600px' }}>
      <Document>
        <Page size="A4" style={styles.page}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>MediLabX Diagnostic Center</Text>
            <Text style={styles.subtitle}>
              123 Medical Avenue, Healthcity, HC 12345 | Phone: (123) 456-7890 | Email: info@medilabx.com
            </Text>
          </View>

          {/* Patient Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Patient Information</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Name:</Text>
              <Text style={styles.value}>{patientData.name}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Patient ID:</Text>
              <Text style={styles.value}>{patientData.id}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Gender:</Text>
              <Text style={styles.value}>{patientData.gender || 'Not specified'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>DOB:</Text>
              <Text style={styles.value}>{patientData.dob || 'Not specified'}</Text>
            </View>
          </View>

          {/* Test Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Test Information</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Test Name:</Text>
              <Text style={styles.value}>{testData.name}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Test Code:</Text>
              <Text style={styles.value}>{testData.code}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Sample Collection:</Text>
              <Text style={styles.value}>{testData.sampleCollection || 'Not available'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Report Date:</Text>
              <Text style={styles.value}>{new Date().toLocaleDateString()}</Text>
            </View>
          </View>

          {/* Test Results */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Test Results</Text>
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={styles.tableCell}>Parameter</Text>
                <Text style={styles.tableCell}>Result</Text>
                <Text style={styles.tableCell}>Unit</Text>
                <Text style={styles.tableCell}>Reference Range</Text>
                <Text style={styles.tableCell}>Flag</Text>
              </View>
              {testResults.map((result, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{result.parameter}</Text>
                  <Text style={styles.tableCell}>{result.value}</Text>
                  <Text style={styles.tableCell}>{result.unit}</Text>
                  <Text style={styles.tableCell}>{result.range}</Text>
                  <Text style={styles.tableCell}>{result.flag || 'Normal'}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text>This report is electronically verified and valid without signature.</Text>
            <Text>Disclaimer: Results should be interpreted in the context of clinical findings.</Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default ReportGenerator;