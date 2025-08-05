<?php
namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:etudiant');
    }

    /**
     * Liste des notifications de l'étudiant
     */
    public function index()
    {
        $etudiant = Auth::guard('etudiant')->user();
        
        $notifications = $etudiant->notifications()
            ->orderBy('created_at', 'desc')
            ->paginate(20);
        
        return Inertia::render('Etudiant/Notifications', [
            'notifications' => $notifications,
            'unreadCount' => $etudiant->unreadNotifications->count()
        ]);
    }

    /**
     * Marquer une notification comme lue
     */
    public function markAsRead($id)
    {
        $etudiant = Auth::guard('etudiant')->user();
        
        $notification = $etudiant->unreadNotifications()
            ->findOrFail($id);
        
        $notification->markAsRead();
        
        return redirect()->back()->with('success', 'Notification marquée comme lue.');
    }

    /**
     * Marquer toutes les notifications comme lues
     */
    public function markAllAsRead()
    {
        $etudiant = Auth::guard('etudiant')->user();
        
        $etudiant->unreadNotifications()->update(['read_at' => now()]);
        
        return redirect()->back()->with('success', 'Toutes les notifications ont été marquées comme lues.');
    }
}