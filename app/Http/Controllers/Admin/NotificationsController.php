<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class NotificationsController extends Controller
{
    public function index(Request $request)
    {
        // Récupère les notifications non lues de l'utilisateur connecté (admin)
        $notifications = Auth::user()->notifications()->latest()->take(50)->get();
        return Inertia::render('Admin/Notifications', [
            'notifications' => $notifications,
        ]);
    }
}
