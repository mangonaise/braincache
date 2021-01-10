import React from 'react';
import './LevelDisplay.css';

const LevelDisplay = ({ level }) => {
  return (
    <div id="level-display">
      Level
      <div id="level-number-indicator">{level}</div>
    </div>
  )
}

export default LevelDisplay;