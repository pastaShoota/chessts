import { positionFromFen } from "../../fen/fen.utils";
import { squareToIx } from "../board.utils";
import { MovablePiece } from "../movable.piece";

describe('pawn', () => {
    describe('figure moves', () => {
        // black pawn d5 e5 g5 b3 king g8
        // white pawn e4 f4 a2 h6 king e2
        const position = positionFromFen("6k1/8/7P/3pp1p1/4PP2/1p6/P3K3/8 w - - 0 1");
        
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
});