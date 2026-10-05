# Révision professionnelle du parcours IA

Révision des 30 leçons les 4 et 5 octobre 2026. Le programme conserve ses URL, ses 14 leçons publiées et ses cinq modules en préparation. La leçon de prompting avancé est désormais référencée dans le module avancé : aucune page de leçon n’est orpheline.

## Ligne pédagogique

Chaque leçon comprend des objectifs observables, une explication contextualisée, un cas concret, un exercice avec livrable et critères de réussite, une correction indicative repliable, une synthèse et des sources datées. Le composant `LessonPractice.astro` offre une interaction native utilisable au clavier, sans JavaScript supplémentaire.

Les explications distinguent principes durables, capacités dépendant de l’outil et informations à revérifier. Les exercices emploient des données fictives. Les exemples SaaS sont identifiés comme des cas pédagogiques distincts de ce site Astro/MDX.

## Corrections par domaine

| Domaine      | Corrections substantielles                                                                                                                                                                |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Fondations   | « développeur augmenté », vocabulaire modèle/application/agent, grille de maturité explicitement pédagogique, absence de classements ou gains chiffrés non étayés                         |
| LLM          | Tokens et décodage, raisonnement évalué sur la tâche, distinction contexte/mémoire/récupération, limites propres au modèle, citations vérifiables                                         |
| Prompts      | Objectifs et preuves, rôles sans expertise fictive, contraintes de sortie distinctes de l’exactitude, justification concise sans exigence de chaîne de pensée privée                      |
| Workflow     | Critères avant code, plans proportionnés, autorisation inter-comptes, idempotence, pagination stable, erreurs et contrôles réellement exécutés                                            |
| Outils       | Stack réelle du dépôt, installation actuelle de Claude Code, comparaison des workflows plutôt que prix/classement figés, veille sur sources primaires                                     |
| Sécurité     | Secrets et données personnelles, pseudonymisation distincte de l’anonymisation, prompt injection et défense en profondeur, permissions imposées hors du prompt, dépendances/slopsquatting |
| Cadre légal  | Responsabilités distribuées selon les faits, conditions RGPD et contrats, nuances de droits d’auteur/licences, AI Act consolidé au 27 juillet 2026 et calendrier actuel                   |
| Agents       | Outils à contrats bornés, budgets/arrêts, reprise et effets externes, supervision d’actions concrètes avec respect des autorisations déjà données                                         |
| Projet final | Nom standard `AGENTS.md`, chargement selon l’outil/version, distinction instructions/permissions, références maintenables, évaluation avec cas normaux et hostiles                        |

Les anciens blocs de programme et de pagination dupliqués dans chaque frontmatter ont été supprimés. La collection Astro constitue la source unique de navigation et de titres.

## Sources et fraîcheur

Le registre [curriculum-sources.json](curriculum-sources.json) conserve les références consultées, leur date et l’identifiant du contenu GitHub ou l’empreinte SHA-256 de la page officielle. Les liens propres à chaque leçon figurent aussi dans son contenu. Les identifiants de modèles présents dans un SDK ne sont pas présentés comme une preuve de disponibilité publique.

La révision juridique utilise le texte consolidé d’EUR-Lex, pas uniquement le texte initial de 2024. La date générale du 2 août 2026 reste distinguée des échéances spécifiques et des dispositions transitoires. Le périmètre de la leçon est l’Union européenne ; la qualification d’un usage et les contrats restent à vérifier pour chaque organisation.

Les tarifs, quotas, fenêtres de contexte et garanties de données ne sont pas figés dans des tableaux sans preuve. Les élèves apprennent à les vérifier auprès du produit et du compte utilisés. Les sources vivantes et les alias de modèles peuvent évoluer après cette révision.

## Vérifications

- Intégrité du programme : toutes les pages de leçon sont référencées exactement une fois ; titres rendus cohérents avec la collection.
- Build Astro et index Pagefind : pages, rendu MDX et indexation.
- Tests navigateur : objectifs et exercices rendus pour les 30 leçons, corrections consultables, navigation, progression et quiz.
- Vérification de l’exemple SQLite avec entrée normale et deux entrées hostiles : résultat attendu et table conservée.
- Relecture des extraits JSON/YAML et des commandes par rapport aux sources citées. Les exemples d’architecture et de workflow sont des spécifications pédagogiques ; ils ne prétendent pas représenter des services exécutés dans ce site.

## Aperçus pédagogiques

[Exercice sombre](previews/exercice-dark.webp) · [Exercice clair](previews/exercice-light.webp). Les captures montrent une correction dépliée sur le site compilé.

## Maintenance

Réviser les références volatiles après un changement de modèle, SDK, outil, contrat ou texte réglementaire. Rejouer les exercices représentatifs, conserver quelques cas qui n’ont pas servi à ajuster les instructions et documenter les limites. Toute modification du programme doit conserver les slugs ou prévoir explicitement une migration des liens et de la progression.
