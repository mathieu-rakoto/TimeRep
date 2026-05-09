/**
 * Composant affichant les boutons pour lancer le timer avec le temps lui correspondant.
 * @param handleTimeValue props de la fonction handleTimeValue().
 * @returns {JSX.Element}
 */
export default function TimeButtons({handleTimeValue}) {

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
    </div>);
}