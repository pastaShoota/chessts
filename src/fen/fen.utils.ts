import { newChessBoard, dummySquare, ixToCoordinates, ixToSquare } from "../model/board.utils";
import { Board, Square, Piece, Game } from "../model/definitions";
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
    const [fenRows, turn, castlings, enPassant, halfMoves, fullMovesStr ] = fen.split(" ");
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
    
    const fullMoves = Number(fullMovesStr) || 1;

    const game: Game = {previousFens: [], currentFen: fen};
    
    return buildPosition({board,sideToMove,castlings,fullMoves, game});
}

export function positionToFen(position: Position): string {
    const fenBoard = [...position.board].sort(fenSquareOrder).map((square) => [[square]]).reduce((accumulator: Square[][], currentValue: Square[][]) => {
        // group squares eight by eight
        if (accumulator[accumulator.length - 1].length < 8) {
            accumulator[accumulator.length - 1].push(currentValue[0][0]);
        } else {
            accumulator.push(currentValue[0]);
        }
        return accumulator;
    }, [[]]).map((row: Square[]) => {
        const rowAsString:string = row.map((square) => {
            switch(square.occupant?.type){
                case 'bishop': return square.occupant.color === 'black' ? 'b' : 'B';
                case 'king': return square.occupant.color === 'black' ? 'k' : 'K';
                case 'knight': return square.occupant.color === 'black' ? 'n' : 'N';
                case 'pawn': return square.occupant.color === 'black' ? 'p' : 'P';
                case 'queen': return square.occupant.color === 'black' ? 'q' : 'Q';
                case 'rook': return square.occupant.color === 'black' ? 'r' : 'R';
                default: return '1';
            }
        }).join('').replace(/(1+)/g, function(match, p1){
            return ('' + p1).length + '';
        });
        return rowAsString;
    }).join('/');

    const colorToPlay = position.sideToMove[0].color.charAt(0);

    const castlingRights = position.castlings || "-";

    const enPassant = position.board.find((square) => square.enPassantTarget);
    const enPassantStr = enPassant ? enPassant.file.toLowerCase() + enPassant.row : '-';

    const halfMoves = position.halfMoves || "0";

    const fullMoves = position.fullMoves || "1";

    return `${fenBoard} ${colorToPlay} ${castlingRights} ${enPassantStr} ${halfMoves} ${fullMoves}`;
}

function fenSquareOrder(square1: Square, square2: Square): number {
    if (square1.row > square2.row) {
        return -1;
    }
    if (square1.row < square2.row) {
        return 1;
    }
    return square1.file.localeCompare(square2.file);
}

export function samePosition(fen1: string, fen2: string): boolean {
    // just consider board, turn, and castling rights
    const [fen1split, fen2split] = [fen1.split(' '), fen2.split(' ')];
    if (fen1split.length > 2 && fen2split.length > 2) {
        return fen1split[0] === fen2split[0] &&
            fen1split[1] === fen2split[1] &&
            fen1split[2] === fen2split[2];
    }
    return false;
}

export const startingPositionFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";