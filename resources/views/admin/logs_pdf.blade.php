<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Rapport d'activité</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ccc; padding: 6px; text-align: left; }
        th { background: #f3f3f3; }
    </style>
</head>
<body>
    <h2>Rapport d'activité</h2>
    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Utilisateur</th>
                <th>Action</th>
                <th>Objet</th>
                <th>Description</th>
                <th>Date</th>
            </tr>
        </thead>
        <tbody>
        @foreach($logs as $log)
            <tr>
                <td>{{ $log->id }}</td>
                <td>{{ $log->user?->name ?? 'Système' }}</td>
                <td>{{ $log->action }}</td>
                <td>{{ $log->subject_type }}</td>
                <td>{{ $log->description }}</td>
                <td>{{ $log->created_at }}</td>
            </tr>
        @endforeach
        </tbody>
    </table>
</body>
</html>
