import { VerifiedMove } from "../definitions";
import { MovablePiece } from "../movable.piece";

export class Queen extends MovablePiece {

    public figureMoves(): VerifiedMove[] {
        throw new Error("Method not implemented.");
    }
}