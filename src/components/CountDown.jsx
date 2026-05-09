/**
 * Composant affichant le Timer.
 * @param minutes props indiquant les minutes.
 * @param seconds props indiquant les secondes.
 * @returns {JSX.Element}
 */
export default function CountDown({minutes, seconds}) {

    return (<div className="countdown-section">
        <div id="countDown">
            {minutes > 10 ? minutes : '0' + minutes} : {seconds > 9 ? seconds : '0' + seconds}
        </div>
    </div>);
}