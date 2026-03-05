import { useState } from 'react';

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
      'Un modele de langage entraine sur de grandes quantites de texte pour generer et comprendre du langage',
      'Un algorithme de tri de donnees',
      'Un type de base de donnees relationnelle',
    ],
    correct: 1,
    difficulty: 'debutant',
  },
  {
    question:
      "Qu'est-ce qu'une hallucination dans le contexte des modeles d'IA generative ?",
    options: [
      'Un bug qui fait planter le modele',
      'Une reponse generee avec assurance mais factuellement incorrecte',
      'Un probleme de connexion au serveur',
      'Une image generee de mauvaise qualite',
    ],
    correct: 1,
    difficulty: 'debutant',
  },
  {
    question: 'A quoi sert un system prompt ?',
    options: [
      "A redemarrer le modele en cas d'erreur",
      "A definir le comportement, le role et les contraintes du modele avant l'interaction",
      'A mesurer la performance du modele',
      'A traduire le prompt dans une autre langue',
    ],
    correct: 1,
    difficulty: 'debutant',
  },
  {
    question:
      "Qu'est-ce que la fenetre de contexte (context window) d'un LLM ?",
    options: [
      "L'interface graphique du chatbot",
      'Le nombre maximum de tokens que le modele peut traiter en une seule interaction',
      'Le temps de reponse du modele',
      "La taille de l'ecran recommandee pour utiliser l'outil",
    ],
    correct: 1,
    difficulty: 'intermediaire',
  },
  {
    question:
      'Quelle technique de prompting consiste a fournir des exemples au modele avant de poser la question ?',
    options: [
      'Chain of Thought',
      'Zero-shot prompting',
      'Few-shot prompting',
      'Prompt injection',
    ],
    correct: 2,
    difficulty: 'intermediaire',
  },
  {
    question: "Qu'est-ce qu'une attaque par prompt injection ?",
    options: [
      'Un virus informatique qui cible les GPU',
      "Une technique qui manipule le modele en inserant des instructions malveillantes dans l'input",
      'Une methode pour accelerer les reponses du modele',
      'Un outil de debug pour tester les prompts',
    ],
    correct: 1,
    difficulty: 'intermediaire',
  },
  {
    question:
      "Dans l'approche Spec-Driven Development, quelle est la premiere etape avant de coder ?",
    options: [
      'Ecrire les tests unitaires',
      "Configurer l'environnement de developpement",
      "Rediger une specification detaillee que l'IA peut suivre",
      'Choisir le framework frontend',
    ],
    correct: 2,
    difficulty: 'intermediaire',
  },
  {
    question:
      'Quelle est la difference principale entre un assistant IA et un agent IA ?',
    options: [
      "L'assistant est gratuit, l'agent est payant",
      "L'assistant repond a des questions, l'agent peut executer des actions de maniere autonome avec des outils",
      "L'assistant utilise du texte, l'agent utilise des images",
      "Il n'y a aucune difference, ce sont des synonymes",
    ],
    correct: 1,
    difficulty: 'avance',
  },
  {
    question: 'A quoi sert un fichier AGENT.md dans un projet de dev ?',
    options: [
      "A documenter l'API REST du projet",
      'A lister les dependances npm du projet',
      "A definir les regles, la structure et les bonnes pratiques qu'un agent IA doit suivre dans le projet",
      'A configurer le pipeline CI/CD',
    ],
    correct: 2,
    difficulty: 'avance',
  },
  {
    question: "Que signifie 'Human in the Loop' dans un workflow agentique ?",
    options: [
      "Un humain qui remplace completement l'IA pour les taches critiques",
      "Un mecanisme ou l'humain valide ou intervient a des points cles du processus automatise",
      'Un test utilisateur realise apres le deploiement',
      "Un role de moderation sur un forum d'IA",
    ],
    correct: 1,
    difficulty: 'avance',
  },
];

type Level = 'Debutant' | 'Intermediaire' | 'Avance';

interface LevelResult {
  level: Level;
  color: string;
  bg: string;
  border: string;
  description: string;
}

