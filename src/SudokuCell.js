import React from 'react';
import './SudokuCell.css';

const SudokuCell = ({ value, rowIndex, colIndex, isActive, onChange }) => {
  const handleChange = (e) => {
    const inputValue = parseInt(e.target.value, 10);
    if (isNaN(inputValue) || inputValue < 1 || inputValue > 9) {
      onChange(rowIndex, colIndex, 0);
    } else {
      onChange(rowIndex, colIndex, inputValue);
    }
  };

  return (
    <input
      type="text"
      maxLength="1"
      value={value !== 0 ? value : ''}
      onChange={handleChange}
      className={`sudoku-cell ${isActive ? 'active' : ''}`}
    />
  );
};

export default SudokuCell;
