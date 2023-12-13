import { MovablePiece } from "./movable.piece";
import { Board, Move } from "./definitions";
import { pieceComparator } from "./piece.utils";


export interface Position {
    readonly board: Board,
    readonly sideToMove: MovablePiece[],
    readonly check?: boolean,
    // TODO: castling rights + en passant + half moves + full moves

    getMoves(): Move[],
}

type PositionStructure = Omit<Position, "getMoves">;

export function buildPosition(position: PositionStructure) {
    return new PositionImpl(position);
}

class PositionImpl implements Position {
    readonly check: boolean;

    constructor(private position: PositionStructure) {
        this.position.sideToMove.sort(pieceComparator); // place king first
        this.check = this.position.sideToMove[0].isThreatened(this.board);
    }

    getMoves(): Move[] {
        throw new Error("Method not implemented.");
    }

    private checkLegal(move: Move) {
        let board = move.mutations({...this.board});

    }

    public get board() {
        return this.position.board;
    }
    public get sideToMove() {
        return this.position.sideToMove;
    }
}