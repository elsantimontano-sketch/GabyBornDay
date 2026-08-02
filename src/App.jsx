import participants from "../participants.json";

function parseLocalDate(value) {
  if (!value) return null;

  const trimmedValue = String(value).trim();
  const [year, month, day] = trimmedValue.split("-").map(Number);

  if ([year, month, day].every((part) => Number.isFinite(part))) {
    return new Date(year, month - 1, day);
  }

  const parsedDate = new Date(trimmedValue);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

const birthDateString = import.meta.env.VITE_BIRTHDAY_DATE || "";
const birthDate = birthDateString ? parseLocalDate(birthDateString) : null;

function App() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const birthDateValid = birthDate && !Number.isNaN(birthDate.getTime());
  const isWaiting = !birthDateValid || today < birthDate;

  const displayParticipants = participants
    .map((participant) => ({
      ...participant,
      date: parseLocalDate(participant.day),
    }))
    .filter((participant) => !Number.isNaN(participant.date.getTime()))
    .sort((a, b) => a.date - b.date);

  const eligibleParticipants = birthDateValid ? displayParticipants : [];
  const todayTimestamp = today.getTime();
  const currentWinningParticipant = displayParticipants.find(
    (participant) => participant.date.getTime() >= todayTimestamp
  );

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
    ? `Tu apuesta del ${winnerDay} fue la más cercana ${winnerDirection} al nacimiento.`
    : `Tu apuesta del ${winnerDay} fue la más cercana al nacimiento.`;

  return (
    <div className="app-shell">
      {isWaiting ? (
        <header className="hero">
          <div className="hero-card">
              <p className="eyelet">Apuesta por la llegada de Gaby</p>
              <h1>Apostamos por cuándo nacerá Gaby</h1>
              <p className="subtitle">El día del nacimiento se revelará la ganadora de la apuesta</p>
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
            <p className="celebrate-label">¡La apuesta llegó a su fin!</p>
            <h1>Felicidades {winner.name} — ¡ganadora de la apuesta! 🎉</h1>
            <p>{winnerMessage}</p>
            <div className="celebrate-badge">¡Ganadora de la apuesta!</div>
          </section>
        </main>
      )}

      {isWaiting && (
        <section className="participants-section">
          <h2>✨ Participantes</h2>
          <div className="participant-grid">
            {displayParticipants.map((participant) => {
              const participantDate = participant.date.getTime();
              const isPast = participantDate < todayTimestamp;
              const isWinning = participant === currentWinningParticipant && !isPast;
              const cardClassName = `participant-card${isPast ? " participant-card-lost" : ""}${isWinning ? " participant-card-winning" : ""}`;

              return (
                <article key={`${participant.name}-${participant.day}`} className={cardClassName}>
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
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

export default App;
