<?php

namespace App\Http\Controllers;

use App\Http\Requests\CheckSMSStatusRequest;
use App\Http\Requests\SendCustomSMSRequest;
use App\Http\Requests\SendSMSRequest;
use App\Services\MTNTindaService;
use Illuminate\Http\Request;

class MTNTindaController extends Controller
{
    protected $mtnTindaService;

    public function __construct(MTNTindaService $mtnTindaService)
    {
        $this->mtnTindaService = $mtnTindaService;
    }

    /**
     * Envoyer un SMS non personnalisé
     */
    public function sendSMS(SendSMSRequest $request)
    {
        $validated = $request->validated();
        
        $response = $this->mtnTindaService->sendSMS(
            $validated['message'],
            $validated['receivers'],
            $validated['sender'] ?? null,
            $validated['email'] ?? null,
            $validated['msg_mail'] ?? null,
            $validated['objet_mail'] ?? null,
            $validated['date_envois'] ?? null,
            $validated['external_id'] ?? null,
            $validated['callback_url'] ?? null
        );

        return response()->json($response);
    }

    /**
     * Envoyer un SMS personnalisé
     */
    public function sendCustomSMS(SendCustomSMSRequest $request)
    {
        $validated = $request->validated();
        
        $response = $this->mtnTindaService->sendCustomSMS(
            $validated['message'],
            $validated['params'],
            $validated['sender'] ?? null,
            $validated['is_email'] ?? null,
            $validated['msg_mail'] ?? null,
            $validated['objet_mail'] ?? null,
            $validated['date_envois'] ?? null,
            $validated['external_id'] ?? null,
            $validated['callback_url'] ?? null
        );

        return response()->json($response);
    }

    /**
     * Vérifier le statut d'un SMS
     */
    public function checkSMSStatus(CheckSMSStatusRequest $request)
    {
        $validated = $request->validated();
        
        $response = $this->mtnTindaService->checkSMSStatus($validated['id']);

        return response()->json($response);
    }
}