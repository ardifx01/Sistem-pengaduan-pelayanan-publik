<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Complaint;
use App\Models\ComplaintDocument;
use App\Models\ComplaintStatusHistory;
use App\Models\Service;
use App\Notifications\ComplaintCreated;
use App\Notifications\ComplaintStatusChanged;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class ComplaintController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Complaint::with(['service', 'user', 'documents']);

        // Admin can see all complaints, users only see their own
        if (!$user->isAdmin()) {
            $query->where('user_id', $user->id);
        }

        // Filter by status if provided
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        // Filter by service if provided
        if ($request->has('service_id') && $request->service_id) {
            $query->where('service_id', $request->service_id);
        }

        // Search by registration number
        if ($request->has('search') && $request->search) {
            $query->where('registration_number', 'like', '%' . $request->search . '%');
        }

        $complaints = $query->orderBy('created_at', 'desc')->paginate(10);

        return response()->json([
            'status' => 'success',
            'data' => $complaints
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'service_id' => 'required|exists:services,id',
            'applicant_name' => 'required|string|max:255',
            'applicant_nik' => 'required|string|size:16',
            'applicant_address' => 'required|string',
            'applicant_phone' => 'nullable|string|max:20',
            'applicant_job' => 'nullable|string|max:255',
            'applicant_birth_date' => 'nullable|date',
            'description' => 'nullable|string',
            'documents' => 'nullable|array',
            'documents.*' => 'file|mimes:pdf,jpg,jpeg,png|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Generate registration number
        $registrationNumber = 'REG-' . date('Ymd') . '-' . strtoupper(Str::random(6));

        // Create complaint
        $complaint = Complaint::create([
            'registration_number' => $registrationNumber,
            'user_id' => $request->user()->id,
            'service_id' => $request->service_id,
            'applicant_name' => $request->applicant_name,
            'applicant_nik' => $request->applicant_nik,
            'applicant_address' => $request->applicant_address,
            'applicant_phone' => $request->applicant_phone,
            'applicant_job' => $request->applicant_job,
            'applicant_birth_date' => $request->applicant_birth_date,
            'description' => $request->description,
            'status' => 'pending'
        ]);

        // Upload documents if provided
        if ($request->hasFile('documents')) {
            foreach ($request->file('documents') as $index => $file) {
                $fileName = time() . '_' . $index . '_' . $file->getClientOriginalName();
                $filePath = $file->storeAs('documents', $fileName, 'public');

                ComplaintDocument::create([
                    'complaint_id' => $complaint->id,
                    'document_name' => $file->getClientOriginalName(),
                    'document_type' => $file->getClientMimeType(),
                    'file_path' => $filePath,
                    'file_size' => $file->getSize()
                ]);
            }
        }

        // Create status history
        ComplaintStatusHistory::create([
            'complaint_id' => $complaint->id,
            'status' => 'pending',
            'notes' => 'Pengaduan telah diterima dan menunggu verifikasi',
            'user_id' => $request->user()->id
        ]);

        // Send notification to user
        $request->user()->notify(new ComplaintCreated($complaint));

        $complaint->load(['service', 'documents']);

        return response()->json([
            'status' => 'success',
            'message' => 'Complaint submitted successfully',
            'data' => $complaint
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Complaint $complaint)
    {
        // Users can only see their own complaints, admins can see all
        if (!$request->user()->isAdmin() && $complaint->user_id !== $request->user()->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $complaint->load(['service', 'user', 'documents', 'statusHistories.user']);

        return response()->json([
            'status' => 'success',
            'data' => $complaint
        ]);
    }

    /**
     * Update complaint status (Admin only).
     */
    public function updateStatus(Request $request, Complaint $complaint)
    {
        // ✅ Debug logging
        Log::info('Update Status Request:', [
            'complaint_id' => $complaint->id,
            'method' => $request->method(),
            'content_type' => $request->header('Content-Type'),
            'all_data' => $request->all(),
            'files' => $request->allFiles(),
            'has_status' => $request->has('status'),
            'status_value' => $request->get('status')
        ]);

        if (!$request->user()->isAdmin()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,reviewing,approved,revision,completed,rejected',
            'notes' => 'nullable|string',
            'result_document' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048'
        ]);

        if ($validator->fails()) {
            Log::error('Validation failed:', [
                'errors' => $validator->errors(),
                'input' => $request->all()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $oldStatus = $complaint->status;
        $complaint->status = $request->status;
        $complaint->notes = $request->notes;

        // Upload result document if provided
        if ($request->hasFile('result_document')) {
            $file = $request->file('result_document');
            $fileName = time() . '_result_' . $file->getClientOriginalName();
            $filePath = $file->storeAs('results', $fileName, 'public');
            $complaint->result_document = $filePath;
        }

        $complaint->save();

        // Create status history
        ComplaintStatusHistory::create([
            'complaint_id' => $complaint->id,
            'status' => $request->status,
            'notes' => $request->notes ?? 'Status updated by admin',
            'user_id' => $request->user()->id
        ]);

        // Send notification to user if status changed
        if ($oldStatus !== $request->status) {
            $complaint->user->notify(new ComplaintStatusChanged($complaint, $oldStatus, $request->status));
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Complaint status updated successfully',
            'data' => $complaint
        ]);
    }

    /**
     * Track complaint by registration number.
     */
    public function track(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'registration_number' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $complaint = Complaint::with(['service', 'statusHistories.user'])
            ->where('registration_number', $request->registration_number)
            ->first();

        if (!$complaint) {
            return response()->json([
                'status' => 'error',
                'message' => 'Complaint not found'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $complaint
        ]);
    }

    /**
     * Get complaint statistics (Admin only).
     */
    public function statistics(Request $request)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $stats = [
            'total' => Complaint::count(),
            'pending' => Complaint::where('status', 'pending')->count(),
            'reviewing' => Complaint::where('status', 'reviewing')->count(),
            'approved' => Complaint::where('status', 'approved')->count(),
            'completed' => Complaint::where('status', 'completed')->count(),
            'rejected' => Complaint::where('status', 'rejected')->count(),
            'this_month' => Complaint::whereMonth('created_at', now()->month)->count(),
            'this_year' => Complaint::whereYear('created_at', now()->year)->count()
        ];

        return response()->json([
            'status' => 'success',
            'data' => $stats
        ]);
    }

    /**
     * Download complaint document.
     */
    public function downloadDocument(Request $request, Complaint $complaint, $documentId)
    {
        // Users can only download their own complaint documents, admins can download all
        if (!$request->user()->isAdmin() && $complaint->user_id !== $request->user()->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $document = $complaint->documents()->find($documentId);

        if (!$document) {
            return response()->json([
                'status' => 'error',
                'message' => 'Document not found'
            ], 404);
        }

        if (!Storage::disk('public')->exists($document->file_path)) {
            return response()->json([
                'status' => 'error',
                'message' => 'File not found on storage'
            ], 404);
        }

        return response()->download(
            Storage::disk('public')->path($document->file_path),
            $document->document_name
        );
    }

    /**
     * Download result document.
     */
    public function downloadResult(Request $request, Complaint $complaint)
    {
        // Users can only download their own complaint result, admins can download all
        if (!$request->user()->isAdmin() && $complaint->user_id !== $request->user()->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        if (!$complaint->result_document) {
            return response()->json([
                'status' => 'error',
                'message' => 'Result document not available'
            ], 404);
        }

        if (!Storage::disk('public')->exists($complaint->result_document)) {
            return response()->json([
                'status' => 'error',
                'message' => 'File not found on storage'
            ], 404);
        }

        $fileName = 'Result_' . $complaint->registration_number . '_' . pathinfo($complaint->result_document, PATHINFO_BASENAME);
        return response()->download(
            Storage::disk('public')->path($complaint->result_document),
            $fileName
        );
    }
}
