import { positionFromFen, startingPositionFen } from "../fen/fen.utils";
import { MovablePiece } from "./movable.piece";
import { moveFromString } from "./piece.utils";

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
            const bishopMoves = pos.getMoves().filter((move) => move.source.file === 'C' && move.source.row === 6);
            
            expect(bishopMoves.length).toBe(3);
            expect(bishopMoves).toEqual(expect.arrayContaining([
                expect.objectContaining({ target: expect.objectContaining({file: 'A', row: 8})}),
                expect.objectContaining({ target: expect.objectContaining({file: 'B', row: 7})}),
                expect.objectContaining({ target: expect.objectContaining({file: 'D', row: 5})}),
            ]));
        });
    });
    describe('play move', () => {
        it('should produce the expected position from start', () => {
            const pos = positionFromFen(startingPositionFen)
                .play(moveFromString('E2 E4'))
                .play(moveFromString('D7 D5'))
                .play(moveFromString('F1 B5'))
                ;
                
            expect(pos.sideToMove[0].color).toBe('black');
            pos.sideToMove.forEach((piece) => expect(piece).toBeInstanceOf(MovablePiece));
            expect(pos.check).toBe(true);
            expect(pos.getMoves().length).toBe(5); // c6 Nc6 Nd7 Bd7 Qd7
        });
    });
    describe('castling', () => {
        describe('castling right loss', () => {
            it('should all four rights on initial pos', () => {
                const pos = positionFromFen(startingPositionFen);
                
                expect(pos.castlings).toEqual('KQkq');
            });
            it('should remove both rights on king move', () => {
            const pos = positionFromFen(startingPositionFen)
                .play(moveFromString('F2 F4'))
                .play(moveFromString('D7 D5'))
                .play(moveFromString('E1 F2'))
                ;
            
                expect(pos.castlings).toEqual('kq');
            });
            it('should remove kingside right on kingrook move', () => {
                const pos = positionFromFen(startingPositionFen)
                    .play(moveFromString('H2 H4'))
                    .play(moveFromString('D7 D5'))
                    .play(moveFromString('H1 H2'))
                ;
                
                expect(pos.castlings).toEqual('Qkq');
            });
            it('should remove queenside right on queenrook taken', () => {
                const pos = positionFromFen(startingPositionFen)
                .play(moveFromString('G2 G4'))
                    .play(moveFromString('B7 B5'))
                    .play(moveFromString('F1 G2'))
                    .play(moveFromString('G8 F6'))
                    .play(moveFromString('G2 A8'))
                    ;
                    
                    expect(pos.castlings).toEqual('KQk');
            });
        });
        // TODO castle moves
    });
});