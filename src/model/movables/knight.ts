import { InternalMove } from "../definitions";
import { MovablePiece } from "../movable.piece";

export class Knight extends MovablePiece {

    public figureMoves(): InternalMove[] {
        throw new Error("Method not implemented.");
    }
}