import { Board, FileNumber, RowNumber, Square } from "src/model/definitions";

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

export function squareToIx(squareArg: Square|string): number {
    const square = typeof squareArg === 'string' ? squareFromString(squareArg) : squareArg;
    const rowOffset = square.row - 1;
    const colOffset = square.file.charCodeAt(0) - lowSquare.file.charCodeAt(0);

    return 8 * rowOffset + colOffset;
}

export function squareEqual(squareArg1: Square|string, squareArg2: Square|string): boolean {
    return squareToIx(squareArg1) === squareToIx(squareArg2);
}

export function squareFromString(square: string): Square {
    const fileNumberPattern = /[^A-H]/g;
    const rowNumberPattern = /[^1-8]/g;

    const fileMatches = square.replace(fileNumberPattern, '');
    const file = fileMatches.length > 0 ? fileMatches[0] as FileNumber : 'A';
    const rowMatches = square.replace(rowNumberPattern, '');
    const row = rowMatches.length > 0 ? Number(rowMatches[0]) as RowNumber : 1;

    // return A1 by default

    return {file, row};
}

export function newChessBoard(): Board {
    return Array.from(Array(64).keys()).map(ixToSquare);
}

export function halfDeepCopy(board: Board, forgetEnPassant: boolean = true): Board {
    const copy = [...board];
    board.forEach((item, ix) => {
        copy[ix] = {...item};
        if (forgetEnPassant) {
            delete copy[ix].enPassantTarget;
        }
    });
    return copy;
}