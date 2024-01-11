import { newChessBoard, halfDeepCopy, squareFromString } from "src/utils/board.utils";

describe("board utils", () => {
    describe("half deep copy", () => {
        const board = newChessBoard();
        board[0].occupant = {type: 'king', color:'white'};
        board[63].occupant = {type:"king", color:"black"};

        const newBoard = halfDeepCopy(board);
        it("should give board with same occupants positions", () => {
            expect(newBoard.length).toBe(64);
            expect(newBoard).not.toBe(board);
            expect(newBoard[0]).not.toBe(board[0]);
            expect(newBoard[1]).not.toBe(board[1]);
            expect(newBoard[0].occupant).toEqual(board[0].occupant);
            expect(newBoard[63].occupant).toEqual(board[63].occupant);
        });
        it("should not impact original board when moving pieces around on the new board", () => {
            newBoard[1].occupant = newBoard[0].occupant;
            newBoard[0].occupant = undefined;

            expect(board[1].occupant).toBeUndefined();
            expect(board[0].occupant).toEqual(expect.objectContaining({type: 'king', color:'white'}));
        });
    });

    describe("square from string", () => {
        it("should convert string to corresponding square", () => {
            expect(squareFromString("E3")).toEqual(expect.objectContaining({
                file: 'E',
                row: 3,
            }))
        });
    });
});