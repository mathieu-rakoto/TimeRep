/**
 * Composant affichant le nombre de séries restantes. Purement informatif :
 * la saisie du nombre de séries se fait dans ProgramSetup, avant le lancement.
 * @param setsLeft props du nombre de séries restantes.
 * @returns {JSX.Element}
 */
export default function SetsCounter({setsLeft}) {

    return (<div className="sets-section">
        <h3>{setsLeft}</h3>
        <p id="repCount">{setsLeft > 1 ? 'sets' : 'set'} left</p>
    </div>);
}
