import { useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Brain,
  CheckCircle2,
  ChevronRight,
  HeartPulse,
  History,
  ShieldCheck,
  Trash2,
  Wind,
} from 'lucide-react';

type Session = {
  id: string;
  createdAt: string;
  before: number;
  after: number;
  trigger: string;
  bodySignal: string;
  automaticThought: string;
  helpfulAction: string;
  note: string;
};

type Step = {
  title: string;
  duration: string;
  text: string;
  prompt: string;
};

const STORAGE_KEY = 'protocole-anxiete:sessions';

const steps: Step[] = [
  {
    title: 'Sécuriser',
    duration: '30 s',
    text: 'Pose les deux pieds au sol. Regarde autour de toi. Le but n’est pas de faire disparaître l’anxiété, mais de réduire l’urgence.',
    prompt: 'Phrase utile : “C’est une montée d’anxiété. C’est désagréable, mais ça va passer.”',
  },
  {
    title: 'Respirer 4/6',
    duration: '2 min',
    text: 'Inspire doucement 4 secondes. Expire 6 secondes. L’expiration longue aide à faire redescendre l’activation physiologique.',
    prompt: 'Ne cherche pas la respiration parfaite. Cherche seulement une respiration un peu plus lente.',
  },
  {
    title: 'Ancrage 5-4-3-2-1',
    duration: '2 min',
    text: 'Nomme 5 choses vues, 4 sensations corporelles, 3 sons, 2 odeurs ou goûts, puis 1 action simple à faire maintenant.',
    prompt: 'Objectif : ramener le cerveau vers l’environnement concret plutôt que vers le scénario mental.',
  },
  {
    title: 'Défusion',
    duration: '1 min',
    text: 'Repère la pensée anxieuse dominante. Ajoute devant : “J’ai la pensée que…”',
    prompt: 'Exemple : “J’ai la pensée que je vais perdre le contrôle.” Ce n’est pas une preuve, c’est un événement mental.',
  },
  {
    title: 'Micro-action',
    duration: '2 min',
    text: 'Choisis une action minuscule et utile : boire de l’eau, ouvrir une fenêtre, marcher 3 minutes, envoyer un message, ranger un objet.',
    prompt: 'Une action concrète vaut mieux qu’une analyse infinie pendant le pic.',
  },
];

const emergencyLinks = [
  { label: '15 — SAMU', detail: 'urgence médicale' },
  { label: '112 — urgence européenne', detail: 'danger immédiat' },
  { label: '3114 — prévention suicide', detail: 'France, 24/7' },
];

function readSessions(): Session[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Session[]) : [];
  } catch {
    return [];
  }
}

