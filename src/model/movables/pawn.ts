import { Move } from "../definitions";
import { MovablePiece } from "../movable.piece";

export class Pawn extends MovablePiece {

    public figureMoves(): Move[] {
        throw new Error("Method not implemented.");
    }
}