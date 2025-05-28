<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Création des rôles
        $roles = ['etudiant', 'agent', 'admin'];
        foreach ($roles as $role) {
            Role::firstOrCreate(['name' => $role]);
        }

        // Création des permissions
        $permissions = [
            'voir_bourses', 'postuler_bourse', 'consulter_notifications',
            'gérer_candidatures', 'valider_dossier', 'rejet_dossier', 'affecter_ecole',
            'gérer_bourses', 'gérer_utilisateurs', 'gérer_statistiques'
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Attribution
        Role::findByName('etudiant')->givePermissionTo([
            'voir_bourses', 'postuler_bourse', 'consulter_notifications'
        ]);

        Role::findByName('agent')->givePermissionTo([
            'gérer_candidatures', 'valider_dossier', 'rejet_dossier', 'affecter_ecole'
        ]);

        Role::findByName('admin')->givePermissionTo(Permission::all());
    }
}
