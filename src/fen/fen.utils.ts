import { Board, FileNumber, Position, RowNumber, Square, Piece } from "../model/definitions";

const dummySquare: Square = {file: 'A', row: 1};

type fenPieceCode = 'p'|'n'|'b'|'r'|'q'|'k'|'P'|'N'|'B'|'R'|'Q'|'K';

const fenPieceMap: ReadonlyMap<fenPieceCode,Piece> = new Map([
    ['p', {color: 'black', type: 'pawn'}],
    ['n', {color: 'black', type: 'knight'}],
    ['b', {color: 'black', type: 'bishop'}],
    ['r', {color: 'black', type: 'rook'}],
    ['q', {color: 'black', type: 'queen'}],
    ['k', {color: 'black', type: 'king'}],
    ['P', {color: 'white', type: 'pawn'}],
    ['N', {color: 'white', type: 'knight'}],
    ['B', {color: 'white', type: 'bishop'}],
    ['R', {color: 'white', type: 'rook'}],
    ['Q', {color: 'white', type: 'queen'}],
    ['K', {color: 'white', type: 'king'}],
]);

function ixToCoordinates(ix: number): [FileNumber, RowNumber] {
    const colNumber = String.fromCharCode('A'.charCodeAt(0) + ix % 8) as FileNumber;
    const rowNumber = (Math.floor(ix / 8) + 1) as RowNumber;
    return [colNumber, rowNumber]
}

function ixToSquare(ix: number): Square {
    let square = {...dummySquare};
    [square.file, square.row] = ixToCoordinates(ix);
    return square;
}

export function generateEmptyBoard(): Board {
    return Array.from(Array(64).keys()).map((ix) => {
        let square = {...dummySquare};
        [square.file, square.row] = ixToCoordinates(ix);
        return square;
    }) as Board;
}

function pieceFromFen(pieceLetter: string): Piece|undefined {
    return fenPieceMap.get(pieceLetter as fenPieceCode);
}

function generateEmptySquares(fromIx: number, length: number =1): Square[] {
    if (fromIx < 0 || fromIx > 63 || length < 1 || length > 64) {
        return [];
    }
    const indexes = Array.from(Array(length).keys()).map((x) => x + fromIx);
    return indexes.map(ixToSquare);
}

export function positionFromFen(fen: string): Position {
    const [fenRows, turn, castling, ] = fen.split(" ");
    let squaresBuilder: Square[] = [];
    let squareCounter = 0;
    fenRows.split('/').reverse().forEach((row) => {
        row.split('').forEach((char) => {
            if (Number(char)) {
                squaresBuilder.push(...generateEmptySquares(squareCounter, Number(char)));
                squareCounter += Number(char);
            } else {
                let square = generateEmptySquares(squareCounter)[0];
                square.occupant = pieceFromFen(char);
                squaresBuilder.push(square);
                squareCounter++;
            }
        });
    });
    return {
        board: squaresBuilder as Board,
        sideToMove: [] // TODO upgrade side to move pieces to movable
    };
}