# Checklist Deploiement - Intime & Co

## Avant le deploiement

### 1. Supabase Setup ✓
- [x] Compte Supabase cree
- [x] Projet Supabase cree
- [x] URL et clefs notees
- [ ] Schema SQL execute (`supabase-schema.sql`)
- [ ] Bucket `product-images` cree et public
- [ ] Compte admin cree dans Authentication
- [ ] Settings initiaux inseres
- [ ] (Optionnel) Donnees test inserees (`exemples-donnees.sql`)

### 2. Variables d'environnement
- [x] Fichier `.env` cree localement
- [ ] Variables ajoutees sur plateforme de deploiement:
  - `REACT_APP_SUPABASE_URL`
  - `REACT_APP_SUPABASE_ANON_KEY`

### 3. Verification locale
- [ ] `npm install` execute
- [ ] `npm run dev` fonctionne
- [ ] Site client accessible sur `http://localhost:5173`
- [ ] Admin accessible sur `http://localhost:5173/admin`
- [ ] Connexion admin reussie
- [ ] Creation produit testee
- [ ] Upload image testee
- [ ] Creation commande testee
- [ ] Code promo teste
- [ ] Notifications temps reel testees

### 4. Tests fonctionnels

#### Site Client
- [ ] Affichage catalogue produits
- [ ] Filtres et recherche fonctionnels
- [ ] Ajout panier fonctionne
- [ ] Checkout complet fonctionne
- [ ] Code promo s'applique
- [ ] Confirmation commande affichee
- [ ] Numero commande genere

#### Panneau Admin
- [ ] Connexion admin reussie
- [ ] Dashboard affiche stats
- [ ] Liste commandes visible
- [ ] Detail commande complet
- [ ] Changement statut fonctionne
- [ ] Impression bon livraison OK
- [ ] Ajout produit fonctionne
- [ ] Upload images fonctionne
- [ ] Creation code promo OK
- [ ] Modification settings OK
- [ ] Notification nouvelle commande recue

## Deploiement sur Vercel

### 1. Preparation
- [ ] Code push sur GitHub/GitLab/Bitbucket
- [ ] Fichier `vercel.json` present
- [ ] `.env` dans `.gitignore`

### 2. Configuration Vercel
1. Aller sur https://vercel.com
2. Cliquer "New Project"
3. Importer le repo
4. Configuration:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

5. Ajouter les variables d'environnement:
   - Cliquer "Environment Variables"
   - Ajouter:
     ```
     REACT_APP_SUPABASE_URL = https://kbsdfazqwkobdfkljcep.supabase.co
     REACT_APP_SUPABASE_ANON_KEY = votre_clef_anon
     ```

6. Cliquer "Deploy"

### 3. Verification post-deploiement
- [ ] Site deploye accessible
- [ ] Admin accessible sur `/admin`
- [ ] Connexion admin fonctionne
- [ ] Produits s'affichent
- [ ] Images chargent correctement
- [ ] Commande de test reussie
- [ ] Email confirmation (si configure)

## Deploiement sur Netlify

### 1. Configuration Netlify
1. Aller sur https://netlify.com
2. Cliquer "New site from Git"
3. Connecter le repo
4. Configuration:
   - Build command: `npm run build`
   - Publish directory: `dist`

5. Ajouter les variables:
   - Settings > Environment > Environment variables
   - Ajouter les memes variables que Vercel

6. Dans Settings > Build & Deploy > Post processing:
   - Activer "Asset optimization"
   - Activer "Pretty URLs"

7. Creer fichier `_redirects` dans `public/`:
   ```
   /admin/* /index.html 200
   /* /index.html 200
   ```

8. Deploy

## Apres deploiement

### 1. Configuration domaine (optionnel)
- [ ] Domaine personnalise ajoute
- [ ] DNS configure
- [ ] HTTPS active
- [ ] Certificat SSL OK

### 2. Monitoring
- [ ] Analytics configure (Google Analytics, etc.)
- [ ] Supabase logs surveilles
- [ ] Erreurs 404/500 verifiees

### 3. SEO (optionnel)
- [ ] Meta tags ajoutes
- [ ] Open Graph images
- [ ] Sitemap genere
- [ ] robots.txt cree

### 4. Performance
- [ ] Score Lighthouse > 90
- [ ] Images optimisees
- [ ] Temps chargement < 3s
- [ ] Mobile friendly

### 5. Securite
- [ ] HTTPS force
- [ ] Headers securite configures
- [ ] RLS Supabase verifie
- [ ] Pas de credentials en dur
- [ ] .env non committe

## Maintenance

### Quotidien
- [ ] Verifier nouvelles commandes
- [ ] Repondre aux clients
- [ ] Mettre a jour stock

### Hebdomadaire
- [ ] Backup Supabase
- [ ] Verifier logs erreurs
- [ ] Analytics revues

### Mensuel
- [ ] Audit securite
- [ ] Mise a jour dependances
- [ ] Optimisation performance
- [ ] Revue codes promo

## Problemes courants

### Site ne charge pas
1. Verifier variables env sur plateforme
2. Verifier build logs
3. Verifier console navigateur

### Admin ne se connecte pas
1. Verifier compte existe dans Supabase Auth
2. Verifier URL Supabase correcte
3. Verifier RLS policies activees

### Images ne chargent pas
1. Verifier bucket `product-images` existe
2. Verifier bucket est public
3. Verifier storage policies

### Commandes ne creent pas
1. Verifier RLS policy INSERT sur orders
2. Verifier console pour erreurs
3. Verifier Supabase logs

## Support

### Resources
- Documentation Supabase: https://supabase.com/docs
- Documentation Vite: https://vitejs.dev
- Documentation React: https://react.dev

### Contact
- Supabase Support: https://supabase.com/support
- Community: Discord Supabase

## Checklist finale

Avant de declarer le deploiement reussi:

- [ ] Site client accessible publiquement
- [ ] Admin accessible et fonctionnel
- [ ] Au moins 3 produits ajoutes avec images
- [ ] 1 commande test passee avec succes
- [ ] 1 code promo actif cree
- [ ] Parametres boutique configures
- [ ] Compte admin securise (mot de passe fort)
- [ ] Backup Supabase configure
- [ ] Monitoring active
- [ ] Documentation fournie au client

Une fois tout coche, le site est pret pour production!
