import React, { useState, useEffect } from 'react'; 
import wordList from './words';
import './App.css';
import WordButton from './components/WordButton';
import LevelDisplay from './components/LevelDisplay';
import LivesDisplay from './components/LivesDisplay';
import VerticalBreak from './components/VerticalBreak';

const statuses = {
  promptSelection: 'Select the new word.',
  wasCorrect: 'Nice!',
  wasIncorrect: 'That\'s not a new word.',
}

const root = document.documentElement;

function App() {
  const [levelNumber, setLevelNumber] = useState(0);
  const [levelsSinceLastMistake, setLevelsSinceLastMistake] = useState(0);
  const [lives, setLives] = useState(3);
  const [disableWordButtons, setDisableWordButtons] = useState(false);
  const [moveWordsOutOfView, setMoveWordsOutOfView] = useState(false);
  const [statusText, setStatusText] = useState(statuses.promptSelection);

  const [words, setWords] = useState({
    seen: [],
    unseen: [...wordList]
  });
  const [levelState, setLevelState] = useState({
    wordSelection: [],
    correctAnswer: ''
  });

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
  } // Updated word state triggers display of next level...

  function displayNextLevel() {
    setLevelNumber(prevState => prevState + 1);
    setMoveWordsOutOfView(false);
    setDisableWordButtons(false);
    setStatusText(statuses.promptSelection);
    document.activeElement.blur();
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

  useEffect(() => {
    setLevelState(newLevelState());
  }, [words]);

  useEffect(() => {
    if (levelState.wordSelection.length > 0) {
      displayNextLevel();
    }
  }, [levelState])

  return (
    <div className="App">
      <LevelDisplay level={levelNumber} />
      <VerticalBreak />
      <LivesDisplay lives={lives}/>
      <VerticalBreak />
      {levelState.wordSelection.map((word, index) => (
        <WordButton 
          key={index}
          word={word} 
          correctAnswer={levelState.correctAnswer}
          onSelect={handleSelectWord}
          disabled={disableWordButtons || word === null}
          moveOutOfView={moveWordsOutOfView}
        />
      ))}
      <VerticalBreak />
      <div id="status-text">{statusText}</div>
    </div>
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


// for visual debug
// return (
//   <div className="App">
//     {wordList.map((word, index) => (
//       <WordButton 

//         word={word}
//       />
//     ))}
//   </div>
// )