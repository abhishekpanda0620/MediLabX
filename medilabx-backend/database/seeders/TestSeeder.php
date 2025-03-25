<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Test;
use App\Models\TestParameter;

class TestSeeder extends Seeder
{
    public function run()
    {
        // CBC Test
        $cbc = Test::create(['name' => 'Complete Blood Count (CBC)']);
        $cbcParameters = [
            ['parameter_name' => 'Hemoglobin', 'unit' => 'g/dL', 'normal_range' => '13.0 - 17.0'],
            ['parameter_name' => 'White Blood Cells', 'unit' => 'cells/mcL', 'normal_range' => '4500 - 11000'],
            ['parameter_name' => 'Platelets', 'unit' => 'cells/mcL', 'normal_range' => '150000 - 400000'],
            ['parameter_name' => 'Red Blood Cells', 'unit' => 'million/mcL', 'normal_range' => '4.7 - 6.1'],
        ];
        foreach ($cbcParameters as $param) {
            TestParameter::create(array_merge($param, ['test_id' => $cbc->id]));
        }

        // Liver Function Test (LFT)
        $lft = Test::create(['name' => 'Liver Function Test (LFT)']);
        $lftParameters = [
            ['parameter_name' => 'Bilirubin Total', 'unit' => 'mg/dL', 'normal_range' => '0.3 - 1.2'],
            ['parameter_name' => 'SGPT (ALT)', 'unit' => 'U/L', 'normal_range' => '7 - 56'],
            ['parameter_name' => 'SGOT (AST)', 'unit' => 'U/L', 'normal_range' => '10 - 40'],
            ['parameter_name' => 'Albumin', 'unit' => 'g/dL', 'normal_range' => '3.5 - 5.0'],
        ];
        foreach ($lftParameters as $param) {
            TestParameter::create(array_merge($param, ['test_id' => $lft->id]));
        }

        // Kidney Function Test (KFT)
        $kft = Test::create(['name' => 'Kidney Function Test (KFT)']);
        $kftParameters = [
            ['parameter_name' => 'Creatinine', 'unit' => 'mg/dL', 'normal_range' => '0.6 - 1.3'],
            ['parameter_name' => 'Urea', 'unit' => 'mg/dL', 'normal_range' => '17 - 49'],
            ['parameter_name' => 'Uric Acid', 'unit' => 'mg/dL', 'normal_range' => '3.5 - 7.2'],
        ];
        foreach ($kftParameters as $param) {
            TestParameter::create(array_merge($param, ['test_id' => $kft->id]));
        }

        // Lipid Profile Test
        $lipid = Test::create(['name' => 'Lipid Profile']);
        $lipidParameters = [
            ['parameter_name' => 'Total Cholesterol', 'unit' => 'mg/dL', 'normal_range' => '125 - 200'],
            ['parameter_name' => 'HDL (Good Cholesterol)', 'unit' => 'mg/dL', 'normal_range' => '40 - 60'],
            ['parameter_name' => 'LDL (Bad Cholesterol)', 'unit' => 'mg/dL', 'normal_range' => '< 100'],
            ['parameter_name' => 'Triglycerides', 'unit' => 'mg/dL', 'normal_range' => '< 150'],
        ];
        foreach ($lipidParameters as $param) {
            TestParameter::create(array_merge($param, ['test_id' => $lipid->id]));
        }

        // Thyroid Function Test (TFT)
        $tft = Test::create(['name' => 'Thyroid Function Test (TFT)']);
        $tftParameters = [
            ['parameter_name' => 'TSH', 'unit' => 'mIU/L', 'normal_range' => '0.4 - 4.0'],
            ['parameter_name' => 'T3', 'unit' => 'ng/dL', 'normal_range' => '80 - 200'],
            ['parameter_name' => 'T4', 'unit' => 'mcg/dL', 'normal_range' => '4.5 - 12.0'],
        ];
        foreach ($tftParameters as $param) {
            TestParameter::create(array_merge($param, ['test_id' => $tft->id]));
        }

        // Blood Sugar Test
        $sugar = Test::create(['name' => 'Blood Sugar Test']);
        $sugarParameters = [
            ['parameter_name' => 'Fasting Blood Sugar', 'unit' => 'mg/dL', 'normal_range' => '70 - 99'],
            ['parameter_name' => 'Postprandial Blood Sugar', 'unit' => 'mg/dL', 'normal_range' => '< 140'],
        ];
        foreach ($sugarParameters as $param) {
            TestParameter::create(array_merge($param, ['test_id' => $sugar->id]));
        }

        // Electrolyte Panel Test
        $electrolyte = Test::create(['name' => 'Electrolyte Panel']);
        $electrolyteParameters = [
            ['parameter_name' => 'Sodium', 'unit' => 'mEq/L', 'normal_range' => '135 - 145'],
            ['parameter_name' => 'Potassium', 'unit' => 'mEq/L', 'normal_range' => '3.5 - 5.1'],
            ['parameter_name' => 'Chloride', 'unit' => 'mEq/L', 'normal_range' => '96 - 106'],
        ];
        foreach ($electrolyteParameters as $param) {
            TestParameter::create(array_merge($param, ['test_id' => $electrolyte->id]));
        }
    }
}
