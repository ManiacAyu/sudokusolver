import React, { useState, useEffect } from "react";
import SudokuGrid from "./SudokuGrid";
import "./App.css";

const emptyBoard = Array(9)
  .fill()
  .map(() => Array(9).fill(0));

function isValid(grid, row, col, num) {
  for (let i = 0; i < 9; i++) {
    if (grid[row][i] === num) return false;
    if (grid[i][col] === num) return false;
    if (
      grid[Math.floor(row / 3) * 3 + Math.floor(i / 3)][
        Math.floor(col / 3) * 3 + (i % 3)
      ] === num
    )
      return false;
  }
  return true;
}

const App = () => {
  const [grid, setGrid] = useState(emptyBoard);
  const [activeCell, setActiveCell] = useState(null);
  const [userInputs, setUserInputs] = useState({});
  const [message, setMessage] = useState("");
  const [difficulty, setDifficulty] = useState("medium");

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const solve = async (grid) => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValid(grid, row, col, num)) {
              grid[row][col] = num;
              setActiveCell({ row, col });
              setGrid([...grid]);
              await sleep(100); // Reduced delay to improve speed
              if (await solve(grid)) return true;
              grid[row][col] = 0;
              setActiveCell({ row, col });
              setGrid([...grid]);
              await sleep(100); // Reduced delay to improve speed
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  const fillGrid = (grid) => {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) {
          shuffle(numbers);
          for (let num of numbers) {
            if (isValid(grid, row, col, num)) {
              grid[row][col] = num;
              if (fillGrid(grid)) return true;
              grid[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  const copyGrid = (grid) => {
    return grid.map((row) => [...row]);
  };

  const checkUniqueSolution = (grid) => {
    let solutionCount = 0;
    const countSolutions = (grid) => {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (grid[row][col] === 0) {
            for (let num = 1; num <= 9; num++) {
              if (isValid(grid, row, col, num)) {
                grid[row][col] = num;
                countSolutions(grid);
                grid[row][col] = 0;
              }
            }
            return;
          }
        }
      }
      solutionCount++;
    };
    countSolutions(copyGrid(grid));
    return solutionCount === 1;
  };

  const generatePuzzle = () => {
    setMessage("");
    let newGrid = JSON.parse(JSON.stringify(emptyBoard));
    fillGrid(newGrid);
    let puzzleGrid = copyGrid(newGrid);

    const difficultyLevels = {
      "very easy": 10,
      easy: 20,
      medium: 30,
      hard: 40,
      "very hard": 50,
    };

    let cellsToRemove = difficultyLevels[difficulty];
    let attempts = 1000; // Limit the number of backtracking attempts
    while (cellsToRemove > 0 && attempts > 0) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      if (puzzleGrid[row][col] !== 0) {
        const backup = puzzleGrid[row][col];
        puzzleGrid[row][col] = 0;
        if (!checkUniqueSolution(puzzleGrid)) {
          puzzleGrid[row][col] = backup;
        } else {
          cellsToRemove--;
        }
      }
      attempts--;
    }

    if (cellsToRemove > 0) {
      setMessage("Failed to generate a puzzle. Please try again.");
    } else {
      setGrid(puzzleGrid);
      setUserInputs({});
      setMessage("");
    }
  };

  const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  const handleCellChange = (rowIndex, colIndex, value) => {
    const newGrid = copyGrid(grid);
    newGrid[rowIndex][colIndex] = value;
    setGrid(newGrid);

    if (value === 0) {
      const updatedUserInputs = { ...userInputs };
      delete updatedUserInputs[`${rowIndex}-${colIndex}`];
      setUserInputs(updatedUserInputs);
    } else {
      setUserInputs({ ...userInputs, [`${rowIndex}-${colIndex}`]: value });
    }
  };

  const handleValidate = () => {
    let isValidSolution = true;
    setMessage("");
    // Check each cell in the userInputs object
    for (const key in userInputs) {
      if (userInputs.hasOwnProperty(key)) {
        const [rowIndex, colIndex] = key.split('-');
        const value = parseInt(userInputs[key]);

        // Check if the value matches the solved grid value
        if (grid[rowIndex][colIndex] !== value) {
          isValidSolution = false;
          break;
        }
      }
    }

    if (isValidSolution) {
      setMessage("Hurray! You have solved the puzzle.");
    } else {
      setMessage("OOPS! Try with other numbers.");
    }
  };

  const handleSolve = async () => {
    const solved = await solve([...grid]);
    setMessage(
      solved
        ? "Hurray! You have solved the puzzle."
        : "OOPS! Try with other numbers."
    );
  };

  const handleDifficultyChange = (e) => {
    setDifficulty(e.target.value);
    generatePuzzle();
  };

  useEffect(() => {
    generatePuzzle();
  }, []);

  return (
    <div className="App">
      <h1>Sudoku Solver</h1>
      <div>
        <label id="difficultylabel">Select Difficulty: </label>
        <select
          id="difficulty"
          value={difficulty}
          onChange={handleDifficultyChange}
        >
          <option value="very easy">Very Easy</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
          <option value="very hard">Very Hard</option>
        </select>
      </div>
      <SudokuGrid
        grid={grid}
        activeCell={activeCell}
        onCellChange={handleCellChange}
      />
      <button onClick={handleSolve}>Solve</button>
      <button onClick={generatePuzzle}>Generate New Puzzle</button>
      {Object.keys(userInputs).length > 0 && (
        <button onClick={handleValidate}>Validate</button>
      )}
      {message && <div className={`message ${message.includes("Hurray") ? "success" : ""}`}>{message}</div>}
    </div>
  );
};

export default App;
