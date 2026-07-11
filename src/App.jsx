import participants from "../participants.json";

const birthDateString = import.meta.env.VITE_BIRTHDAY_DATE || "";
const birthDate = birthDateString ? new Date(birthDateString) : null;

function compareDays(a, b) {
  return new Date(b.day) - new Date(a.day);
}

function App() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const birthDateValid = birthDate && !Number.isNaN(birthDate.getTime());
  const isWaiting = !birthDateValid || today < birthDate;

  const eligibleParticipants = birthDateValid
    ? participants
        .map((participant) => ({
          ...participant,
          date: new Date(participant.day),
        }))
        .filter((participant) => !Number.isNaN(participant.date.getTime()))
    : [];

  const previousCandidates = eligibleParticipants
    .filter((participant) => participant.date <= birthDate)
    .sort((a, b) => b.date - a.date);

  const nextCandidates = eligibleParticipants
    .filter((participant) => participant.date > birthDate)
    .sort((a, b) => a.date - b.date);

  const winnerCandidates = previousCandidates.length
    ? previousCandidates
    : nextCandidates;

  const winner = winnerCandidates[0] || participants[0];
  const winnerDay = winner?.day || "TBD";
  const winnerDirection = previousCandidates.length ? "anterior" : "posterior";
  const winnerMessage = birthDateValid
    ? `Su fecha elegida ${winnerDay} fue la más cercana ${winnerDirection} al nacimiento.`
    : `Su fecha elegida ${winnerDay} fue la más cercana al nacimiento.`;

  return (
    <div className="app-shell">
      {isWaiting ? (
        <header className="hero">
          <div className="hero-card">
            <p className="eyelet">Cuenta regresiva Baby Shower</p>
            <h1>Estamos esperando a que nazca Gaby</h1>
            <p className="subtitle">Este día se revelará a la ganadora</p>
          </div>
        </header>
      ) : (
        <main className="celebration-shell">
          <div className="confetti-wrapper" aria-hidden="true">
            {Array.from({ length: 14 }).map((_, index) => (
              <span
                key={index}
                className={`confetti-piece piece-${index + 1}`}
              />
            ))}
          </div>
          <section className="celebrate-card">
            <p className="celebrate-label">¡Es hora de celebrar!</p>
            <h1>Felicidades {winner.name} 🎉</h1>
            <p>{winnerMessage}</p>
            <div className="celebrate-badge">¡Ganadora del baby shower!</div>
          </section>
        </main>
      )}

      {isWaiting && (
        <section className="participants-section">
          <h2>✨ Participantes</h2>
          <div className="participant-grid">
            {participants.map((participant, index) => (
              <article key={index} className="participant-card">
                <span className="avatar">
                  {participant.name.charAt(0).toUpperCase()}
                </span>
                <div>
                  <p className="participant-name">{participant.name}</p>
                  <p className="participant-day">
                    Seleccionado: {participant.day}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default App;
