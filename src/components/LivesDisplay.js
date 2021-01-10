import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'

const heartColor = 'rgb(230, 101, 144)';
const usedHeartColor = 'rgb(220, 220, 220)';

const LivesDisplay = ({ lives }) => {
  return (
    <div id="lives-display">
      <FontAwesomeIcon icon={faHeart} color={lives > 0 ? heartColor : usedHeartColor} size='lg'/>
      <FontAwesomeIcon icon={faHeart} color={lives > 1 ? heartColor : usedHeartColor} size='lg'/>
      <FontAwesomeIcon className="life-icon" icon={faHeart} color={lives > 2 ? heartColor : usedHeartColor} size='lg'/>
    </div>
  )
}

export default LivesDisplay;