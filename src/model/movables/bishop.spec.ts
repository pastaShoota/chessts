import { positionFromFen } from "../../fen/fen.utils";

describe('bishop', () => {
    describe('figure moves', () => {
        // starting position using FEN: black bishop on e5 white king on g5, black king on c4 white pawn on e4
        const position = positionFromFen('8/8/8/4b1K1/2k1P3/8/8/8 b - - 0 1');
        const bishop = position.sideToMove.filter((piece) => piece.type === 'bishop')[0];

        it('should figure all moves', () => {
            const moves = bishop.figureMoves(position.board);

            expect(moves).toBeInstanceOf(Array);
            expect(moves.length).toBeGreaterThan(0);
            expect(moves.length).toBeLessThanOrEqual(14);
            moves.map((move) => move.source).forEach((source) => expect(source).toEqual({row: 5, file: 'E'}));
            expect(moves.map((move) => move.target)).toEqual(expect.arrayContaining([expect.objectContaining({file: "H", row: 8})]));
        });
    });
    describe('figure moves with obstacles', () => {
        it('should not output unaccessible squares', () => {
            // same as above with a pawn on g7 -> Be5 won't be able to move to h8
            const position = positionFromFen('8/6p1/8/4b1K1/2k1P3/8/8/8 b - - 0 1');
            const bishop = position.sideToMove.filter((piece) => piece.type === 'bishop')[0];

            const moves = bishop.figureMoves(position.board);

            expect(moves).toBeInstanceOf(Array);
            expect(moves.length).toBeGreaterThan(0);
            expect(moves.length).toBeLessThanOrEqual(14);
            moves.map((move) => move.source).forEach((target) => expect(target).not.toEqual({row: 8, file: 'H'}));
        });
        it('should not output squares occupied by friendly pieces', () => {
            // same as above with a pawn on g7 -> Be5 won't be able to move to g7 either
            const position = positionFromFen('8/6p1/8/4b1K1/2k1P3/8/8/8 b - - 0 1');
            const bishop = position.sideToMove.filter((piece) => piece.type === 'bishop')[0];

            const moves = bishop.figureMoves(position.board);

            expect(moves).toBeInstanceOf(Array);
            expect(moves.length).toBeGreaterThan(0);
            expect(moves.length).toBeLessThanOrEqual(14);
            moves.map((move) => move.source).forEach((target) => expect(target).not.toEqual({row: 7, file: 'G'}));
        });
        it('should output squares occupied by enemy pieces', () => {
            // same as above with a white pawn on g7 -> Be5 will be able to move to g7 this time
            const position = positionFromFen('8/6P1/8/4b1K1/2k1P3/8/8/8 b - - 0 1');
            const bishop = position.sideToMove.filter((piece) => piece.type === 'bishop')[0];

            const moves = bishop.figureMoves(position.board);

            expect(moves).toBeInstanceOf(Array);
            expect(moves.length).toBeGreaterThan(0);
            expect(moves.length).toBeLessThanOrEqual(14);
            moves.map((move) => move.source).forEach((target) => expect(target).not.toEqual({row: 8, file: 'H'}));
            expect(moves.map((move) => move.target)).toEqual(expect.arrayContaining([expect.objectContaining({file: "G", row: 7})]));
        });

        // TODO verify board mutations
    });
});