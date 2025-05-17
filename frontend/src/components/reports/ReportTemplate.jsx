import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

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
 
  signatureLine: {
    borderTop: '1pt solid #666',
    marginTop: 40,
    paddingTop: 5
  },
  watermark: {
    position: 'absolute',
    top: '40%',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 60,
    color: 'rgba(211, 211, 211, 0.4)',
    transform: 'rotate(-45deg)',
    zIndex: -1,
  },
  // Add these new styles for Indian lab reports
  highValue: {
    color: '#d32f2f',
    fontWeight: 'bold'
  },
  lowValue: {
    color: '#1976d2',
    fontWeight: 'bold'
  },
  normalValue: {
    color: '#388e3c'
  },
  signatureBox: {
    marginTop: 15,
    padding: 10,
    borderTop: '1pt solid #ddd',
    width: '40%',
    textAlign: 'center'
  },
  signatureText: {
    fontSize: 10,
    marginBottom: 30
  },
  signatureName: {
    fontSize: 12,
    fontWeight: 'bold'
  },
  signatureRole: {
    fontSize: 9
  },
  signatureRegNo: {
    fontSize: 8
  },
  disclaimer: {
    fontSize: 8,
    marginTop: 10,
    textAlign: 'center',
    fontStyle: 'italic'
  },
  description: {
    fontSize: 10,
    marginTop: 3,
    color: '#333'
  },
  interpretationText: {
    fontSize: 10,
    marginTop: 5,
    padding: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 3,
    borderLeft: '3pt solid #4b5563',
    fontStyle: 'italic'
  },
  // New Indian lab report specific styles
  labHeader: {
    paddingBottom: 10,
    marginBottom: 15,
    borderBottom: '1pt solid #666'
  },
  labName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  accreditation: {
    fontSize: 9,
    textAlign: 'center',
    marginBottom: 5,
    color: '#444'
  },
  address: {
    fontSize: 8,
    textAlign: 'center',
    color: '#666'
  },
  reportId: {
    fontSize: 8,
    textAlign: 'right',
    marginTop: 5,
    color: '#666'
  },
  criticalAlert: {
    backgroundColor: '#FFEBEE',
    color: '#D32F2F',
    padding: 5,
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    border: '1pt solid #EF9A9A'
  },
  criticalInfo: {
    marginTop: 10,
    padding: 5,
    backgroundColor: '#FFF8E1',
    border: '1pt solid #FFECB3'
  },
  criticalInfoTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#E65100'
  },
  criticalNote: {
    fontSize: 8,
    fontStyle: 'italic',
    marginTop: 5,
    color: '#E65100'
  },
  valueHigh: {
    color: '#FF9800',
    fontWeight: 'bold'
  },
  valueLow: {
    color: '#1976d2',
    fontWeight: 'bold'
  },
  valueCritical: {
    color: '#D32F2F',
    fontWeight: 'bold',
    textDecoration: 'underline'
  },
  valueNormal: {
    color: '#388e3c'
  },
});

