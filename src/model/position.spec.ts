import { positionFromFen, startingPositionFen } from "../fen/fen.utils";
import { squareFromString, squareToIx } from "./board.utils";
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
            it('should have all four rights on initial pos', () => {
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
                    .play('G2 G4').play('B7 B5')
                    .play('F1 G2').play('G8 F6')
                    .play('G2 A8')
                ;
                    
                expect(pos.castlings).toEqual('KQk');
            });
        });
        describe("castling moves", () => {
            const initialPosWithJustKingsAndRooks = positionFromFen('r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1');
            const movesWithWhiteQueenCastlling = expect.arrayContaining([
                expect.objectContaining({source: squareFromString("E1"), target: squareFromString("C1")}) 
            ]);
            const movesWithBlackKingCastlling = expect.arrayContaining([
                expect.objectContaining({source: squareFromString("E8"), target: squareFromString("G8")}) 
            ]);
 
            it('should not be allowed to castle while there are pieces in the way', () => {
                let pos = positionFromFen(startingPositionFen)
                    .play('D2 D4').play('E7 E6');
                expect(pos.getMoves()).not.toEqual(movesWithWhiteQueenCastlling);
                
                pos = pos.play('C1 F4').play('G8 F6');
                expect(pos.getMoves()).not.toEqual(movesWithWhiteQueenCastlling);
                
                pos = pos.play('D1 D3');
                expect(pos.getMoves()).not.toEqual(movesWithBlackKingCastlling);
                
                pos = pos.play('F8 E7');
                expect(pos.getMoves()).not.toEqual(movesWithWhiteQueenCastlling);
                
                pos = pos.play('B1 C3');
                expect(pos.getMoves()).toEqual(movesWithBlackKingCastlling);
                
                pos = pos.play('D7 D5');
                expect(pos.getMoves()).toEqual(movesWithWhiteQueenCastlling);
            });
            it('should not be allowed to castle either side when in check', () => {
                let pos = positionFromFen(startingPositionFen)
                    .play('D2 D4').play('E7 E6')
                    .play('C1 F4').play('G8 F6')
                    .play('D1 D3').play('F8 B4') // check!
                    .play('B1 C3').play('B4 C3'); // check again
                expect(pos.getMoves()).not.toEqual(movesWithWhiteQueenCastlling);
                pos = pos.play('B2 C3').play('B8 C6'); // no more check
                expect(pos.getMoves()).toEqual(movesWithWhiteQueenCastlling);
            });
            it('should not be allowed to castle when a passing square is controlled by opponent', () => {
                let pos = initialPosWithJustKingsAndRooks.play("H1 G1");
                expect(pos.getMoves()).not.toEqual(movesWithBlackKingCastlling);
                pos = pos.play("A8 C8");
                expect(pos.getMoves()).not.toEqual(movesWithWhiteQueenCastlling);
                pos = pos.play("G1 F1");
                expect(pos.getMoves()).not.toEqual(movesWithBlackKingCastlling);
                pos = pos.play("C8 D8");
                expect(pos.getMoves()).not.toEqual(movesWithWhiteQueenCastlling);
                pos = pos.play("F1 H1");
                expect(pos.getMoves()).toEqual(movesWithBlackKingCastlling);
                pos = pos.play("D8 B8");
                expect(pos.getMoves()).toEqual(movesWithWhiteQueenCastlling);
            });
            it('should not be allowed to castle once right no longer enabled', () => {
                let pos = initialPosWithJustKingsAndRooks;
                expect(pos.getMoves()).toEqual(movesWithWhiteQueenCastlling);
                pos = pos.play("A1 A2");
                expect(pos.getMoves()).toEqual(movesWithBlackKingCastlling);
                pos = pos.play("E8 D8").play("A2 A1").play("D8 E8");
                expect(pos.getMoves()).not.toEqual(movesWithWhiteQueenCastlling);
                pos = pos.play("A1 A2");
                expect(pos.getMoves()).not.toEqual(movesWithBlackKingCastlling);
            });
            it('should move pieces correctly', () => {
                let pos = initialPosWithJustKingsAndRooks.play("E1 C1"); // queen side castle

                expect(pos.board[squareToIx("A1")]).not.toHaveProperty('occupant');
                expect(pos.board[squareToIx("B1")]).not.toHaveProperty('occupant');
                expect(pos.board[squareToIx("E1")]).not.toHaveProperty('occupant');
                expect(pos.board[squareToIx("C1")]).toHaveProperty('occupant', expect.objectContaining({color: 'white', type: 'king'}));
                expect(pos.board[squareToIx("D1")]).toHaveProperty('occupant', expect.objectContaining({color: 'white', type: 'rook'}));
                
                pos = pos.play("E8 G8"); // king side castle
                expect(pos.board[squareToIx("H8")]).not.toHaveProperty('occupant');
                expect(pos.board[squareToIx("E8")]).not.toHaveProperty('occupant');
                expect(pos.board[squareToIx("G8")]).toHaveProperty('occupant', expect.objectContaining({color: 'black', type: 'king'}));
                expect(pos.board[squareToIx("F8")]).toHaveProperty('occupant', expect.objectContaining({color: 'black', type: 'rook'}));
            });
        });
    });
});