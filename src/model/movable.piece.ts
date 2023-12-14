import { dummySquare, squareToIx } from "./board.utils";
import { Board, Direction, Directions, InternalMove, Piece, PieceColor, PieceType, Square } from "./definitions";
import { opposite } from "./piece.utils";

export abstract class MovablePiece implements Piece{
    public type: PieceType;
    public color: PieceColor;
    public location: Square = dummySquare;
    
    constructor(proto: Piece) {
        this.type = proto.type;
        this.color = proto.color;
    }

    public abstract figureMoves(board: Board): InternalMove[];

    protected probe(board: Board, direction: Direction, range: number = 8, separateSquare?: Square): Square[] {
        const result: Square[] = [];
        let square = separateSquare || this.location;
        
        while(!direction.edgeReached(square) && result.length < range && square.occupant?.color !== this.color) {
            square = board[squareToIx(square) + direction.cape];
            result.push(square);
        }
        return result;
    }

    public isThreatened(board: Board, separateSquare?: Square) {
        return this.isThreatenedByPawn(board, separateSquare) ||
            this.isThreatenedByKing(board, separateSquare) ||
            this.isThreatenedByLongRangePiece(board, separateSquare) ||
            this.isThreatenedByKnight(board, separateSquare);
    }

    private isThreatenedByPawn(board: Board, square?: Square) {
        const directions = this.color === 'white' ? [Directions.UP_LEFT, Directions.UP_RIGHT] : [Directions.DOWN_LEFT, Directions.DOWN_RIGHT];
        const PAWN_RANGE = 1;

        return directions.flatMap((direction) => this.probe(board, direction, PAWN_RANGE, square))
            .filter((otherSquare) => otherSquare.occupant?.color !== this.color && otherSquare.occupant?.type === 'pawn')
            .length > 0;
    }

    private isThreatenedByKing(board: Board, square?: Square) {
        const directions = [Directions.UP, Directions.DOWN, Directions.LEFT, Directions.RIGHT, Directions.UP_LEFT, Directions.UP_RIGHT, Directions.DOWN_LEFT, Directions.DOWN_RIGHT];
        const KING_RANGE = 1;

        return directions.flatMap((direction) => this.probe(board, direction, KING_RANGE, square))
            .filter((otherSquare) => otherSquare.occupant?.color !== this.color && otherSquare.occupant?.type === 'king')
            .length > 0;
    }

    private isThreatenedByLongRangePiece(board: Board, square?: Square) {
        const rookishDirections = [Directions.UP, Directions.DOWN, Directions.LEFT, Directions.RIGHT];
        const bishopishDirections = [Directions.UP_RIGHT, Directions.DOWN_LEFT, Directions.UP_LEFT, Directions.DOWN_RIGHT];
        const LONG_RANGE = 7;
        const rookishTypes = ['rook', 'queen'];
        const bishopishTypes = ['bishop', 'queen'];
        return rookishDirections.flatMap((direction) => this.probe(board, direction, LONG_RANGE, square))
            .filter((otherSquare) => otherSquare.occupant?.color === opposite(this.color) && rookishTypes.includes(otherSquare.occupant?.type))
            .length > 0 ||
            bishopishDirections.flatMap((direction) => this.probe(board, direction, LONG_RANGE, square))
            .filter((otherSquare) => otherSquare.occupant?.color === opposite(this.color) && bishopishTypes.includes(otherSquare.occupant?.type))
            .length > 0;
    }

    private isThreatenedByKnight(board: Board, square?: Square) {
        //TODO
        return false;
    }
}
