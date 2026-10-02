/**
 * Composant affichant le Timer, précédé du libellé de la phase en cours.
 * @param minutes props indiquant les minutes.
 * @param seconds props indiquant les secondes.
 * @param label props du libellé de la phase (GET READY / WORK / REST / DONE).
 * @param children props du contenu affiché sous le chrono (la ligne temporelle).
 * @returns {JSX.Element}
 */
export default function CountDown({minutes, seconds, label, children}) {

    return (<div className="countdown-section">
        <p className="phase-label">{label}</p>
        <div id="countDown">
            {minutes > 9 ? minutes : '0' + minutes} : {seconds > 9 ? seconds : '0' + seconds}
        </div>
        {children}
    </div>);
}