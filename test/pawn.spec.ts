import { positionFromFen, startingPositionFen } from "src/utils/fen.utils";
import { squareToIx } from "src/utils/board.utils";
import { MovablePiece } from "src/model/movable.piece";
import { newStartingPos } from "src/model/position";

describe('pawn', () => {
    describe('figure moves', () => {
        // black pawn d5 e5 g5 b3 king g8
        // white pawn e4 f4 a2 h6 king e2
        const position = positionFromFen("6k1/8/7P/3pp1p1/4PP2/1p6/P3K3/8 w - - 0 1");
        const blackPos = positionFromFen("6k1/8/7P/3pp1p1/4PP2/1p6/P3K3/8 b - - 0 1");

        it('should figure black moves as well', () => {
            const pawnB3 = blackPos.board[squareToIx({file: 'B', row: 3})].occupant as MovablePiece;

            const moves = pawnB3.figureMoves(blackPos.board);
            expect(moves.length).toBe(2);
            expect(moves).toEqual(expect.arrayContaining([
                expect.objectContaining({target: expect.objectContaining({file:'A', row: 2})}),
                expect.objectContaining({target: expect.objectContaining({file:'B', row: 2})}),
            ]));
        });
        it('should figure move only', () => {
            const pawnH6 = position.board[squareToIx({file: 'H', row: 6})].occupant as MovablePiece;
            
            const moves = pawnH6.figureMoves(position.board);
            expect(moves).toBeDefined();
            expect(moves.length).toBe(1);
            expect(moves[0].source).toEqual({file: 'H', row: 6});
            expect(moves[0].target).toEqual({file: 'H', row: 7});
        });
        it('should figure capture only', () => {
            const pawnE4 = position.board[squareToIx({file: 'E', row: 4})].occupant as MovablePiece;
            
            const moves = pawnE4.figureMoves(position.board); // blocked by pawn e5
            expect(moves).toBeDefined();
            expect(moves.length).toBe(1);
            expect(moves[0].source).toEqual(expect.objectContaining({file: 'E', row: 4}));
            expect(moves[0].target).toEqual(expect.objectContaining({file: 'D', row: 5}));
        });
        it('should figure captures both sides', () => {
            const pawnF4 = position.board[squareToIx({file: 'F', row: 4})].occupant as MovablePiece;
            
            const moves = pawnF4.figureMoves(position.board);
            expect(moves).toBeDefined();
            expect(moves.length).toBe(3);
            expect(moves).toEqual(expect.arrayContaining([expect.objectContaining({
                source: {file: 'F', row: 4},
                target: {file: 'F', row: 5}
            }), expect.objectContaining({
                source: {file: 'F', row: 4},
                target: expect.objectContaining({file: 'E', row: 5})
            }), expect.objectContaining({
                source: {file: 'F', row: 4},
                target: expect.objectContaining({file: 'G', row: 5})
            })]));
        });
        it('should figure step+leap+capture', () => {
            const pawnA2 = position.board[squareToIx({file: 'A', row: 2})].occupant as MovablePiece;
            
            const moves = pawnA2.figureMoves(position.board);
            expect(moves).toBeDefined();
            expect(moves.length).toBe(3);
            expect(moves).toEqual(expect.arrayContaining([expect.objectContaining({
                source: {file: 'A', row: 2},
                target: expect.objectContaining({file: 'B', row: 3}),
            }), expect.objectContaining({
                source: {file: 'A', row: 2},
                target: {file: 'A', row: 3},
            }), expect.objectContaining({
                source: {file: 'A', row: 2},
                target: {file: 'A', row: 4},
            })]));
        });
    });
    describe('promotion', () => {
        // pawn nearing promotion
        const position = positionFromFen("6k1/8/8/8/8/8/1p6/R1N4K b - - 0 1");
        const pawnB2 = position.board[squareToIx({file: 'B', row: 2})].occupant as MovablePiece;

        it("should figure both take + promotion and promotion alone", () => {
            const moves = pawnB2.figureMoves(position.board);

            expect(moves).toEqual(expect.arrayContaining([
                expect.objectContaining({target: expect.objectContaining({file: 'A', row: 1}), promoteTo: 'knight'}),
                expect.objectContaining({target: expect.objectContaining({file: 'A', row: 1}), promoteTo: 'bishop'}),
                expect.objectContaining({target: expect.objectContaining({file: 'A', row: 1}), promoteTo: 'rook'}),
                expect.objectContaining({target: expect.objectContaining({file: 'A', row: 1}), promoteTo: 'queen'}),
                expect.objectContaining({target: expect.objectContaining({file: 'B', row: 1}), promoteTo: 'knight'}),
                expect.objectContaining({target: expect.objectContaining({file: 'B', row: 1}), promoteTo: 'bishop'}),
                expect.objectContaining({target: expect.objectContaining({file: 'B', row: 1}), promoteTo: 'rook'}),
                expect.objectContaining({target: expect.objectContaining({file: 'B', row: 1}), promoteTo: 'queen'}),
                expect.objectContaining({target: expect.objectContaining({file: 'C', row: 1}), promoteTo: 'knight'}),
                expect.objectContaining({target: expect.objectContaining({file: 'C', row: 1}), promoteTo: 'bishop'}),
                expect.objectContaining({target: expect.objectContaining({file: 'C', row: 1}), promoteTo: 'rook'}),
                expect.objectContaining({target: expect.objectContaining({file: 'C', row: 1}), promoteTo: 'queen'}),
            ]));
        });
        it("should transform to the demanded promoted type", () => {
            const takeAndPromoteToRookPos = position.play("B2 A1=Q");

            // expect black queen on A1 and no more black pawn on b2
            expect(takeAndPromoteToRookPos.board[0]).toHaveProperty('occupant', expect.objectContaining({color: 'black', type: 'queen'}));
            expect(takeAndPromoteToRookPos.board[9]).not.toHaveProperty('occupant');
        });
        it("promote and test playing on for a few moves", () => {
            const takeAndPromoteOnCheck = position.play("B2 C1=Q");

            expect(takeAndPromoteOnCheck.check).toBe(true);
            expect(takeAndPromoteOnCheck.getMoves().length).toBe(3); // Kg2 Kh2 Rxc1
            const onlyKingLeft = takeAndPromoteOnCheck.play("H1 H2")
                .play("C1 A1");

            expect(onlyKingLeft.sideToMove.length).toEqual(1);
            expect(onlyKingLeft.getMoves().length).toEqual(3); // Kg2 Kg3 Kh3   1st rank guarded
        });
    });
    describe("en passant", () => {
        it("should set up", () => {
            const pos = newStartingPos().play("E2 E4");

            expect(pos.board[squareToIx("E3")]).toHaveProperty("enPassantTarget", true);
        });
        it("should forget on next move", () => {
            const pos = newStartingPos().play("E2 E4").play("E7 E5");

            expect(pos.board[squareToIx("E3")]).not.toHaveProperty("enPassantTarget");
            expect(pos.board[squareToIx("E6")]).toHaveProperty("enPassantTarget", true);
        });
        it("should land pawn on en passant target", () => {
            const pos = newStartingPos().play("E2 E4").play("C7 C5").play("E4 E5").play("D7 D5").play("E5 D6") // <- take en passant
                .play("C5 C4").play("D2 D4").play("C4 D3"); // <- second take en passant (other side)

            expect(pos.board[squareToIx("D6")].occupant).toEqual(expect.objectContaining({ type: "pawn", color: "white"}));
            expect(pos.board[squareToIx("D3")].occupant).toEqual(expect.objectContaining({ type: "pawn", color: "black"}));
        });
        it("should pick up the pawn moved on previous move", () => {
            const pos = newStartingPos().play("E2 E4").play("C7 C5").play("E4 E5").play("D7 D5").play("E5 D6") // <- take en passant
                .play("C5 C4").play("D2 D4").play("C4 D3"); // <- second take en passant (other side)
    
            expect(pos.board[squareToIx("D5")].occupant).toBeUndefined();
            expect(pos.board[squareToIx("C4")].occupant).toBeUndefined();
        });
    });
});