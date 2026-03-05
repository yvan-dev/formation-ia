import { useState } from 'react';

interface Question {
  question: string;
  options: string[];
  correct: number;
  difficulty: 'debutant' | 'intermediaire' | 'avance';
}

const questions: Question[] = [
  {
    question: "Que signifie l'acronyme \"IA\" ?",
    options: [
      "Interface Automatique",
      "Intelligence Artificielle",
      "Information Avancee",
      "Ingenierie Appliquee",
    ],
    correct: 1,
    difficulty: 'debutant',
  },
  {
    question: "Quel est le principal objectif du Machine Learning ?",
    options: [
      "Remplacer tous les emplois humains",
      "Permettre aux machines d'apprendre a partir de donnees",
      "Creer des robots physiques",
      "Accelerer la vitesse d'Internet",
    ],
    correct: 1,
    difficulty: 'debutant',
  },
  {
    question: "Quelle est la difference entre l'IA faible et l'IA forte ?",
    options: [
      "L'IA faible est gratuite, l'IA forte est payante",
      "L'IA faible utilise moins de donnees que l'IA forte",
      "L'IA faible est specialisee dans une tache, l'IA forte possederait une intelligence generale",
      "Il n'y a aucune difference, ce sont des synonymes",
    ],
    correct: 2,
    difficulty: 'debutant',
  },
  {
    question: "Qu'est-ce qu'un reseau de neurones artificiels ?",
    options: [
      "Un reseau social pour chercheurs en IA",
      "Un modele mathematique inspire du fonctionnement du cerveau humain",
      "Un cable physique reliant des ordinateurs",
      "Un logiciel de messagerie chiffree",
    ],
    correct: 1,
    difficulty: 'intermediaire',
  },
  {
    question: "Quel type d'apprentissage utilise des donnees etiquetees pour entrainer un modele ?",
    options: [
      "Apprentissage non supervise",
      "Apprentissage par renforcement",
      "Apprentissage supervise",
      "Apprentissage par transfert",
    ],
    correct: 2,
    difficulty: 'intermediaire',
  },
  {
    question: "Qu'est-ce que le Deep Learning ?",
    options: [
      "Un type d'apprentissage qui utilise uniquement des donnees textuelles",
      "Un sous-domaine du ML utilisant des reseaux de neurones a plusieurs couches",
      "Une technique de compression de donnees",
      "Un langage de programmation pour l'IA",
    ],
    correct: 1,
    difficulty: 'intermediaire',
  },
  {
    question: "A quoi sert une fonction d'activation dans un reseau de neurones ?",
    options: [
      "A demarrer l'entrainement du modele",
      "A sauvegarder les poids du modele",
      "A introduire de la non-linearite dans le modele",
      "A connecter le modele a Internet",
    ],
    correct: 2,
    difficulty: 'avance',
  },
  {
    question: "Qu'est-ce que le surapprentissage (overfitting) ?",
    options: [
      "Quand un modele est trop lent a entrainer",
      "Quand un modele apprend trop bien les donnees d'entrainement et generalise mal",
      "Quand un modele manque de donnees",
      "Quand un modele utilise trop de memoire",
    ],
    correct: 1,
    difficulty: 'avance',
  },
  {
    question: "Quel mecanisme cle est au coeur de l'architecture Transformer ?",
    options: [
      "La convolution",
      "La retropropagation",
      "L'attention (self-attention)",
      "La recursion",
    ],
    correct: 2,
    difficulty: 'avance',
  },
  {
    question: "Que mesure la fonction de perte (loss function) dans un modele de ML ?",
    options: [
      "La vitesse d'execution du modele",
      "La quantite de donnees utilisees",
      "L'ecart entre les predictions du modele et les valeurs reelles",
      "Le nombre de couches du reseau",
    ],
    correct: 2,
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
      color: 'text-sage-400',
      bg: 'bg-sage-500/10',
      border: 'border-sage-500/30',
      description:
        "Vous debutez en IA — c'est le moment ideal pour commencer ! Nous vous recommandons de suivre la formation depuis le debut pour bien maitriser les fondamentaux.",
    };
  }
  if (pct <= 70) {
    return {
      level: 'Intermediaire',
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      description:
        "Vous avez de bonnes bases en IA. Certains concepts avances meritent encore d'etre approfondis. Vous pouvez parcourir les modules qui vous interessent.",
    };
  }
  return {
    level: 'Avance',
    color: 'text-coral-400',
    bg: 'bg-coral-500/10',
    border: 'border-coral-500/30',
    description:
      "Vous maitrisez bien les concepts de l'IA. La formation peut vous servir de reference ou vous permettre de consolider certains points precis.",
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
      <div className="rounded-2xl border border-ink-700/40 bg-ink-900/80 p-8 text-center">
        <div className="mb-6">
          <div className="text-sm text-ink-500 uppercase tracking-wider mb-3">
            Votre niveau estime
          </div>
          <div
            className={`inline-block text-3xl font-display font-bold px-6 py-2 rounded-xl border ${result.bg} ${result.color} ${result.border}`}
          >
            {result.level}
          </div>
        </div>

        <div className="mb-6">
          <div className="font-display text-4xl font-bold text-ink-50 mb-1">
            {score} / {questions.length}
          </div>
          <div className="text-sm text-ink-500">bonnes reponses</div>
        </div>

        <div className="w-full bg-ink-800 rounded-full h-2.5 mb-6 max-w-xs mx-auto">
          <div
            className="h-full rounded-full bg-gradient-to-r from-gold-600 to-gold-400 transition-all duration-700"
            style={{ width: `${Math.round((score / questions.length) * 100)}%` }}
          />
        </div>

        <p className="text-ink-300 text-sm leading-relaxed max-w-md mx-auto mb-8">
          {result.description}
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <button
            onClick={handleRestart}
            className="px-5 py-2.5 rounded-xl border border-ink-700/40 text-ink-200 text-sm font-semibold hover:border-ink-600 hover:bg-ink-800/50 transition-all duration-200"
          >
            Refaire le quiz
          </button>
          <a
            href={`${basePath}courses/introduction-ia`}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold-600 to-gold-500 text-ink-950 text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-gold-500/20 inline-flex items-center gap-1.5"
          >
            Commencer la formation
            <svg
              className="w-4 h-4"
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
      ? 'text-sage-400'
      : q.difficulty === 'intermediaire'
        ? 'text-amber-400'
        : 'text-coral-400';

  return (
    <div className="rounded-2xl border border-ink-700/40 bg-ink-900/80 overflow-hidden">
      {/* Progress bar */}
      <div className="h-1 bg-ink-800">
        <div
          className="h-full bg-gradient-to-r from-gold-600 to-gold-400 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Header */}
      <div className="px-6 py-4 border-b border-ink-800/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gold-400">
            Question {currentQ + 1} / {questions.length}
          </span>
          <span
            className={`text-xs px-2 py-0.5 rounded-md border border-current/20 ${difficultyColor}`}
          >
            {difficultyLabel}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h4 className="font-display text-lg font-semibold text-ink-50 mb-6">
          {q.question}
        </h4>

        <div className="space-y-3 mb-6">
          {q.options.map((option, i) => {
            let classes =
              'w-full text-left px-4 py-3.5 rounded-xl border text-sm transition-all duration-200 ';
            if (answered) {
              if (i === q.correct) {
                classes += 'border-sage-500/40 bg-sage-500/10 text-sage-400';
              } else if (i === selected) {
                classes += 'border-coral-500/40 bg-coral-500/10 text-coral-400';
              } else {
                classes += 'border-ink-700/30 bg-ink-800/30 text-ink-500';
              }
            } else if (i === selected) {
              classes += 'border-gold-500/40 bg-gold-500/10 text-gold-400';
            } else {
              classes +=
                'border-ink-700/30 hover:border-ink-600 hover:bg-ink-800/50 text-ink-200';
            }

            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                className={classes}
                disabled={answered}
              >
                <span className="inline-flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg border border-current/20 flex items-center justify-center text-xs font-semibold shrink-0">
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
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold-600 to-gold-500 disabled:from-ink-700 disabled:to-ink-700 disabled:text-ink-500 text-ink-950 text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-gold-500/20"
            >
              Valider
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold-600 to-gold-500 text-ink-950 text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-gold-500/20"
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
