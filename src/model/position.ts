import { MovablePiece } from "./movable.piece";
import { Board, CandidateMove, VerifiedMove } from "./definitions";
import { pieceComparator } from "./piece.utils";
import { positionFromFen } from "../fen/fen.utils";


export interface Position {
    readonly board: Board,
    readonly sideToMove: MovablePiece[],
    readonly check: boolean,
    // TODO: castling rights + en passant + half moves + full moves

    getMoves(): VerifiedMove[],
}

export type PositionPlain = Omit<Position, "getMoves"|"check">;

export function buildPosition(position: PositionPlain): Position {
    return new PositionImpl(position);
}

class PositionImpl implements Position {
    readonly check: boolean;

    constructor(private position: PositionPlain) {
        this.position.sideToMove.sort(pieceComparator); // place king first
        this.check = this.position.sideToMove[0].isThreatened(this.board);
    }

    getMoves(): VerifiedMove[] {
        return this.sideToMove.flatMap((piece) => piece.figureMoves(this.board))
            .map((move) => {
                if (move.verified) {
                    return move;
                }
                return this.verify(move as CandidateMove);
                
                // remove nulls
            }).filter((move) => move) as VerifiedMove[];
    }

    private verify(move: CandidateMove): VerifiedMove | null {
        let board = move.mutations({...this.board});

        if (this.sideToMove[0].isThreatened(board)) {
            return null;
        }

        const resultingPosition: PositionPlain = positionFromFen(''); // TODO
        let {mutations, ...result} = {...move, verified: true, resultingPosition};

        return result;
    }

    public get board() {
        return this.position.board;
    }
    public get sideToMove() {
        return this.position.sideToMove;
    }
}