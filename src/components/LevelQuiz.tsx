import { useMemo, useState } from 'react';

interface Choice {
  label: string;
  points: number;
}

interface Question {
  dimension: string;
  question: string;
  choices: Choice[];
}

interface LevelResult {
  level: number;
  title: string;
  diagnostic: string;
  nextGoal: string;
  plan: string[];
  recommendation: string;
}

const questions: Question[] = [
  {
    dimension: 'Usage quotidien',
    question:
      "Quand vous recevez un nouveau ticket dev, comment utilisez-vous l'IA en premier ?",
    choices: [
      { label: "Je ne l'utilise pas sur cette étape", points: 0 },
      { label: 'Je pose une question ponctuelle dans un chat', points: 1 },
      {
        label: "Je m'appuie sur mon éditeur pour accélérer le code",
        points: 2,
      },
      {
        label: 'Je délègue une première implémentation puis je révise',
        points: 3,
      },
      {
        label: 'Je déclenche un workflow structuré avec contrôle humain',
        points: 4,
      },
    ],
  },
  {
    dimension: 'Cadrage',
    question:
      "Avant de demander du code à l'IA, quel niveau de cadrage fournissez-vous ?",
    choices: [
      { label: 'Aucun cadre explicite', points: 0 },
      { label: 'Un prompt court sans critères de qualité', points: 1 },
      { label: 'Un contexte, des contraintes et des exemples', points: 2 },
      {
        label: 'Une mini-spécification (objectif, critères, limites)',
        points: 3,
      },
      { label: "Une spec standardisée réutilisable par l'équipe", points: 4 },
    ],
  },
  {
    dimension: 'Validation',
    question: "Comment vérifiez-vous la sortie produite par l'IA ?",
    choices: [
      { label: 'Je copie/colle sans validation systématique', points: 0 },
      { label: 'Je relis rapidement le résultat', points: 1 },
      { label: 'Je fais une revue fonctionnelle + tests de base', points: 2 },
      { label: 'Je valide avec tests, logs et critères de sortie', points: 3 },
      {
        label:
          "Je dispose d'une checklist d'équipe et de garde-fous automatisés",
        points: 4,
      },
    ],
  },
  {
    dimension: 'Sécurité',
    question: 'Dans vos prompts, comment gérez-vous les données sensibles ?',
    choices: [
      { label: "Je n'ai pas de règle particulière", points: 0 },
      { label: 'Je fais attention au cas par cas', points: 1 },
      { label: "J'anonymise les données les plus critiques", points: 2 },
      {
        label: "J'applique des règles explicites par type de donnée",
        points: 3,
      },
      {
        label: 'Ces règles sont documentées et partagées en équipe',
        points: 4,
      },
    ],
  },
  {
    dimension: 'Qualité de code',
    question:
      "Quel est votre niveau d'autonomie avec l'IA sur le code multi-fichiers ?",
    choices: [
      { label: 'Je reste sur des snippets isolés', points: 0 },
      { label: 'Je traite des petites fonctions simples', points: 1 },
      { label: 'Je gère des composants ou services entiers', points: 2 },
      { label: 'Je confie des tâches complètes puis je supervise', points: 3 },
      {
        label: 'Je pilote des enchaînements outillés avec validation',
        points: 4,
      },
    ],
  },
  {
    dimension: 'Collaboration',
    question: "Dans l'équipe, comment partagez-vous les bonnes pratiques IA ?",
    choices: [
      { label: 'Aucun partage structuré', points: 0 },
      { label: 'Partage ponctuel en discussion', points: 1 },
      { label: 'Bibliothèque de prompts utiles', points: 2 },
      { label: 'Rituels de revue des workflows IA', points: 3 },
      {
        label: 'Référentiel commun (prompts/specs/AGENT.md) maintenu',
        points: 4,
      },
    ],
  },
  {
    dimension: 'Impact',
    question: "Comment mesurez-vous l'apport réel de l'IA dans vos sprints ?",
    choices: [
      { label: 'Je ne mesure pas encore', points: 0 },
      { label: 'Je me base sur un ressenti global', points: 1 },
      {
        label: 'Je suis quelques indicateurs simples (temps, bugs)',
        points: 2,
      },
      { label: 'Je compare avant/après sur des tâches types', points: 3 },
      {
        label: 'Nous suivons des indicateurs partagés et exploitables',
        points: 4,
      },
    ],
  },
  {
    dimension: 'Human in the Loop',
    question: "Dans vos automatisations IA, où placez-vous l'humain ?",
    choices: [
      { label: 'Aucune automatisation en place', points: 0 },
      { label: 'Automatisation minimale sans règles claires', points: 1 },
      { label: 'Validation humaine en fin de chaîne', points: 2 },
      { label: 'Validation humaine aux étapes critiques', points: 3 },
      {
        label: 'Validation humaine outillée avec seuils et escalade',
        points: 4,
      },
    ],
  },
  {
    dimension: 'Agentique',
    question: 'Quel est votre niveau actuel sur les agents IA ?',
    choices: [
      { label: "Je n'utilise pas d'agent", points: 0 },
      { label: 'Je teste ponctuellement des assistants', points: 1 },
      { label: 'Je délègue des tâches guidées à un agent unique', points: 2 },
      {
        label: 'Je supervise des workflows agentiques multi-étapes',
        points: 3,
      },
      {
        label: 'Je pilote des orchestrations avancées avec garde-fous',
        points: 4,
      },
    ],
  },
  {
    dimension: 'Projection',
    question: 'Quel est votre objectif réaliste à 3 mois ?',
    choices: [
      { label: 'Découvrir les bases et les usages utiles', points: 0 },
      { label: 'Stabiliser un usage régulier au quotidien', points: 1 },
      { label: 'Industrialiser un workflow dev reproductible', points: 2 },
      {
        label: 'Mettre en place des automatisations avec supervision',
        points: 3,
      },
      { label: 'Préparer une orchestration multi-agents pilotée', points: 4 },
    ],
  },
];

