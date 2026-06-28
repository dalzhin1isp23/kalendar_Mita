import React from 'react';

const Chislo = ({ number, isSelected, hasEvent, isToday, onClick }) => {
  const className = `chislo ${
    isSelected ? 'selected' : ''
  } ${hasEvent ? 'has-event' : ''} ${isToday ? 'today' : ''}`;
  return (
    <button className={className} onClick={onClick}>
      {number}
    </button>
  );
};

export default Chislo;