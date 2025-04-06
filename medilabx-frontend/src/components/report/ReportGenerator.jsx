import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  header: {
    marginBottom: 20,
    borderBottom: 1,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    width: 150,
    fontWeight: 'bold',
  },
  value: {
    flex: 1,
  },
  results: {
    marginTop: 20,
  }
});

const ReportGenerator = ({ testData, patientData, testResults }) => {
  return (
    <PDFViewer style={{ width: '100%', height: '600px' }}>
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.title}>Medical Test Report</Text>
          </View>

          <View style={styles.section}>
            <Text style={{ fontSize: 16, marginBottom: 10 }}>Patient Information</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Name:</Text>
              <Text style={styles.value}>{patientData.name}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Patient ID:</Text>
              <Text style={styles.value}>{patientData.id}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Date:</Text>
              <Text style={styles.value}>{new Date().toLocaleDateString()}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={{ fontSize: 16, marginBottom: 10 }}>Test Information</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Test Name:</Text>
              <Text style={styles.value}>{testData.name}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Test Type:</Text>
              <Text style={styles.value}>{testData.type}</Text>
            </View>
          </View>

          <View style={[styles.section, styles.results]}>
            <Text style={{ fontSize: 16, marginBottom: 10 }}>Test Results</Text>
            {testResults.map((result, index) => (
              <View key={index} style={styles.row}>
                <Text style={styles.label}>{result.parameter}:</Text>
                <Text style={styles.value}>{result.value} {result.unit}</Text>
              </View>
            ))}
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default ReportGenerator;