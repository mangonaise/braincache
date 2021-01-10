import React, { useState } from 'react';
import VerticalBreak from '../components/VerticalBreak';

const EndScreen = ({ score, isMaxScore, highScore, onRestart, seenWords }) => {
  const [showWords, setShowWords] = useState(false);

  console.log(seenWords);

  console.log('score', score);
  console.log('high score', highScore);

  let gameOverMessage = <div className="stylish-text">Game over!</div>;
  if (isMaxScore) {
    gameOverMessage = (<>
      <div className="stylish-text">You... win?</div>
      <VerticalBreak size="m" />
      <div className="stylish-text content">
        You've seen every single word. Wow! I was pretty sure that was impossible. 
        If you seriously just did this, you have great power. Use it wisely.
      </div>
      </>
    )
  }

  let scoreLabel = "Your score:";
  if (score > highScore) scoreLabel = "New high score!";

  return (
    <div className="Screen move-into-view">
      <h1 id="title">🧠</h1>
      {gameOverMessage}
      <VerticalBreak size="m" />
      <div className="flex-row">{scoreLabel} <span className="level-number-indicator">{score}</span></div>
      <VerticalBreak size="m"/>
      <button className="stylish-button ui-button" onClick={onRestart}>Play Again</button>
      <button className="stylish-button ui-button" onClick={() => window.location.reload()}>Home</button>
    </div>
  )
}

export default EndScreen;