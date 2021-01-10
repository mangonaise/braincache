import React from 'react';

const VerticalBreak = ({ size }) => {
  return (
    <div style={{height: sizeToPxValue(size)}}></div>
  )
}

function sizeToPxValue(size) {
  switch (size) {
    case 's':
      return '10px';
    case 'm':
      return '20px';
    case 'l':
      return '30px';
    default: 
      return '30px';
  }
}

export default VerticalBreak;