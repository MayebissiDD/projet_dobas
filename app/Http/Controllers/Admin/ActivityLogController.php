<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ActivityLogController extends Controller
{
    public function index(Request $request)
    {
        $query = ActivityLog::with('user')->latest();

        if ($request->filled('from')) {
            $query->whereDate('created_at', '>=', $request->from);
        }
        if ($request->filled('to')) {
            $query->whereDate('created_at', '<=', $request->to);
        }

        $logs = $query->paginate(20);

        return Inertia::render('Admin/Rapports', [
            'logs' => $logs,
            'filters' => [
                'from' => $request->from,
                'to' => $request->to,
            ],
        ]);
    }

    public function exportCsv(Request $request)
    {
        $query = ActivityLog::with('user')->latest();
        if ($request->filled('from')) {
            $query->whereDate('created_at', '>=', $request->from);
        }
        if ($request->filled('to')) {
            $query->whereDate('created_at', '<=', $request->to);
        }
        $logs = $query->get();

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="logs.csv"',
        ];
        $callback = function () use ($logs) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['ID', 'Utilisateur', 'Action', 'Objet', 'Description', 'Date']);
            foreach ($logs as $log) {
                fputcsv($handle, [
                    $log->id,
                    $log->user?->name ?? 'Système',
                    $log->action,
                    $log->subject_type,
                    $log->description,
                    $log->created_at,
                ]);
            }
            fclose($handle);
        };
        return response()->stream($callback, 200, $headers);
    }

    public function exportPdf(Request $request)
    {
        $query = ActivityLog::with('user')->latest();
        if ($request->filled('from')) {
            $query->whereDate('created_at', '>=', $request->from);
        }
        if ($request->filled('to')) {
            $query->whereDate('created_at', '<=', $request->to);
        }
        $logs = $query->get();

        $html = view('admin.logs_pdf', compact('logs'))->render();
        $pdf = app('dompdf.wrapper');
        $pdf->loadHTML($html);
        return $pdf->download('logs.pdf');
    }
}
