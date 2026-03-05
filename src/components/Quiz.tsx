import { useState } from 'react';

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface QuizProps {
  questions: QuizQuestion[];
}

export default function Quiz({ questions }: QuizProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = questions[currentQ];

  function handleSelect(index: number) {
    if (showResult) return;
    setSelected(index);
  }

  function handleSubmit() {
    if (selected === null) return;
    setShowResult(true);
    if (selected === q.correct) {
      setScore((s) => s + 1);
    }
  }

  function handleNext() {
    if (currentQ < questions.length - 1) {
      setCurrentQ((c) => c + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      setFinished(true);
    }
  }

  function handleRestart() {
    setCurrentQ(0);
    setSelected(null);
    setShowResult(false);
    setScore(0);
    setFinished(false);
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    const passed = pct >= 70;
    return (
      <div className="border-ink-700/40 bg-ink-900/80 my-8 rounded-2xl border p-8 text-center">
        <div
          className={`font-display mb-2 text-5xl font-bold ${passed ? 'text-sage-400' : 'text-amber-400'}`}
        >
          {pct}%
        </div>
        <p className="text-ink-200 mb-1">
          {score} / {questions.length} bonnes réponses
        </p>
        <p
          className={`mb-6 text-sm ${passed ? 'text-sage-400' : 'text-amber-400'}`}
        >
          {passed
            ? 'Félicitations, quiz réussi !'
            : 'Continuez à réviser et réessayez !'}
        </p>
        <button
          onClick={handleRestart}
          className="from-gold-600 to-gold-500 text-ink-950 hover:shadow-gold-500/20 rounded-xl bg-gradient-to-r px-5 py-2.5 text-sm font-semibold transition-all duration-300 hover:shadow-lg"
        >
          Recommencer le quiz
        </button>
      </div>
    );
  }

  return (
    <div className="border-ink-700/40 bg-ink-900/80 my-8 overflow-hidden rounded-2xl border">
      {/* Header */}
      <div className="border-ink-800/40 flex items-center justify-between border-b px-6 py-4">
        <span className="text-gold-400 text-sm font-semibold">Quiz</span>
        <span className="text-ink-500 text-sm">
          Question {currentQ + 1} / {questions.length}
        </span>
      </div>

      <div className="p-6">
        <h4 className="font-display text-ink-50 mb-5 text-lg font-semibold">
          {q.question}
        </h4>

        <div className="mb-6 space-y-3">
          {q.options.map((option, i) => {
            let classes =
              'w-full text-left px-4 py-3.5 rounded-xl border text-sm transition-all duration-200 ';
            if (showResult) {
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
                disabled={showResult}
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

        {showResult && (
          <div className="bg-ink-800/40 border-ink-700/30 mb-6 rounded-xl border px-5 py-4">
            <p className="text-ink-200 text-sm">
              <span className="text-ink-50 font-semibold">Explication : </span>
              {q.explanation}
            </p>
          </div>
        )}

        <div className="flex justify-end">
          {!showResult ? (
            <button
              onClick={handleSubmit}
              disabled={selected === null}
              className="from-gold-600 to-gold-500 disabled:from-ink-700 disabled:to-ink-700 disabled:text-ink-500 text-ink-950 hover:shadow-gold-500/20 rounded-xl bg-gradient-to-r px-5 py-2.5 text-sm font-semibold transition-all duration-300 hover:shadow-lg"
            >
              Valider
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="from-gold-600 to-gold-500 text-ink-950 hover:shadow-gold-500/20 rounded-xl bg-gradient-to-r px-5 py-2.5 text-sm font-semibold transition-all duration-300 hover:shadow-lg"
            >
              {currentQ < questions.length - 1
                ? 'Question suivante'
                : 'Voir les résultats'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
