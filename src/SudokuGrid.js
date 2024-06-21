import React from 'react';
import SudokuCell from './SudokuCell';
import './SudokuGrid.css';

const SudokuGrid = ({ grid, activeCell, onCellChange }) => {
  return (
    <div className="sudoku-grid">
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="sudoku-row">
          {row.map((cell, colIndex) => (
            <SudokuCell
              key={`${rowIndex}-${colIndex}`}
              value={cell}
              rowIndex={rowIndex}
              colIndex={colIndex}
              isActive={activeCell && activeCell.row === rowIndex && activeCell.col === colIndex}
              onChange={onCellChange}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default SudokuGrid;
