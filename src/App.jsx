/**
 * Composant principal.
 * Pilote le programme d'entraînement : on saisit un nombre de séries, la durée des
 * répétitions et la durée du repos, puis le programme enchaîne seul
 * effort → repos → effort → repos … jusqu'à 0 série (pas de repos après la dernière
 * série : le programme est terminé dès qu'elle l'est).
 */
import {useCallback, useEffect, useRef, useState} from "react";
import CountDown from "./components/CountDown.jsx";
import SetsCounter from "./components/SetsCounter.jsx";
import SetsTimeline from "./components/SetsTimeline.jsx";
import ProgramSetup from "./components/ProgramSetup.jsx";
import ProgramControls from "./components/ProgramControls.jsx";

// Phases du programme.
const IDLE = 'idle';
const WORK = 'work';
const REST = 'rest';
const DONE = 'done';

// Libellés affichés au-dessus du compte à rebours.
const PHASE_LABELS = {
    [IDLE]: 'GET READY',
    [WORK]: 'WORK',
    [REST]: 'REST',
    [DONE]: 'DONE',
};

function App() {
    const [phase, setPhase] = useState(IDLE);
    const [totalSets, setTotalSets] = useState(0);
    const [setsLeft, setSetsLeft] = useState(0);
    const [workTime, setWorkTime] = useState(0);
    const [restTime, setRestTime] = useState(0);
    const [countDown, setCountDown] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const minutes = Math.floor(countDown / 60);
    const seconds = countDown % 60;
    const isRunning = phase === WORK || phase === REST;
    // Sans durée d'effort saisie, l'effort n'est pas chronométré : le chrono reste à 00:00
    // et c'est l'utilisateur qui déclare la série terminée.
    const isFreeWork = workTime === 0;
    const isFreeWorkPhase = isFreeWork && phase === WORK;

    // La frise a besoin d'une largeur pour l'effort : en mode libre on lui en donne une
    // nominale, la moitié du repos, soit un tiers du cycle.
    const slotWorkTime = isFreeWork ? restTime / 2 : workTime;

    // Part du programme déjà écoulée (0 à 1), déduite du temps restant. Le dernier effort
    // n'est suivi d'aucun repos, d'où le « - restTime » du temps total :
    // pendant un effort il reste le temps courant plus les séries suivantes,
    // pendant un repos il reste le temps courant plus les séries suivantes (dernier repos exclu).
    const cycleTime = slotWorkTime + restTime;
    const totalTime = totalSets * cycleTime - restTime;
    let remainingTime = 0;
    if (isFreeWorkPhase) {
        // L'effort libre n'a pas de durée : la progression stationne au début de son créneau.
        remainingTime = setsLeft * cycleTime - restTime;
    } else if (phase === WORK) {
        remainingTime = countDown + (setsLeft - 1) * cycleTime;
    } else if (phase === REST) {
        remainingTime = countDown + setsLeft * cycleTime - restTime;
    }
    const progress = totalTime > 0 ? 1 - remainingTime / totalTime : 0;
    // Série dont l'effort est en attente du clic, pour la faire pulser sur la frise.
    const pulsingSet = isFreeWorkPhase ? totalSets - setsLeft : -1;

    // Un seul objet Audio pour toute la session, instancié au premier besoin.
    const beepRef = useRef(null);
    // Fin de la phase en cours (timestamp) : le temps restant se mesure sur l'horloge réelle,
    // car les intervalles sont ralentis ou suspendus quand l'écran est verrouillé ou l'onglet masqué.
    const endAtRef = useRef(0);
    // Temps restant (ms) figé pendant une pause, pour repartir de là à la reprise.
    const pausedRemainingRef = useRef(0);

    const beginPhase = useCallback((seconds) => {
        endAtRef.current = Date.now() + seconds * 1000;
        setCountDown(seconds);
    }, []);

    const getBeep = () => {
        if (beepRef.current === null) {
            beepRef.current = new Audio('beep.mp3');
        }
        return beepRef.current;
    };

    const stopBeep = () => {
        if (beepRef.current !== null) {
            beepRef.current.pause();
            beepRef.current.currentTime = 0;
        }
    };

    // Lance le programme avec les réglages saisis et commence par la phase d'effort.
    const handleStart = (sets, newWorkTime, newRestTime) => {
        // Le clic est la seule occasion de « déverrouiller » le son sur mobile :
        // une lecture déclenchée plus tard par le timer serait refusée par iOS.
        // La lecture est muette (« muted » : sur iOS, « volume » est en lecture seule),
        // elle ne sert qu'à obtenir l'autorisation du navigateur.
        const beep = getBeep();
        beep.muted = true;
        beep.play()
            .then(() => {
                stopBeep();
                beep.muted = false;
            })
            .catch(() => {
                beep.muted = false;
                console.error("le son n'est pas joué");
            });

        setWorkTime(newWorkTime);
        setRestTime(newRestTime);
        setTotalSets(sets);
        setSetsLeft(sets);
        setIsPaused(false);
        setPhase(WORK);
        beginPhase(newWorkTime);
    };

    const handleTogglePause = () => {
        stopBeep();
        if (isPaused) {
            endAtRef.current = Date.now() + pausedRemainingRef.current;
        } else {
            pausedRemainingRef.current = Math.max(0, endAtRef.current - Date.now());
        }
        setIsPaused(!isPaused);
    };

    // Seule sortie d'un effort, qu'il soit chronométré (fin du décompte) ou libre (clic
    // sur Set done) : la série réalisée est décomptée, puis le repos démarre,
    // sauf après la dernière série où le programme est terminé.
    const startRest = useCallback(() => {
        if (setsLeft <= 1) {
            setSetsLeft(0);
            setPhase(DONE);
            return;
        }
        setSetsLeft(setsLeft - 1);
        setPhase(REST);
        beginPhase(restTime);
    }, [setsLeft, restTime, beginPhase]);

    const handleSetDone = () => {
        stopBeep();
        startRest();
    };

    // Écourte la phase en cours : la transition est prise en charge par l'effet ci-dessous.
    const handleSkip = () => {
        stopBeep();
        setIsPaused(false);
        endAtRef.current = Date.now();
        setCountDown(0);
    };

    const handleStop = () => {
        stopBeep();
        setIsPaused(false);
        setPhase(IDLE);
        setSetsLeft(0);
        setCountDown(0);
    };

    // Intervalle unique, recréé seulement quand la phase ou la pause change.
    // Il ne décompte pas des « ticks » : il relit l'horloge, donc un retard (écran verrouillé,
    // onglet masqué) est rattrapé au tick suivant, ou dès le retour au premier plan.
    // Un effort libre ne fait rien défiler : aucun intervalle n'est créé.
    useEffect(() => {
        if (!isRunning || isPaused || isFreeWorkPhase) {
            return undefined;
        }

        const tick = () => {
            setCountDown(Math.max(0, Math.ceil((endAtRef.current - Date.now()) / 1000)));
        };
        const interval = setInterval(tick, 250);
        document.addEventListener('visibilitychange', tick);

        return () => {
            clearInterval(interval);
            document.removeEventListener('visibilitychange', tick);
        };
    }, [isRunning, isPaused, isFreeWorkPhase]);

    // Garde l'écran allumé tant que le programme tourne (un repos de plusieurs minutes
    // sinon met le téléphone en veille). Le verrou saute quand la page est masquée :
    // on le redemande au retour au premier plan.
    useEffect(() => {
        if (!isRunning || !('wakeLock' in navigator)) {
            return undefined;
        }

        let lock = null;
        let cancelled = false;
        const acquire = async () => {
            try {
                const newLock = await navigator.wakeLock.request('screen');
                if (cancelled) {
                    newLock.release();
                } else {
                    lock = newLock;
                }
            } catch {
                // Refusé (économie d'énergie…) : le chrono fonctionne quand même.
            }
        };
        const handleVisibility = () => {
            if (document.visibilityState === 'visible') {
                acquire();
            }
        };

        acquire();
        document.addEventListener('visibilitychange', handleVisibility);

        return () => {
            cancelled = true;
            document.removeEventListener('visibilitychange', handleVisibility);
            if (lock !== null) {
                lock.release();
            }
        };
    }, [isRunning]);

    // Bip des 5 dernières secondes, puis passage à la phase suivante quand on atteint 0.
    // Un effort libre stationne à 0 : il ne bipe pas et n'en sort que par le bouton.
    useEffect(() => {
        if (!isRunning || isFreeWorkPhase) {
            return;
        }

        if (countDown > 0) {
            if (countDown <= 5) {
                const beep = getBeep();
                beep.currentTime = 0;
                beep.play().catch(() => console.error("le son n'est pas joué"));
            }
            return;
        }

        // Le dernier effort mène directement à DONE (voir startRest) : un repos est
        // toujours suivi d'une nouvelle série.
        if (phase === WORK) {
            startRest();
        } else {
            setPhase(WORK);
            beginPhase(workTime);
        }
    }, [countDown, phase, isRunning, isFreeWorkPhase, workTime, startRest, beginPhase]);

    return (<div className="container-fluid">
        <div id="header">
            <h1 id="title">Time&apos; Rep</h1>
            <div id="header-rule"></div>
            <p id="version">v3.1</p>
        </div>
        <div id="main-content">
            <CountDown minutes={minutes} seconds={seconds} label={PHASE_LABELS[phase]}>
                {phase !== IDLE && <SetsTimeline
                    totalSets={totalSets}
                    workTime={slotWorkTime}
                    restTime={restTime}
                    progress={progress}
                    pulsingSet={pulsingSet}/>}
            </CountDown>
            {isRunning && <SetsCounter setsLeft={setsLeft}/>}
            {isRunning ? <ProgramControls
                isPaused={isPaused}
                isFreeWorkPhase={isFreeWorkPhase}
                handleSetDone={handleSetDone}
                handleTogglePause={handleTogglePause}
                handleSkip={handleSkip}
                handleStop={handleStop}/> : <ProgramSetup handleStart={handleStart}/>}
        </div>
        <div id="copyright" className="text-center">
            Copyright © TimeRep&apos; v3.1 propriété de Mathieu RAKOTOARITSIMA 09 mai 2026
        </div>
    </div>);
}

export default App;
