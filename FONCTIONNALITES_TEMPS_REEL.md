# Fonctionnalites Temps Reel - Intime & Co

L'application utilise Supabase Realtime pour plusieurs fonctionnalites en temps reel.

## 1. Annonces dynamiques (Site client)

### Fonctionnement
- Le site client s'abonne aux changements de la table `settings`
- Quand l'admin modifie le texte de l'annonce dans les parametres
- Le texte de la bande d'annonce se met a jour automatiquement sans rechargement

### Code
```javascript
// Dans App.jsx
useEffect(() => {
  const unsubscribe = subscribeToSettings((payload) => {
    if (payload.new.key === 'announcement_text') {
      setAnnouncementText(payload.new.value);
    }
  });

  return () => unsubscribe();
}, []);
```

### Test
1. Ouvrir le site client dans un onglet
2. Ouvrir l'admin dans un autre onglet
3. Dans l'admin, aller dans Parametres
4. Modifier le texte de l'annonce
5. Sauvegarder
6. Observer le texte sur le site client se mettre a jour instantanement

## 2. Notifications nouvelles commandes (Admin)

### Fonctionnement
- Le dashboard admin s'abonne aux insertions dans la table `orders`
- Quand un client passe une commande sur le site
- L'admin recoit une notification immediatement
- Le compteur "Commandes en attente" se met a jour

### Code
```javascript
// Dans Dashboard.jsx
useEffect(() => {
  const channel = supabase
    .channel('dashboard-orders')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'orders',
      },
      (payload) => {
        loadData();
        const order = payload.new;
        alert(`Nouvelle commande recue — ${order.order_number}`);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);
```

### Test
1. Ouvrir l'admin et aller sur le dashboard
2. Dans un autre onglet, ouvrir le site client
3. Ajouter des produits au panier
4. Finaliser la commande
5. Observer la notification apparaitre instantanement dans l'admin

## 3. Mise a jour des statistiques (Admin)

### Fonctionnement
- Les statistiques du dashboard se rechargent automatiquement
- Commandes du jour
- Chiffre d'affaires
- Commandes en attente
- Tout se met a jour en temps reel

### Impact
L'admin n'a pas besoin de recharger la page pour voir:
- Les nouvelles commandes
- Les changements de statut
- Les nouveaux produits ajoutes

## Configuration Supabase Realtime

### Activer Realtime sur les tables

Dans Supabase Dashboard > Database > Replication:

1. Activer Realtime pour la table `orders`
2. Activer Realtime pour la table `settings`

### Verifier les abonnements

Dans Supabase Dashboard > Database > Extensions:
- Verifier que l'extension `pg_stat_statements` est activee
- Verifier que l'extension `supabase_realtime` est activee

## Performance

### Optimisations
- Les abonnements sont nettoyes au demontage des composants
- Utilisation de channels nommes pour eviter les conflits
- Filtrage des evenements par type (INSERT, UPDATE, DELETE)
- Limitation des mises a jour aux champs pertinents

### Limites
- Maximum 100 connexions Realtime simultanees sur le plan gratuit
- Latence ~50-200ms selon la region
- Les evenements sont garantis dans l'ordre

## Deboggage

### Verifier les abonnements actifs
```javascript
const channels = supabase.getChannels();
console.log('Active channels:', channels);
```

### Tester manuellement
```javascript
// Dans la console du navigateur
const channel = supabase
  .channel('test')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'orders'
  }, (payload) => {
    console.log('Change received!', payload);
  })
  .subscribe();
```

### Problemes courants

**Les notifications n'arrivent pas**
- Verifier que Realtime est active sur la table
- Verifier les RLS policies (SELECT doit etre autorise)
- Verifier la connexion Supabase dans la console

**Multiples notifications**
- Verifier qu'il n'y a pas de double abonnement
- S'assurer que le cleanup est fait au demontage

**Delai important**
- Verifier la region Supabase (plus proche = plus rapide)
- Verifier la connexion internet
- Les notifications DB peuvent prendre jusqu'a 500ms

## Cas d'usage futurs possibles

### Stock en temps reel
Afficher le stock restant qui se met a jour quand un autre client achete

### Chat support
Support client en temps reel entre admin et clients

### Tableau de suivi des livraisons
Mise a jour automatique du statut de livraison

### Notifications push
Envoyer des notifications navigateur aux admins
