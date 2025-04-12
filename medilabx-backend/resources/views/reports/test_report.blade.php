<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Test Report</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 1px solid #ddd;
            margin-bottom: 20px;
        }
        .header img {
            max-width: 200px;
            height: auto;
        }
        .header h1 {
            color: #2563eb;
            font-size: 24px;
            margin: 10px 0;
        }
        .lab-info {
            font-size: 14px;
            margin-bottom: 10px;
        }
        .section {
            margin-bottom: 20px;
        }
        .section-title {
            font-weight: bold;
            font-size: 16px;
            background-color: #f3f4f6;
            padding: 5px;
            margin-bottom: 10px;
        }
        .patient-info, .test-info {
            display: flex;
            flex-wrap: wrap;
        }
        .info-item {
            width: 50%;
            padding: 5px 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        table, th, td {
            border: 1px solid #ddd;
        }
        th, td {
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f3f4f6;
        }
        .abnormal {
            color: #dc2626;
            font-weight: bold;
        }
        .footer {
            margin-top: 30px;
            border-top: 1px solid #ddd;
            padding-top: 20px;
            font-size: 12px;
        }
        .signatures {
            display: flex;
            justify-content: space-between;
            margin-top: 50px;
        }
        .signature {
            width: 45%;
            border-top: 1px solid #333;
            padding-top: 5px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>MediLabX Diagnostic Center</h1>
        <div class="lab-info">
            123 Medical Avenue, Healthcity, HC 12345<br>
            Phone: (123) 456-7890 | Email: info@medilabx.com<br>
            CLIA ID: 12D3456789 | Lab Director: Dr. Medical Director
        </div>
    </div>

    <div class="section">
        <div class="section-title">Patient Information</div>
        <div class="patient-info">
            <div class="info-item"><strong>Patient Name:</strong> {{ $report->testBooking->patient->name }}</div>
            <div class="info-item"><strong>Patient ID:</strong> {{ $report->testBooking->patient->id }}</div>
            <div class="info-item"><strong>Gender:</strong> {{ $report->testBooking->patient->gender ?? 'Not specified' }}</div>
            <div class="info-item"><strong>DOB:</strong> {{ $report->testBooking->patient->date_of_birth ?? 'Not specified' }}</div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Test Information</div>
        <div class="test-info">
            <div class="info-item"><strong>Test Name:</strong> {{ $report->testBooking->test->name }}</div>
            <div class="info-item"><strong>Test Code:</strong> {{ $report->testBooking->test->code }}</div>
            <div class="info-item"><strong>Sample Collection:</strong> {{ $report->testBooking->sample_collection_time }}</div>
            <div class="info-item"><strong>Report Date:</strong> {{ $reportDate }}</div>
            <div class="info-item"><strong>Ordering Physician:</strong> {{ $report->testBooking->doctor->name }}</div>
            <div class="info-item"><strong>Report Status:</strong> {{ strtoupper($report->status) }}</div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Test Results</div>
        <table>
            <thead>
                <tr>
                    <th>Parameter</th>
                    <th>Result</th>
                    <th>Units</th>
                    <th>Reference Range</th>
                    <th>Flag</th>
                </tr>
            </thead>
            <tbody>
                @if(count($report->test_results) > 0)
                    @foreach($report->test_results as $result)
                        @php
                            $parameter = $report->testBooking->test->parameters->firstWhere('id', $result['parameter_id']);
                            $isAbnormal = false;
                            if ($parameter && isset($parameter['normal_range']) && isset($result['value'])) {
                                $range = $parameter['normal_range'];
                                $value = floatval($result['value']);
                                
                                if (preg_match('/(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)/', $range, $matches)) {
                                    $min = floatval($matches[1]);
                                    $max = floatval($matches[2]);
                                    $isAbnormal = $value < $min || $value > $max;
                                }
                            }
                        @endphp
                        <tr>
                            <td>{{ $parameter ? $parameter['parameter_name'] : 'Unknown Parameter' }}</td>
                            <td class="{{ $isAbnormal ? 'abnormal' : '' }}">{{ $result['value'] }}</td>
                            <td>{{ $parameter ? $parameter['unit'] : '' }}</td>
                            <td>{{ $parameter ? $parameter['normal_range'] : '' }}</td>
                            <td>{{ $isAbnormal ? 'Abnormal' : 'Normal' }}</td>
                        </tr>
                    @endforeach
                @else
                    <tr>
                        <td colspan="5" style="text-align: center;">No results recorded</td>
                    </tr>
                @endif
            </tbody>
        </table>
    </div>

    @if($report->technician_notes)
    <div class="section">
        <div class="section-title">Technician Notes</div>
        <p>{{ $report->technician_notes }}</p>
    </div>
    @endif

    @if($report->pathologist_notes || $report->conclusion)
    <div class="section">
        <div class="section-title">Pathologist Comments</div>
        @if($report->pathologist_notes)
            <p><strong>Notes:</strong> {{ $report->pathologist_notes }}</p>
        @endif
        @if($report->conclusion)
            <p><strong>Conclusion:</strong> {{ $report->conclusion }}</p>
        @endif
    </div>
    @endif

    <div class="signatures">
        <div class="signature">
            <p>{{ $report->labTechnician ? $report->labTechnician->name : 'Lab Technician' }}</p>
            <p>Lab Technician</p>
        </div>
        <div class="signature">
            <p>{{ $report->pathologist ? $report->pathologist->name : 'Pending Review' }}</p>
            <p>Reviewing Pathologist</p>
        </div>
    </div>

    <div class="footer">
        <p>This report is electronically verified and valid without signature.</p>
        <p>Results validated on: {{ $validatedDate }}</p>
        <p><strong>Disclaimer:</strong> This test was performed using procedures approved by regulatory authorities. Results should be interpreted in the context of clinical findings and other laboratory data. A negative result does not exclude the possibility of disease. Consult your healthcare provider for guidance.</p>
    </div>
</body>
</html>