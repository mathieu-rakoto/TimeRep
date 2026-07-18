import {useState} from "react";

/**
 * Composant affichant le champ pour saisir la durée d'un exercice à chronométrer,
 * sans décompter le nombre de répétitions restantes.
 * @param handleExcerciceTime props de la fonction qui gère le temps de l'exercice.
 * @returns {JSX.Element}
 */
export default function ExerciseTimer({ handleExcerciceTime }) {
    const [exerciseMinutes, setExerciseMinutes] = useState('');
    const [exerciseSeconds, setExerciseSeconds] = useState('');

    const handleExerciseSubmit = () => {
        const totalSeconds = (Number(exerciseMinutes) || 0) * 60 + (Number(exerciseSeconds) || 0);
        if (totalSeconds > 0) {
            handleExcerciceTime(totalSeconds);
        }
    };

    return (
        <div className="exercise-timer-section">
            <h2 className="section-title">Time your exercise</h2>
            <div className="button-group">
                <input
                    type="number"
                    min="0"
                    inputMode="numeric"
                    className="custom-time-input"
                    placeholder="min"
                    aria-label="minutes"
                    value={exerciseMinutes}
                    onChange={(event) => setExerciseMinutes(event.target.value)}
                />
                <input
                    type="number"
                    min="0"
                    max="59"
                    inputMode="numeric"
                    className="custom-time-input"
                    placeholder="sec"
                    aria-label="secondes"
                    value={exerciseSeconds}
                    onChange={(event) => setExerciseSeconds(event.target.value)}
                />
            </div>
            <button
                type="button"
                className="btn btn-outline-danger custom-time-submit"
                onClick={handleExerciseSubmit}>
                OK
            </button>
        </div>
    );
}
