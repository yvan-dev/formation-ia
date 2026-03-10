import { useEffect, useMemo, useState } from 'react';
import { APPS_SCRIPT_URL } from '../config';

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
    question: 'Quand vous recevez un nouveau ticket dev, comment utilisez-vous l\'IA en premier ?',
    choices: [
      { label: 'Je ne l\'utilise pas sur cette étape', points: 0 },
      { label: 'Je pose une question ponctuelle dans un chat', points: 1 },
      { label: 'Je m\'appuie sur mon éditeur pour accélérer le code', points: 2 },
      { label: 'Je délègue une première implémentation puis je révise', points: 3 },
      { label: 'Je déclenche un workflow structuré avec contrôle humain', points: 4 },
    ],
  },
  {
    dimension: 'Cadrage',
    question: 'Avant de demander du code à l\'IA, quel niveau de cadrage fournissez-vous ?',
    choices: [
      { label: 'Aucun cadre explicite', points: 0 },
      { label: 'Un prompt court sans critères de qualité', points: 1 },
      { label: 'Un contexte, des contraintes et des exemples', points: 2 },
      { label: 'Une mini-spécification (objectif, critères, limites)', points: 3 },
      { label: 'Une spec standardisée réutilisable par l\'équipe', points: 4 },
    ],
  },
  {
    dimension: 'Validation',
    question: 'Comment vérifiez-vous la sortie produite par l\'IA ?',
    choices: [
      { label: 'Je copie/colle sans validation systématique', points: 0 },
      { label: 'Je relis rapidement le résultat', points: 1 },
      { label: 'Je fais une revue fonctionnelle + tests de base', points: 2 },
      { label: 'Je valide avec tests, logs et critères de sortie', points: 3 },
      { label: 'Je dispose d\'une checklist d\'équipe et de garde-fous automatisés', points: 4 },
    ],
  },
  {
    dimension: 'Sécurité',
    question: 'Dans vos prompts, comment gérez-vous les données sensibles ?',
    choices: [
      { label: 'Je n\'ai pas de règle particulière', points: 0 },
      { label: 'Je fais attention au cas par cas', points: 1 },
      { label: 'J\'anonymise les données les plus critiques', points: 2 },
      { label: 'J\'applique des règles explicites par type de donnée', points: 3 },
      { label: 'Ces règles sont documentées et partagées en équipe', points: 4 },
    ],
  },
  {
    dimension: 'Qualité de code',
    question: 'Quel est votre niveau d\'autonomie avec l\'IA sur le code multi-fichiers ?',
    choices: [
      { label: 'Je reste sur des snippets isolés', points: 0 },
      { label: 'Je traite des petites fonctions simples', points: 1 },
      { label: 'Je gère des composants ou services entiers', points: 2 },
      { label: 'Je confie des tâches complètes puis je supervise', points: 3 },
      { label: 'Je pilote des enchaînements outillés avec validation', points: 4 },
    ],
  },
  {
    dimension: 'Collaboration',
    question: 'Dans l\'équipe, comment partagez-vous les bonnes pratiques IA ?',
    choices: [
      { label: 'Aucun partage structuré', points: 0 },
      { label: 'Partage ponctuel en discussion', points: 1 },
      { label: 'Bibliothèque de prompts utiles', points: 2 },
      { label: 'Rituels de revue des workflows IA', points: 3 },
      { label: 'Référentiel commun (prompts/specs/AGENT.md) maintenu', points: 4 },
    ],
  },
  {
    dimension: 'Impact',
    question: 'Comment mesurez-vous l\'apport réel de l\'IA dans vos sprints ?',
    choices: [
      { label: 'Je ne mesure pas encore', points: 0 },
      { label: 'Je me base sur un ressenti global', points: 1 },
      { label: 'Je suis quelques indicateurs simples (temps, bugs)', points: 2 },
      { label: 'Je compare avant/après sur des tâches types', points: 3 },
      { label: 'Nous suivons des indicateurs partagés et exploitables', points: 4 },
    ],
  },
  {
    dimension: 'Human in the Loop',
    question: 'Dans vos automatisations IA, où placez-vous l\'humain ?',
    choices: [
      { label: 'Aucune automatisation en place', points: 0 },
      { label: 'Automatisation minimale sans règles claires', points: 1 },
      { label: 'Validation humaine en fin de chaîne', points: 2 },
      { label: 'Validation humaine aux étapes critiques', points: 3 },
      { label: 'Validation humaine outillée avec seuils et escalade', points: 4 },
    ],
  },
  {
    dimension: 'Agentique',
    question: 'Quel est votre niveau actuel sur les agents IA ?',
    choices: [
      { label: 'Je n\'utilise pas d\'agent', points: 0 },
      { label: 'Je teste ponctuellement des assistants', points: 1 },
      { label: 'Je délègue des tâches guidées à un agent unique', points: 2 },
      { label: 'Je supervise des workflows agentiques multi-étapes', points: 3 },
      { label: 'Je pilote des orchestrations avancées avec garde-fous', points: 4 },
    ],
  },
  {
    dimension: 'Projection',
    question: 'Quel est votre objectif réaliste à 3 mois ?',
    choices: [
      { label: 'Découvrir les bases et les usages utiles', points: 0 },
      { label: 'Stabiliser un usage régulier au quotidien', points: 1 },
      { label: 'Industrialiser un workflow dev reproductible', points: 2 },
      { label: 'Mettre en place des automatisations avec supervision', points: 3 },
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
      nextGoal: 'Passer au niveau 2 (Copilote) avec des prompts réutilisables et une validation systématique.',
      plan: [
        'Mettre en place 3 prompts standards (analyse ticket, génération tests, relecture).',
        'Ajouter une checklist de validation courte avant chaque merge.',
        'Réaliser 2 exercices guidés sur la formation pour ancrer les réflexes.',
      ],
      recommendation: 'Commencez par les modules Introduction et bases LLM/prompting avant toute automatisation.',
    };
  }

  if (score <= 16) {
    return {
      level: 2,
      title: 'Copilote (assistance contextualisée)',
      diagnostic:
        'Vous utilisez déjà l\'IA comme copilote et vous gagnez du temps. Le prochain levier est de mieux formaliser le cadrage et les critères de qualité.',
      nextGoal: 'Passer au niveau 3 (Agent guidé) en déléguant des tâches complètes sous supervision.',
      plan: [
        'Formaliser un template de spec courte avant chaque tâche IA.',
        'Conduire 1 workflow complet par semaine (plan -> exécution -> review).',
        'Documenter les erreurs récurrentes et leurs parades dans un référentiel d\'équipe.',
      ],
      recommendation: 'Concentrez-vous sur le module Workflow développeur assisté par IA.',
    };
  }

  if (score <= 24) {
    return {
      level: 3,
      title: 'Agent guidé (exécution supervisée)',
      diagnostic:
        "Vous êtes au niveau cible court terme: vous déléguez déjà des tâches complètes avec une supervision active. Le gain principal vient maintenant de la standardisation d'équipe.",
      nextGoal: 'Stabiliser ce niveau et préparer le niveau 4 (Human in the Loop).',
      plan: [
        'Créer un standard d\'équipe pour plan-first et spec-driven.',
        'Outiller les points de validation humaine sur les tâches sensibles.',
        'Mesurer le gain sur 2 à 3 cas d\'usage réels de sprint.',
      ],
      recommendation: 'Vous êtes sur la bonne trajectoire. Consolidez la qualité avant d\'ouvrir plus d\'automatisation.',
    };
  }

  if (score <= 32) {
    return {
      level: 4,
      title: 'Human in the Loop (workflow automatisé contrôlé)',
      diagnostic:
        'Vous avez déjà un usage avancé, avec automatisation partielle et supervision structurée. Votre enjeu devient la robustesse et la gouvernance.',
      nextGoal: 'Préparer progressivement le niveau 5 sur des périmètres non critiques.',
      plan: [
        'Documenter les seuils de validation et d\'escalade.',
        'Séparer explicitement les workflows critiques et non critiques.',
        'Construire un backlog d\'amélioration continue piloté par métriques.',
      ],
      recommendation: 'Renforcez les modules sécurité, gouvernance et agentique guidée avant tout scale-up.',
    };
  }

  return {
    level: 5,
    title: 'Swarm (orchestration multi-agents)',
    diagnostic:
      'Votre maturité est élevée et orientée orchestration. La priorité est de maintenir la fiabilité et la maîtrise des risques au même niveau que la vitesse.',
    nextGoal: 'Conserver la performance tout en maîtrisant les risques opérationnels et juridiques.',
    plan: [
      'Maintenir des garde-fous humains sur les décisions à impact élevé.',
      'Versionner les règles des agents et tracer les décisions clés.',
      'Évaluer régulièrement les incidents évités vs la productivité gagnée.',
    ],
    recommendation: 'Avancez par cas d\'usage incrémentaux; évitez la généralisation sans preuve de robustesse.',
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
  const [email, setEmail] = useState('');
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [detailedAnswers, setDetailedAnswers] = useState<Array<{ dimension: string; chosenLabel: string; points: number }>>([]);

  const q = questions[currentQ];
  const score = useMemo(
    () => answers.reduce((acc, points) => acc + points, 0),
    [answers],
  );
  const maxScore = questions.length * 4;
  const ratio = useMemo(() => Math.round((score / maxScore) * 100), [score, maxScore]);
  const progress = useMemo(
    () => Math.round((answers.length / questions.length) * 100),
    [answers.length],
  );
  const result = useMemo(() => getLevel(score), [score]);

  useEffect(() => {
    if (!finished) return;
    localStorage.setItem('placement_quiz_done', '1');
    localStorage.setItem('placement_quiz_level', String(result.level));
    localStorage.setItem('placement_quiz_score', String(ratio));
  }, [finished, result.level, ratio]);

  function handleNext() {
    if (selected === null) return;

    const points = q.choices[selected].points;
    const chosenLabel = q.choices[selected].label;
    setDetailedAnswers((prev) => [...prev, { dimension: q.dimension, chosenLabel, points }]);
    const nextAnswers = [...answers, points];
    setAnswers(nextAnswers);

    if (currentQ < questions.length - 1) {
      setCurrentQ((c) => c + 1);
      setSelected(null);
      return;
    }

    setFinished(true);
  }

  async function handleSubmitEmail() {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setSubmitStatus('error');
      setErrorMessage('Veuillez entrer une adresse email valide.');
      return;
    }

    setSubmitStatus('loading');
    setErrorMessage('');

    const payload = {
      email,
      score,
      scorePct: ratio,
      level: result.level,
      levelTitle: result.title,
      diagnostic: result.diagnostic,
      nextGoal: result.nextGoal,
      plan: result.plan,
      recommendation: result.recommendation,
      answers: detailedAnswers,
      siteUrl: window.location.origin + (basePath.endsWith('/') ? basePath : basePath + '/'),
    };

    try {
      const res = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Erreur inconnue');

      setSubmitStatus('success');
    } catch (err) {
      setSubmitStatus('error');
      setErrorMessage(
        err instanceof Error ? err.message : 'Impossible d\'envoyer les résultats. Vérifiez votre connexion.',
      );
    }
  }

  function handleRestart() {
    setCurrentQ(0);
    setSelected(null);
    setAnswers([]);
    setFinished(false);
    setEmail('');
    setSubmitStatus('idle');
    setErrorMessage('');
    setDetailedAnswers([]);
  }

  if (finished) {
    return (
      <div className="rounded-[1rem] border border-[var(--border)] bg-[var(--surface)] p-6">
        <p className="text-xs font-semibold tracking-[0.14em] text-[var(--text-faint)] uppercase">
          Résultat du diagnostic
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full border border-[var(--brand-300)] bg-[rgba(23,229,23,0.12)] px-4 py-1 text-sm font-semibold text-[var(--brand-700)]">
            Niveau {result.level}
          </span>
          <span className="text-sm font-semibold text-[var(--text-primary)]">{result.title}</span>
        </div>

        <p className="section-title mt-4 text-4xl text-[var(--text-primary)]">{ratio}%</p>
        <p className="text-sm text-[var(--text-faint)]">maturité observée sur ce quiz</p>

        <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-[var(--surface-strong)]">
          <div
            className="h-full rounded-full"
            style={{ width: `${ratio}%`, background: 'var(--gradient-brand)' }}
          />
        </div>

        <div className="mt-5 rounded-xl border border-[var(--brand-300)] bg-[rgba(23,229,23,0.08)] p-4">
          <p className="text-sm leading-relaxed text-[var(--text-primary)]">{result.diagnostic}</p>
          <p className="mt-2 text-sm font-semibold text-[var(--text-primary)]">{result.nextGoal}</p>
        </div>

        <div className="mt-5">
          <p className="text-sm font-semibold text-[var(--text-primary)]">Plan d'amélioration recommandé (30 jours)</p>
          <ul className="mt-2 space-y-2 text-sm text-[var(--text-muted)]">
            {result.plan.map((step) => (
              <li key={step} className="flex items-start gap-2">
                <span className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-[var(--brand-400)]" />
                <span>{step}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm font-semibold text-[var(--text-primary)]">{result.recommendation}</p>
        </div>

        <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] p-5">
          <p className="text-sm font-semibold text-[var(--text-primary)]">
            Recevez vos résultats et votre plan d'amélioration par email
          </p>
          {submitStatus === 'success' ? (
            <p className="mt-3 text-sm font-semibold text-[var(--brand-400)]">
              Résultats envoyés avec succès ! Vérifiez votre boîte de réception.
            </p>
          ) : (
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (submitStatus === 'error') setSubmitStatus('idle');
                }}
                className="flex-1 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-faint)] focus:border-[var(--brand-400)] focus:outline-none"
                disabled={submitStatus === 'loading'}
              />
              <button
                onClick={handleSubmitEmail}
                disabled={submitStatus === 'loading' || !email}
                className="btn-primary text-sm disabled:cursor-not-allowed disabled:opacity-45"
              >
                {submitStatus === 'loading' ? 'Envoi…' : 'Envoyer'}
              </button>
            </div>
          )}
          {submitStatus === 'error' && errorMessage && (
            <p className="mt-2 text-sm text-red-500">{errorMessage}</p>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href={`${basePath}courses/ia-appliquee-metiers-tech`}
            className="btn-primary text-sm"
          >
            Découvrir notre première formation
          </a>
          <button
            onClick={handleRestart}
            className="rounded-full border border-[var(--border)] px-5 py-2 text-sm font-semibold text-[var(--text-muted)] transition hover:bg-[var(--surface-strong)] hover:text-[var(--text-primary)]"
          >
            Refaire le quiz
          </button>
        </div>
      </div>
    );
  }

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
        <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-semibold text-[var(--text-muted)]">
          {q.dimension}
        </span>
      </div>

      <div className="p-5">
        <h3 className="section-title text-xl text-[var(--text-primary)]">{q.question}</h3>

        <div className="mt-5 space-y-3">
          {q.choices.map((choice, i) => {
            const selectedState = i === selected;
            const classes = selectedState
              ? 'border-[var(--brand-400)] bg-[rgba(23,229,23,0.12)] text-[var(--text-primary)]'
              : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:bg-[var(--surface-strong)] hover:text-[var(--text-primary)]';

            return (
              <button
                key={choice.label}
                className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${classes}`}
                onClick={() => setSelected(i)}
              >
                <span className="inline-flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-current/25 text-xs font-semibold">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span>{choice.label}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={handleNext}
            disabled={selected === null}
            className="btn-primary disabled:cursor-not-allowed disabled:opacity-45"
          >
            {currentQ < questions.length - 1 ? 'Continuer' : 'Voir mon niveau'}
          </button>
        </div>
      </div>
    </div>
  );
}