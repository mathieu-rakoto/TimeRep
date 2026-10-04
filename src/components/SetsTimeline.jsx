/**
 * Composant affichant la ligne temporelle du programme.
 * Chaque série est dessinée comme une barre épaisse (l'effort) suivie d'un trait fin
 * (le repos), tous deux larges au prorata de leur durée, et terminée par un nœud rond.
 * La dernière série n'est suivie d'aucun repos.
 * La frise est empilée en deux couches identiques : une grise en fond, une lime par
 * dessus, rognée à gauche au fil du temps. Le lime ne couvre donc que le temps restant
 * et recule de nœud en nœud, et la limite entre les deux indique où l'on en est.
 * @param totalSets props du nombre de séries du programme.
 * @param workTime props de la durée d'un effort, en secondes.
 * @param restTime props de la durée d'un repos, en secondes.
 * @param progress props de la part du programme déjà écoulée (0 à 1).
 * @param pulsingSet props de l'index de la série dont l'effort attend le clic, -1 sinon.
 * @returns {JSX.Element|null}
 */
export default function SetsTimeline({totalSets, workTime, restTime, progress, pulsingSet}) {
    const cycleTime = workTime + restTime;
    const totalTime = totalSets * cycleTime - restTime;

    if (totalTime <= 0) {
        return null;
    }

    // Position et largeur de chaque élément, en pourcentage de la durée totale.
    const marks = [];
    for (let index = 0; index < totalSets; index += 1) {
        const cycleStart = index * cycleTime;
        marks.push({
            key: `work-${index}`,
            className: index === pulsingSet
                ? 'sets-timeline-work sets-timeline-work--waiting'
                : 'sets-timeline-work',
            start: (cycleStart / totalTime) * 100,
            width: (workTime / totalTime) * 100,
        });
        const isLast = index === totalSets - 1;
        if (!isLast) {
            marks.push({
                key: `rest-${index}`,
                className: 'sets-timeline-rest',
                start: ((cycleStart + workTime) / totalTime) * 100,
                width: (restTime / totalTime) * 100,
            });
        }
        marks.push({
            key: `node-${index}`,
            className: 'sets-timeline-node',
            start: ((cycleStart + (isLast ? workTime : cycleTime)) / totalTime) * 100,
            width: null,
        });
    }

    const renderMarks = () => marks.map((mark) => (<span
        key={mark.key}
        className={mark.className}
        style={mark.width === null
            ? {left: `${mark.start}%`}
            : {left: `${mark.start}%`, width: `${mark.width}%`}}
    ></span>));

    return (<div className="sets-timeline">
        <div className="sets-timeline-track">
            <div className="sets-timeline-layer">{renderMarks()}</div>
            <div
                className="sets-timeline-layer sets-timeline-layer--remaining"
                style={{clipPath: `inset(0 0 0 ${progress * 100}%)`}}>
                {renderMarks()}
            </div>
        </div>
    </div>);
}
