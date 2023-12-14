import { Board, Direction, Directions, InternalMove } from "../definitions";
import { MovablePiece } from "../movable.piece";
import { basicMutations } from "../piece.utils";

export class Bishop extends MovablePiece {

    private static readonly directions: Direction[] = [
        Directions.UP_LEFT,
        Directions.UP_RIGHT,
        Directions.DOWN_LEFT,
        Directions.DOWN_RIGHT,
    ];

    public figureMoves(board: Board): InternalMove[] {
        return Bishop.directions.flatMap((direction) => super.probe(board, direction))
            .filter((finalSquare) => !(finalSquare.occupant instanceof MovablePiece)) // cannot take piece from same side
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