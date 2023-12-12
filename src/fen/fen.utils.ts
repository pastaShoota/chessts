import { dummySquare, ixToCoordinates, ixToSquare } from "../model/board.utils";
import { Board, FileNumber, RowNumber, Square, Piece } from "../model/definitions";
import { MovablePiece } from "../model/movable.piece";
import { pieceComparator, toMovable } from "../model/piece.utils";
import { Position, buildPosition } from "../model/position";

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
    const squaresBuilder: Square[] = [];
    let squareCounter = 0;
    let sideToMove: MovablePiece[] = [];

    fenRows.split('/').reverse().forEach((row) => {
        row.split('').forEach((char) => {
            if (Number(char)) {
                squaresBuilder.push(...generateEmptySquares(squareCounter, Number(char)));
                squareCounter += Number(char);
            } else {
                let square = generateEmptySquares(squareCounter)[0];
                square.occupant = pieceFromFen(char);
                squaresBuilder.push(square);
                
                if (square.occupant?.color.startsWith(turn)) {
                    const occupant = toMovable(square.occupant);
                    occupant.location = ixToSquare(squareCounter);
                    sideToMove.push(occupant);
                }
                squareCounter++;
            }
        });
    });
    sideToMove = sideToMove.sort(pieceComparator); // place the king first
    const board = squaresBuilder as Board;
    
    return buildPosition({board,sideToMove});
}