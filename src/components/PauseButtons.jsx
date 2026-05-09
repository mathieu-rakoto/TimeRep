/**
 * Composant affichant les boutons pour le temps de pause.
 * @param handlePauseTime props de la fonction qui gère la pause.
 * @returns {JSX.Element}
 */
export default function PauseButtons({ handlePauseTime }) {

    return (
        <div className="pause-buttons-section">
            <h2 className="section-title">Choose a break time</h2>
            <div className="button-group">
                <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => handlePauseTime(25)}>
                    00:25
                </button>
                <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => handlePauseTime(60)}>
                    01:00
                </button>
            </div>
            <div className="button-group">
                <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => handlePauseTime(120)}>
                    02:00
                </button>
                <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => handlePauseTime(180)}>
                    03:00
                </button>
            </div>
        </div>
    );
}