function writeSessions(sessions: Session[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

function clampAnxiety(value: number) {
  return Math.max(0, Math.min(10, value));
}

export function App() {
  const [activeStep, setActiveStep] = useState(0);
  const [before, setBefore] = useState(7);
  const [after, setAfter] = useState(4);
  const [trigger, setTrigger] = useState('');
  const [bodySignal, setBodySignal] = useState('');
  const [automaticThought, setAutomaticThought] = useState('');
  const [helpfulAction, setHelpfulAction] = useState('');
  const [note, setNote] = useState('');
  const [sessions, setSessions] = useState<Session[]>(readSessions);

  const currentStep = steps[activeStep];
  const averageDrop = useMemo(() => {
    if (!sessions.length) return null;
    const total = sessions.reduce((sum, session) => sum + (session.before - session.after), 0);
    return Math.round((total / sessions.length) * 10) / 10;
  }, [sessions]);

  const saveSession = () => {
    const session: Session = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      before: clampAnxiety(before),
      after: clampAnxiety(after),
      trigger: trigger.trim(),
      bodySignal: bodySignal.trim(),
      automaticThought: automaticThought.trim(),
      helpfulAction: helpfulAction.trim(),
      note: note.trim(),
    };

    const nextSessions = [session, ...sessions].slice(0, 50);
    setSessions(nextSessions);
    writeSessions(nextSessions);
    setTrigger('');
    setBodySignal('');
    setAutomaticThought('');
    setHelpfulAction('');
    setNote('');
  };

  const clearHistory = () => {
    setSessions([]);
    writeSessions([]);
  };

  return (
    <main className="app-shell">
      <section className="hero card elevated">
        <div className="hero-copy">
          <p className="eyebrow">Protocole personnel</p>
          <h1>Faire redescendre l’anxiété, étape par étape.</h1>
          <p>
            Un support court pour traverser une montée d’anxiété : respiration, ancrage,
            défusion, micro-action et journal avant/après.
          </p>
        </div>
        <div className="hero-badge" aria-hidden="true">
          <HeartPulse size={42} />
        </div>
      </section>

      <section className="safety card">
        <div>
          <div className="section-title compact">
            <AlertTriangle size={18} />
            <h2>Limite importante</h2>
          </div>
          <p>
            Cette application n’est pas un avis médical. En cas de danger immédiat ou d’idées
            suicidaires, contacte un service d’urgence ou une personne de confiance.
          </p>
        </div>
        <div className="emergency-grid">
          {emergencyLinks.map((item) => (
            <div className="emergency-pill" key={item.label}>
              <strong>{item.label}</strong>
              <span>{item.detail}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="stats-grid">
        <article className="stat card">
          <Activity size={20} />
          <strong>{sessions.length}</strong>
          <span>sessions enregistrées</span>
        </article>
        <article className="stat card">
          <ShieldCheck size={20} />
          <strong>{averageDrop === null ? '—' : `-${averageDrop}`}</strong>
          <span>baisse moyenne /10</span>
        </article>
      </section>

      <section className="card protocol-card" id="crise">
        <div className="section-title">
          <Wind size={22} />
          <div>
            <h2>Crise maintenant</h2>
            <p>Avance sans réfléchir trop longtemps. Le protocole est volontairement simple.</p>
          </div>
        </div>

        <div className="stepper" aria-label="Étapes du protocole">
          {steps.map((step, index) => (
            <button
              className={index === activeStep ? 'step-dot active' : 'step-dot'}
              key={step.title}
              onClick={() => setActiveStep(index)}
              aria-label={`Aller à l’étape ${index + 1}: ${step.title}`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <article className="active-step">
          <div className="step-header">
            <span>Étape {activeStep + 1}/5</span>
            <span>{currentStep.duration}</span>
          </div>
          <h3>{currentStep.title}</h3>
          <p>{currentStep.text}</p>
          <div className="prompt-box">{currentStep.prompt}</div>
        </article>

        <div className="button-row">
          <button
            className="secondary-button"
            onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
            disabled={activeStep === 0}
          >
            Précédent
          </button>
          <button
            className="primary-button"
            onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))}
            disabled={activeStep === steps.length - 1}
          >
            Suivant <ChevronRight size={18} />
          </button>
        </div>
      </section>

      <section className="grid-two">
        <article className="card">
          <div className="section-title">
            <Brain size={22} />
            <div>
              <h2>Journal rapide</h2>
              <p>30 secondes pour transformer l’épisode en donnée exploitable.</p>
            </div>
          </div>

          <div className="slider-group">
            <label htmlFor="before">Anxiété avant : {before}/10</label>
            <input
              id="before"
              type="range"
              min="0"
              max="10"
              value={before}
              onChange={(event) => setBefore(Number(event.target.value))}
            />
          </div>

          <div className="slider-group">
            <label htmlFor="after">Anxiété après : {after}/10</label>
            <input
              id="after"
              type="range"
              min="0"
              max="10"
              value={after}
              onChange={(event) => setAfter(Number(event.target.value))}
            />
          </div>

          <label>
            Déclencheur probable
            <input value={trigger} onChange={(event) => setTrigger(event.target.value)} placeholder="ex. message, foule, fatigue..." />
          </label>
          <label>
            Signal corporel dominant
            <input value={bodySignal} onChange={(event) => setBodySignal(event.target.value)} placeholder="ex. gorge serrée, ventre, cœur..." />
          </label>
          <label>
            Pensée automatique
            <input value={automaticThought} onChange={(event) => setAutomaticThought(event.target.value)} placeholder="ex. je ne vais pas gérer..." />
          </label>
          <label>
            Action qui a aidé
            <input value={helpfulAction} onChange={(event) => setHelpfulAction(event.target.value)} placeholder="ex. marcher, respirer, appeler..." />
          </label>
          <label>
            Note libre
            <textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Ce que je veux retenir..." rows={4} />
          </label>

          <button className="primary-button full" onClick={saveSession}>
            <CheckCircle2 size={18} /> Enregistrer la session
          </button>
        </article>

        <article className="card history-card">
          <div className="section-title spread">
            <div className="inline-title">
              <History size={22} />
              <div>
                <h2>Historique</h2>
                <p>Stockage local, uniquement sur cet appareil.</p>
              </div>
            </div>
            {sessions.length > 0 && (
              <button className="icon-button" onClick={clearHistory} aria-label="Effacer l’historique">
                <Trash2 size={18} />
              </button>
            )}
          </div>

          {sessions.length === 0 ? (
            <div className="empty-state">
              <p>Aucune session enregistrée pour l’instant.</p>
              <span>Fais un protocole, puis note l’avant/après.</span>
            </div>
          ) : (
            <div className="session-list">
              {sessions.map((session) => (
                <article className="session-item" key={session.id}>
                  <div className="session-topline">
                    <strong>
                      {new Intl.DateTimeFormat('fr-FR', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      }).format(new Date(session.createdAt))}
                    </strong>
                    <span>
                      {session.before}/10 → {session.after}/10
                    </span>
                  </div>
                  {(session.trigger || session.helpfulAction) && (
                    <p>
                      {session.trigger && `Déclencheur : ${session.trigger}. `}
                      {session.helpfulAction && `A aidé : ${session.helpfulAction}.`}
                    </p>
                  )}
                  {session.automaticThought && <small> pensée : “{session.automaticThought}”</small>}
                </article>
              ))}
            </div>
          )}
        </article>
      </section>
    </main>
  );
}
