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
            'category' => 'Hematology',
            'code' => 'CBC001',
            'description' => 'A blood test used to evaluate your overall health and detect a wide range of disorders.',
            'turn_around_time' => 24,
            'specimen_requirements' => 'EDTA whole blood - Purple top tube (3-5ml)',
            'preparation_instructions' => 'No special preparation required.',
            'price' => 45.00,
            'fasting_required' => false
        ]);

        $cbcParameters = [
            [
                'parameter_name' => 'Hemoglobin',
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
                'interpretation_guide' => 'Low levels may indicate anemia. High levels may indicate polycythemia.'
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
            'category' => 'Biochemistry',
            'code' => 'LIP001',
            'description' => 'A blood test that measures the levels of fats (lipids) in your blood.',
            'turn_around_time' => 24,
            'specimen_requirements' => 'Serum - Red top tube (5ml)',
            'preparation_instructions' => 'Fast for 12-14 hours before the test. Only water is permitted.',
            'price' => 65.00,
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
            'category' => 'Endocrinology',
            'code' => 'TFT001',
            'description' => 'A blood test that checks how well your thyroid gland is working.',
            'turn_around_time' => 48,
            'specimen_requirements' => 'Serum - Red top tube (3-5ml)',
            'preparation_instructions' => 'No special preparation required. However, inform your doctor about any medications.',
            'price' => 85.00,
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
    }
}
