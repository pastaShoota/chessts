import { Direction, Directions } from "../definitions";
import { BasicPiece } from "./basic.piece";

export class Bishop extends BasicPiece {
    protected getRange(): number {
        return 7;
    }
    protected getDirections(): Direction[] {
        return [
            Directions.UP_LEFT,
            Directions.UP_RIGHT,
            Directions.DOWN_LEFT,
            Directions.DOWN_RIGHT,
        ];
    }
}