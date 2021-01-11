import React, { useState, useEffect, useRef } from 'react';
import './WordButton.css';

const WordButton = ({ shortcut, word, correctAnswer, onSelect, disabled, moveOutOfView }) => {
  const [animationState, setAnimationState] = useState('none');
  
  function selectThisWord() {
    if (disabled) return;
    const isCorrect = word === correctAnswer;
    setAnimationState(isCorrect ? 'correct' : 'incorrect');
    onSelect(isCorrect);
  }
  // The keyboard shortcut listener needs access to a ref, or else it will not have access to most recent props.
  const selectThisWordRef = useRef(selectThisWord);

  function checkShortcut(event) {
    if (parseInt(event.key) === shortcut) {
      selectThisWordRef.current();
    }
  }

  useEffect(() => {
    document.addEventListener('keyup', checkShortcut);
    return (() => document.removeEventListener('keyup', checkShortcut));
  }, [])

  useEffect(() => {
    setAnimationState('none');
  }, [correctAnswer])

  useEffect(() => {
    selectThisWordRef.current = selectThisWord;
    if (disabled && word === correctAnswer && animationState==='none') {
      setAnimationState('actualAnswer');
    } 
  }, [disabled])

  return(
    <button 
      disabled={disabled && animationState === 'none'}
      className={
        `${getStyleFromAnimationState(animationState)} 
        ${moveOutOfView ? 'move-out-of-view' : 'move-into-view'}` 
      } 
      onClick={selectThisWord}>
      {word}
      <div className="word-shortcut-key">{shortcut}</div>
    </button>
  )
}

function getStyleFromAnimationState(state) {
  let style = 'stylish-button word-button';
  if (state === 'none') {
    style += ' unselected-word';
  } else if (state === 'actualAnswer') {
    style += ' actual-word';
  } else {
    style += ' animate-word';
    style += state === 'correct' ? ' correct-word' : ' incorrect-word';
  }
  return style;
}

export default WordButton;