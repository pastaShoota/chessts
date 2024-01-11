import { generateEmptyBoard, positionFromFen, positionToFen, startingPositionFen } from "src/utils/fen.utils";
import { Piece } from "src/model/definitions";
import { MovablePiece } from "src/model/movable.piece";
import { Position, newStartingPos } from "src/model/position";

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
            expect(occupant).toBeInstanceOf(MovablePiece);
            
            occupant = board[38].occupant as Piece;
            expect(occupant.type).toBe('king');
            expect(occupant.color).toBe('white');
            
            occupant = board[26].occupant as Piece;
            expect(occupant.type).toBe('king');
            expect(occupant.color).toBe('black');
            expect(occupant).toBeInstanceOf(MovablePiece);

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
            const sideToMove = positionFromFen(fen).sideToMove;

            expect(sideToMove).toBeInstanceOf(Array);
            expect(sideToMove.length).toBe(2);
            sideToMove.forEach((piece) => {
                expect(piece).toBeInstanceOf(MovablePiece);
                expect(piece.color).toBe('black'); // b letter in fen string
            });
            expect(sideToMove.map((piece) => piece.type)).toContain('king');
            expect(sideToMove.map((piece) => piece.type)).toContain('pawn');
            expect(sideToMove[0].type).toBe('king');
        });
    });
    describe("postion to fen", () => {
        let pos = newStartingPos();
        let lastPos: Position;
        let fen: string;
        function testFen() {
            if (pos !== lastPos) {
                lastPos = pos;
                fen = positionToFen(pos);
            }
            return fen;
        }

        it("should give correct positions", () => {
            expect(testFen()).toEqual(startingPositionFen);

            pos = pos.play("E2 E4").play("E7 E5").play("G1 F3"); // 3 half moves

            expect(testFen().split(' ')).toHaveLength(6);
            expect(testFen().split(' ')[0]).toEqual("rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R");
        });
        it("should give correct color to play", () => {
            expect(testFen().split(' ')[1]).toEqual('b'); // black to play
            
            pos = pos.play("B8 C6"); // 1 half move

            expect(testFen().split(' ')[1]).toEqual('w'); // white to play
        });
        it("should give correct castling rights", () => {
            expect(testFen().split(' ')[2]).toEqual("KQkq");

            pos = pos.play("H1 G1"); // 1 half move

            expect(testFen().split(' ')[2]).toEqual("Qkq");
        });
        it("should give correct en passant square", () => {
            expect(testFen().split(' ')[3]).toEqual("-");
            
            pos = pos.play("D7 D5"); // 1 half move
            
            expect(testFen().split(' ')[3]).toEqual("d6");
        });
        it("should give correct half moves", () => {
            // last move has been pawn move => half move counter reset
            expect(testFen().split(' ')[4]).toEqual('0');
            
            pos = pos.play("B1 C3").play("G8 F6").play("F1 E2"); // 3 piece moves
            
            expect(testFen().split(' ')[4]).toEqual('3');
        });
        it("should give correct full moves", () => {
            // counted 9 half moves from above (0 => 1, 1 => 1, 2 => 2, 3=> 2, 4=>3 etc) y = x/2 +1
            expect(testFen().split(' ')[5]).toEqual('5');
            
            pos = pos.play("F6 G8"); // white to play : full moves should have incremented
            
            expect(testFen().split(' ')[5]).toEqual('6');
        });
        it('should give correct castling rights when none left', () => {

            pos = newStartingPos().play("E2 E4").play("E7 E5").play("G1 F3")
            .play("B8 C6").play("H1 G1").play("D7 D5")
            .play("B1 C3").play("G8 F6").play("F1 E2")
            .play("F6 G8").play("E1 F1").play("E8 E7");

            expect(testFen().split(' ')[2]).toEqual("-");
        });
    });
});
