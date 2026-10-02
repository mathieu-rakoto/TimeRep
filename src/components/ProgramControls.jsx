/**
 * Composant affichant les contrôles disponibles pendant que le programme tourne :
 * mise en pause / reprise, passage à la phase suivante et arrêt complet.
 * @param isPaused props indiquant si le compte à rebours est figé.
 * @param handleTogglePause props de la fonction qui bascule pause/reprise.
 * @param handleSkip props de la fonction qui écourte la phase en cours.
 * @param handleStop props de la fonction qui arrête le programme.
 * @returns {JSX.Element}
 */
export default function ProgramControls({isPaused, handleTogglePause, handleSkip, handleStop}) {

    return (<div className="controls-section">
        <div className="button-group button-group--3">
            <button
                type="button"
                className="btn btn-success"
                onClick={handleTogglePause}>
                {isPaused ? 'Resume' : 'Pause'}
            </button>
            <button
                type="button"
                className="btn btn-outline-warning"
                onClick={handleSkip}>
                Skip
            </button>
            <button
                type="button"
                className="btn btn-outline-danger"
                onClick={handleStop}>
                Stop
            </button>
        </div>
    </div>);
}