function getLevel(score: number): LevelResult {
  if (score <= 8) {
    return {
      level: 1,
      title: 'Chat (Q&A basique)',
      diagnostic:
        "Vous démarrez l'usage IA principalement en mode assistance ponctuelle. Le potentiel est là, mais il manque encore un cadre pour sécuriser et accélérer le quotidien dev.",
      nextGoal:
        'Passer au niveau 2 (Copilote) avec des prompts réutilisables et une validation systématique.',
      plan: [
        'Mettre en place 3 prompts standards (analyse ticket, génération tests, relecture).',
        'Ajouter une checklist de validation courte avant chaque merge.',
        'Réaliser 2 exercices guidés sur la formation pour ancrer les réflexes.',
      ],
      recommendation:
        'Commencez par les modules Introduction et bases LLM/prompting avant toute automatisation.',
    };
  }

  if (score <= 16) {
    return {
      level: 2,
      title: 'Copilote (assistance contextualisée)',
      diagnostic:
        "Vous utilisez déjà l'IA comme copilote et vous gagnez du temps. Le prochain levier est de mieux formaliser le cadrage et les critères de qualité.",
      nextGoal:
        'Passer au niveau 3 (Agent guidé) en déléguant des tâches complètes sous supervision.',
      plan: [
        'Formaliser un template de spec courte avant chaque tâche IA.',
        'Conduire 1 workflow complet par semaine (plan -> exécution -> review).',
        "Documenter les erreurs récurrentes et leurs parades dans un référentiel d'équipe.",
      ],
      recommendation:
        'Concentrez-vous sur le module Workflow développeur assisté par IA.',
    };
  }

  if (score <= 24) {
    return {
      level: 3,
      title: 'Agent guidé (exécution supervisée)',
      diagnostic:
        "Vous êtes au niveau cible court terme: vous déléguez déjà des tâches complètes avec une supervision active. Le gain principal vient maintenant de la standardisation d'équipe.",
      nextGoal:
        'Stabiliser ce niveau et préparer le niveau 4 (Human in the Loop).',
      plan: [
        "Créer un standard d'équipe pour plan-first et spec-driven.",
        'Outiller les points de validation humaine sur les tâches sensibles.',
        "Mesurer le gain sur 2 à 3 cas d'usage réels de sprint.",
      ],
      recommendation:
        "Vous êtes sur la bonne trajectoire. Consolidez la qualité avant d'ouvrir plus d'automatisation.",
    };
  }

  if (score <= 32) {
    return {
      level: 4,
      title: 'Human in the Loop (workflow automatisé contrôlé)',
      diagnostic:
        'Vous avez déjà un usage avancé, avec automatisation partielle et supervision structurée. Votre enjeu devient la robustesse et la gouvernance.',
      nextGoal:
        'Préparer progressivement le niveau 5 sur des périmètres non critiques.',
      plan: [
        "Documenter les seuils de validation et d'escalade.",
        'Séparer explicitement les workflows critiques et non critiques.',
        "Construire un backlog d'amélioration continue piloté par métriques.",
      ],
      recommendation:
        'Renforcez les modules sécurité, gouvernance et agentique guidée avant tout scale-up.',
    };
  }

  return {
    level: 5,
    title: 'Swarm (orchestration multi-agents)',
    diagnostic:
      'Votre maturité est élevée et orientée orchestration. La priorité est de maintenir la fiabilité et la maîtrise des risques au même niveau que la vitesse.',
    nextGoal:
      'Conserver la performance tout en maîtrisant les risques opérationnels et juridiques.',
    plan: [
      'Maintenir des garde-fous humains sur les décisions à impact élevé.',
      'Versionner les règles des agents et tracer les décisions clés.',
      'Évaluer régulièrement les incidents évités vs la productivité gagnée.',
    ],
    recommendation:
      "Avancez par cas d'usage incrémentaux; évitez la généralisation sans preuve de robustesse.",
  };
}

