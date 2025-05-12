<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\TestBooking;
use App\Models\TestReport;
use App\Models\Test;
use App\Models\TestPackage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Get admin dashboard statistics
     */
    public function adminStats()
    {
        // Ensure user is admin
        if (!Auth::user()->hasRole('admin')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        // Users by role
        $usersByRole = [
            'patients' => User::whereHas('roles', function($q) { $q->where('name', 'patient'); })->count(),
            'doctors' => User::whereHas('roles', function($q) { $q->where('name', 'doctor'); })->count(),
            'labTechnicians' => User::whereHas('roles', function($q) { $q->where('name', 'lab_technician'); })->count(),
            'pathologists' => User::whereHas('roles', function($q) { $q->where('name', 'pathologist'); })->count(),
        ];
        
        // Test bookings stats
        $bookingStats = [
            'total' => TestBooking::count(),
            'booked' => TestBooking::where('status', TestBooking::STATUS_BOOKED)->count(),
            'processing' => TestBooking::whereIn('status', [
                TestBooking::STATUS_SAMPLE_COLLECTED,
                TestBooking::STATUS_PROCESSING
            ])->count(),
            'completed' => TestBooking::where('status', TestBooking::STATUS_COMPLETED)->count()
        ];
        
        // Test reports stats
        $reportStats = [
            'total' => TestReport::count(),
            'validated' => TestReport::where('status', TestReport::STATUS_VALIDATED)->count(),
            'pending' => TestReport::whereIn('status', [
                TestReport::STATUS_DRAFT,
                TestReport::STATUS_SUBMITTED,
                TestReport::STATUS_REVIEWED
            ])->count()
        ];
        
        // Popular tests
        $popularTests = TestBooking::select('test_id', DB::raw('count(*) as count'))
            ->with('test:id,name')
            ->groupBy('test_id')
            ->orderBy('count', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->test_id,
                    'name' => $item->test->name,
                    'count' => $item->count
                ];
            });
        
        // Revenue data
        $revenueData = Test::join('test_bookings', 'tests.id', '=', 'test_bookings.test_id')
            ->where('test_bookings.status', '!=', TestBooking::STATUS_CANCELLED)
            ->select(
                DB::raw('MONTH(test_bookings.created_at) as month'),
                DB::raw('SUM(tests.price) as revenue')
            )
            ->whereYear('test_bookings.created_at', date('Y'))
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->keyBy('month')
            ->map(function ($item) {
                return round($item->revenue, 2);
            });
        
        // Fill in missing months with zero
        $monthlyRevenue = [];
        for ($i = 1; $i <= 12; $i++) {
            $monthlyRevenue[$i] = $revenueData[$i] ?? 0;
        }
        
        return response()->json([
            'usersByRole' => $usersByRole,
            'bookingStats' => $bookingStats,
            'reportStats' => $reportStats,
            'popularTests' => $popularTests,
            'monthlyRevenue' => $monthlyRevenue,
            'packageCount' => TestPackage::count(),
            'testCount' => Test::count()
        ]);
    }
    
    /**
     * Get doctor dashboard statistics
     */
    public function doctorStats()
    {
        $user = Auth::user();
        
        if (!$user->hasRole('doctor')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        // Patient count for this doctor
        $patientCount = TestBooking::where('doctor_id', $user->id)
            ->distinct('patient_id')
            ->count('patient_id');
        
        // Test bookings stats
        $bookingStats = [
            'total' => TestBooking::where('doctor_id', $user->id)->count(),
            'booked' => TestBooking::where('doctor_id', $user->id)
                ->where('status', TestBooking::STATUS_BOOKED)->count(),
            'processing' => TestBooking::where('doctor_id', $user->id)
                ->whereIn('status', [
                    TestBooking::STATUS_SAMPLE_COLLECTED,
                    TestBooking::STATUS_PROCESSING
                ])->count(),
            'completed' => TestBooking::where('doctor_id', $user->id)
                ->where('status', TestBooking::STATUS_COMPLETED)->count()
        ];
        
        // Recent test bookings
        $recentBookings = TestBooking::with(['patient:id,name', 'test:id,name'])
            ->where('doctor_id', $user->id)
            ->latest()
            ->limit(5)
            ->get();
        
        // Test reports by status
        $reportStats = [
            'totalValidated' => TestReport::whereHas('testBooking', function($q) use ($user) {
                $q->where('doctor_id', $user->id);
            })->where('status', TestReport::STATUS_VALIDATED)->count(),
            'pending' => TestReport::whereHas('testBooking', function($q) use ($user) {
                $q->where('doctor_id', $user->id);
            })->whereIn('status', [
                TestReport::STATUS_DRAFT, 
                TestReport::STATUS_SUBMITTED,
                TestReport::STATUS_REVIEWED
            ])->count(),
        ];
        
        // Latest validated reports
        $latestReports = TestReport::with(['testBooking.patient:id,name', 'testBooking.test:id,name'])
            ->whereHas('testBooking', function($q) use ($user) {
                $q->where('doctor_id', $user->id);
            })
            ->where('status', TestReport::STATUS_VALIDATED)
            ->latest()
            ->limit(5)
            ->get();
            
        return response()->json([
            'patientCount' => $patientCount,
            'bookingStats' => $bookingStats,
            'reportStats' => $reportStats,
            'recentBookings' => $recentBookings,
            'latestReports' => $latestReports
        ]);
    }
    
    /**
     * Get lab technician dashboard statistics
     */
    public function labStats()
    {
        $user = Auth::user();
        
        if (!$user->hasRole('lab_technician')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        // Sample stats
        $sampleStats = [
            'awaiting' => TestBooking::where('status', TestBooking::STATUS_BOOKED)->count(),
            'collected' => TestBooking::where('status', TestBooking::STATUS_SAMPLE_COLLECTED)->count(),
            'processing' => TestBooking::where('status', TestBooking::STATUS_PROCESSING)->count(),
            'completed' => TestBooking::whereIn('status', [
                TestBooking::STATUS_REVIEWED,
                TestBooking::STATUS_COMPLETED
            ])->count()
        ];
        
        // Report stats
        $reportStats = [
            'draft' => TestReport::where('lab_technician_id', $user->id)
                ->where('status', TestReport::STATUS_DRAFT)->count(),
            'submitted' => TestReport::where('lab_technician_id', $user->id)
                ->where('status', TestReport::STATUS_SUBMITTED)->count(),
            'validated' => TestReport::where('lab_technician_id', $user->id)
                ->where('status', TestReport::STATUS_VALIDATED)->count(),
            'rejected' => TestReport::where('lab_technician_id', $user->id)
                ->where('status', TestReport::STATUS_REJECTED)->count(),
        ];
        
        // Priority samples (samples collected over 24 hours ago)
        $prioritySamples = TestBooking::with(['patient:id,name', 'test:id,name'])
            ->where('status', TestBooking::STATUS_SAMPLE_COLLECTED)
            ->where('sample_collection_time', '<', now()->subHours(24))
            ->orderBy('sample_collection_time')
            ->limit(5)
            ->get();
        
        // Recent reports
        $recentReports = TestReport::with(['testBooking.patient:id,name', 'testBooking.test:id,name'])
            ->where('lab_technician_id', $user->id)
            ->latest()
            ->limit(5)
            ->get();
        
        return response()->json([
            'sampleStats' => $sampleStats,
            'reportStats' => $reportStats,
            'prioritySamples' => $prioritySamples,
            'recentReports' => $recentReports
        ]);
    }
    
    /**
     * Get patient dashboard statistics
     */
    public function patientStats()
    {
        $user = Auth::user();
        
        if (!$user->hasRole('patient')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        // Test bookings stats
        $bookingStats = [
            'total' => TestBooking::where('patient_id', $user->id)->count(),
            'booked' => TestBooking::where('patient_id', $user->id)
                ->where('status', TestBooking::STATUS_BOOKED)->count(),
            'processing' => TestBooking::where('patient_id', $user->id)
                ->whereIn('status', [
                    TestBooking::STATUS_SAMPLE_COLLECTED, 
                    TestBooking::STATUS_PROCESSING,
                    TestBooking::STATUS_REVIEWED
                ])->count(),
            'completed' => TestBooking::where('patient_id', $user->id)
                ->where('status', TestBooking::STATUS_COMPLETED)->count(),
            'cancelled' => TestBooking::where('patient_id', $user->id)
                ->where('status', TestBooking::STATUS_CANCELLED)->count(),
        ];
        
        // Recent bookings
        $recentBookings = TestBooking::with(['test:id,name', 'doctor:id,name'])
            ->where('patient_id', $user->id)
            ->latest()
            ->limit(5)
            ->get();
        
        // Recent reports
        $recentReports = TestReport::with(['testBooking.test:id,name'])
            ->whereHas('testBooking', function($q) use ($user) {
                $q->where('patient_id', $user->id);
            })
            ->where('status', TestReport::STATUS_VALIDATED)
            ->latest()
            ->limit(5)
            ->get();
        
        return response()->json([
            'bookingStats' => $bookingStats,
            'recentBookings' => $recentBookings,
            'recentReports' => $recentReports,
            'unreadReports' => 0, // You could add a read/unread feature in the future
        ]);
    }
}
