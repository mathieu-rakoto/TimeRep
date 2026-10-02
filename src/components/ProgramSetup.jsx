import {useState} from "react";

/**
 * Composant de réglage du programme : nombre de séries, temps de repos entre les séries
 * et temps que va durer les répétitions. Le bouton Start remonte les trois valeurs à App.
 * Les durées sont saisies en minutes/secondes et remontent converties en secondes.
 * @param handleStart props de la fonction qui lance le programme (sets, workTime, restTime).
 * @returns {JSX.Element}
 */
export default function ProgramSetup({handleStart}) {
    const [sets, setSets] = useState(0);
    const [workMinutes, setWorkMinutes] = useState('');
    const [workSeconds, setWorkSeconds] = useState('');
    const [restMinutes, setRestMinutes] = useState('');
    const [restSeconds, setRestSeconds] = useState('');

    const workTime = (Number(workMinutes) || 0) * 60 + (Number(workSeconds) || 0);
    const restTime = (Number(restMinutes) || 0) * 60 + (Number(restSeconds) || 0);
    // La durée d'effort est facultative : laissée vide, la série se termine au bouton.
    const isReady = sets > 0 && restTime > 0;

    const handleSubmit = () => {
        if (isReady) {
            handleStart(sets, workTime, restTime);
        }
    };

    return (<div className="program-setup-section">
        <h2 className="section-title">Sets to do</h2>
        <p className="setup-value">{sets}</p>
        <div className="button-group">
            <button
                className="btn btn-success"
                type="button"
                onClick={() => setSets(sets > 0 ? sets - 1 : 0)}>
                − set
            </button>
            <button
                className="btn btn-success"
                type="button"
                onClick={() => setSets(sets + 1)}>
                + set
            </button>
        </div>

        <h2 className="section-title">Rest between sets</h2>
        <div className="button-group">
            <input
                type="number"
                min="0"
                inputMode="numeric"
                className="custom-time-input"
                placeholder="min"
                aria-label="minutes de repos"
                value={restMinutes}
                onChange={(event) => setRestMinutes(event.target.value)}
            />
            <input
                type="number"
                min="0"
                max="59"
                inputMode="numeric"
                className="custom-time-input"
                placeholder="sec"
                aria-label="secondes de repos"
                value={restSeconds}
                onChange={(event) => setRestSeconds(event.target.value)}
            />
        </div>

        <h2 className="section-title">Reps duration (optional)</h2>
        <p className="setup-hint">Leave empty to end each set with a button</p>
        <div className="button-group">
            <input
                type="number"
                min="0"
                inputMode="numeric"
                className="custom-time-input"
                placeholder="min"
                aria-label="minutes des répétitions"
                value={workMinutes}
                onChange={(event) => setWorkMinutes(event.target.value)}
            />
            <input
                type="number"
                min="0"
                max="59"
                inputMode="numeric"
                className="custom-time-input"
                placeholder="sec"
                aria-label="secondes des répétitions"
                value={workSeconds}
                onChange={(event) => setWorkSeconds(event.target.value)}
            />
        </div>

        <button
            type="button"
            className="btn btn-success custom-time-submit"
            disabled={!isReady}
            onClick={handleSubmit}>
            Start
        </button>
    </div>);
}
