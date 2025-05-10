import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
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
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    margin: '10 0',
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
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
  parameterTable: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 5,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    marginBottom: 5,
    paddingVertical: 3,
  },
  col1: { width: '30%' },
  col2: { width: '20%' },
  col3: { width: '25%' },
  col4: { width: '25%' },
});

const TestReport = ({ test, results, patient }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>MediLabX Test Report</Text>
        <Text style={styles.subtitle}>Report Generated: {new Date().toLocaleDateString()}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Patient Information</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Patient Name:</Text>
          <Text style={styles.value}>{patient?.name || 'N/A'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Patient ID:</Text>
          <Text style={styles.value}>{patient?.id || 'N/A'}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Test Information</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Test Name:</Text>
          <Text style={styles.value}>{test.name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Test Code:</Text>
          <Text style={styles.value}>{test.code}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Test Results</Text>
        <View style={styles.parameterTable}>
          <View style={styles.tableHeader}>
            <Text style={styles.col1}>Parameter</Text>
            <Text style={styles.col2}>Result</Text>
            <Text style={styles.col3}>Normal Range</Text>
            <Text style={styles.col4}>Status</Text>
          </View>
          {test.parameters.map((parameter, index) => {
            const result = results?.find(r => r.parameter_id === parameter.id);
            return (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.col1}>{parameter.parameter_name}</Text>
                <Text style={styles.col2}>{result?.value || 'Pending'}</Text>
                <Text style={styles.col3}>{parameter.normal_range}</Text>
                <Text style={styles.col4}>
                  {result ? (
                    result.value >= parameter.critical_low && 
                    result.value <= parameter.critical_high ? 'Normal' : 'Abnormal'
                  ) : 'N/A'}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </Page>
  </Document>
);

export default TestReport;