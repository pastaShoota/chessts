import { squareToIx } from "../../utils/board.utils";
import { Board, Direction, Directions, InternalMove, Piece, PieceType } from "../definitions";
import { MovablePiece } from "../movable.piece";
import { basicMutations } from "./basic.piece";

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

    public static toMovable: (piece: Piece) => MovablePiece;

    public figureMoves(board: Board): InternalMove[] {
        const captureSquares = this.captureDirections().flatMap((direction) => super.probe(board, direction, PAWN_STEP))
            .filter((finalSquare) => this.isOpponent(finalSquare.occupant) || finalSquare.enPassantTarget);
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
                            targetBoard[squareToIx(target)].occupant = Pawn.toMovable({color: this.color, type: promoteTo});
                            console.log('promoting to '+ promoteTo + ' ' + JSON.stringify(targetBoard[squareToIx(target)].occupant));
                            return targetBoard;
                        }}
                    })
                }
                if (moveSquares.length > 1 && finalSquare.row === moveSquares[1].row) {
                    // double step => set En passant
                    return {...result, mutations: (board) => {
                        let targetBoard = basicMutations({source, target})(board);
                        // console.log("setting en passant on square " + JSON.stringify(moveSquares[0]));
                        targetBoard[squareToIx(moveSquares[0])].enPassantTarget = true;
                        return targetBoard;
                    }};
                }
                if (finalSquare.enPassantTarget) {
                    // taking en passant -> make opponent pawn disappear
                    return {...result, mutations: (board) => {
                        let targetBoard = basicMutations({source, target})(board);
                        const squareOfTakenPawn = targetBoard[squareToIx(finalSquare) - this.moveDirection().cape];
                        console.log("erasing pawn (en passant): " + JSON.stringify(squareOfTakenPawn));
                        delete squareOfTakenPawn.occupant;
                        return targetBoard;
                    }};
                }
                return {...result, mutations: basicMutations({source, target})};
        });
    }
}