const ReportTemplate = ({ data }) => {
  // Add defensive checks to prevent errors
  if (!data || typeof data !== 'object') {
    // Return a minimal valid document if data is missing or invalid
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Error: Invalid Report Data</Text>
            <Text>Unable to generate report due to missing or invalid data.</Text>
          </View>
        </Page>
      </Document>
    );
  }
  
  const isDraft = data.status && data.status.includes('DRAFT');
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {isDraft && (
          <View style={styles.watermark}>
            <Text>DRAFT</Text>
          </View>
        )}
        
         {/* Add NABL accreditation logo and info */}
      <View style={styles.labHeader}>
        <Text style={styles.labName}>MEDILABX DIAGNOSTIC LABORATORY</Text>
        <Text style={styles.accreditation}>NABL Accredited (ISO 15189:2012) • Reg No: XYZ123456</Text>
        <Text style={styles.address}>123 Medical Avenue, New Delhi, India 110001 • Phone: +91 11 2345 6789</Text>
        <Text style={styles.reportId}>Report ID: REP-{data.testId}-{new Date().toISOString().slice(0,10)}</Text>
      </View>

        {data.isCritical && (
          <View style={styles.criticalAlert}>
            <Text>** CRITICAL VALUE ALERT - IMMEDIATE CLINICAL ATTENTION REQUIRED **</Text>
          </View>
        )}

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
              <View style={styles.row}>
          <Text style={styles.label}>Age/Gender:</Text>
          <Text style={styles.value}>{data.patientAge}/{data.patientGender}</Text>
        </View>
          <View style={styles.row}>
          <Text style={styles.label}>Referred By:</Text>
          <Text style={styles.value}>Dr. {data.doctorName}</Text>
        </View>
            </View>
          </View>

      {/* Sample Details */}
          <View style={styles.col}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sample Details</Text>
              <View style={styles.row}>
                <Text style={styles.label}>Specimen Type</Text>
                <Text style={styles.value}>{data.specimenType}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Collection Date</Text>
                <Text style={styles.value}>{data.testDate}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Test Name</Text>
                <Text style={styles.value}>{data.testType}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Report Status</Text>
                <Text style={styles.value}>{data.status}</Text>
              </View>
            </View>
          </View>
        </View>

        {data.testDescription && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Test Information</Text>
            <Text style={styles.description}>{data.testDescription}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Test Results</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>Parameter</Text>
              <Text style={styles.tableCell}>Result</Text>
              <Text style={styles.tableCell}>Unit</Text>
              <Text style={styles.tableCell}>Biological Reference Interval</Text>
              <Text style={styles.tableCell}>Status</Text>
            </View>
            {Array.isArray(data.parameters) ? data.parameters.map((param, index) => {
              const isCriticalHigh = param.critical_high && parseFloat(param.value) > parseFloat(param.critical_high);
              const isCriticalLow = param.critical_low && parseFloat(param.value) < parseFloat(param.critical_low);
              const isHigh = parseFloat(param.value) > parseFloat(param.max_range) && !isCriticalHigh;
              const isLow = parseFloat(param.value) < parseFloat(param.min_range) && !isCriticalLow;
              const statusStyle = isCriticalHigh || isCriticalLow ? styles.valueCritical : 
                                 isHigh ? styles.valueHigh : 
                                 isLow ? styles.valueLow : 
                                 styles.valueNormal;
              
              return (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{param.name}</Text>
                  <Text style={[styles.tableCell, statusStyle]}>
                    {param.value}
                  </Text>
                  <Text style={styles.tableCell}>{param.unit}</Text>
                  <Text style={styles.tableCell}>{param.range}</Text>
                  <Text style={[styles.tableCell, statusStyle]}>
                    {isCriticalLow ? 'CRITICAL LOW' :
                     isHigh ? 'HIGH' : 
                     isLow ? 'LOW' : 
                     'NORMAL'}
                  </Text>
                </View>
              );
            }) : (
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, { textAlign: 'center', padding: 10, color: '#666' }]}>
                  No parameters available
                </Text>
              </View>
            )}
          </View>
        </View>



        {/* Interpretation Notes */}
        {data.interpretation && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Clinical Interpretation</Text>
            <Text style={styles.interpretationText}>{data.interpretation}</Text>
          </View>
        )}

        <View style={styles.footer}>
          <View style={styles.signatures}>
            <View style={styles.signatureBox}>
              <Text style={styles.signatureText}>Medical Lab Technician</Text>
              <Text style={styles.signatureName}>{data.labTechnician || 'N/A'}</Text>
              <Text style={styles.signatureRole}>Lab Technician</Text>
              <Text style={styles.signatureRegNo}>Employee ID: {data.labTechnicianId || 'N/A'}</Text>
            </View>
            <View style={styles.signatureBox}>
              <Text style={styles.signatureText}>Quality Assurance</Text>
              <Text style={styles.signatureName}>MediLabX QA</Text>
              <Text style={styles.signatureRole}>Automated Validation</Text>
              <Text style={styles.signatureRegNo}>QC Ref: {new Date().toISOString().slice(0,10)}</Text>
            </View>
          </View>
          
          <Text style={styles.disclaimer}>
            * This report is electronically verified and does not require physical signature.
          </Text>
          <Text style={styles.disclaimer}>
            ** Results should be correlated clinically. Laboratory investigations are subject to analytical variations.
          </Text>
          <Text style={styles.disclaimer}>
            *** Report includes parameters with reference ranges as per Indian population standards.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default ReportTemplate;