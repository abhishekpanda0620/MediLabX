<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Test;
use App\Models\TestParameter;

class TestSeeder extends Seeder
{
    public function run()
    {
        // Complete Blood Count (CBC)
        $cbc = Test::create([
            'name' => 'Complete Blood Count (CBC)',
            'category' => 'Haematology',
            'code' => 'CBC001',
            'description' => 'A comprehensive blood test to evaluate overall health and detect various disorders.',
            'turn_around_time' => 24,
            'specimen_requirements' => 'EDTA whole blood - Purple top tube (3-5ml)',
            'preparation_instructions' => 'No special preparation required.',
            'price' => 550.00, // Price in INR
            'fasting_required' => false
        ]);

        $cbcParameters = [
            [
                'parameter_name' => 'Haemoglobin',
                'unit' => 'g/dL',
                'normal_range' => '13.0 - 17.0',
                'description' => 'Protein in red blood cells that carries oxygen',
                'critical_low' => '7.0',
                'critical_high' => '20.0',
                'method' => 'Spectrophotometry',
                'reference_ranges' => json_encode([
                    ['gender' => 'male', 'range' => '13.0 - 17.0'],
                    ['gender' => 'female', 'range' => '12.0 - 15.5']
                ]),
                'interpretation_guide' => 'Low levels may indicate anaemia. High levels may indicate polycythaemia.'
            ],
            [
                'parameter_name' => 'White Blood Cells',
                'unit' => 'cells/mcL',
                'normal_range' => '4500 - 11000',
                'description' => 'Cells that help fight infection',
                'critical_low' => '2000',
                'critical_high' => '30000',
                'method' => 'Flow Cytometry',
                'interpretation_guide' => 'High count may indicate infection, inflammation, or leukemia. Low count may indicate bone marrow problems or autoimmune conditions.'
            ],
            [
                'parameter_name' => 'Platelets',
                'unit' => 'cells/mcL',
                'normal_range' => '150000 - 400000',
                'description' => 'Blood cells that help with clotting',
                'critical_low' => '50000',
                'critical_high' => '1000000',
                'method' => 'Impedance',
                'interpretation_guide' => 'Low count may indicate bleeding risk. High count may increase clotting risk.'
            ]
        ];

        foreach ($cbcParameters as $param) {
            TestParameter::create(array_merge($param, ['test_id' => $cbc->id]));
        }

        // Lipid Profile
        $lipid = Test::create([
            'name' => 'Lipid Profile',
            'category' => 'Clinical Biochemistry',
            'code' => 'LIP001',
            'description' => 'Blood test that measures lipids to assess cardiovascular health.',
            'turn_around_time' => 24,
            'specimen_requirements' => 'Serum - Red top tube (5ml)',
            'preparation_instructions' => 'Fast for 12-14 hours before the test. Only water is permitted.',
            'price' => 800.00, // Price in INR
            'fasting_required' => true,
            'fasting_duration' => 12
        ]);

        $lipidParameters = [
            [
                'parameter_name' => 'Total Cholesterol',
                'unit' => 'mg/dL',
                'normal_range' => '125 - 200',
                'description' => 'Measures all types of cholesterol in your blood',
                'critical_high' => '300',
                'method' => 'Enzymatic',
                'interpretation_guide' => 'High levels may indicate increased risk of heart disease.'
            ],
            [
                'parameter_name' => 'HDL Cholesterol',
                'unit' => 'mg/dL',
                'normal_range' => '40 - 60',
                'description' => 'Good cholesterol that helps remove other forms of cholesterol',
                'critical_low' => '20',
                'method' => 'Direct Measurement',
                'interpretation_guide' => 'Higher levels are better and may protect against heart disease.'
            ],
            [
                'parameter_name' => 'LDL Cholesterol',
                'unit' => 'mg/dL',
                'normal_range' => '< 100',
                'description' => 'Bad cholesterol that can build up in your arteries',
                'critical_high' => '190',
                'method' => 'Calculated',
                'interpretation_guide' => 'High levels may indicate increased risk of heart disease.'
            ],
            [
                'parameter_name' => 'Triglycerides',
                'unit' => 'mg/dL',
                'normal_range' => '< 150',
                'description' => 'Type of fat found in blood',
                'critical_high' => '500',
                'method' => 'Enzymatic',
                'interpretation_guide' => 'High levels may indicate increased risk of heart disease or pancreatitis.'
            ]
        ];

        foreach ($lipidParameters as $param) {
            TestParameter::create(array_merge($param, ['test_id' => $lipid->id]));
        }

        // Thyroid Function Test (TFT)
        $tft = Test::create([
            'name' => 'Thyroid Function Test (TFT)',
            'category' => 'Clinical Biochemistry',
            'code' => 'TFT001',
            'description' => 'Comprehensive thyroid function assessment.',
            'turn_around_time' => 48,
            'specimen_requirements' => 'Serum - Red top tube (3-5ml)',
            'preparation_instructions' => 'Early morning sample preferred. Inform about thyroid medications.',
            'price' => 1200.00, // Price in INR
            'fasting_required' => false
        ]);

        $tftParameters = [
            [
                'parameter_name' => 'TSH',
                'unit' => 'mIU/L',
                'normal_range' => '0.4 - 4.0',
                'description' => 'Thyroid Stimulating Hormone',
                'critical_low' => '0.01',
                'critical_high' => '50.0',
                'method' => 'Chemiluminescence',
                'interpretation_guide' => 'High levels may indicate hypothyroidism. Low levels may indicate hyperthyroidism.'
            ],
            [
                'parameter_name' => 'Free T3',
                'unit' => 'pg/mL',
                'normal_range' => '2.3 - 4.2',
                'description' => 'Free Triiodothyronine',
                'critical_low' => '1.0',
                'critical_high' => '7.0',
                'method' => 'Immunoassay',
                'interpretation_guide' => 'Elevated in hyperthyroidism, decreased in hypothyroidism.'
            ],
            [
                'parameter_name' => 'Free T4',
                'unit' => 'ng/dL',
                'normal_range' => '0.8 - 1.8',
                'description' => 'Free Thyroxine',
                'critical_low' => '0.4',
                'critical_high' => '3.0',
                'method' => 'Immunoassay',
                'interpretation_guide' => 'Elevated in hyperthyroidism, decreased in hypothyroidism.'
            ]
        ];

        foreach ($tftParameters as $param) {
            TestParameter::create(array_merge($param, ['test_id' => $tft->id]));
        }

        // HbA1c Test
        $hba1c = Test::create([
            'name' => 'Glycated Haemoglobin (HbA1c)',
            'category' => 'Clinical Biochemistry',
            'code' => 'HBA001',
            'description' => 'Measures average blood sugar levels over past 2-3 months.',
            'turn_around_time' => 24,
            'specimen_requirements' => 'EDTA whole blood - Purple top tube (3ml)',
            'preparation_instructions' => 'No fasting required.',
            'price' => 650.00, // Price in INR
            'fasting_required' => false
        ]);

        $hba1cParameters = [
            [
                'parameter_name' => 'HbA1c',
                'unit' => '%',
                'normal_range' => '4.0 - 5.6',
                'description' => 'Glycated Haemoglobin',
                'critical_high' => '9.0',
                'method' => 'HPLC',
                'interpretation_guide' => 'Values between 5.7-6.4% indicate prediabetes. Values ≥6.5% indicate diabetes.'
            ],
            [
                'parameter_name' => 'eAG (Estimated Average Glucose)',
                'unit' => 'mg/dL',
                'normal_range' => '70 - 126',
                'description' => 'Estimated Average Glucose calculated from HbA1c',
                'method' => 'Calculation',
                'interpretation_guide' => 'Provides estimated average blood glucose over past 2-3 months'
            ]
        ];

        foreach ($hba1cParameters as $param) {
            TestParameter::create(array_merge($param, ['test_id' => $hba1c->id]));
        }

        // Liver Function Test
        $lft = Test::create([
            'name' => 'Liver Function Test (LFT)',
            'category' => 'Clinical Biochemistry',
            'code' => 'LFT001',
            'description' => 'Comprehensive assessment of liver function.',
            'turn_around_time' => 24,
            'specimen_requirements' => 'Serum - Red top tube (5ml)',
            'preparation_instructions' => 'Overnight fasting required (8-12 hours).',
            'price' => 900.00, // Price in INR
            'fasting_required' => true,
            'fasting_duration' => 8
        ]);

        $lftParameters = [
            [
                'parameter_name' => 'Total Bilirubin',
                'unit' => 'mg/dL',
                'normal_range' => '0.3 - 1.2',
                'description' => 'Measures total bilirubin levels',
                'critical_high' => '15.0',
                'method' => 'Colorimetry',
                'interpretation_guide' => 'Elevated levels may indicate liver disease or bile duct obstruction'
            ],
            [
                'parameter_name' => 'SGPT (ALT)',
                'unit' => 'U/L',
                'normal_range' => '7 - 55',
                'description' => 'Alanine Aminotransferase',
                'critical_high' => '1000',
                'method' => 'UV Kinetic',
                'interpretation_guide' => 'Elevated in liver cell injury'
            ],
            [
                'parameter_name' => 'SGOT (AST)',
                'unit' => 'U/L',
                'normal_range' => '8 - 48',
                'description' => 'Aspartate Aminotransferase',
                'critical_high' => '1000',
                'method' => 'UV Kinetic',
                'interpretation_guide' => 'Elevated in liver cell injury and cardiac conditions'
            ],
            [
                'parameter_name' => 'Alkaline Phosphatase',
                'unit' => 'U/L',
                'normal_range' => '40 - 129',
                'description' => 'ALP enzyme levels',
                'critical_high' => '500',
                'method' => 'pNPP-AMP',
                'interpretation_guide' => 'Elevated in bone and liver diseases'
            ],
            [
                'parameter_name' => 'Total Proteins',
                'unit' => 'g/dL',
                'normal_range' => '6.0 - 8.3',
                'description' => 'Total protein levels in blood',
                'critical_low' => '4.0',
                'method' => 'Biuret',
                'interpretation_guide' => 'Low levels may indicate malnutrition or liver disease'
            ],
            [
                'parameter_name' => 'Albumin',
                'unit' => 'g/dL',
                'normal_range' => '3.5 - 5.2',
                'description' => 'Major protein in blood',
                'critical_low' => '2.0',
                'method' => 'BCG',
                'interpretation_guide' => 'Low levels may indicate liver disease or malnutrition'
            ]
        ];

        foreach ($lftParameters as $param) {
            TestParameter::create(array_merge($param, ['test_id' => $lft->id]));
        }

        // Vitamin D Test
        $vitD = Test::create([
            'name' => 'Vitamin D (25-OH)',
            'category' => 'Clinical Biochemistry',
            'code' => 'VITD001',
            'description' => 'Measures Vitamin D levels in blood.',
            'turn_around_time' => 48,
            'specimen_requirements' => 'Serum - Red top tube (3ml)',
            'preparation_instructions' => 'No special preparation required.',
            'price' => 1500.00, // Price in INR
            'fasting_required' => false
        ]);

        $vitDParameters = [
            [
                'parameter_name' => '25-OH Vitamin D',
                'unit' => 'ng/mL',
                'normal_range' => '30 - 100',
                'description' => '25-Hydroxyvitamin D',
                'critical_low' => '10',
                'critical_high' => '150',
                'method' => 'CLIA',
                'interpretation_guide' => 'Levels <20: Deficient, 21-29: Insufficient, 30-100: Sufficient, >100: Potential toxicity'
            ]
        ];

        foreach ($vitDParameters as $param) {
            TestParameter::create(array_merge($param, ['test_id' => $vitD->id]));
        }

        // COVID-19 RT-PCR
        $covid = Test::create([
            'name' => 'COVID-19 RT-PCR',
            'category' => 'Molecular Diagnostics',
            'code' => 'COV001',
            'description' => 'Detection of SARS-CoV-2 virus.',
            'turn_around_time' => 24,
            'specimen_requirements' => 'Nasopharyngeal and Oropharyngeal swabs',
            'preparation_instructions' => 'Avoid eating, drinking, or smoking 30 minutes before sample collection.',
            'price' => 700.00, // Price in INR as per govt guidelines
            'fasting_required' => false
        ]);

        $covidParameters = [
            [
                'parameter_name' => 'SARS-CoV-2',
                'unit' => 'NA',
                'normal_range' => 'Not Detected',
                'description' => 'Detection of SARS-CoV-2 viral RNA',
                'method' => 'RT-PCR',
                'interpretation_guide' => 'Detected: Positive for COVID-19, Not Detected: Negative for COVID-19'
            ],
            [
                'parameter_name' => 'CT Value',
                'unit' => 'Cycles',
                'normal_range' => 'NA',
                'description' => 'Cycle threshold value',
                'method' => 'RT-PCR',
                'interpretation_guide' => 'Lower CT values indicate higher viral load'
            ]
        ];

        foreach ($covidParameters as $param) {
            TestParameter::create(array_merge($param, ['test_id' => $covid->id]));
        }
    }
}
