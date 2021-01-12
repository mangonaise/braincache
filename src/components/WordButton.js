import React, { useState, useEffect, useRef } from 'react';
import './WordButton.css';

const WordButton = ({ shortcut, word, correctAnswer, onSelect, disabled, moveOutOfView }) => {
  const [animationState, setAnimationState] = useState('none');

  function selectThisWord() {
    if (disabled) return;
    const isCorrect = word === correctAnswer;
    setAnimationState(isCorrect ? 'correct' : 'incorrect');
    onSelect(isCorrect);
  };
  // The keyboard shortcut listener needs access to a ref, or else it will not have access to most recent props.
  const selectThisWordRef = useRef(selectThisWord);

  useEffect(() => {
    document.addEventListener('keyup', checkForKeyboardShortcut);
    return (() => document.removeEventListener('keyup', checkForKeyboardShortcut));
  }, [])

  useEffect(() => {
    setAnimationState('none');
  }, [correctAnswer])

  useEffect(() => {
    selectThisWordRef.current = selectThisWord;
    if (disabled && word === correctAnswer && animationState==='none') {
      setAnimationState('actualAnswer');
    } 
    selectThisWordRef.current = selectThisWord;
  }, [disabled])

  function checkForKeyboardShortcut(event) {
    if (parseInt(event.key) === shortcut) {
      selectThisWordRef.current();
    }
  }

  function getStyleFromAnimationState() {
    let style = 'stylish-button word-button';
    if (animationState === 'none') {
      style += ' unselected-word';
    } else if (animationState === 'actualAnswer') {
      style += ' actual-word';
    } else {
      style += ' animate-word-background';
      style += animationState === 'correct' ? ' correct-word' : ' incorrect-word';
    }
    if (disabled) style += ' no-pointer-events';
    return style;
  }

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

export default WordButton;