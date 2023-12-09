import { generateEmptyBoard, positionFromFen } from "./fen.utils";
import { Piece } from "../model/definitions";

describe('fen utils', ()=>{
    describe('generate empty board', () => {
        it('should give correct coordinates', () => {
            const result = generateEmptyBoard();

            expect(result[0]).toHaveProperty('row', 1);
            expect(result[0]).toHaveProperty('file', 'A');

            expect(result[63]).toHaveProperty('row', 8);
            expect(result[63]).toHaveProperty('file', 'H');
            
            expect(result[36]).toHaveProperty('row', 5);
            expect(result[36]).toHaveProperty('file', 'E');
        
            expect(result[26]).toHaveProperty('row', 4);
            expect(result[26]).toHaveProperty('file', 'C');
        });
    });
    describe('position from fen', () => {
        const fen = '8/8/8/4p1K1/2k1P3/8/8/8 b - - 0 1';
        // black pawn e5 (=36) white king g5 (=38) black king c4 (=26) white pawn e4 (=28)

        it('should give all piece places correctly', () => {
            const board = positionFromFen(fen).board;
            expect(board[36].occupant).toBeDefined();
            expect(board[38].occupant).toBeDefined();
            expect(board[26].occupant).toBeDefined();
            expect(board[28].occupant).toBeDefined();
            
            let occupant = board[36].occupant as Piece;
            expect(occupant.type).toBe('pawn');
            expect(occupant.color).toBe('black');
            
            occupant = board[38].occupant as Piece;
            expect(occupant.type).toBe('king');
            expect(occupant.color).toBe('white');
   
            occupant = board[26].occupant as Piece;
            expect(occupant.type).toBe('king');
            expect(occupant.color).toBe('black');

            occupant = board[28].occupant as Piece;
            expect(occupant.type).toBe('pawn');
            expect(occupant.color).toBe('white');
        });

        it('should give only the specified pieces', () => {
            const emptySquares = positionFromFen(fen).board.filter((sq,ix) => ![36,38,26,28].includes(ix));
            
            expect(emptySquares.length).toBeTruthy();
            emptySquares.forEach((emptySquare) => {
                expect(emptySquare.occupant).toBeUndefined();
            })
        });
        it('should give correct list of pieces from side to move', () => {
            fail("not implemented");
        });
    });
});