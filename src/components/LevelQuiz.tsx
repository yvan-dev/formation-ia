import { useMemo, useState } from 'react';

interface Question {
  question: string;
  options: string[];
  correct: number;
  difficulty: 'debutant' | 'intermediaire' | 'avance';
}

const questions: Question[] = [
  {
    question: "Qu'est-ce qu'un LLM (Large Language Model) ?",
    options: [
      'Un logiciel de traduction automatique',
      'Un modèle de langage entraîné sur de grands corpus pour comprendre et générer du texte',
      'Un algorithme de tri de données',
      'Une base de données relationnelle',
    ],
    correct: 1,
    difficulty: 'debutant',
  },
  {
    question: "Qu'est-ce qu'une hallucination en IA générative ?",
    options: [
      'Un bug système qui coupe la connexion',
      'Une réponse convaincante mais factuellement fausse',
      'Une erreur de compilation',
      'Une image de mauvaise résolution',
    ],
    correct: 1,
    difficulty: 'debutant',
  },
  {
    question: 'À quoi sert un system prompt ?',
    options: [
      'À redémarrer le modèle',
      'À fixer le rôle, les contraintes et les règles de réponse',
      'À mesurer la latence du service',
      'À traduire automatiquement les requêtes',
    ],
    correct: 1,
    difficulty: 'debutant',
  },
  {
    question: "Que représente la fenêtre de contexte d'un LLM ?",
    options: [
      'La taille de la fenêtre du navigateur',
      'Le nombre maximal de tokens pris en compte dans une interaction',
      'Le temps moyen de réponse',
      "Le nombre d'utilisateurs simultanés",
    ],
    correct: 1,
    difficulty: 'intermediaire',
  },
  {
    question:
      'Quelle technique consiste à fournir des exemples avant la demande principale ?',
    options: ['Zero-shot', 'Fine-tuning', 'Few-shot prompting', 'Prompt injection'],
    correct: 2,
    difficulty: 'intermediaire',
  },
  {
    question: "Qu'est-ce qu'une attaque par prompt injection ?",
    options: [
      'Une faille GPU',
      "Une tentative de détournement des instructions du modèle via l'entrée utilisateur",
      "Une méthode d'optimisation des tokens",
      'Un protocole de test de charge',
    ],
    correct: 1,
    difficulty: 'intermediaire',
  },
  {
    question: 'En Spec-Driven Development, quelle est la première étape ?',
    options: [
      'Coder rapidement un prototype',
      'Configurer les outils de build',
      'Rédiger une spécification exploitable avant implémentation',
      'Passer directement aux tests de charge',
    ],
    correct: 2,
    difficulty: 'intermediaire',
  },
  {
    question: "Quelle est la différence principale entre assistant IA et agent IA ?",
    options: [
      'Aucune différence',
      "L'assistant répond; l'agent orchestre des actions avec outils et objectifs",
      "L'assistant ne peut produire que du texte",
      "L'agent est uniquement visuel",
    ],
    correct: 1,
    difficulty: 'avance',
  },
  {
    question: 'À quoi sert un fichier AGENT.md dans un projet ?',
    options: [
      "À décrire l'API REST publique",
      'À lister les dépendances npm',
      'À cadrer les règles, contraintes et workflow pour les agents IA du projet',
      'À piloter le déploiement Kubernetes',
    ],
    correct: 2,
    difficulty: 'avance',
  },
  {
    question: 'Que signifie Human in the Loop ?',
    options: [
      "L'humain remplace l'IA", 
      'Des points de contrôle humains dans un processus automatisé',
      'Un test utilisateur en fin de projet',
      'Une option de modération de chat',
    ],
    correct: 1,
    difficulty: 'avance',
  },
];

type Level = 'Débutant' | 'Intermédiaire' | 'Avancé';

interface LevelResult {
  level: Level;
  description: string;
  recommendation: string;
}

function getLevel(score: number): LevelResult {
  const pct = (score / questions.length) * 100;

  if (pct <= 40) {
    return {
      level: 'Débutant',
      description:
        'Nous posons les bases: fonctionnement des LLM, hygiène de prompt et sécurité essentielle.',
      recommendation:
        "Commençons par les modules Fondations, Comprendre les LLMs, puis Prompt Engineering avant de passer à l'agentique.",
    };
  }

  if (pct <= 70) {
    return {
      level: 'Intermédiaire',
      description:
        "Nous avons déjà de bons réflexes sur les usages quotidiens et les limites des modèles.",
      recommendation:
        'Renforçons Spec-Driven Development, architecture agentique guidée et gestion des risques opérationnels.',
    };
  }

  return {
    level: 'Avancé',
    description:
      "Niveau opérationnel solide: nous pouvons structurer des workflows IA robustes à l'échelle de l'équipe.",
    recommendation:
      'Ciblons les modules capstone AGENT.md, gouvernance IA, supervision human-in-the-loop et industrialisation.',
  };
}

interface LevelQuizProps {
  basePath?: string;
}

