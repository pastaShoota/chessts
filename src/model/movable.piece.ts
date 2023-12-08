import { Move, Piece, PieceColor, PieceType } from "./definitions";

export abstract class MovablePiece implements Piece{
    public type: PieceType;
    public color: PieceColor;
    
    constructor(proto: Piece) {
        this.type = proto.type;
        this.color = proto.color;
    }

    public abstract figureMoves(): Move[];
}