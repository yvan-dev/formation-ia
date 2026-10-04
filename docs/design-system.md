# AOT Academy — Direction artistique

Cette direction graphique, validée par l’utilisateur, s’applique à l’ensemble du site : accueil, programme, leçons et quiz. Les tokens et composants de production constituent la référence.

## Identité et palette

Une composition éditoriale, des surfaces graphite et un accent violet. Les espaces et séparateurs structurent le contenu ; pas de dégradé, de halo d’interface ou d’ombre pour établir la hiérarchie. Le thème sombre est celui proposé à la première visite, le choix du visiteur est conservé.

| Token              | Sombre    | Clair     | Usage                             |
| ------------------ | --------- | --------- | --------------------------------- |
| `--bg`             | `#141720` | `#F6F7FA` | Fond de page                      |
| `--surface`        | `#1A1E2A` | `#FFFFFF` | Cartes et diagnostic              |
| `--surface-strong` | `#1F2533` | `#EEF1F6` | États neutres et code inline      |
| `--text`           | `#EEF1F6` | `#141720` | Titres et contenu fort            |
| `--muted`          | `#B0BDD0` | `#3D4560` | Paragraphes et interface          |
| `--faint`          | `#94A3BB` | `#566480` | Métadonnées                       |
| `--accent`         | `#B366F5` | `#7A00DF` | Liens et repères                  |
| `--action`         | `#7A00DF` | `#7A00DF` | Action principale, texte blanc    |
| `--action-hover`   | `#5E00AB` | `#5E00AB` | Survol de l’action                |
| `--accent-soft`    | `#211A2E` | `#F2E7FC` | Leçon ou réponse sélectionnée     |
| `--divider`        | `#2A3045` | `#D4DCE8` | Séparateurs décoratifs            |
| `--border`         | `#7080A0` | `#7080A0` | Contours des contrôles            |
| `--focus`          | `#CC99F8` | `#7A00DF` | Focus clavier                     |
| `--success`        | `#33DB9D` | `#007D50` | Validation réellement enregistrée |

Les couleurs sont définies dans `src/styles/global.css`. Réutiliser leurs rôles sémantiques. Les séparateurs décoratifs restent discrets ; les contours des contrôles sont contrastés. Le vert est réservé aux leçons terminées. Toute information d’état possède aussi un libellé ou une icône.

## Typographie et composition

- **DM Sans variable** : identité, titres et interface. Hero à 64–66 px sur grand écran, 31–38 px sur mobile ; sections à 28–36 px.
- **Inter variable** : lecture pédagogique à 16 px / 1,8 ; variante italique incluse.
- **JetBrains Mono** : code et références techniques ; styles normal, gras et italique inclus.
- Fontes WOFF2 locales dans `src/assets/fonts`, avec leurs licences SIL Open Font License. Aucun appel à Google Fonts.
- Titres équilibrés avec `text-wrap: balance`, paragraphes avec `text-wrap: pretty`, données en chiffres tabulaires.
- Conteneur de 1 248 px maximum ; marges de 20 px sur mobile ; article central de 650 px maximum.
- Cartes de rayon 12 px, encadrés de 8 px, boutons en pilule. Listes et séparateurs prennent le relais lorsque des cartes rendraient la page trop dense.

## Illustrations et mouvement

Les cinq illustrations générées pour cette évolution de la DA sont intégrées dans `src/assets/illustrations` en WebP. Astro produit leurs variantes responsives, avec dimensions explicites et `srcset`. Le hero est chargé en priorité, les quatre métiers en chargement différé.

L’image du hero représente un noyau neuronal de verre et de titane, entouré d’orbites et de panneaux holographiques, sans texte visible. Les cinq fichiers possèdent un canal alpha : aucun fond noir incrusté, aucune inversion de couleur selon le thème. Les matériaux clairs et violets fonctionnent sur les surfaces sombres comme claires. La galerie montre développement, architecture, DevOps/QA et produit, chacun avec une légende discrète. Ces visuels représentent les métiers, pas des références clients.

`HeroArtwork.astro` contient l’unique animation du site : orbites SVG en rotation (14 et 20 secondes), balises, pulsation du noyau et panneaux flottants (4 à 6 secondes). Seuls `transform` et `opacity` sont animés ; le bitmap reste immobile. Le bouton natif permet la pause/reprise. `IntersectionObserver`, la visibilité de l’onglet et `prefers-reduced-motion` suspendent les effets lorsque nécessaire. Aucun moteur d’animation supplémentaire.

## Comportements et contenu

- Accueil : une promesse, une action principale vers le quiz, un lien vers le programme, un noyau IA et quatre images métiers. Le parcours utilise trois cartes illustrées par des schémas SVG ; la progression possède cinq cartes à icônes et repères visuels.
- Programme : contenu issu de la collection Astro, modules publiés dans des accordéons natifs et modules en préparation explicitement séparés. Les liens vers un module ouvrent la bonne section.
- Leçons : contenu MDX conservé, identité du module et icônes décoratives des sections, navigation du programme, sommaire sur grand écran, programme dépliable sur mobile, coloration du code selon le thème, pagination et validation de progression.
- Quiz : illustration transparente et repères visuels ; les 10 questions, options, seuils des cinq niveaux, diagnostic, recommandations et plan à 30 jours sont conservés. Les choix sont des radios natives.
- Stockage compatible : `aot-theme`, `progress_<course>`, `placement_quiz_done`, `placement_quiz_level`, `placement_quiz_score`. La progression exclut les doublons et les leçons hors programme publié. Un stockage indisponible ne casse pas l’interface et les échecs d’enregistrement sont signalés.
- Les routes et le préfixe `/formation-ia/` restent ceux du site. Le contenu des 30 leçons continue d’être indexé par Pagefind.

## Accessibilité et validation

Lien d’évitement, focus visible, boutons d’icône nommés, contrôles natifs, `aria-current`, libellés de progression et statut de validation. Le contenu ne dépend pas uniquement de la couleur.

Avant de modifier cette DA : lancer le build, le lint et les tests Playwright ; contrôler les deux thèmes, une largeur de 320 px et un zoom de 200 %. Les tests E2E couvrent la navigation, la persistance du thème et de la progression, les cinq résultats du quiz, le clavier, le mouvement réduit et les quatre vues sur six largeurs dans les deux thèmes. Ces contrôles ne remplacent pas un audit d’accessibilité manuel complet.

## Aperçus de l’intégration

Captures du site compilé, fournies comme référence visuelle. [Accueil clair](previews/accueil-clair.webp) · [Accueil mobile](previews/accueil-mobile.webp).

| Accueil                                | Programme                               | Leçon                                | Quiz                                |
| -------------------------------------- | --------------------------------------- | ------------------------------------ | ----------------------------------- |
| [Voir l’aperçu](previews/accueil.webp) | [Voir l’aperçu](previews/parcours.webp) | [Voir l’aperçu](previews/lecon.webp) | [Voir l’aperçu](previews/quiz.webp) |
