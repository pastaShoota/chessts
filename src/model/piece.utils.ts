import { Bishop, King, Knight, Pawn, Queen, Rook } from "./movables";
import { Board, Move, Piece, PieceColor, FileNumber, RowNumber } from "./definitions";
import { MovablePiece } from "./movable.piece";
import { halfDeepCopy, squareToIx } from "./board.utils";

export function toMovable(piece: Piece): MovablePiece {
    switch(piece.type) {
        case 'king' : return new King(piece);
        case 'queen' : return new Queen(piece);
        case 'rook' : return new Rook(piece);
        case 'bishop' : return new Bishop(piece);
        case 'knight' : return new Knight(piece);
        case 'pawn' : return new Pawn(piece);
    }
}

// comparator to always place the king first
export function pieceComparator(a: Piece, b: Piece): number {
    if (a.type === 'king') {
        return -1;
    }
    if (b.type === 'king') {
        return 1;
    }
    return 0;
}

export function basicMutations(move: Move): (board: Board) => Board {
    return (board: Board) => {
        const targetBoard = halfDeepCopy(board);
        delete targetBoard[squareToIx(move.source)].occupant;
        targetBoard[squareToIx(move.target)].occupant = board[squareToIx(move.source)].occupant;
        return targetBoard;
    }
}

export function opposite(color: PieceColor): PieceColor {
    switch(color) {
        case 'white': return 'black';
        case 'black': return 'white';
        default: throw new Error("unexpected piece color state");
    }
}

export function moveAsString(move: Move): string {
    let result = move.source.file + move.source.row + ' ' + move.target.file + move.target.row;
    if (move.promoteTo) {
        result += ('=' + move.promoteTo.charAt(0).toUpperCase());
    }
    return result;
}

export function moveFromString(move: string): Move {
    const [sourceFile, sourceRow, targetFile, targetRow, promoteTo] = move.split(/[ =]?/);

    const fileNumberPattern = /(A|B|C|D|E|F|G|H)/;
    const rowNumberPattern = /(1|2|3|4|5|6|7|8)/;
    
    if (!(sourceFile && sourceFile.match(fileNumberPattern) &&
            sourceRow && sourceRow.match(rowNumberPattern) &&
            targetFile && targetFile.match(fileNumberPattern) &&
            targetRow && targetRow.match(rowNumberPattern))) {
                throw new Error("parse error move from string " + move);
    }
    const result: Move = {
        source: {file: sourceFile as FileNumber, row: Number(sourceRow) as RowNumber}, 
        target: {file: targetFile as FileNumber, row: Number(targetRow) as RowNumber}, 
    }
    if(promoteTo && promoteTo.toUpperCase() in {'N':'', 'B':'', 'R':'', 'Q': ''}) {
        switch(promoteTo.toLocaleUpperCase()){
            case 'N': result.promoteTo = 'knight'; break;
            case 'B': result.promoteTo = 'bishop'; break;
            case 'R': result.promoteTo = 'rook'; break;
            case 'Q': result.promoteTo = 'queen'; break;
        }
    }
    return result;
}