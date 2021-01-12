import React, { useState, useEffect } from 'react'; 
import WordButton from './WordButton';
import LevelDisplay from './LevelDisplay';
import LivesDisplay from './LivesDisplay';
import VerticalBreak from './VerticalBreak';
import wordList from '../words';
import utilities from '../utilities.js'

const statuses = {
  promptSelection: 'Select the new word.',
  wasCorrect: 'Nice!',
  wasIncorrect: 'You\'ve seen that before.',
}

const root = document.documentElement;
const initWords = { seen: [], unseen: [...wordList] };
const initLevelState = { currentLevel: 0,  wordOptions: [], correctAnswer: ''};

const GameplayScreen = ({ onGameEnd }) => {
  const [words, setWords] = useState(initWords);
  const [levelState, setLevelState] = useState(() => generateNewLevelState(true));
  const [lives, setLives] = useState(3);
  const [statusText, setStatusText] = useState(statuses.promptSelection);

  // Needed for visual effects.
  const [levelsSinceLastMistake, setLevelsSinceLastMistake] = useState(0);
  const [moveWordsOutOfView, setMoveWordsOutOfView] = useState(false);
  const [disableWordButtons, setDisableWordButtons] = useState(false);
 
  // Selecting a word triggers a sequence of events, denoted by ↓
  function handleSelectWord(isCorrect) {
    setDisableWordButtons(true);
    if (isCorrect) {
      setStatusText(statuses.wasCorrect);
    } else {
      setStatusText(statuses.wasIncorrect);
      setLives(prevLives => prevLives - 1);
    }
    setLevelsSinceLastMistake(prevCount => isCorrect ? (prevCount + 1) : 0);
    sweepAwayWords(isCorrect).then(() => updateWordsState());
  }
  // ↓
  async function sweepAwayWords(isCorrect) {
    let [showResultDuration, sweepDuration] = calculateAnimationDurations(isCorrect);
    root.style.setProperty('--word-sweep-duration', `${sweepDuration}ms`);
    await utilities.sleep(showResultDuration);
    setMoveWordsOutOfView(true);
    await utilities.sleep(sweepDuration);
  }
  // ↓
  function updateWordsState() {
    setWords(prevWords => {
      return {
        seen: [...prevWords.seen, levelState.correctAnswer],
        unseen: prevWords.unseen.filter(word => !levelState.wordOptions.includes(word))
      }
    })
  } 
  // ↓ 
  useEffect(() => {
    if (words === initWords) return;
    if (lives > 0 && words.unseen.length > 0) {
      setLevelState(generateNewLevelState());
    } else {
      onGameEnd(getGameEndData());
    }
  }, [words]);
  // ↓
  useEffect(() => {
    if (levelState !== initLevelState) {
      displayNextLevel();
    }
  }, [levelState])
  // .

  function displayNextLevel() {
    setMoveWordsOutOfView(false);
    setDisableWordButtons(false);
    setStatusText(statuses.promptSelection);
    document.activeElement.blur();
    if (levelState.currentLevel === 1) root.style.setProperty('--word-shortcut-visibility', 'hidden');
  }

  function generateNewLevelState(init = false) {
    const unseenWord = utilities.randomItemFrom(words.unseen);
    let wordOptions;
 
    switch (words.seen.length) {
      case 0:
        wordOptions = [unseenWord, null, null];
        break;

      case 1: 
        const nextWords = utilities.shuffle([words.seen[0], unseenWord]);
        wordOptions = [...nextWords, null];
        break;

      default:
        const firstWordIndex = utilities.randomIndexFrom(words.seen);
        const seenWordsClone = [...words.seen];
        seenWordsClone.splice(firstWordIndex, 1);
        const secondWord = utilities.randomItemFrom(seenWordsClone);
        wordOptions = utilities.shuffle([words.seen[firstWordIndex], secondWord, unseenWord]); 
    }

    return {
      currentLevel: init ? 1 : levelState.currentLevel + 1,
      wordOptions: wordOptions,
      correctAnswer: unseenWord
    }    
  }

  function calculateAnimationDurations(wasAnswerCorrect) {
    let showResultDuration = 1600;
    let sweepDuration = 400;
    if (wasAnswerCorrect) {
      const denominator = Math.pow(1.25, levelsSinceLastMistake);
      showResultDuration = 1000 + (600 / denominator);
      sweepDuration = 250 + (150 / denominator)
    }
    return [showResultDuration, sweepDuration];
  }

  function getGameEndData() {
    return {
      score: levelState.currentLevel,
      isMaxScore: words.unseen.length === 0,
      seenWords: words.seen
    }
  }

  return ( 
    <div className="Screen">
      <LevelDisplay level={levelState.currentLevel} moveOutOfView={moveWordsOutOfView}/>
      <VerticalBreak />
      <LivesDisplay lives={lives}/>
      <VerticalBreak />
      {levelState.wordOptions.map((word, index) => (
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
  );
}

export default GameplayScreen;