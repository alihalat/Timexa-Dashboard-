Timexa - Dashboard de Gestion de Temps

Timexa est une application web moderne de gestion de feuilles de temps (Timesheet). Elle permet aux employés de saisir leurs heures et aux administrateurs de superviser l'activité globale, le tout via une interface fluide et responsive.
Fonctionnalités Principales

L'application est divisée en deux interfaces distinctes selon le rôle de l'utilisateur :👤 Espace Employé (User)
* **Tableau de bord personnel** : Vue d'ensemble des heures travaillées et progression hebdomadaire.
* **Gestion des Shifts** : Ajout, modification et suppression des créneaux de travail (Date, Heure début/fin, Tâche, Commentaire).
* **Statistiques en temps réel** : Calcul automatique de la durée des shifts et barre de progression (objectif 40h/semaine).
* **Indicateurs visuels** : Statut de complétion de la semaine (En cours / Complet).
🛡️ Espace Administrateur (Admin)
* **Vue globale** : Tableau de bord affichant le total des employés, le volume d'heures total et le nombre de shifts.
* **Suivi des employés** : Liste filtrable des employés avec leurs totaux d'heures individuels.
* **Détails des feuilles de temps** : Consultation détaillée de l'historique des shifts pour chaque employé.
🛠 Stack Technique

Ce projet est le **Frontend** de l'application, construit avec les technologies suivantes :

* **Framework** : [Next.js 15+ (App Router)](https://nextjs.org/)
* **Langage** : TypeScript
* **Styling** : [Tailwind CSS v4](https://tailwindcss.com/)
* **Composants UI** : [Shadcn/UI](https://ui.shadcn.com/) (basé sur Radix UI)
* **Icones** : Lucide React
* **Graphiques** : Recharts
* **Validation** : Zod & React Hook Form
* **Gestion de dates** : date-fnsStructure du Projet

L'architecture suit les standards Next.js App Router :

```bash
├── app/                  # Pages et Layouts (App Router)
│   ├── layout.tsx        # Layout racine
│   ├── page.tsx          # Page d'accueil (Redirection Auth)
│   └── globals.css       # Styles globaux et variables CSS
├── components/           # Composants Réutilisables
│   ├── auth/             # Composants de connexion
│   ├── dashboard/        # Dashboards Admin et User
│   ├── timesheet/        # Tableaux, Modales et Stats
│   ├── layout/           # Headers et navigation
│   └── ui/               # Composants de base (Shadcn)
├── lib/                  # Utilitaires et Configuration API
│   ├── api.ts            # Appels API (Fetch wrappers)
│   └── utils.ts          # Helpers (clsx, twMerge)
└── public/               # Assets statiques (Logos, Icons)
