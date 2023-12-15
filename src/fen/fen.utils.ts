import { newChessBoard, dummySquare, ixToCoordinates, ixToSquare } from "../model/board.utils";
import { Board, Square, Piece } from "../model/definitions";
import { MovablePiece } from "../model/movable.piece";
import { toMovable } from "../model/piece.utils";
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

export function positionFromFen(fen: string): Position {
    const [fenRows, turn, castling, ] = fen.split(" ");
    let squareCounter = 0;
    let sideToMove: MovablePiece[] = [];
    const board: Board = newChessBoard();

    fenRows.split('/').reverse().forEach((row) => {
        row.split('').forEach((char) => {
            if (Number(char)) {
                squareCounter += Number(char);
            } else {
                const occupant = pieceFromFen(char);
                
                if (occupant?.color.startsWith(turn)) {
                    const movable = toMovable(occupant);
                    movable.location = ixToSquare(squareCounter);
                    board[squareCounter].occupant = movable;
                    sideToMove.push(movable);
                } else {
                    board[squareCounter].occupant = occupant;
                }
                squareCounter++;
            }
        });
    });
    
    return buildPosition({board,sideToMove});
}

export const startingPositionFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";