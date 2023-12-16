import { Board, FileNumber, RowNumber, Square } from "./definitions";

export const dummySquare: Square = {file: 'A', row: 1};
const lowSquare = dummySquare;

export function ixToCoordinates(ix: number): [FileNumber, RowNumber] {
    const colNumber = String.fromCharCode('A'.charCodeAt(0) + ix % 8) as FileNumber;
    const rowNumber = (Math.floor(ix / 8) + 1) as RowNumber;
    return [colNumber, rowNumber]
}

export function ixToSquare(ix: number): Square {
    let square = {...dummySquare};
    [square.file, square.row] = ixToCoordinates(ix);
    return square;
}

export function squareToIx(square: Square): number {
    const rowOffset = square.row - 1;
    const colOffset = square.file.charCodeAt(0) - lowSquare.file.charCodeAt(0);

    return 8 * rowOffset + colOffset;
}

export function squareFromString(square: string): Square {
    const fileNumberPattern = /(A|B|C|D|E|F|G|H)/;
    const rowNumberPattern = /(1|2|3|4|5|6|7|8)/;

    const file = square.replace(fileNumberPattern, '\\1') as FileNumber;
    const row = Number(square.replace(rowNumberPattern, '\\1')) as RowNumber;

    return {file, row};
}

export function newChessBoard(): Board {
    return Array.from(Array(64).keys()).map(ixToSquare);
}

export function halfDeepCopy(board: Board): Board {
    const copy = [...board];
    board.forEach((item, ix) => {
        copy[ix] = {...item};
    });
    return copy;
}