Nettoyage des migrations :
- Garder uniquement la migration principale pour chaque table.
- Supprimer les doublons et les migrations inutiles (ex : add_bourse_id_to_dossiers_table.php si déjà inclus dans create_dossiers_table.php).
- Garder la migration schools la plus ancienne (2025_05_27_232851_create_schools_table.php) et supprimer 2025_06_26_120000_create_schools_table.php.
- Garder la migration bourses renommée (2025_06_25_000000_create_bourses_table.php) et supprimer 2025_06_26_160000_create_bourses_table.php.
- Supprimer toutes les migrations add_school_id, add_choix_ecoles, add_filiere_affectee, add_bourse_id si déjà dans la migration dossiers.
- Vérifier l'ordre : users, schools, bourses, dossiers, payments, activity_logs, etc.
