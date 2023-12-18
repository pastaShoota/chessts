import { Board, Direction, Directions, InternalMove } from "../definitions";
import { BasicPiece } from "./basic.piece";

export class King extends BasicPiece {
    protected getRange(): number {
        return 1;
    }
    protected getDirections(): Direction[] {
        return [
            Directions.DOWN,
            Directions.DOWN_LEFT,
            Directions.DOWN_RIGHT,
            Directions.LEFT,
            Directions.RIGHT,
            Directions.UP,
            Directions.UP_LEFT,
            Directions.UP_RIGHT,
        ]
    }
    public figureMoves(board: Board): InternalMove[] {
        return super.figureMoves(board)
            .filter((candidateMove) => !this.isThreatened(board, candidateMove.target))
            .map((candidateMove) => {
                candidateMove.verified = true; 
                return candidateMove;
            });
    }
}