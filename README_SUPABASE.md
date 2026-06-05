# Intime & Co - E-commerce avec Supabase

Site e-commerce complet avec panneau d'administration pour la boutique de lingerie Intime & Co.

## Fonctionnalites

### Site Client
- Catalogue de produits avec filtres et tri
- Panier d'achat avec codes promo
- Systeme de commande complet
- Paiement a la livraison, BaridiMob, CCP
- Annonces en temps reel

### Panneau Admin (`/admin`)
- Authentification securisee
- Tableau de bord avec statistiques
- Gestion des commandes avec statuts
- Gestion des produits avec upload d'images
- Gestion des codes promo
- Parametres de la boutique
- Impression des bons de livraison
- Notifications temps reel des nouvelles commandes

## Installation

### 1. Cloner le projet
```bash
git clone <repo-url>
cd intime-ecommerce
npm install
```

### 2. Configuration Supabase

Le projet est configure avec les credentials Supabase fournis.

Les tables et le bucket ont deja ete crees dans Supabase.

### 3. Variables d'environnement

Le fichier `.env` est deja configure avec :
```
REACT_APP_SUPABASE_URL=https://kbsdfazqwkobdfkljcep.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Creer un compte admin

Dans le dashboard Supabase:
1. Aller dans Authentication > Users
2. Cliquer sur "Add user"
3. Creer un compte avec email et mot de passe
4. Ce compte pourra se connecter sur `/admin`

### 5. Inserer les donnees initiales (settings)

Dans SQL Editor de Supabase, executer:

```sql
INSERT INTO settings (key, value) VALUES
('store_name', 'Intime & Co'),
('announcement_text', 'Livraison gratuite des 3000 DZD d''achat — Paiement a la livraison disponible'),
('delivery_fee', '500'),
('free_delivery_threshold', '3000'),
('instagram_url', 'https://www.instagram.com/inti.me15'),
('store_phone', ''),
('store_address', 'Blida, Algerie'),
('store_hours', 'Lun–Sam : 09h00 – 19h00');
```

### 6. Lancer le projet

```bash
npm run dev
```

- Site client: `http://localhost:5173`
- Panneau admin: `http://localhost:5173/admin`

## Structure du projet

```
src/
├── admin/                    # Panneau d'administration
│   ├── components/          # Composants admin
│   ├── pages/               # Pages admin
│   └── AdminApp.jsx         # App admin principal
├── components/              # Composants client
├── supabase/                # Integration Supabase
│   ├── client.js            # Client Supabase
│   ├── products.js          # Fonctions produits
│   ├── orders.js            # Fonctions commandes
│   ├── promos.js            # Fonctions codes promo
│   ├── settings.js          # Fonctions parametres
│   └── storage.js           # Upload images
├── data/                    # Donnees JSON (legacy)
├── App.jsx                  # App client principal
└── main.jsx                 # Point d'entree avec routing
```

## Utilisation

### Ajouter des produits
1. Aller sur `/admin`
2. Se connecter avec le compte admin cree
3. Aller dans "Produits"
4. Cliquer sur "Ajouter un produit"
5. Remplir le formulaire et uploader les images
6. Enregistrer

### Gerer les commandes
1. Les nouvelles commandes apparaissent en temps reel
2. Cliquer sur "Voir" pour voir les details
3. Changer le statut de la commande
4. Imprimer le bon de livraison si necessaire

### Creer un code promo
1. Aller dans "Codes promo"
2. Cliquer sur "Creer un code"
3. Configurer le code (pourcentage ou montant fixe)
4. Definir les conditions (minimum, maximum d'utilisations, expiration)

## Technologies

- React 19
- Vite
- Supabase (Backend, Auth, Storage, Realtime)
- Lucide React (Icons)

## Notes importantes

- Les clients ne creent PAS de comptes
- Seul l'admin se connecte (sur `/admin`)
- Les images sont stockees dans Supabase Storage
- Les commandes sont creees anonymement par les clients
- Le stock est decremente automatiquement a chaque commande
- Les codes promo sont valides en temps reel
