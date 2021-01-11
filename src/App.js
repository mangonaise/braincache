import React, { useState, useEffect } from 'react'; 
import wordList from './words';
import './App.css';
import StartScreen from './components/StartScreen';
import EndScreen from './components/EndScreen';
import WordButton from './components/WordButton';
import LevelDisplay from './components/LevelDisplay';
import LivesDisplay from './components/LivesDisplay';
import VerticalBreak from './components/VerticalBreak';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

const statuses = {
  promptSelection: 'Select the new word.',
  wasCorrect: 'Nice!',
  wasIncorrect: 'You\'ve seen that before.',
}

const root = document.documentElement;
const initWords = { seen: [], unseen: [...wordList] };
const initLevelState = { wordSelection: [], correctAnswer: ''};

function App() {
  const [currentScreen, setCurrentScreen] = useState('start');
  const [currentLevel, setCurrentLevel] = useState();
  const [highScore, setHighScore] = useState(localStorage.getItem('highScore') ?? 0);
  const [previousHighScore, setPreviousHighScore] = useState(0);
  const [levelsSinceLastMistake, setLevelsSinceLastMistake] = useState(0);
  const [lives, setLives] = useState(3);
  const [disableWordButtons, setDisableWordButtons] = useState(false);
  const [moveWordsOutOfView, setMoveWordsOutOfView] = useState(false);
  const [statusText, setStatusText] = useState(statuses.promptSelection);
  const [words, setWords] = useState();
  const [levelState, setLevelState] = useState();

  function startGame() {
    setCurrentLevel(0);
    setLevelsSinceLastMistake(0);
    setLives(3);
    setDisableWordButtons(false);
    setMoveWordsOutOfView(false);
    setWords(initWords);
    setLevelState(initLevelState);
  }

  function handleSelectWord(isCorrect) {
    setDisableWordButtons(true);
    if (isCorrect) {
      setStatusText(statuses.wasCorrect);
    } else {
      setStatusText(statuses.wasIncorrect);
      setLives(prevLives => prevLives - 1);
    }
    sweepAwayWords(isCorrect).then(() => updateWordState());
  }

  async function sweepAwayWords(isCorrect) {
    setLevelsSinceLastMistake(prevState => isCorrect ? (prevState + 1) : 0);
    let showResultDuration = 1600;
    let sweepDuration = 400;
    if (isCorrect) {
      const denominator = Math.pow(1.25, levelsSinceLastMistake);
      showResultDuration = 1000 + (600 / denominator);
      sweepDuration = 250 + (150 / denominator)
    }
    root.style.setProperty('--word-sweep-duration', `${sweepDuration}ms`);
    await sleep(showResultDuration);
    setMoveWordsOutOfView(true);
    await sleep(sweepDuration);
  }

  function updateWordState() {
    setWords(prevWords => {
      return {
        seen: [...prevWords.seen, levelState.correctAnswer],
        unseen: prevWords.unseen.filter(word => !levelState.wordSelection.includes(word))
      }
    })
  } 

  // Updated word state triggers new level state. Or, if game over, ends the game.
  useEffect(() => {
    if (!words) return;
    if (lives > 0 && words.unseen.length > 0) {
      setLevelState(newLevelState());
    } else {
      endGame();
    }
  }, [words]);

  // Updated level state triggers display of the next level. Or, if initialized, starts the game.
  useEffect(() => {
    if (!levelState) return;
    if (levelState.wordSelection.length > 0) {
      displayNextLevel();
    } else if (levelState === initLevelState) {
      setCurrentScreen('game');
    }
  }, [levelState])

  // Ending the game saves the high score.
  useEffect(() => {
    if (currentScreen === 'end') {
      saveHighScore();
    }
  }, [currentScreen])

  function displayNextLevel() {
    setCurrentLevel(prevState => prevState + 1);
    setMoveWordsOutOfView(false);
    setDisableWordButtons(false);
    setStatusText(statuses.promptSelection);
    document.activeElement.blur();
    if (currentLevel === 1) root.style.setProperty('--word-shortcut-visibility', 'hidden');
  }

  function newLevelState() {
    const unseenWord = randomItemFrom(words.unseen);

    switch (words.seen.length) {
      case 0:
        return {
          wordSelection: [unseenWord, null, null],
          correctAnswer: unseenWord
        }
      case 1: 
        const options = shuffle([words.seen[0], unseenWord]);
        return {
          wordSelection: [...options, null],
          correctAnswer: unseenWord
        }
      default:
        const firstSeenWordIndex = randomIndexFrom(words.seen);
        const firstSeenWord = words.seen[firstSeenWordIndex];
        const seenWordsClone = words.seen.filter((word, index) => !(index === firstSeenWordIndex));
        const secondSeenWord = randomItemFrom(seenWordsClone);
        return {
          wordSelection: shuffle([firstSeenWord, secondSeenWord, unseenWord]),
          correctAnswer: unseenWord
        }   
    }
  }

  function saveHighScore() {
    const prevBest = localStorage.getItem('highScore') ?? 0;
    setPreviousHighScore(prevBest);
    if (currentLevel > prevBest) {
      localStorage.setItem('highScore', currentLevel);
      setHighScore(currentLevel);
    }
  }

  function endGame() {
    setCurrentScreen('end');
  }

  let app;
  if (currentScreen === 'start') {
    app = (
      <StartScreen 
        highScore={highScore}
        onStart={startGame}
      />
    )
  } else if (currentScreen === 'end') {
    app = (
      <EndScreen 
        score={currentLevel}
        isMaxScore={words.unseen.length === 0}
        highScore={previousHighScore}
        onRestart={startGame}
        seenWords={words.seen}
      />
    )
  } else if (currentScreen === 'game') {
    app = (
      <div className="Screen">
        <LevelDisplay level={currentLevel} moveOutOfView={moveWordsOutOfView}/>
        <VerticalBreak />
        <LivesDisplay lives={lives}/>
        <VerticalBreak />
        {levelState.wordSelection.map((word, index) => (
          <WordButton 
            key={index}
            shortcut={index + 1}
            word={word} 
            correctAnswer={levelState.correctAnswer}
            onSelect={handleSelectWord}
            disabled={disableWordButtons || word === null}
            moveOutOfView={moveWordsOutOfView}
          />
        ))}
        <VerticalBreak />
        <div className="boxed-text">{statusText}</div>
      </div>
    )
  }

  return (<>
    <div className="App">{app}</div>
    <div className="footer">
      <div>by mangonaise</div>
      <FontAwesomeIcon icon={faHeart} color="rgb(230, 101, 144)"/>
      <a href="https://github.com/mangonaise/word-memory-game">github</a>
      </div>
    </>
  );
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function randomIndexFrom(array) {
  return Math.floor(Math.random() * array.length);
}

function randomItemFrom(array) {
  return array[randomIndexFrom(array)];
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export default App;