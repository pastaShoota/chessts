import { positionFromFen } from "src/utils/fen.utils";
import { squareToIx } from "src/utils/board.utils";
import { MovablePiece } from "src/model/movable.piece";

describe('movable piece', () => {
    describe('is threatened', () => {
        // starting position using FEN: white pawn on c5 black bishop on e5 white king on g5, black king on c4 white pawn on e4 black knight on c7
        const position = positionFromFen('8/2n5/8/2P1b1K1/2k1P3/8/8/8 w - - 0 1');
        const whiteKing = position.sideToMove[0];
        const pawnC5 = position.board[squareToIx("C5")].occupant as MovablePiece;
        const pawnE4 = position.board[squareToIx("E4")].occupant as MovablePiece;
        const squareH8 = position.board[squareToIx("H8")];
        const squareA8 = position.board[squareToIx("A8")];

        it('should figure threat from king', () => {
            expect(position.sideToMove).toContain(pawnC5);

            // c5 white pawn is threatened by c4 black king
            expect(pawnC5.isThreatened(position.board)).toBeTruthy();
        });
        it('should figure no threat at all', () => {
            expect(pawnE4).toBeInstanceOf(MovablePiece);

            // e4 white pawn not threatened at all
            expect(pawnE4.isThreatened(position.board)).toBeFalsy();
        });
        it('should figure threat from a bishop on a separate square', () => {
            // h8 square is threatened by bishop on E5
            expect(whiteKing.isThreatened(position.board, squareH8)).toBeTruthy();
        });
        it('no attacker on white king', () => {
            expect(whiteKing.isThreatened(position.board)).toBeFalsy();
        });
        it("knight attack on A8", () => {
            expect(whiteKing.isThreatened(position.board, squareA8)).toBeTruthy();
        });
    });
});