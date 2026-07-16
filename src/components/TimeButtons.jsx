import {useState} from "react";

/**
 * Composant affichant les boutons pour lancer le timer avec le temps lui correspondant,
 * ainsi qu'un champ permettant de saisir un temps personnalisé.
 * @param handleTimeValue props de la fonction handleTimeValue().
 * @param handleCustomTime props de la fonction handleCustomTime(totalSeconds).
 * @returns {JSX.Element}
 */
export default function TimeButtons({handleTimeValue, handleCustomTime}) {
    const [customMinutes, setCustomMinutes] = useState('');
    const [customSeconds, setCustomSeconds] = useState('');

    const handleCustomSubmit = () => {
        const totalSeconds = (Number(customMinutes) || 0) * 60 + (Number(customSeconds) || 0);
        if (totalSeconds > 0) {
            handleCustomTime(totalSeconds);
        }
    };

    return (<div className="time-buttons-section">
        <h2 className="section-title">Choose a time</h2>
        <div className="button-group">
            <button
                type="button"
                className="btn btn-outline-warning"
                onClick={(event) => {
                    handleTimeValue(event)
                }}
                value={25}>00:25
            </button>
            <button
                type="button"
                className="btn btn-outline-warning"
                onClick={(event) => {
                    handleTimeValue(event)
                }}
                value={30}>00:30
            </button>
        </div>
        <div className="button-group">
            <button
                type="button"
                className="btn btn-outline-warning"
                onClick={(event) => {
                    handleTimeValue(event)
                }}
                value={60}>01:00
            </button>
            <button
                type="button"
                className="btn btn-outline-warning"
                onClick={(event) => {
                    handleTimeValue(event)
                }}
                value={90}>01:30
            </button>
        </div>
        <div className="button-group">
            <button
                type="button"
                className="btn btn-outline-warning"
                onClick={(event) => {
                    handleTimeValue(event)
                }}
                value={120}>02:00
            </button>
            <button
                type="button"
                className="btn btn-outline-warning"
                onClick={(event) => {
                    handleTimeValue(event)
                }}
                value={180}>03:00
            </button>
        </div>
        <div className="button-group">
            <input
                type="number"
                min="0"
                inputMode="numeric"
                className="custom-time-input"
                placeholder="min"
                aria-label="minutes"
                value={customMinutes}
                onChange={(event) => setCustomMinutes(event.target.value)}
            />
            <input
                type="number"
                min="0"
                max="59"
                inputMode="numeric"
                className="custom-time-input"
                placeholder="sec"
                aria-label="secondes"
                value={customSeconds}
                onChange={(event) => setCustomSeconds(event.target.value)}
            />
        </div>
        <button
            type="button"
            className="btn btn-outline-warning custom-time-submit"
            onClick={handleCustomSubmit}>
            OK
        </button>
    </div>);
}