
export type PieceType = 'pawn'|'knight'|'bishop'|'rook'|'queen'|'king';
export type PieceColor = 'black'|'white';

export interface Piece {
    type: PieceType;
    color: PieceColor;
}

export type FileNumber = 'A'|'B'|'C'|'D'|'E'|'F'|'G'|'H';
export type RowNumber = 1|2|3|4|5|6|7|8;

export type Square = {
    file: FileNumber,
    row: RowNumber,
    occupant?: Piece,
}

type FixedSizeArray<N extends number, T> = {
    //0: T,
    length: N
} & ReadonlyArray<T>;

export type Board = FixedSizeArray<64, Square>;

export type Move = {
    source: Square,
    target: Square,
    promoteTo?: Piece,
    mutations: (board: Board) => Board,
}
