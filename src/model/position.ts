import { MovablePiece } from "./movable.piece";
import { Board } from "./definitions";


export type Position = {
    board: Board,
    sideToMove: MovablePiece[],
    // TODO: castling rights + en passant + half moves + full moves
}
