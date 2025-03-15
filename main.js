// import React, { useState, useEffect, useCallback } from 'react';
// import ReactDOM from 'react-dom/client';

const { useState, useEffect, useCallback } = React;

// April 26, 1986 - Chernobyl Nuclear Power Plant
const gameScenes = {
  start: {
    text: "01:23 AM - During a late-night safety test at Reactor No. 4, multiple alarms suddenly activate. As the deputy chief engineer, you notice severe power fluctuations. The RBMK reactor is becoming unstable.",
    choices: [{ text: "Analyze reactor power distribution graphs", nextScene: "initialAssessment" }, { text: "Check neutron flux readings in person", nextScene: "reactorChamber" }, { text: "Begin immediate SCRAM procedure", nextScene: "evacuation" }]
  },
  initialAssessment: {
    text: "The control rods are at 6-8 meters insertion, xenon poisoning is present, and the reactor's power output is oscillating between 200MW and 1600MW thermal. Multiple control circuits are showing conflicting readings.",
    choices: [{ text: "Check reactor core temperature readings", nextScene: "controlRoom" }, { text: "Review emergency protocols", nextScene: "protocols" }, { text: "Contact facility director", nextScene: "communication" }]
  },
  protocols: {
    text: "The emergency manual indicates several possible procedures. Time is running out!",
    choices: [{ text: "Follow standard shutdown procedure", nextScene: "controlRoom" }, { text: "Implement emergency protocols", nextScene: "controlRoom" }]
  },
  communication: {
    text: "The facility director is unavailable. The responsibility falls on you.",
    choices: [{ text: "Take command of the situation", nextScene: "controlRoom" }, { text: "Wait for higher authority", nextScene: "death" }]
  },
  controlRoom: {
    text: "The control room panels show critical parameters: reactivity margin at 6 rods equivalent, power distribution severely skewed to lower regions, and positive void coefficient at maximum. The AZ-5 SCRAM system is available but could trigger a power excursion due to the tip design of the control rods.",
    choices: [{ text: "Attempt manual override of cooling systems", nextScene: "manualOverride" }, { text: "Investigate backup system malfunction", nextScene: "backupSystem" }, { text: "Initiate emergency shutdown sequence", nextScene: "shutdown" }]
  },
  reactorChamber: {
    text: "The radiation levels are already at 3.6 Roentgen - that's the maximum reading on the low-range dosimeters. The high-range dosimeters are locked in a safe.",
    choices: [{ text: "Try to manually activate emergency cooling", nextScene: "death" }, { text: "Return to control room immediately", nextScene: "controlRoom" }]
  },
  evacuation: {
    text: "You've ordered the evacuation of Pripyat, but it may be too late. The city's 50,000 residents will be exposed to dangerous levels of radiation. The reactor core is now exposed.",
    choices: [{ text: "Try again", nextScene: "start" }]
  },
  manualOverride: {
    text: "The manual override is risky but might work. You need to choose the correct sequence.",
    choices: [{ text: "Sequence: Cool → Vent → Power", nextScene: "technicalSuccess" }, { text: "Sequence: Power → Cool → Vent", nextScene: "death" }, { text: "Sequence: Vent → Power → Cool", nextScene: "death" }]
  },
  backupSystem: {
    text: "You discover the backup system was sabotaged! There's evidence of tampering.",
    choices: [{ text: "Try to repair it quickly", nextScene: "death" }, { text: "Return to control room", nextScene: "controlRoom" }, { text: "Call security", nextScene: "security" }]
  },
  shutdown: {
    text: "Emergency shutdown initiated. The reactor is powering down but cooling is still critical.",
    choices: [{ text: "Monitor the shutdown process", nextScene: "heroicSuccess" }, { text: "Leave the facility", nextScene: "evacuation" }]
  },
  security: {
    text: "Security arrives but precious time has been lost. The reactor temperature is now critical.",
    choices: [{ text: "Rush back to control room", nextScene: "controlRoom" }, { text: "Evacuate immediately", nextScene: "evacuation" }]
  },
  heroicSuccess: {
    text: "Through extraordinary effort and sacrifice, you've managed to contain the worst nuclear disaster in history. Your actions saved countless lives in Pripyat and prevented catastrophic contamination across Europe.",
    ending: "HEROIC",
    choices: [{ text: "Play again", nextScene: "start" }]
  },
  technicalSuccess: {
    text: "Your methodical approach and technical expertise prevented the disaster. While some systems are damaged, there were no casualties.",
    ending: "TECHNICAL",
    choices: [{ text: "Play again", nextScene: "start" }]
  },
  partialSuccess: {
    text: "You managed to prevent a full meltdown, but at great cost. The facility is severely damaged and will take years to recover.",
    ending: "PARTIAL",
    choices: [{ text: "Play again", nextScene: "start" }]
  },
  catastrophicDeath: {
    text: "The reactor core has exploded, releasing massive amounts of radioactive material into the atmosphere. The graphite moderator is burning, sending a radioactive plume across Europe. This will be remembered as the worst nuclear disaster in history.",
    ending: "CATASTROPHIC",
    choices: [{ text: "Try again", nextScene: "start" }]
  },
  sacrificeDeath: {
    text: "Like the brave firefighters of Chernobyl, you sacrificed yourself to prevent an even greater catastrophe. Your exposure to lethal radiation levels while managing the crisis will be remembered by history.",
    ending: "SACRIFICE",
    choices: [{ text: "Try again", nextScene: "start" }]
  },
  evacuationEnd: {
    text: "The residents of Pripyat were evacuated, but not before receiving significant radiation exposure. The exclusion zone will remain uninhabitable for thousands of years, but your quick action saved many from immediate death.",
    ending: "EVACUATION",
    choices: [{ text: "Try again", nextScene: "start" }]
  },
  diagnostic: {
    text: "The RBMK reactor's diagnostic panel shows: moderator temperature 280°C, fuel channel pressure 83 kg/cm², steam quality ratio destabilizing, and neutron flux distribution indicates possible void collapse in lower regions. Multiple safety systems are generating contradictory readings.",
    choices: [{ text: "Run full system diagnostic", nextScene: "systemCheck" }, { text: "Focus on cooling system", nextScene: "coolingCheck" }, { text: "Check reactor pressure", nextScene: "pressureCheck" }]
  },
  systemCheck: {
    text: "The diagnostic reveals a cascade failure originating from the primary cooling circuit.",
    choices: [{ text: "Reroute power to backup systems", nextScene: "backupSuccess" }, { text: "Attempt to restart primary system", nextScene: "death" }, { text: "Contact external support", nextScene: "support" }]
  },
  coolingCheck: {
    text: "The cooling system analysis shows multiple valve failures in sequence.",
    choices: [{ text: "Override valve controls", nextScene: "valveControl" }, { text: "Activate emergency cooling", nextScene: "emergencyCool" }]
  },
  pressureCheck: {
    text: "Reactor pressure is dangerously high and rising!",
    choices: [{ text: "Emergency pressure release", nextScene: "death" }, { text: "Return to diagnostic panel", nextScene: "diagnostic" }]
  },
  valveControl: {
    text: "Manual valve control activated. You need to sequence the valve operations correctly.",
    choices: [{ text: "Open auxiliary valves first", nextScene: "success" }, { text: "Open main valves first", nextScene: "death" }]
  },
  emergencyCool: {
    text: "Emergency cooling system engaged. Secondary containment holding.",
    choices: [{ text: "Monitor containment levels", nextScene: "success" }, { text: "Increase cooling rate", nextScene: "death" }]
  },
  backupSuccess: {
    text: "Backup systems successfully engaged. Crisis averted.",
    choices: [{ text: "Begin system restoration", nextScene: "success" }]
  },
  support: {
    text: "External support team is 30 minutes out. That might be too long.",
    choices: [{ text: "Wait for support", nextScene: "death" }, { text: "Take immediate action", nextScene: "diagnostic" }]
  },
  radiationCheck: {
    text: "Radiation levels are fluctuating in different sectors. You need to ensure containment.",
    choices: [{ text: "Seal off affected sectors", nextScene: "containment" }, { text: "Send in inspection team", nextScene: "death" }, { text: "Ignore secondary containment", nextScene: "death" }]
  },
  containment: {
    text: "Primary containment pressure at 67 atmospheres and rising. Hydrogen concentration detected in multiple zones. Fuel channel temperature sensors showing readings above 700°C in sectors 47-21. Emergency cooling system reporting conflicting flow rates.",
    choices: [{ text: "Initiate controlled venting", nextScene: "ventingProcess" }, { text: "Strengthen containment shields", nextScene: "shieldControl" }]
  },
  ventingProcess: {
    text: "Venting must be done precisely. Which sectors should be vented first?",
    choices: [{ text: "Vent auxiliary chambers first", nextScene: "success" }, { text: "Vent main chamber first", nextScene: "death" }]
  },
  shieldControl: {
    text: "Shield reinforcement requires power redistribution. Choose the power allocation:",
    choices: [{ text: "Prioritize critical systems", nextScene: "success" }, { text: "Equal distribution", nextScene: "partialSuccess" }]
  },
  powerManagement: {
    text: "Power grid is becoming unstable. Emergency generators are available.",
    choices: [{ text: "Switch to emergency power", nextScene: "success" }, { text: "Maintain main power", nextScene: "death" }, { text: "Split power sources", nextScene: "partialSuccess" }]
  }
};

