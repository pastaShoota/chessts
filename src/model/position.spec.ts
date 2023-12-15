import { positionFromFen } from "../fen/fen.utils";

describe('position', () => {
    describe('constructor', () => {
        it('should set check to false when king not in check', () => {
            // starting pos with 1 e4 d5 
            const fen = 'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w - - 0 1';

            expect(positionFromFen(fen).check).toBe(false);
        });
        it('should set check to true when king in check', () => {
            // starting pos with 1.e4 d5 2.Bb5+
            const fen = 'rnbqkbnr/ppp1pppp/8/1B1p4/4P3/8/PPPP1PPP/RNBQK1NR b - - 0 1';

            expect(positionFromFen(fen).check).toBe(true);
        });
    });
    describe('get moves', () => {
        // black bishop a8 king h8
        // white bishop c6 king e4
        const pos = positionFromFen('b6k/8/2B5/8/4K3/8/8/8 w - - 0 1');
        it('should take account of pins', () => {
            pos.getMoves().filter((move) => move.source.file === 'C' && move.source.row === 6);
            // TODO
        })
    })
});