<?php
namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\LygosService;
use App\Models\Payment;

class PaymentController extends Controller
{
    protected $lygos;

    public function __construct(LygosService $lygos)
    {
        $this->lygos = $lygos;
    }

    /**
     * Traite le paiement Lygos depuis le formulaire public (Postuler)
     */
    public function pay(Request $request)
    {
        $request->validate([
            'fullName' => 'required',
            'email' => 'required|email',
            'telephone' => 'required',
            'type_bourse' => 'required',
            'montant' => 'required|numeric|min:1',
        ]);

        // Appel réel à l'API Lygos
        $response = \Illuminate\Support\Facades\Http::withHeaders([
            'api-key' => $this->lygos->getApiKey(),
            'Content-Type' => 'application/json',
        ])->post('https://api.lygosapp.com/v1/gateway', [
            'message' => '',
            'success_url' => url('/postuler?success=1'),
            'failure_url' => url('/postuler?error=1'),
            'amount' => $request->montant,
            'shop_name' => 'DOBAS',
        ]);

        if ($response->successful() && isset($response['link'])) {
            return response()->json([
                'success' => true,
                'link' => $response['link'],
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création du paiement Lygos',
            ], 500);
        }
    }
}
