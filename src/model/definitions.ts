
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
    enPassantTarget?: boolean,
}

/*type FixedSizeArray<N extends number, T> = {
    //0: T,
    length: N
} & ReadonlyArray<T>;*/

export type Board = ReadonlyArray<Square>;

export type Move = {
    source: Square,
    target: Square,
    promoteTo?: PieceType,
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

    KNIGHT_UP_LEFT: {cape: 15, edgeReached: (square: Square) => square.file === 'A' || square.row >= 7},
    KNIGHT_UP_RIGHT: {cape: 17, edgeReached: (square: Square) => square.file === 'H' || square.row >= 7},
    KNIGHT_DOWN_LEFT: {cape: -17, edgeReached: (square: Square) => square.file === 'A' || square.row <= 2},
    KNIGHT_DOWN_RIGHT: {cape: -15, edgeReached: (square: Square) => square.file === 'H' || square.row <= 2},
    KNIGHT_LEFT_UP: {cape: 6, edgeReached: (square: Square) => square.file === 'A' || square.file === 'B' || square.row === 8},
    KNIGHT_RIGHT_UP: {cape: 10, edgeReached: (square: Square) => square.file === 'H' || square.file === 'G' || square.row === 8},
    KNIGHT_LEFT_DOWN: {cape: -10, edgeReached: (square: Square) => square.file === 'A' || square.file === 'B' || square.row === 1},
    KNIGHT_RIGHT_DOWN: {cape: -6, edgeReached: (square: Square) => square.file === 'H' || square.file === 'G' || square.row === 1},
} as const;

export type Direction = typeof Directions[keyof typeof Directions];

export type EndOfGame = "checkmate" | "draw-stalemate" | "timesup" | "whiteresigns" | "blackresigns" | "draw-repetition" | "draw-fiftymoves";

export type castling = 'q'|'k'|'Q'|'K';

export type castlingRight = {
    id: castling,
    involvedSquares: string[],
}

export const castlingRights: castlingRight[] = [
    {
        id: 'q',
        involvedSquares: ['A8', 'E8'],
    },
    {
        id: 'k',
        involvedSquares: ['H8', 'E8'],
    },
    {
        id: 'Q',
        involvedSquares: ['A1', 'E1'],
    },
    {
        id: 'K',
        involvedSquares: ['H1', 'E1'],
    },
]