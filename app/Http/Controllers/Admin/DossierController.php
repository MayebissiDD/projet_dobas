<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Dossier;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Response as FileResponse;
use League\Csv\Writer;
use Dompdf\Dompdf;
use Dompdf\Options;

class DossierController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request): Response
    {
        $query = Dossier::with(['bourse', 'etudiant', 'pieces.piece']);

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('nom', 'like', "%$search%")
                    ->orWhere('prenom', 'like', "%$search%")
                    ->orWhere('email', 'like', "%$search%");
            });
        }

        $sortBy = $request->input('sortBy', 'created_at');
        $sortDir = $request->input('sortDir', 'desc');
        $query->orderBy($sortBy, $sortDir);

        $dossiers = $query->paginate(20)->appends($request->only('search', 'sortBy', 'sortDir'));

        return Inertia::render('Admin/Dossiers', [
            'dossiers' => $dossiers,
            'filters' => $request->only('search', 'sortBy', 'sortDir'),
        ]);
    }

    public function exportCsv()
    {
        $dossiers = Dossier::with('bourse', 'etudiant')->get();

        $csv = Writer::createFromString('');
        $csv->insertOne(['ID', 'Nom', 'Prénom', 'Email', 'Bourse']);

        foreach ($dossiers as $dossier) {
            $csv->insertOne([
                $dossier->id,
                $dossier->nom,
                $dossier->prenom,
                $dossier->email,
                $dossier->bourse?->titre ?? '',
            ]);
        }

        return FileResponse::make($csv->toString(), 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="dossiers.csv"',
        ]);
    }

    public function exportPdf()
    {
        $dossiers = Dossier::with('bourse', 'etudiant')->get();

        $html = view('exports.dossiers_pdf', compact('dossiers'))->render();

        $pdf = new Dompdf();
        $pdf->loadHtml($html);
        $pdf->setPaper('A4', 'portrait');
        $pdf->render();

        return response($pdf->output(), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="dossiers.pdf"',
        ]);
    }

    public function show($id): Response
    {
        $dossier = Dossier::with(['bourse', 'etudiant', 'pieces.piece'])->findOrFail($id);
        $this->authorize('view', $dossier);
        return Inertia::render('Admin/DossierShow', ['dossier' => $dossier]);
    }

    public function edit($id): Response
    {
        $dossier = Dossier::findOrFail($id);
        return Inertia::render('Admin/DossierEdit', ['dossier' => $dossier]);
    }

    public function update(Request $request, $id)
    {
        $dossier = Dossier::findOrFail($id);

        $validated = $request->validate([
            'nom' => 'required|string',
            'prenom' => 'required|string',
            'email' => 'required|email',
            'telephone' => 'required|string',
            'diplome' => 'required|string',
            'annee_diplome' => 'required|string',
            'paiement_mode' => 'nullable|string',
            'niveau' => 'nullable|string',
            'commentaire' => 'nullable|string',
        ]);

        $dossier->update($validated);

        return redirect()->route('admin.dossiers.index')->with('success', 'Dossier modifié avec succès.');
    }

    public function destroy($id)
    {
        Dossier::destroy($id);
        return redirect()->route('admin.dossiers.index')->with('success', 'Dossier supprimé avec succès.');
    }

    public function apiList()
    {
        $dossiers = Dossier::with(['bourse', 'etudiant', 'pieces.piece'])->latest()->paginate(20);
        return response()->json(['dossiers' => $dossiers]);
    }
}
