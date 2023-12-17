import { Board, Direction, InternalMove } from "../definitions";
import { MovablePiece } from "../movable.piece";
import { basicMutations } from "../piece.utils";

export abstract class BasicPiece extends MovablePiece {
    protected abstract getRange(): number;

    protected abstract getDirections(): Direction[];

    public figureMoves(board: Board): InternalMove[] {
        return this.getDirections().flatMap((direction) => super.probe(board, direction, this.getRange()))
            .filter((finalSquare) => !(finalSquare.occupant instanceof MovablePiece)) // can't take friendly film
            .map((finalSquare) => {
                const [source, target] = [this.location, finalSquare];
                return {
                    source,
                    target,
                    mutations: basicMutations({source, target}),
                    verified: false,
                }
            });
    }
}