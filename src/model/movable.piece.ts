import { dummySquare, squareToIx } from "./board.utils";
import { Board, Direction, Move, Piece, PieceColor, PieceType, Square } from "./definitions";

export abstract class MovablePiece implements Piece{
    public type: PieceType;
    public color: PieceColor;
    public location: Square = dummySquare;
    
    constructor(proto: Piece) {
        this.type = proto.type;
        this.color = proto.color;
    }

    public abstract figureMoves(board: Board): Move[];

    protected probe(board: Board, direction: Direction, range: number = 8): Square[] {
        const result: Square[] = [];
        let square = this.location;
        while(!direction.edgeReached(square) && result.length < range && square.occupant?.color !== this.color) {
            square = board[squareToIx(square) + direction.cape];
            result.push(square);
        }
        return result;
    }
}
