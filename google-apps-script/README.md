# Google Apps Script — Quiz de positionnement IA

Script de soumission des resultats du quiz. Stocke les reponses dans un Google Sheet et envoie un email HTML avec les resultats au participant.

## Prerequis

- Un compte Google avec acces a Google Sheets et Google Apps Script
- Le fichier `Code.gs` de ce dossier

## Installation

### 1. Creer le Google Sheet

1. Ouvrir [Google Sheets](https://sheets.google.com) et creer un nouveau classeur
2. Copier l'identifiant du classeur depuis l'URL :
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_ICI/edit
   ```

### 2. Configurer le script

1. Dans le classeur, aller dans **Extensions > Apps Script**
2. Supprimer le contenu par defaut et coller le contenu de `Code.gs`
3. Remplacer la valeur de `SPREADSHEET_ID` par l'identifiant copie a l'etape precedente :
   ```javascript
   const SPREADSHEET_ID = 'votre_id_ici';
   ```
4. Sauvegarder le projet (Ctrl+S)

### 3. Initialiser les colonnes

1. Dans l'editeur Apps Script, selectionner la fonction `setupHeaders` dans le menu deroulant
2. Cliquer sur **Executer**
3. Autoriser les permissions demandees (acces Sheets et Mail)
4. Verifier que la feuille "Responses" contient maintenant la ligne d'en-tete

### 4. Deployer en tant qu'application Web

1. Cliquer sur **Deployer > Nouveau deploiement**
2. Selectionner le type **Application Web**
3. Parametres :
   - **Executer en tant que** : Moi
   - **Qui a acces** : Tout le monde
4. Cliquer sur **Deployer**
5. Copier l'URL de deploiement

### 5. Connecter au site

Coller l'URL de deploiement dans `src/config.ts` du projet principal, dans le champ prevu pour l'endpoint Google Apps Script.

## Test

Verifier que le deploiement fonctionne avec cette commande curl :

```bash
curl -X POST 'DEPLOYMENT_URL' \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@test.com","score":20,"scorePct":50,"level":3,"levelTitle":"Agent guidé","diagnostic":"Vous avez une bonne base.","nextGoal":"Maîtriser le cadrage avancé.","plan":["Step 1","Step 2"],"recommendation":"Suivez la formation complète.","answers":[{"dimension":"Usage quotidien","chosenLabel":"Je délègue...","points":3}],"siteUrl":"https://example.com/"}'
```

Reponse attendue :

```json
{ "success": true }
```

Le health check est disponible via GET :

```bash
curl 'DEPLOYMENT_URL'
```

Reponse attendue :

```json
{ "status": "ok" }
```

## Colonnes du Google Sheet

| # | Colonne | Description |
|---|---------|-------------|
| 1 | Timestamp | Date et heure de soumission |
| 2 | Email | Adresse email du participant |
| 3 | Score brut | Score total en points |
| 4 | Score % | Score en pourcentage |
| 5 | Niveau | Numero du niveau (1-5) |
| 6 | Titre du niveau | Intitule du niveau |
| 7-16 | Dimensions | 10 colonnes, une par dimension (format : "Label (X/4)") |
| 17 | Diagnostic | Texte de diagnostic personnalise |
| 18 | Prochain objectif | Objectif suivant recommande |
| 19 | Plan | Etapes du plan a 30 jours, separees par " \| " |
| 20 | Recommandation | Recommandation finale |

## Mise a jour du deploiement

Apres chaque modification du script :

1. Aller dans **Deployer > Gerer les deploiements**
2. Cliquer sur l'icone crayon du deploiement actif
3. Selectionner **Nouvelle version** dans le menu deroulant
4. Cliquer sur **Deployer**

L'URL reste la meme, pas besoin de la mettre a jour dans le projet.
