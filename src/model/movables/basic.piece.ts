import { Board, Direction, Move, InternalMove } from "model/definitions";
import { MovablePiece } from "model/movable.piece";
import { halfDeepCopy, squareToIx } from "utils/board.utils";

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


export function basicMutations(move: Move): (board: Board) => Board {
    return (board: Board) => {
        const targetBoard = halfDeepCopy(board);
        delete targetBoard[squareToIx(move.source)].occupant;
        targetBoard[squareToIx(move.target)].occupant = board[squareToIx(move.source)].occupant;
        return targetBoard;
    }
}
