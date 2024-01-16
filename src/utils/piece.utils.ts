import { Bishop, King, Knight, Pawn, Queen, Rook } from "../model/movables/index";
import { Move, Piece, FileNumber, RowNumber } from "../model/definitions";
import { MovablePiece } from "../model/movable.piece";

// comparator to always place the king first
export function pieceComparator(a: Piece, b: Piece): number {
    if (a.type === 'king') {
        return -1;
    }
    if (b.type === 'king') {
        return 1;
    }
    return 0;
}

export function toMovable(piece: Piece): MovablePiece {
    switch(piece.type) {
        case 'king' : return new King(piece);
        case 'queen' : return new Queen(piece);
        case 'rook' : return new Rook(piece);
        case 'bishop' : return new Bishop(piece);
        case 'knight' : return new Knight(piece);
        case 'pawn' : return new Pawn(piece);
    }
}

if (!Pawn.toMovable) {
    Pawn.toMovable = toMovable;
}

export function moveAsString(move: Move): string {
    let result = move.source.file + move.source.row + ' ' + move.target.file + move.target.row;
    if (move.promoteTo) {
        result += ('=' + move.promoteTo.charAt(0).toUpperCase());
    }
    return result;
}

export function moveFromString(move: string): Move {
    const [sourceFile, sourceRow, targetFile, targetRow, promoteTo] = move.split(/[ =]?/);

    const fileNumberPattern = /(A|B|C|D|E|F|G|H)/;
    const rowNumberPattern = /(1|2|3|4|5|6|7|8)/;
    
    if (!(sourceFile && sourceFile.match(fileNumberPattern) &&
            sourceRow && sourceRow.match(rowNumberPattern) &&
            targetFile && targetFile.match(fileNumberPattern) &&
            targetRow && targetRow.match(rowNumberPattern))) {
                throw new Error("parse error move from string " + move);
    }
    const result: Move = {
        source: {file: sourceFile as FileNumber, row: Number(sourceRow) as RowNumber}, 
        target: {file: targetFile as FileNumber, row: Number(targetRow) as RowNumber}, 
    }
    if(promoteTo && promoteTo.toUpperCase() in {'N':'', 'B':'', 'R':'', 'Q': ''}) {
        switch(promoteTo.toLocaleUpperCase()){
            case 'N': result.promoteTo = 'knight'; break;
            case 'B': result.promoteTo = 'bishop'; break;
            case 'R': result.promoteTo = 'rook'; break;
            case 'Q': result.promoteTo = 'queen'; break;
        }
    }
    return result;
}