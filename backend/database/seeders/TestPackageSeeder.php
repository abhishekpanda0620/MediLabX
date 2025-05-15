<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TestPackage;
use App\Models\Test;

class TestPackageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        // Get all tests from database to use in packages
        $tests = Test::all();
        
        // Common test IDs by category for reference (assuming tests are seeded with TestSeeder)
        $bloodTests = $tests->where('category', 'Haematology')->pluck('id')->toArray();
        $biochemistryTests = $tests->where('category', 'Biochemistry')->pluck('id')->toArray();
        $liverTests = $tests->where('category', 'Biochemistry')
                           ->where(function($query) {
                               $query->where('name', 'like', '%liver%')
                                     ->orWhere('name', 'like', '%ALT%')
                                     ->orWhere('name', 'like', '%AST%')
                                     ->orWhere('name', 'like', '%Bilirubin%');
                           })
                           ->pluck('id')
                           ->toArray();
        $lipidTests = $tests->where('category', 'Biochemistry')
                           ->where(function($query) {
                               $query->where('name', 'like', '%Lipid%')
                                     ->orWhere('name', 'like', '%Cholesterol%')
                                     ->orWhere('name', 'like', '%HDL%')
                                     ->orWhere('name', 'like', '%LDL%')
                                     ->orWhere('name', 'like', '%Triglycerides%');
                           })
                           ->pluck('id')
                           ->toArray();
        $diabetesTests = $tests->where(function($query) {
                               $query->where('name', 'like', '%Glucose%')
                                     ->orWhere('name', 'like', '%HbA1c%')
                                     ->orWhere('name', 'like', '%Insulin%');
                           })
                           ->pluck('id')
                           ->toArray();
        $thyroidTests = $tests->where(function($query) {
                               $query->where('name', 'like', '%Thyroid%')
                                     ->orWhere('name', 'like', '%TSH%')
                                     ->orWhere('name', 'like', '%T3%')
                                     ->orWhere('name', 'like', '%T4%');
                           })
                           ->pluck('id')
                           ->toArray();
        $urineTests = $tests->where('category', 'Urine Analysis')->pluck('id')->toArray();

        // 1. Basic Health Checkup Package
        $basicHealthPackage = TestPackage::create([
            'name' => 'Basic Health Checkup',
            'description' => 'Essential health parameters for routine health monitoring.',
            'price' => 899.00,
            'discount_percentage' => 15.00,
            'gender' => 'both',
            'is_active' => true,
        ]);
        
        // Attach relevant tests to the package - using CBC, basic blood sugar, lipid profile
        $basicHealthPackageTests = array_merge(
            array_slice($bloodTests, 0, 1),  // CBC
            array_slice($diabetesTests, 0, 1),  // Blood Sugar
            array_slice($lipidTests, 0, 3)   // Some Lipid tests
        );
        $basicHealthPackage->tests()->attach($basicHealthPackageTests);
        
        // 2. Comprehensive Health Checkup
        $comprehensivePackage = TestPackage::create([
            'name' => 'Comprehensive Health Checkup',
            'description' => 'Thorough assessment of overall health with detailed analysis of major systems.',
            'price' => 2499.00,
            'discount_percentage' => 20.00,
            'gender' => 'both',
            'is_active' => true,
        ]);
        
        $comprehensiveTests = array_merge(
            array_slice($bloodTests, 0, 2),  // Blood tests including CBC
            array_slice($biochemistryTests, 0, 6),  // Biochemistry tests
            array_slice($liverTests, 0, 4),  // Liver tests
            array_slice($lipidTests, 0, 4),  // Lipid profile
            array_slice($diabetesTests, 0, 2),  // Diabetes tests
            array_slice($urineTests, 0, 1)   // Urine routine
        );
        $comprehensivePackage->tests()->attach($comprehensiveTests);
        
        // 3. Women's Health Package
        $womensHealthPackage = TestPackage::create([
            'name' => 'Women\'s Health Package',
            'description' => 'Specialized health screening designed for women\'s specific health needs.',
            'price' => 3499.00,
            'discount_percentage' => 22.00,
            'gender' => 'female',
            'is_active' => true,
        ]);
        
        $womensHealthTests = array_merge(
            array_slice($bloodTests, 0, 2),  // Blood tests
            array_slice($thyroidTests, 0, 3),  // Thyroid profile
            array_slice($diabetesTests, 0, 2),  // Diabetes tests
            array_slice($lipidTests, 0, 4),  // Lipid profile
            array_slice($urineTests, 0, 1),  // Urine routine
            array_slice($biochemistryTests, 0, 4)  // Additional biochemistry
        );
        $womensHealthPackage->tests()->attach($womensHealthTests);
        
        // 4. Men's Health Package
        $mensHealthPackage = TestPackage::create([
            'name' => 'Men\'s Health Package',
            'description' => 'Comprehensive screening addressing common health concerns in men.',
            'price' => 3299.00,
            'discount_percentage' => 18.00,
            'gender' => 'male',
            'is_active' => true,
        ]);
        
        $mensHealthTests = array_merge(
            array_slice($bloodTests, 0, 2),  // Blood tests
            array_slice($liverTests, 0, 5),  // Liver function tests
            array_slice($diabetesTests, 0, 2),  // Diabetes tests
            array_slice($lipidTests, 0, 4),  // Lipid profile
            array_slice($urineTests, 0, 1),  // Urine routine
            array_slice($biochemistryTests, 0, 4)  // Additional biochemistry
        );
        $mensHealthPackage->tests()->attach($mensHealthTests);
        
        // 5. Senior Citizen Health Package
        $seniorPackage = TestPackage::create([
            'name' => 'Senior Citizen Health Package',
            'description' => 'Comprehensive health assessment tailored for adults over 60.',
            'price' => 4299.00,
            'discount_percentage' => 25.00,
            'gender' => 'both',
            'is_active' => true,
        ]);
        
        $seniorTests = array_merge(
            array_slice($bloodTests, 0, 3),  // Extended blood tests
            array_slice($biochemistryTests, 0, 8),  // More biochemistry tests
            array_slice($liverTests, 0, 5),  // Complete liver profile
            array_slice($lipidTests, 0, 5),  // Complete lipid profile
            array_slice($diabetesTests, 0, 3),  // Complete diabetes profile
            array_slice($thyroidTests, 0, 3),  // Thyroid profile
            array_slice($urineTests, 0, 2)   // Extended urine analysis
        );
        $seniorPackage->tests()->attach($seniorTests);
        
        // 6. Diabetes Risk Assessment
        $diabetesPackage = TestPackage::create([
            'name' => 'Diabetes Risk Assessment',
            'description' => 'Specialized panel to identify diabetes risk factors and monitor glycemic control.',
            'price' => 1699.00,
            'discount_percentage' => 18.00,
            'gender' => 'both',
            'is_active' => true,
        ]);
        
        $diabetesPackage->tests()->attach($diabetesTests);
        
        // 7. Heart Health Package
        $heartPackage = TestPackage::create([
            'name' => 'Heart Health Package',
            'description' => 'Comprehensive cardiac risk assessment to evaluate heart health.',
            'price' => 2999.00,
            'discount_percentage' => 20.00,
            'gender' => 'both',
            'is_active' => true,
        ]);
        
        $heartHealthTests = array_merge(
            array_slice($lipidTests, 0, 5),  // Complete lipid profile
            array_slice($diabetesTests, 0, 2),  // Basic diabetes tests
            array_slice($biochemistryTests, 0, 4)  // Selected biochemistry tests
        );
        $heartPackage->tests()->attach($heartHealthTests);
        
        // 8. Thyroid Function Panel
        $thyroidPackage = TestPackage::create([
            'name' => 'Thyroid Function Panel',
            'description' => 'Comprehensive assessment of thyroid function and related hormones.',
            'price' => 1299.00,
            'discount_percentage' => 15.00,
            'gender' => 'both',
            'is_active' => true,
        ]);
        
        $thyroidPackage->tests()->attach($thyroidTests);
    }
}
