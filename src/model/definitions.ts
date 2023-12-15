
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
}

export type InternalMove = Move & {
    mutations: (board: Board) => Board,
    verified: boolean,
}

export const Directions = {
    UP_LEFT: {cape: 7, edgeReached: (square: Square) => square.file === 'A' || square.row === 8 },
    UP: {cape: 8, edgeReached: (square: Square) => square.row === 8 },
    UP_RIGHT: {cape: 9, edgeReached: (square: Square) => square.file === 'H' || square.row === 8 },
    RIGHT: {cape: 1, edgeReached: (square: Square) => square.file === 'H' },
    DOWN_RIGHT: {cape: -7, edgeReached: (square: Square) => square.file === 'H' || square.row === 1 },
    DOWN: {cape: -8, edgeReached: (square: Square) => square.row === 1 },
    DOWN_LEFT: {cape: -9, edgeReached: (square: Square) => square.file === 'A' || square.row === 1 },
    LEFT: {cape: -1, edgeReached: (square: Square) => square.file === 'A' },
} as const;

export type Direction = typeof Directions[keyof typeof Directions];

export type EndOfGame = "checkmate" | "draw-stalemate" | "timesup" | "whiteresigns" | "blackresigns" | "draw-repetition" | "draw-fiftymoves";
