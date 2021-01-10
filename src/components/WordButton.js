import React, { useState, useEffect } from 'react';

const WordButton = ({ word, correctAnswer, onSelect, disabled, moveOutOfView }) => {
  const [wasSelected, setWasSelected] = useState(false);

  function selectWord(event) {
    if (disabled) return;
    setWasSelected(true);
    const isCorrect = word === correctAnswer;
    animate(event.target, isCorrect);
    onSelect(isCorrect);
  }

  function animate(buttonElement, isCorrect) {
    buttonElement.classList.remove('unselected-word');
    buttonElement.classList.add('animate-word');
    if (isCorrect) buttonElement.classList.add('correct-word');
    else buttonElement.classList.add('incorrect-word');
  }

  useEffect(() => {
    setWasSelected(false);
  }, [correctAnswer])

  return(
    <button 
      disabled={disabled && !wasSelected}
      className={`word-button unselected-word ${moveOutOfView ? 'move-out-of-view' : 'move-into-view'}`} 
      onClick={selectWord}>
      {word}
    </button>
  )
}

export default WordButton;