import { Board, FileNumber, Position, RowNumber, Square } from "../model/definitions";

const dummySquare: Square = {file: "A", row: 1};
const emptyBoard: Board = generateEmptyBoard();

function ixToCoordinates(ix: number): [FileNumber, RowNumber] {
    const colNumber = String.fromCharCode('A'.charCodeAt(0) + ix % 8) as FileNumber;
    const rowNumber = (Math.floor(ix / 8) + 1) as RowNumber;
    return [colNumber, rowNumber];
}

export function generateEmptyBoard(): Board {
    return Array.from(Array(64).keys()).map((ix) => {
        let square = {...dummySquare};
        [square.file, square.row] = ixToCoordinates(ix);
        return square;
    }) as Board;
}

export function positionFromFen(fen: string): Position {
    // TODO
    return {
        board: emptyBoard,
        sideToMove: []
    };
}