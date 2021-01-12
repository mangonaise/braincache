import React, { useState } from 'react';
import VerticalBreak from './VerticalBreak';
import './EndScreen.css';

const EndScreen = ({ score, isMaxScore, previousHighScore, seenWords, onRestart }) => {
  const [showWords, setShowWords] = useState(false);

  let gameOverMessage = <div className="boxed-text">Game over!</div>;
  if (isMaxScore) {
    gameOverMessage = (<>
      <div className="boxed-text">You... win?</div>
      <VerticalBreak size="m" />
      <div className="boxed-text content">
        You've seen every single word. Wow! I was pretty sure that was impossible. 
        If you seriously just did this, you have great power. Use it wisely.
      </div>
      </>
    )
  }

  let scoreLabel = "Your score:";
  if (score > previousHighScore) scoreLabel = "New high score!";

  return (
    <div className="Screen move-into-view">
      <h1 id="title">👏</h1>
      {gameOverMessage}
      <VerticalBreak size="m" />
      <div className="flex-row">{scoreLabel} <span className="level-number-indicator">{score}</span></div>
      <VerticalBreak size="m"/>
      <button className="stylish-button menu-button" onClick={onRestart}>Play Again</button>
      <button className="stylish-button menu-button" onClick={() => window.location.reload()}>Home</button>
      {!showWords &&
        <button className="stylish-button menu-button" onClick={() => setShowWords(true)}>Check Words</button>
      }
      {showWords && 
        <div id="end-word-list">
          <div id="end-word-list-title">You saw...</div>
          {[...seenWords].sort().map((word, index) => 
            <p key={index} className="end-word-list-item">{word}</p>
          )}
        </div>
      }
    </div>
  )
}

export default EndScreen;