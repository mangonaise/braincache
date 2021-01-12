import React, { useState } from 'react'; 
import './App.css';
import StartScreen from './components/StartScreen';
import GameplayScreen from './components/GameplayScreen';
import EndScreen from './components/EndScreen';
import GithubFooter from './components/GithubFooter';

function App() {
  const [currentScreen, setCurrentScreen] = useState('start');
  const [highScore, setHighScore] = useState(localStorage.getItem('highScore') ?? 0);
  const [previousHighScore, setPreviousHighScore] = useState(0);
  const [gameData, setGameData] = useState();

  function handleGameEnd(gameEndData) {
    setGameData(gameEndData);
    saveHighScore(gameEndData.score);
    setCurrentScreen('end');
  }

  function saveHighScore(score) {
    const prevBest = localStorage.getItem('highScore') ?? 0;
    setPreviousHighScore(prevBest);
    if (score > prevBest) {
      localStorage.setItem('highScore', score);
      setHighScore(score);
    }
  }

  let screenContent;
  switch (currentScreen) {
    case 'start':
      screenContent = (
        <StartScreen 
          highScore={highScore}
          onStart={() => setCurrentScreen('game')}  
        />
      )
    break;

    case 'game':
      screenContent = (
        <GameplayScreen onGameEnd={handleGameEnd}/>
      )
    break;

    case 'end':
      screenContent = (
        <EndScreen
          score={gameData.score}
          isMaxScore={gameData.isMaxScore}
          previousHighScore={previousHighScore}
          seenWords={gameData.seenWords}
          onRestart={() => setCurrentScreen('game')}
        />
      )
    break;

    default:
      throw new Error(`Unknown screen requested ${currentScreen}!`);
  }

  return ( 
    <>
      <div className="App">
        {screenContent}
      </div>
      <GithubFooter />
    </>
  )
}

export default App;