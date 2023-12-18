import { squareToIx } from "../board.utils";
import { Board, Direction, Directions, InternalMove, PieceType } from "../definitions";
import { MovablePiece } from "../movable.piece";
import { basicMutations, opposite, toMovable } from "../piece.utils";

const [PAWN_STEP, PAWN_LEAP] = [1, 2];

export class Pawn extends MovablePiece {

    private captureDirections(): Direction[] {
        return (this.color === 'white') ?
            [Directions.UP_LEFT, Directions.UP_RIGHT] :
            [Directions.DOWN_LEFT, Directions.DOWN_RIGHT];
        }
        
    private moveDirection(): Direction {
        return (this.color === 'white') ?
            Directions.UP :
            Directions.DOWN;
    }

    private moveRange(): number {
        if (this.color === 'white' && this.location.row === 2
        || this.color === 'black' && this.location.row === 7) {
            return PAWN_LEAP;
        }
        return PAWN_STEP;
    }

    public figureMoves(board: Board): InternalMove[] {
        const captureSquares = this.captureDirections().flatMap((direction) => super.probe(board, direction, PAWN_STEP))
            .filter((finalSquare) => finalSquare.occupant?.color === opposite(this.color));
        const moveSquares = super.probe(board, this.moveDirection(), this.moveRange())
            .filter((finalSquare) => !finalSquare.occupant);
        return [...captureSquares, ...moveSquares].flatMap((finalSquare) => {
                const [source, target] = [this.location, finalSquare];
                const result = {
                    source,
                    target,
                    verified: false,
                };
                if (this.moveDirection().edgeReached(finalSquare)) {
                    // Promotion
                    return (['knight','bishop','rook','queen'] as PieceType[]).map((promoteTo) => {
                        return {...result, promoteTo,
                        mutations: (board) => {
                            let targetBoard = basicMutations({source, target})(board);
                            targetBoard[squareToIx(target)].occupant = toMovable({color: this.color, type: promoteTo});
                            console.log('promoting to '+ promoteTo + ' ' + JSON.stringify(targetBoard[squareToIx(target)].occupant));
                            return targetBoard;
                        }}
                    })
                }
                return {...result, mutations: basicMutations({source, target})};
        });
    }

    // TODO en passant
}