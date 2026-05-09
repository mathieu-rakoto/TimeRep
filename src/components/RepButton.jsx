/**
 * Composant affichant le nombre de répétitions restantes, ainsi que les boutons pour les incrémenter ou décrémenter.
 * @param repCount props du nombre de répétitions restantes.
 * @param handlePlus props de la fonction handleClickUp().
 * @param handleLess props de la fonction handleClickDown().
 * @returns {JSX.Element}
 */
export default function RepButton({repCount, handlePlus, handleLess}) {

    return (<div className="reps-section">
        <h3>{repCount}</h3>
        <p id="repCount">{repCount > 1 ? 'reps' : 'rep'} to do</p>
        <div className="button-group">
            <button
                className="btn btn-success"
                type="button"
                onClick={handleLess}>
                − rep
            </button>
            <button
                className="btn btn-success"
                type="button"
                onClick={handlePlus}>
                + rep
            </button>
        </div>
    </div>);
}