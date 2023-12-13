import { Bishop, King, Knight, Pawn, Queen, Rook } from "./movables";
import { Board, Move, Piece, PieceColor, Square } from "./definitions";
import { MovablePiece } from "./movable.piece";
import { squareToIx } from "./board.utils";

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

export function basicMutations(move: Pick<Move, "source"|"target">): (board: Board) => Board {
    return (board: Board) => {
        const targetBoard = [...board];
        targetBoard[squareToIx(move.source)] = {...board[squareToIx(move.source)]};
        delete targetBoard[squareToIx(move.source)].occupant;
        targetBoard[squareToIx(move.target)] = {...board[squareToIx(move.target)]};
        targetBoard[squareToIx(move.target)].occupant = board[squareToIx(move.source)].occupant;
        return targetBoard as Board;
    }
}

export function opposite(color: PieceColor): PieceColor {
    switch(color) {
        case 'white': return 'black';
        case 'black': return 'white';
        default: throw new Error("unexpected piece color state");
    }
}