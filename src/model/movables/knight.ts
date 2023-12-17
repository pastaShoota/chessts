import { Directions, Direction } from "../definitions";
import { BasicPiece } from "./basic.piece";

export class Knight extends BasicPiece {
    protected getRange(): number {
        return 1;
    }

    protected getDirections(): Direction[] {
        return [
            Directions.KNIGHT_DOWN_LEFT,
            Directions.KNIGHT_DOWN_RIGHT,
            Directions.KNIGHT_UP_LEFT,
            Directions.KNIGHT_UP_RIGHT,
            Directions.KNIGHT_LEFT_DOWN,
            Directions.KNIGHT_LEFT_UP,
            Directions.KNIGHT_RIGHT_DOWN,
            Directions.KNIGHT_RIGHT_UP,
        ];
    };
}