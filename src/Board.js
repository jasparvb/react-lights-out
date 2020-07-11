import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows=5, ncols=6, chanceLightStartsOn=.25 }) {
  const [board, setBoard] = useState(createBoard());

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    let initialBoard = [];
    // create array-of-arrays of true/false values
    for(let y = 0; y < nrows; y++){
      initialBoard.push([]);
      for(let x = 0; x < ncols; x++){
        initialBoard[y].push(Math.random() < chanceLightStartsOn);
      }
    }
    return initialBoard;
  }

  function hasWon() {
    // check the board in state to determine whether the player has won.
    return board.every(row => row.every(col => !col));
  }

  function flipCellsAround(coord) {
    setBoard(oldBoard => {
      const [y, x] = coord.split("-").map(Number);

      const flipCell = (y, x, boardCopy) => {
        // if this coord is actually on board, flip it

        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };

      // (deep) copy of the oldBoard
      let boardCopy = oldBoard.map(row => [...row]);
      // in the copy, flip this cell and the cells around it
      flipCell(y, x, boardCopy);
      flipCell(y-1, x, boardCopy);
      flipCell(y+1, x, boardCopy);
      flipCell(y, x-1, boardCopy);
      flipCell(y, x+1, boardCopy);
      return boardCopy;
    });
  }

  // if the game is won, just show a winning msg & render nothing else
  if(hasWon()){
    return (
      <h2>You won!</h2>
    );
  }

  // make table board
  let tableBoard = board.map((row, y) => 
    <tr>{row.map((cell, x) => (
        <Cell 
          key={`${y}-${x}`} 
          flipCellsAroundMe={() => flipCellsAround(`${y}-${x}`)} 
          isLit={cell}
        />
      ))}
    </tr>
  );

  return (
    <table className="Board">
      <tbody>
      {tableBoard}
      </tbody>
    </table>
  );
}

export default Board;
