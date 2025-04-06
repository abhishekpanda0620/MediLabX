import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { formatDate } from '../../utils/formatters';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica'
  },
  header: {
    marginBottom: 20,
    borderBottom: '1pt solid #666'
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 10
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10
  },
  section: {
    marginBottom: 10
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5
  },
  grid: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 10
  },
  col: {
    flex: 1,
    paddingRight: 10
  },
  row: {
    marginBottom: 5
  },
  label: {
    fontSize: 10,
    color: '#666'
  },
  value: {
    fontSize: 12
  },
  table: {
    display: 'table',
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#666',
    marginVertical: 10
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#666'
  },
  tableHeader: {
    backgroundColor: '#f3f4f6'
  },
  tableCell: {
    flex: 1,
    padding: 5,
    fontSize: 10
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30
  },
  signatures: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 50
  },
  signatureBox: {
    width: 200
  },
  signatureLine: {
    borderTop: '1pt solid #666',
    marginTop: 40,
    paddingTop: 5
  }
});

const ReportTemplate = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>MediLabX</Text>
        <Text style={styles.subtitle}>Laboratory Test Report</Text>
      </View>

      <View style={styles.grid}>
        <View style={styles.col}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Patient Information</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Name</Text>
              <Text style={styles.value}>{data.patientName}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Patient ID</Text>
              <Text style={styles.value}>{data.patientId}</Text>
            </View>
          </View>
        </View>

        <View style={styles.col}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Test Information</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Test Type</Text>
              <Text style={styles.value}>{data.testType}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Test Date</Text>
              <Text style={styles.value}>{data.testDate}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Test Results</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCell}>Parameter</Text>
            <Text style={styles.tableCell}>Result</Text>
            <Text style={styles.tableCell}>Unit</Text>
            <Text style={styles.tableCell}>Normal Range</Text>
            <Text style={styles.tableCell}>Status</Text>
          </View>
          {data.parameters.map((param, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{param.name}</Text>
              <Text style={styles.tableCell}>{param.value}</Text>
              <Text style={styles.tableCell}>{param.unit}</Text>
              <Text style={styles.tableCell}>{param.range}</Text>
              <Text style={styles.tableCell}>{param.status}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.signatures}>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLine}>{data.labTechnician}</Text>
            <Text style={styles.label}>Lab Technician</Text>
          </View>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLine}>{data.pathologist}</Text>
            <Text style={styles.label}>Pathologist</Text>
          </View>
        </View>
        <Text style={[styles.label, { marginTop: 20, textAlign: 'center' }]}>
          Report generated on {data.reportDate}
        </Text>
      </View>
    </Page>
  </Document>
);

export default ReportTemplate;