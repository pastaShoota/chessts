import { Direction, Directions, InternalMove } from "../definitions";
import { BasicPiece } from "./basic.piece";

export class Queen extends BasicPiece {
    protected getRange(): number {
        return 7;
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
}