export default function LevelQuiz({ basePath = '' }: LevelQuizProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answered, setAnswered] = useState(false);

  const q = questions[currentQ];
  const progress = useMemo(
    () => ((currentQ + (answered ? 1 : 0)) / questions.length) * 100,
    [currentQ, answered],
  );

  function handleSelect(index: number) {
    if (answered) return;
    setSelected(index);
  }

  function handleSubmit() {
    if (selected === null) return;
    setAnswered(true);
    if (selected === q.correct) setScore((s) => s + 1);
  }

  function handleNext() {
    if (currentQ < questions.length - 1) {
      setCurrentQ((c) => c + 1);
      setSelected(null);
      setAnswered(false);
      return;
    }
    setFinished(true);
  }

  function handleRestart() {
    setCurrentQ(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setAnswered(false);
  }

  const difficultyMap = {
    debutant: {
      label: 'Facile',
      className:
        'border-[rgba(52,168,54,0.35)] bg-[rgba(52,168,54,0.12)] text-[var(--brand-700)]',
    },
    intermediaire: {
      label: 'Moyen',
      className:
        'border-[rgba(23,229,23,0.36)] bg-[rgba(23,229,23,0.12)] text-[var(--brand-700)]',
    },
    avance: {
      label: 'Avancé',
      className:
        'border-[rgba(0,0,0,0.35)] bg-[rgba(0,0,0,0.82)] text-[var(--brand-500)]',
    },
  };

  if (finished) {
    const result = getLevel(score);
    const ratio = Math.round((score / questions.length) * 100);

    return (
      <div className="rounded-[1rem] border border-[var(--border)] bg-[var(--surface)] p-6 text-center">
        <p className="text-xs font-semibold tracking-[0.14em] text-[var(--text-faint)] uppercase">
          Niveau estimé
        </p>

        <div className="mt-3 inline-flex items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-5 py-2 text-2xl font-extrabold text-[var(--text-primary)]">
          {result.level}
        </div>

        <p className="section-title mt-5 text-4xl text-[var(--text-primary)]">
          {score} / {questions.length}
        </p>
        <p className="text-sm text-[var(--text-faint)]">bonnes réponses</p>

        <div className="mx-auto mt-4 h-2.5 w-full max-w-sm overflow-hidden rounded-full bg-[var(--surface-strong)]">
          <div
            className="h-full rounded-full"
            style={{ width: `${ratio}%`, background: 'var(--gradient-brand)' }}
          />
        </div>

        <p className="mx-auto mt-5 max-w-2xl text-sm text-[var(--text-muted)]">
          {result.description}
        </p>
        <p className="mx-auto mt-2 max-w-2xl text-sm font-semibold text-[var(--text-primary)]">
          {result.recommendation}
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleRestart}
            className="rounded-full border border-[var(--border)] px-5 py-2 text-sm font-semibold text-[var(--text-muted)] transition hover:bg-[var(--surface-strong)] hover:text-[var(--text-primary)]"
          >
            Refaire le quiz
          </button>
          <a
            href={`${basePath}courses/ia-appliquee-metiers-tech`}
            className="btn-primary text-sm"
          >
            Ouvrir la formation
          </a>
        </div>
      </div>
    );
  }

  const difficulty = difficultyMap[q.difficulty];

  return (
    <div className="overflow-hidden rounded-[1rem] border border-[var(--border)] bg-[var(--surface)]">
      <div className="h-1.5 bg-[var(--surface-strong)]">
        <div
          className="h-full transition-all duration-500"
          style={{ width: `${progress}%`, background: 'var(--gradient-brand)' }}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] bg-[var(--surface-strong)] px-5 py-3">
        <span className="text-xs font-semibold tracking-[0.09em] text-[var(--text-faint)] uppercase">
          Question {currentQ + 1} / {questions.length}
        </span>
        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${difficulty.className}`}>
          {difficulty.label}
        </span>
      </div>

      <div className="p-5">
        <h3 className="section-title text-xl text-[var(--text-primary)]">{q.question}</h3>

        <div className="mt-5 space-y-3">
          {q.options.map((option, i) => {
            let classes =
              'w-full rounded-xl border px-4 py-3 text-left text-sm transition ';

            if (answered) {
              if (i === q.correct) {
                classes +=
                  'border-[rgba(52,168,54,0.45)] bg-[rgba(52,168,54,0.12)] text-[var(--brand-700)]';
              } else if (i === selected) {
                classes +=
                  'border-[rgba(0,0,0,0.5)] bg-[rgba(0,0,0,0.82)] text-[var(--brand-500)]';
              } else {
                classes +=
                  'border-[var(--border)] bg-[var(--surface-strong)] text-[var(--text-faint)]';
              }
            } else if (i === selected) {
              classes +=
                'border-[var(--brand-400)] bg-[rgba(23,229,23,0.12)] text-[var(--text-primary)]';
            } else {
              classes +=
                'border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:bg-[var(--surface-strong)] hover:text-[var(--text-primary)]';
            }

            return (
              <button
                key={i}
                disabled={answered}
                className={classes}
                onClick={() => handleSelect(i)}
              >
                <span className="inline-flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-current/25 text-xs font-semibold">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span>{option}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex justify-end">
          {!answered ? (
            <button
              onClick={handleSubmit}
              disabled={selected === null}
              className="btn-primary disabled:cursor-not-allowed disabled:opacity-45"
            >
              Valider
            </button>
          ) : (
            <button onClick={handleNext} className="btn-primary">
              {currentQ < questions.length - 1
                ? 'Question suivante'
                : 'Voir mon niveau'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

