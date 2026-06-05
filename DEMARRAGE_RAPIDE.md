# Demarrage Rapide - Intime & Co

## Etape 1: Installation

```bash
npm install
```

## Etape 2: Configuration Supabase (DEJA FAIT)

Les credentials Supabase sont deja dans le fichier `.env`:
- URL: https://kbsdfazqwkobdfkljcep.supabase.co
- Tables et bucket deja crees

## Etape 3: Initialiser la base de donnees

Dans le dashboard Supabase (https://supabase.com/dashboard):

1. Aller dans **SQL Editor**
2. Copier tout le contenu du fichier `supabase-schema.sql`
3. Executer le script
4. Verifier que les tables sont creees dans **Table Editor**

## Etape 4: Creer le bucket d'images

1. Aller dans **Storage**
2. Creer un nouveau bucket nomme: `product-images`
3. Cocher "Public bucket"
4. Sauvegarder

## Etape 5: Creer un compte administrateur

1. Aller dans **Authentication** > **Users**
2. Cliquer sur "Add user"
3. Entrer:
   - Email: admin@intime.dz (ou autre)
   - Password: choisir un mot de passe securise
4. Confirmer

## Etape 6: Lancer l'application

```bash
npm run dev
```

L'application sera disponible sur: http://localhost:5173

## Acces

- **Site client**: http://localhost:5173
- **Panneau admin**: http://localhost:5173/admin

### Connexion admin
Utiliser l'email et mot de passe crees a l'etape 5.

## Tester l'application

### Cote client:
1. Parcourir le catalogue (sera vide au debut)
2. Tester le panier
3. Passer une commande test

### Cote admin:
1. Se connecter sur `/admin`
2. Ajouter des produits avec images
3. Creer des codes promo
4. Voir les commandes en temps reel
5. Modifier les parametres

## Ajouter des produits

1. Aller sur `/admin`
2. Cliquer sur **Produits**
3. Cliquer sur **Ajouter un produit**
4. Remplir:
   - Nom
   - Categorie
   - Prix
   - Stock
   - Tailles et couleurs
   - Uploader des images
5. Activer le produit
6. Enregistrer

Le produit apparaitra immediatement sur le site client!

## Fonctionnalites principales

### Site client:
- Catalogue filtrable
- Recherche
- Panier avec codes promo
- Checkout complet
- Annonces en temps reel

### Panneau admin:
- Dashboard avec stats
- Gestion completes des commandes
- Gestion des produits avec upload
- Codes promo
- Parametres de la boutique
- Notifications temps reel
- Impression bons de livraison

## Problemes courants

### "Failed to fetch products"
- Verifier que les tables sont creees dans Supabase
- Verifier les credentials dans `.env`
- Verifier les RLS policies dans Supabase

### "Upload failed"
- Verifier que le bucket `product-images` existe
- Verifier qu'il est public
- Verifier les storage policies

### Connexion admin impossible
- Verifier que le compte existe dans Authentication
- Verifier email et mot de passe
- Essayer de reset le mot de passe

## Support

Pour toute question, verifier:
1. Les tables Supabase sont creees
2. Le bucket storage existe et est public
3. Le compte admin existe
4. Les variables `.env` sont correctes
