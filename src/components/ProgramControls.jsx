/**
 * Composant affichant les contrôles disponibles pendant que le programme tourne.
 * Pendant un effort libre, rien ne défile et il n'y a pas de durée à écourter :
 * seuls « Set done », qui termine la série, et « Stop » sont proposés.
 * @param isPaused props indiquant si le compte à rebours est figé.
 * @param isFreeWorkPhase props indiquant un effort libre en attente du clic.
 * @param handleSetDone props de la fonction qui termine un effort libre.
 * @param handleTogglePause props de la fonction qui bascule pause/reprise.
 * @param handleSkip props de la fonction qui écourte la phase en cours.
 * @param handleStop props de la fonction qui arrête le programme.
 * @returns {JSX.Element}
 */
export default function ProgramControls({
                                            isPaused,
                                            isFreeWorkPhase,
                                            handleSetDone,
                                            handleTogglePause,
                                            handleSkip,
                                            handleStop
                                        }) {

    if (isFreeWorkPhase) {
        return (<div className="controls-section">
            <div className="button-group">
                <button
                    type="button"
                    className="btn btn-success"
                    onClick={handleSetDone}>
                    Set done
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