interface LevelQuizProps {
  basePath?: string;
}

export default function LevelQuiz({ basePath = '' }: LevelQuizProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);
  const [storageError, setStorageError] = useState(false);

  const q = questions[currentQ];
  const score = useMemo(
    () => answers.reduce((acc, points) => acc + points, 0),
    [answers],
  );
  const maxScore = questions.length * 4;
  const ratio = useMemo(
    () => Math.round((score / maxScore) * 100),
    [score, maxScore],
  );
  const result = useMemo(() => getLevel(score), [score]);

  function handleNext() {
    if (selected === null) return;

    const points = q.choices[selected].points;
    const nextAnswers = [...answers, points];
    setAnswers(nextAnswers);

    if (currentQ < questions.length - 1) {
      setCurrentQ((c) => c + 1);
      setSelected(null);
      return;
    }

    const finalScore = nextAnswers.reduce((total, points) => total + points, 0);
    try {
      localStorage.setItem('placement_quiz_done', '1');
      localStorage.setItem(
        'placement_quiz_level',
        String(getLevel(finalScore).level),
      );
      localStorage.setItem(
        'placement_quiz_score',
        String(Math.round((finalScore / maxScore) * 100)),
      );
    } catch {
      setStorageError(true);
    }
    setFinished(true);
  }

  function handleRestart() {
    setCurrentQ(0);
    setSelected(null);
    setAnswers([]);
    setFinished(false);
    setStorageError(false);
  }

  if (finished) {
    return (
      <section
        className="quiz-panel quiz-result"
        aria-labelledby="quiz-result-title"
      >
        <p className="eyebrow">Résultat du diagnostic</p>
        <h2 id="quiz-result-title">
          Niveau {result.level} · {result.title}
        </h2>
        <p className="quiz-result-number">
          {ratio}
          <span>%</span>
        </p>
        <p className="muted">Maturité observée sur ce quiz</p>
        <progress value={score} max={maxScore} aria-label="Score de maturité" />
        <div className="quiz-diagnostic">
          <p>{result.diagnostic}</p>
          <p>
            <strong>{result.nextGoal}</strong>
          </p>
        </div>
        <h3>Votre plan à 30 jours</h3>
        <ol className="quiz-plan">
          {result.plan.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <p className="quiz-recommendation">{result.recommendation}</p>
        {storageError && (
          <p role="status" className="storage-error">
            Le résultat est disponible ici, mais le navigateur empêche son
            enregistrement sur cet appareil.
          </p>
        )}
        <div className="quiz-result-actions">
          <a
            className="btn-primary"
            href={`${basePath}courses/ia-appliquee-metiers-tech`}
          >
            Explorer le parcours{' '}
            <svg
              className="inline-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path d="M6 18L18 6M6 6h12v12" />
            </svg>
          </a>
          <button
            className="btn-secondary"
            type="button"
            onClick={handleRestart}
          >
            Refaire le quiz
          </button>
        </div>
      </section>
    );
  }

  return (
    <form
      className="quiz-panel"
      onSubmit={(event) => {
        event.preventDefault();
        handleNext();
      }}
    >
      <div className="quiz-meta">
        <span className="mono" aria-live="polite">
          Question {currentQ + 1} / {questions.length}
        </span>
        <span className="badge">{q.dimension}</span>
      </div>
      <progress
        value={answers.length}
        max={questions.length}
        aria-label="Progression du quiz"
      />
      <fieldset key={currentQ}>
        <legend>{q.question}</legend>
        <div className="quiz-choices">
          {q.choices.map((choice, index) => (
            <label className="quiz-choice" key={choice.label}>
              <input
                type="radio"
                name="answer"
                value={index}
                checked={selected === index}
                onChange={() => setSelected(index)}
              />
              <span>{choice.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="quiz-actions">
        <button
          className="btn-primary"
          type="submit"
          disabled={selected === null}
        >
          {currentQ < questions.length - 1 ? 'Continuer' : 'Voir mon niveau'}{' '}
          <svg
            className="inline-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path d="M4 12h16m-6-6 6 6-6 6" />
          </svg>
        </button>
      </div>
    </form>
  );
}
