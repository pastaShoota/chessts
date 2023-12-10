import { Bishop, King, Knight, Pawn, Queen, Rook } from "./movables";
import { Piece } from "./definitions";
import { MovablePiece } from "./movable.piece";

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
