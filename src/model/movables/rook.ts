import { Direction, Directions, InternalMove } from "../definitions";
import { BasicPiece } from "./basic.piece";

export class Rook extends BasicPiece {
    protected getRange(): number {
        return 7;
    }
    protected getDirections(): Direction[] {
        return [
            Directions.UP,
            Directions.DOWN,
            Directions.LEFT,
            Directions.RIGHT,
        ]
    }
}