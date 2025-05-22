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
            margin-bottom: 20px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 10px;
        }
        .header h1 {
            color: #2563eb;
            font-size: 20px;
            margin: 10px 0;
        }
        .header p {
            font-size: 12px;
            color: #666;
        }
        .section {
            margin-bottom: 15px;
        }
        .section-title {
            font-size: 14px;
            font-weight: bold;
            background-color: #f3f4f6;
            padding: 5px;
            margin-bottom: 5px;
        }
        .row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
        }
        .label {
            font-weight: bold;
            width: 50%;
        }
        .value {
            width: 50%;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }
        table, th, td {
            border: 1px solid #ddd;
        }
        th {
            background-color: #f3f4f6;
            font-weight: bold;
            text-align: left;
            padding: 5px;
        }
        td {
            padding: 5px;
            text-align: left;
        }
        .footer {
            text-align: center;
            font-size: 10px;
            color: #666;
            margin-top: 20px;
        }
        .abnormal {
            color: #dc2626;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>GAYATRI DIAGNOSTIC</h1>
        <p>PAPANGA,COLONY,CHOWK,BHEDEN,BARGARH | Phone: (+91)9871373329 </p>
    </div>

    <div class="section">
        <div class="section-title">Patient Information</div>
        <div class="row">
            <div class="label">Name:</div>
            <div class="value">{{ $report->testBooking->patient->name ?? 'Unknown' }}</div>
        </div>
        <div class="row">
            <div class="label">Patient ID:</div>
            <div class="value">{{ $report->testBooking->patient->id ?? 'Unknown' }}</div>
        </div>
        <div class="row">
            <div class="label">Gender:</div>
            <div class="value">{{ $report->testBooking->patient->gender ?? 'Not specified' }}</div>
        </div>
        <div class="row">
            <div class="label">DOB:</div>
            <div class="value">{{ $report->testBooking->patient->date_of_birth ?? 'Not specified' }}</div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Test Information</div>
        <div class="row">
            <div class="label">Test Name:</div>
            <div class="value">{{ $report->testBooking->test->name ?? 'Unknown' }}</div>
        </div>
        <div class="row">
            <div class="label">Test Code:</div>
            <div class="value">{{ $report->testBooking->test->code ?? 'Unknown' }}</div>
        </div>
        <div class="row">
            <div class="label">Sample Collection:</div>
            <div class="value">{{ $report->testBooking->sample_collection_time ?? 'Not available' }}</div>
        </div>
        <div class="row">
            <div class="label">Report Date:</div>
            <div class="value">{{ $reportDate }}</div>
        </div>
        <div class="row">
            <div class="label">Reffered By:</div>
            <div class="value">{{ $report->testBooking->doctor->name }}</div>
        </div>
        <div class="row">
            <div class="label">Report Status:</div>
            <div class="value">{{ strtoupper($report->status) }}</div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Test Results</div>
        <table>
            <thead>
                <tr>
                    <th>Parameter</th>
                    <th>Result</th>
                    <th>Unit</th>
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


    <div class="signatures">
        <div class="signature">
            <p>{{ $report->labTechnician ? $report->labTechnician->name : 'Lab Technician' }}</p>
            <p>Lab Technician</p>
        </div>
        
    </div>

    <div class="footer">
        <p>This report is electronically verified and valid without signature.</p>
        <p>Results validated on: {{ $validatedDate }}</p>
        <p><strong>Disclaimer:</strong> This test was performed using procedures approved by regulatory authorities. Results should be interpreted in the context of clinical findings and other laboratory data. A negative result does not exclude the possibility of disease. Consult your healthcare provider for guidance.</p>
    </div>
</body>
</html>