const App = () => {
  const [currentScene, setCurrentScene] = useState('start');
  const [history, setHistory] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [timerActive, setTimerActive] = useState(true);
  const [isVoting, setIsVoting] = useState(false);

  const determineEnding = () => {
    const recentChoices = history.slice(-3);
    if (recentChoices.includes('valveControl') && recentChoices.includes('powerManagement')) {
      return 'heroicSuccess';
    } else if (recentChoices.includes('diagnostic') && recentChoices.includes('systemCheck')) {
      return 'technicalSuccess';
    } else if (recentChoices.includes('evacuation')) {
      return 'evacuationEnd';
    } else if (recentChoices.includes('containment')) {
      return 'partialSuccess';
    }
    return 'catastrophicDeath';
  };
  const handleTimeout = useCallback(() => {
    setIsVoting(true);
    setTimerActive(false);
  }, []);
  // Timer effect
  useEffect(() => {
    let timer;
    if (timerActive && !gameScenes[currentScene].ending) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [currentScene, timerActive, handleTimeout]);
  const handleChoice = choice => {
    if (choice.text === 'Try again' || choice.text === 'Play again') {
      // Reset game state
      setCurrentScene('start');
      setHistory([]);
      setTimeLeft(60);
      setTimerActive(true);
      setIsVoting(false);
      return;
    }

    // Process choices during voting state
    if (isVoting) {
      setIsVoting(false); // Clear voting state when choice is made
    }

    setHistory([...history, currentScene]);

    // Reset timer for new question
    setTimeLeft(60);
    setTimerActive(false); // Temporarily pause timer during transition

    if (choice.nextScene === 'success') {
      setCurrentScene(determineEnding());
    } else if (choice.nextScene === 'death') {
      setCurrentScene('catastrophicDeath');
    } else {
      setCurrentScene(choice.nextScene);
    }

    setTimerActive(true); // Reactivate timer for next scene
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const newHistory = [...history];
      const previousScene = newHistory.pop();
      setHistory(newHistory);
      setCurrentScene(previousScene);
    }
  };

  return React.createElement(
    'div',
    { style: {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f0f0f0',
        minHeight: '100vh'
      } },
    React.createElement(
      'h1',
      { style: { color: '#cc0000', textAlign: 'center' } },
      'Chernobyl: April 26, 1986'
    ),
    React.createElement(
      'h2',
      { style: { color: '#666', textAlign: 'center', fontSize: '1.2em', marginBottom: '20px' } },
      'RBMK Reactor No. 4 - Pripyat, Ukrainian SSR'
    ),
    React.createElement(
      'div',
      { style: {
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '10px',
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        } },
      React.createElement(
        'div',
        { style: { marginBottom: '20px' } },
        React.createElement(
          'p',
          { style: { fontSize: '1.2em', marginBottom: '10px' } },
          gameScenes[currentScene].text
        ),
        gameScenes[currentScene].ending && React.createElement(
          'div',
          { style: {
              backgroundColor: '#f8f9fa',
              padding: '15px',
              borderRadius: '5px',
              marginTop: '10px',
              border: '1px solid #dee2e6'
            } },
          React.createElement(
            'h3',
            { style: { color: '#28a745', marginBottom: '10px' } },
            'Ending Achieved: ',
            gameScenes[currentScene].ending
          )
        ),
        !gameScenes[currentScene].ending && React.createElement(
          'div',
          { style: {
              marginTop: '10px',
              padding: '10px',
              backgroundColor: isVoting ? '#ff4444' : timeLeft <= 10 ? '#ffebee' : '#e3f2fd',
              borderRadius: '5px',
              textAlign: 'center'
            } },
          React.createElement(
            'p',
            { style: {
                color: isVoting ? '#ffffff' : timeLeft <= 10 ? '#c62828' : '#1565c0',
                fontSize: '1.2em',
                fontWeight: 'bold',
                margin: 0
              } },
            isVoting ? 'VOTE!' : `Time Remaining: ${timeLeft} seconds`
          )
        )
      ),
      React.createElement(
        'div',
        { style: {
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          } },
        gameScenes[currentScene].choices.map((choice, index) => React.createElement(
          'button',
          {
            key: index,
            onClick: () => handleChoice(choice),
            style: {
              padding: '10px 20px',
              fontSize: '1em',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            },
            onMouseOver: e => e.target.style.backgroundColor = '#0056b3',
            onMouseOut: e => e.target.style.backgroundColor = '#007bff'
          },
          choice.text
        ))
      )
    ),
    history.length > 0 && React.createElement(
      'button',
      {
        onClick: handleUndo,
        style: {
          padding: '10px 20px',
          backgroundColor: '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }
      },
      'Undo Last Choice'
    )
  );
};

const container = document.getElementById('renderDiv');
const root = ReactDOM.createRoot(container);
root.render(React.createElement(App, null));
