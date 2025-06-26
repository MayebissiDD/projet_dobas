<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\School;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SchoolController extends Controller
{
    public function index()
    {
        $schools = School::latest()->paginate(20);
        return Inertia::render('Admin/Ecoles', [
            'schools' => $schools
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/EcolesCreate');
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'ville' => 'nullable|string|max:255',
            'pays' => 'nullable|string|max:255',
            'type' => 'nullable|string|max:100',
            'logo' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'site_web' => 'nullable|url',
            'contact' => 'nullable|string|max:255',
        ]);
        School::create($request->all());
        return redirect()->route('admin.ecoles.index')->with('success', 'École ajoutée.');
    }

    public function edit($id)
    {
        $school = School::findOrFail($id);
        return Inertia::render('Admin/EcolesEdit', [
            'school' => $school
        ]);
    }

    public function update(Request $request, $id)
    {
        $school = School::findOrFail($id);
        $school->update($request->all());
        return redirect()->route('admin.ecoles.index')->with('success', 'École modifiée.');
    }

    public function destroy($id)
    {
        $school = School::findOrFail($id);
        $school->delete();
        return redirect()->route('admin.ecoles.index')->with('success', 'École supprimée.');
    }
}
