/**
 * Composant principal.
 * Pilote le programme d'entraînement : on saisit un nombre de séries, la durée des
 * répétitions et la durée du repos, puis le programme enchaîne seul
 * effort → repos → effort → repos … jusqu'à 0 série (un dernier repos est joué après
 * la dernière série).
 */
import {useEffect, useRef, useState} from "react";
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

    // Part du programme déjà écoulée (0 à 1), déduite du temps restant :
    // pendant un effort il reste le repos de la série en cours plus les séries suivantes,
    // pendant un repos il ne reste que les séries suivantes.
    const cycleTime = workTime + restTime;
    const totalTime = totalSets * cycleTime;
    let remainingTime = 0;
    if (phase === WORK) {
        remainingTime = countDown + restTime + (setsLeft - 1) * cycleTime;
    } else if (phase === REST) {
        remainingTime = countDown + setsLeft * cycleTime;
    }
    const progress = totalTime > 0 ? 1 - remainingTime / totalTime : 0;

    // Un seul objet Audio pour toute la session, instancié au premier besoin.
    const beepRef = useRef(null);

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
        // La lecture est muette, elle ne sert qu'à obtenir l'autorisation du navigateur.
        const beep = getBeep();
        beep.volume = 0;
        beep.play()
            .then(() => {
                stopBeep();
                beep.volume = 1;
            })
            .catch(() => {
                beep.volume = 1;
                console.error("le son n'est pas joué");
            });

        setWorkTime(newWorkTime);
        setRestTime(newRestTime);
        setTotalSets(sets);
        setSetsLeft(sets);
        setIsPaused(false);
        setPhase(WORK);
        setCountDown(newWorkTime);
    };

    const handleTogglePause = () => {
        stopBeep();
        setIsPaused(!isPaused);
    };

    // Écourte la phase en cours : la transition est prise en charge par l'effet ci-dessous.
    const handleSkip = () => {
        stopBeep();
        setIsPaused(false);
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
    useEffect(() => {
        if (!isRunning || isPaused) {
            return undefined;
        }

        const interval = setInterval(() => {
            setCountDown((current) => (current > 0 ? current - 1 : 0));
        }, 1000);

        return () => clearInterval(interval);
    }, [isRunning, isPaused]);

    // Bip des 5 dernières secondes, puis passage à la phase suivante quand on atteint 0.
    useEffect(() => {
        if (!isRunning) {
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

        if (phase === WORK) {
            // Une série vient d'être réalisée : on la décompte puis on enchaîne sur le repos.
            setSetsLeft((current) => (current > 0 ? current - 1 : 0));
            setPhase(REST);
            setCountDown(restTime);
        } else if (setsLeft > 0) {
            setPhase(WORK);
            setCountDown(workTime);
        } else {
            setPhase(DONE);
        }
    }, [countDown, phase, isRunning, setsLeft, workTime, restTime]);

    return (<div className="container-fluid">
        <div id="header">
            <h1 id="title">Time&apos; Rep</h1>
            <div id="header-rule"></div>
            <p id="version">v3.0</p>
        </div>
        <div id="main-content">
            <CountDown minutes={minutes} seconds={seconds} label={PHASE_LABELS[phase]}>
                {phase !== IDLE && <SetsTimeline
                    totalSets={totalSets}
                    workTime={workTime}
                    restTime={restTime}
                    progress={progress}/>}
            </CountDown>
            {isRunning && <SetsCounter setsLeft={setsLeft}/>}
            {isRunning ? <ProgramControls
                isPaused={isPaused}
                handleTogglePause={handleTogglePause}
                handleSkip={handleSkip}
                handleStop={handleStop}/> : <ProgramSetup handleStart={handleStart}/>}
        </div>
        <div id="copyright" className="text-center">
            Copyright © TimeRep&apos; v3.0 propriété de Mathieu RAKOTOARITSIMA 09 mai 2026
        </div>
    </div>);
}

export default App;
