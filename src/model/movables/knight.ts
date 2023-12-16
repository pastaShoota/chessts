import { Directions, Direction, InternalMove, Board } from "../definitions";
import { MovablePiece } from "../movable.piece";
import { basicMutations } from "../piece.utils";

export class Knight extends MovablePiece {
    private static readonly RANGE = 1;

    private static readonly directions: Direction[] = [
        Directions.KNIGHT_DOWN_LEFT,
        Directions.KNIGHT_DOWN_RIGHT,
        Directions.KNIGHT_UP_LEFT,
        Directions.KNIGHT_UP_RIGHT,
        Directions.KNIGHT_LEFT_DOWN,
        Directions.KNIGHT_LEFT_UP,
        Directions.KNIGHT_RIGHT_DOWN,
        Directions.KNIGHT_RIGHT_UP,
    ];

    public figureMoves(board: Board): InternalMove[] {
        return Knight.directions.flatMap((direction) => super.probe(board, direction, Knight.RANGE))
            .filter((finalSquare) => !(finalSquare.occupant instanceof MovablePiece)) // can't friend piece
            .map(((finalSquare) => {
                const [source, target] = [this.location, finalSquare];
                return {
                    source,
                    target,
                    mutations: basicMutations({source, target}),
                    verified: false,
                }
            }));
    }
}