function getLevel(score: number, total: number): LevelResult {
  const pct = (score / total) * 100;
  if (pct <= 40) {
    return {
      level: 'Debutant',
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      border: 'border-green-500/30',
      description:
        "Vous debutez avec l'IA appliquee — c'est le moment ideal pour commencer ! Nous vous recommandons de demarrer par le Module 0 (Fondations et Mindset) pour poser les bases et progresser sereinement.",
    };
  }
  if (pct <= 70) {
    return {
      level: 'Intermediaire',
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      description:
        'Vous avez de bonnes bases en IA. Pour aller plus loin, concentrez-vous sur les modules avances : Spec-Driven Development (M5), Developpement Agentique (M6) et le projet AGENT.md (M7).',
    };
  }
  return {
    level: 'Avance',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    description:
      "Vous maitrisez bien les concepts de l'IA appliquee. Foncez directement vers le Module 7 pour realiser le projet capstone AGENT.md et structurer vos workflows agentiques.",
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

  function handleSelect(index: number) {
    if (answered) return;
    setSelected(index);
  }

  function handleSubmit() {
    if (selected === null) return;
    setAnswered(true);
    if (selected === q.correct) {
      setScore((s) => s + 1);
    }
  }

  function handleNext() {
    if (currentQ < questions.length - 1) {
      setCurrentQ((c) => c + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setFinished(true);
    }
  }

  function handleRestart() {
    setCurrentQ(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setAnswered(false);
  }

  if (finished) {
    const result = getLevel(score, questions.length);
    return (
      <div className="border-navy-700/40 bg-navy-900/80 rounded-2xl border p-8 text-center">
        <div className="mb-6">
          <div className="text-navy-500 mb-3 text-sm tracking-wider uppercase">
            Votre niveau estime
          </div>
          <div
            className={`font-sans inline-block rounded-xl border px-6 py-2 text-3xl font-bold ${result.bg} ${result.color} ${result.border}`}
          >
            {result.level}
          </div>
        </div>

        <div className="mb-6">
          <div className="font-sans text-navy-50 mb-1 text-4xl font-bold">
            {score} / {questions.length}
          </div>
          <div className="text-navy-500 text-sm">bonnes reponses</div>
        </div>

        <div className="bg-navy-800 mx-auto mb-6 h-2.5 w-full max-w-xs rounded-full">
          <div
            className="from-acton-700 to-acton-500 h-full rounded-full bg-gradient-to-r transition-all duration-700"
            style={{
              width: `${Math.round((score / questions.length) * 100)}%`,
            }}
          />
        </div>

        <p className="text-navy-300 mx-auto mb-8 max-w-md text-sm leading-relaxed">
          {result.description}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={handleRestart}
            className="border-navy-700/40 text-navy-200 hover:border-navy-600 hover:bg-navy-800/50 rounded-xl border px-5 py-2.5 text-sm font-semibold transition-all duration-200"
          >
            Refaire le quiz
          </button>
          <a
            href={`${basePath}courses/ia-appliquee-metiers-tech`}
            className="from-acton-700 to-acton-600 text-navy-950 hover:shadow-acton-600/20 inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r px-5 py-2.5 text-sm font-semibold transition-all duration-300 hover:shadow-lg"
          >
            Commencer la formation
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>
      </div>
    );
  }

  const progress = (currentQ / questions.length) * 100;
  const difficultyLabel =
    q.difficulty === 'debutant'
      ? 'Facile'
      : q.difficulty === 'intermediaire'
        ? 'Moyen'
        : 'Difficile';
  const difficultyColor =
    q.difficulty === 'debutant'
      ? 'text-green-400'
      : q.difficulty === 'intermediaire'
        ? 'text-blue-400'
        : 'text-red-400';

  return (
    <div className="border-navy-700/40 bg-navy-900/80 overflow-hidden rounded-2xl border">
      {/* Progress bar */}
      <div className="bg-navy-800 h-1">
        <div
          className="from-acton-700 to-acton-500 h-full bg-gradient-to-r transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Header */}
      <div className="border-navy-800/40 flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="text-acton-500 text-sm font-semibold">
            Question {currentQ + 1} / {questions.length}
          </span>
          <span
            className={`rounded-md border border-current/20 px-2 py-0.5 text-xs ${difficultyColor}`}
          >
            {difficultyLabel}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h4 className="font-sans text-navy-50 mb-6 text-lg font-semibold">
          {q.question}
        </h4>

        <div className="mb-6 space-y-3">
          {q.options.map((option, i) => {
            let classes =
              'w-full text-left px-4 py-3.5 rounded-xl border text-sm transition-all duration-200 ';
            if (answered) {
              if (i === q.correct) {
                classes += 'border-green-500/40 bg-green-500/10 text-green-400';
              } else if (i === selected) {
                classes += 'border-red-500/40 bg-red-500/10 text-red-400';
              } else {
                classes += 'border-navy-700/30 bg-navy-800/30 text-navy-500';
              }
            } else if (i === selected) {
              classes += 'border-acton-600/40 bg-acton-600/10 text-acton-500';
            } else {
              classes +=
                'border-navy-700/30 hover:border-navy-600 hover:bg-navy-800/50 text-navy-200';
            }

            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                className={classes}
                disabled={answered}
              >
                <span className="inline-flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-current/20 text-xs font-semibold">
                    {String.fromCharCode(65 + i)}
                  </span>
                  {option}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex justify-end">
          {!answered ? (
            <button
              onClick={handleSubmit}
              disabled={selected === null}
              className="from-acton-700 to-acton-600 disabled:from-navy-700 disabled:to-navy-700 disabled:text-navy-500 text-navy-950 hover:shadow-acton-600/20 rounded-xl bg-gradient-to-r px-5 py-2.5 text-sm font-semibold transition-all duration-300 hover:shadow-lg"
            >
              Valider
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="from-acton-700 to-acton-600 text-navy-950 hover:shadow-acton-600/20 rounded-xl bg-gradient-to-r px-5 py-2.5 text-sm font-semibold transition-all duration-300 hover:shadow-lg"
            >
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
