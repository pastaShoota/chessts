import { generateEmptyBoard } from "./fen.utils";

describe('fen utils', ()=>{
    describe('generate empty board', () => {
        it('should give correct coordinates', () => {
            const result = generateEmptyBoard();

            expect(result[0]).toHaveProperty('row', 1);
            expect(result[0]).toHaveProperty('file', 'A');

            expect(result[63]).toHaveProperty('row', 8);
            expect(result[63]).toHaveProperty('file', 'H');
        });
    });
});