import React from 'react';
import './LevelDisplay.css';

const LevelDisplay = ({ level, moveOutOfView }) => {
  return (
    <div id="level-display">
      <div>Level</div>
      <div id="level-number-indicator" >
        <div className={moveOutOfView ? 'move-out-of-view' : 'move-into-view'}>{level}</div>
      </div>
    </div>
  )
}

export default LevelDisplay;