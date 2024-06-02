import React, { useState, useEffect } from "react";
import "./App.css";
import dice1Img from "./dice-1.png";
import dice2Img from "./dice-2.png";
import dice3Img from "./dice-3.png";
import dice4Img from "./dice-4.png";
import dice5Img from "./dice-5.png";
import dice6Img from "./dice-6.png";

const diceImages = [
  null,
  dice1Img,
  dice2Img,
  dice3Img,
  dice4Img,
  dice5Img,
  dice6Img,
];

const PlayerSection = ({
  player,
  activePlayer,
  currentScore,
  totalScore,
  wins,
  name,
  setName,
}) => (
  <section
    className={`player player--${player} ${
      activePlayer === player ? "player--active" : ""
    }`}
  >
    <h2 className="name">
      <input
        className="name-input"
        type="text"
        value={name}
        onChange={(e) => setName(player, e.target.value)}
      />
    </h2>
    <p className="score">Total Score: {totalScore}</p>
    <p className="score">Wins: {wins}</p>
    <div className="current">
      <p>
        Current Score: <span>{currentScore}</span>
      </p>
    </div>
  </section>
);

const Dice = ({ dice1Value, dice2Value }) => (
  <div className="dice-container">
    <img
      src={diceImages[dice1Value]}
      alt={`Dice ${dice1Value}`}
      className="dice"
      style={{ display: dice1Value ? "block" : "none" }}
    />
    <img
      src={diceImages[dice2Value]}
      alt={`Dice ${dice2Value}`}
      className="dice"
      style={{ display: dice2Value ? "block" : "none" }}
    />
  </div>
);

const App = () => {
  const [currentScore, setCurrentScore] = useState(0);
  const [scores, setScores] = useState([0, 0]);
  const [activePlayer, setActivePlayer] = useState(0);
  const [gamePlaying, setGamePlaying] = useState(true);
  const [message, setMessage] = useState("Player 1's Turn");
  const [dice1Value, setDice1Value] = useState(null);
  const [dice2Value, setDice2Value] = useState(null);
  const [wins, setWins] = useState([0, 0]);
  const [playerNames, setPlayerNames] = useState(["Player 1", "Player 2"]);
  const [isAIPlaying, setIsAIPlaying] = useState(false);

  useEffect(() => {
    if (activePlayer === 1 && gamePlaying && isAIPlaying) {
      const aiTimeout = setTimeout(aiTurn, 1000);
      return () => clearTimeout(aiTimeout);
    }
  }, [activePlayer, isAIPlaying]);

  const init = () => {
    setScores([0, 0]);
    setCurrentScore(0);
    setActivePlayer(0);
    setGamePlaying(true);
    setMessage("Player 1's Turn");
    setDice1Value(null);
    setDice2Value(null);
    setIsAIPlaying(false);
  };

  const switchPlayer = () => {
    setCurrentScore(0);
    setActivePlayer((prevActivePlayer) => {
      const newActivePlayer = prevActivePlayer === 0 ? 1 : 0;
      setMessage(`${playerNames[newActivePlayer]}'s Turn`);
      return newActivePlayer;
    });
  };

  const rollDice = () => {
    if (gamePlaying) {
      const dice1 = Math.floor(Math.random() * 6) + 1;
      const dice2 = Math.floor(Math.random() * 6) + 1;
      setDice1Value(dice1);
      setDice2Value(dice2);

      if (dice1 === 1 || dice2 === 1) {
        switchPlayer();
      } else {
        setCurrentScore((prevScore) => prevScore + dice1 + dice2);
      }
    }
  };

  const holdScore = () => {
    if (gamePlaying) {
      setScores((prevScores) => {
        const newScores = [...prevScores];
        newScores[activePlayer] += currentScore;

        if (newScores[activePlayer] >= 50) {
          setGamePlaying(false);
          setWins((prevWins) => {
            const newWins = [...prevWins];
            newWins[activePlayer] += 1;
            return newWins;
          });
          setMessage(`${playerNames[activePlayer]} wins!`);
        } else {
          switchPlayer();
        }
        return newScores;
      });
    }
  };

  const passTurn = () => {
    if (gamePlaying) {
      switchPlayer();
    }
  };

  const aiTurn = () => {
    if (gamePlaying && activePlayer === 1) {
      const dice1 = Math.floor(Math.random() * 6) + 1;
      const dice2 = Math.floor(Math.random() * 6) + 1;
      setDice1Value(dice1);
      setDice2Value(dice2);

      if (dice1 === 1 || dice2 === 1) {
        switchPlayer();
      } else {
        setCurrentScore((prevScore) => prevScore + dice1 + dice2);

        if (currentScore + dice1 + dice2 >= 20 || Math.random() > 0.5) {
          holdScore();
        } else {
          setTimeout(aiTurn, 1000);
        }
      }
    }
  };

  const startAI = () => {
    setIsAIPlaying(true);
    switchPlayer();
  };

  const setName = (player, name) => {
    setPlayerNames((prevNames) => {
      const newNames = [...prevNames];
      newNames[player] = name;
      return newNames;
    });
  };
  return (
    <div className="App">
      <main>
        <PlayerSection
          player={0}
          activePlayer={activePlayer}
          currentScore={activePlayer === 0 ? currentScore : 0}
          totalScore={scores[0]}
          wins={wins[0]}
          name={playerNames[0]}
          setName={setName}
        />
        <PlayerSection
          player={1}
          activePlayer={activePlayer}
          currentScore={activePlayer === 1 ? currentScore : 0}
          totalScore={scores[1]}
          wins={wins[1]}
          name={playerNames[1]}
          setName={setName}
        />
        <div className="btn-container">
          <Dice dice1Value={dice1Value} dice2Value={dice2Value} />
          <div className="message" id="message">
            {message}
          </div>
          <div className="winning-score">
            <input type="number" id="winning-score" value="50" readOnly />
          </div>
          <button className="btn new-game-btn" onClick={init}>
            🔄 New game
          </button>
          <button className="btn roll-btn" onClick={rollDice}>
            🎲 Roll dice
          </button>
          <button className="btn hold-btn" onClick={holdScore}>
            📥 Hold score
          </button>
          <button className="btn pass-btn" onClick={passTurn}>
            ⏩ Pass turn
          </button>
          {
            <button className="btn ai-btn" onClick={startAI}>
              🤖 Play against AI
            </button>
          }
        </div>
      </main>
    </div>
  );
};

export default App;
