<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

# Prérequis et installation de l’application DOBAS

## Prérequis système
- PHP >= 8.1
- Composer
- Node.js >= 16.x et npm
- MySQL ou MariaDB
- Accès à un compte Gmail (pour l’envoi d’emails)

## Installation

1. **Cloner le dépôt**
   ```sh
   git clone <votre-repo-git> && cd projet_dobas
   ```
2. **Installer les dépendances PHP**
   ```sh
   composer install
   ```
3. **Installer les dépendances front-end**
   ```sh
   npm install
   ```
4. **Copier le fichier d’exemple d’environnement**
   ```sh
   cp .env.example .env
   ```
5. **Générer la clé d’application**
   ```sh
   php artisan key:generate
   ```
6. **Configurer la base de données**
   - Renseignez les variables `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` dans `.env`.
7. **Configurer l’envoi d’emails (Gmail recommandé)**
   - Activez la validation en deux étapes sur votre compte Google.
   - Générez un mot de passe d’application (voir documentation ou README ci-dessous).
   - Mettez à jour la section mail dans `.env` :
     ```env
     MAIL_MAILER=smtp
     MAIL_HOST=smtp.gmail.com
     MAIL_PORT=587
     MAIL_USERNAME=your_gmail@gmail.com
     MAIL_PASSWORD=your_app_password
     MAIL_ENCRYPTION=tls
     MAIL_FROM_ADDRESS=your_gmail@gmail.com
     MAIL_FROM_NAME="DOBAS"
     ```
8. **Lancer les migrations et seeders**
   ```sh
   php artisan migrate --seed
   ```
9. **Compiler les assets front-end**
   ```sh
   npm run build
   ```
10. **Démarrer le serveur**
    ```sh
    php artisan serve
    ```

# Présentation du projet DOBAS

DOBAS est une application web de gestion des bourses d’études, conçue pour digitaliser et fiabiliser l’ensemble du workflow de candidature, d’instruction, de paiement et de suivi des étudiants. Elle s’adresse aux étudiants, agents instructeurs et administrateurs, avec une gestion stricte des rôles et des notifications.

## Fonctionnalités principales
- **Soumission de candidatures** par les étudiants (création de dossier, pièces jointes, choix de bourse, etc.)
- **Instruction des dossiers** par les agents (validation, rejet, affectation à une école/filière)
- **Paiement des frais** (intégration Lygos, Stripe, gestion des statuts, notifications)
- **Notifications** (mail + in-app) pour chaque étape clé (nouvelle candidature, validation, rejet, paiement reçu)
- **Gestion des rôles** (admin, agent, étudiant) avec permissions strictes
- **Exports CSV, statistiques, et suivi d’activité**
- **Purge automatique des dossiers rejetés après 1 mois**
- **Accessibilité et interface moderne (Laravel + React/Inertia)**

## Workflows clés

### 1. Workflow de candidature
- L’étudiant crée un compte, complète son profil et soumet un dossier de candidature.
- Les agents et admins sont notifiés de la nouvelle candidature.
- L’agent instruit le dossier : il peut le valider (et affecter une école/filière) ou le rejeter (avec motif).
- L’étudiant et l’admin sont notifiés de la décision (validation ou rejet).

### 2. Workflow de paiement
- L’étudiant accède à la page de paiement de son dossier (Lygos, Stripe, etc.).
- Après paiement, l’étudiant, les agents et l’admin sont notifiés.
- Les paiements sont vérifiés et validés côté admin/agent.

### 3. Gestion des rôles et accès
- **Admin** : gestion des utilisateurs, écoles, bourses, accès à tous les dossiers, statistiques, exports.
- **Agent** : instruction des dossiers, gestion des paiements, accès restreint à ses dossiers.
- **Étudiant** : gestion de son profil, soumission de candidatures, suivi des paiements et notifications.

### 4. Notifications
- Toutes les notifications critiques sont envoyées par email (Gmail) et dans l’application (Laravel Notifications).
- Les notifications temps réel sont prévues via Pusher/Websockets.

### 5. Sécurité et audit
- Toutes les actions sensibles sont loggées (ActivityLogger).
- Les accès sont strictement contrôlés par policies et middlewares.
- Les dossiers rejetés sont purgés automatiquement après 1 mois.

---

# Pour générer un mot de passe d’application Gmail
1. Activez la validation en deux étapes sur https://myaccount.google.com/security
2. Accédez à « Mots de passe des applications »
3. Générez un mot de passe pour « Mail » et copiez-le dans `MAIL_PASSWORD` (sans espaces).

---

# Pour toute question, consultez la documentation ou contactez DIB DE BOUK allias MAYEBISSI au +242064397707.


## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

You may also try the [Laravel Bootcamp](https://bootcamp.laravel.com), where you will be guided through building a modern Laravel application from scratch.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

- **[Vehikl](https://vehikl.com)**
- **[Tighten Co.](https://tighten.co)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel)**
- **[DevSquad](https://devsquad.com/hire-laravel-developers)**
- **[Redberry](https://redberry.international/laravel-development)**
- **[Active Logic](https://activelogic.com)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
