<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Export PDF des dossiers</title>
    <style>
        body { font-family: sans-serif; }
        table { width: 100%; border-collapse: collapse; font-size: 12px; }
        th, td { border: 1px solid #ddd; padding: 6px; }
        th { background: #f0f0f0; }
    </style>
</head>
<body>
    <h2>Liste des dossiers</h2>
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Email</th>
                <th>Bourse</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($dossiers as $dossier)
                <tr>
                    <td>{{ $dossier->id }}</td>
                    <td>{{ $dossier->nom }}</td>
                    <td>{{ $dossier->prenom }}</td>
                    <td>{{ $dossier->email }}</td>
                    <td>{{ $dossier->bourse?->titre }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
