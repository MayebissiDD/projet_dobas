<?php

namespace App\Http\Controllers\Agent;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Carbon;

class AgentNotificationController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Récupérer toutes les notifications groupées par date
        $notifications = $user->notifications->groupBy(function ($notification) {
            return Carbon::parse($notification->created_at)->format('Y-m-d');
        });

        return Inertia::render('Agent/Notifications', [
            'notifications' => $notifications,
            'unreadCount' => $user->unreadNotifications->count(),
        ]);
    }

    public function markAllAsRead()
    {
        $user = Auth::user();
        $user->unreadNotifications->markAsRead();

        return redirect()->back()->with('success', 'Toutes les notifications ont été marquées comme lues.');
    }

    public function markAsRead($id)
    {
        $user = Auth::user();
        $notification = $user->unreadNotifications()->findOrFail($id);
        $notification->markAsRead();

        return redirect()->back()->with('success', 'Notification marquée comme lue.');
    }
}
