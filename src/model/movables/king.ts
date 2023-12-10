import { Move } from "../definitions";
import { MovablePiece } from "../movable.piece";

export class King extends MovablePiece {

    public figureMoves(): Move[] {
        throw new Error("Method not implemented.");
    }
}