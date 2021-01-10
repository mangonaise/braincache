import React from 'react';
import VerticalBreak from './VerticalBreak';

const StartScreen = ({ highScore, onStart }) => {
  return (
    <div className="Screen move-into-view">
      <h1 id="title">🧠</h1>
      <div className="stylish-text">How many words can you remember?</div>
      <VerticalBreak size="m" />
      <div className="flex-row">Your best score: <span className="level-number-indicator">{highScore}</span></div>
      <VerticalBreak size="m"/>
      <div className="stylish-text content">
        <ul>
          <li>Words will appear on the screen.</li>
          <li>Select the one you haven't seen.</li>
          <li> Most people score somewhere between 50 and 200.</li>
        </ul>
      </div>
      <VerticalBreak size="m"/>
      <button className="stylish-button ui-button" onClick={onStart}>Start</button>
    </div>
  )
}

export default StartScreen;