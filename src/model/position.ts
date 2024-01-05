import { MovablePiece } from "./movable.piece";
import { Board, Move, InternalMove, EndOfGame } from "./definitions";
import { pieceComparator, toMovable, moveAsString, moveFromString } from "./piece.utils";
import { halfDeepCopy, squareToIx, } from "./board.utils";
import { figureCastleMoves, reevaluateCastlings as reevaluateCastlingRights } from "./castle.utils";

export interface Position {
    readonly board: Board,
    readonly sideToMove: MovablePiece[],
    readonly check: boolean,
    readonly castlings: string,
    readonly ended?: EndOfGame,
    readonly fullMoves: number,
    readonly halfMoves: number,

    getMoves(): Move[],
    play(move: Move | string): Position,
}

export type PositionPlain = Pick<Position, "board"|"sideToMove"|"castlings"> & {fullMoves?: number, halfMoves?: number};

export function buildPosition(positionPlain: PositionPlain): Position {
    return new PositionImpl(positionPlain);
}

class PositionImpl implements Position {
    readonly check: boolean;
    private moves?: InternalMove[];

    constructor(private position: PositionPlain) {
        this.position.sideToMove.sort(pieceComparator); // place king first
        this.check = this.position.sideToMove[0].isThreatened(this.board);
    }

    getMoves(): Move[] {
        return this.ended ? [] : this.doGetMoves().map((move) => {
            const {source, target, promoteTo} = {...move};
            return {source, target, promoteTo}; // only return Move fields
        });
    }
    
    play(moveArg: Move | string): Position {
        const move: Move = typeof moveArg === "string" ? moveFromString(moveArg as string) : moveArg as Move;
        const moveToPlay = this.doGetMoves().find((internalMove) => 
            moveAsString(internalMove) === moveAsString(move)
        );
        if (!moveToPlay) {
            throw new Error("Unexpected move " + JSON.stringify(move));
        }
        //console.log('board: ' + JSON.stringify(this.board) + ' typeof board ' + (typeof this.board));
        const board = moveToPlay.mutations(this.board);
        const sideToMove: MovablePiece[] = [];
        board.forEach((square) => {
            if (square.occupant instanceof MovablePiece) { // remove movability from one side
                const {type, color} = {...square.occupant};
                square.occupant = {type, color};
            } else if (square.occupant) { // give it to the other
                const piece = toMovable(square.occupant);
                const {file, row} = {...square};
                piece.location = {file, row};
                square.occupant = piece;
                sideToMove.push(piece);
            }
        });
        const castlings = reevaluateCastlingRights(this.castlings, move);
        //console.log('board: ' + JSON.stringify(board));
        const fullMoves = this.sideToMove[0].color === 'black' ? this.fullMoves + 1 : this.fullMoves;
        const halfMoves = this.isTakeOrPawnMove(moveToPlay) ? 0 : this.halfMoves + 1;

        return buildPosition({board, sideToMove, castlings, fullMoves, halfMoves});
    }
    
    private doGetMoves(): InternalMove[] {
        if (!this.moves) {
            this.moves = this.computeMoves() || [];
            //console.log(`computed ${this.moves?.length} moves`);
        }
        return this.moves;
    }
    
    // Determine end of game
    get ended(): EndOfGame|undefined {
        if (this.doGetMoves().length < 1) {
            return this.check ? 'checkmate' : 'draw-stalemate';
        }
        if (this.halfMoves >= 100)  {
            return 'draw-fiftymoves';
        }
        // if too little material left -> draw TODO
        // if same position repeated 3 times -> draw TODO
        return undefined;
    }

    private computeMoves() {
        const pieceMoves = this.sideToMove.flatMap((piece) => piece.figureMoves(this.board))
            // verify moves if not already done
            .map((move) => move.verified ? move : this.verify(move))
            // retain only verified (aka legal) moves
            .filter((move) => move.verified);
        const castleMoves = figureCastleMoves(this);
        return [...pieceMoves, ...castleMoves];
    }

    private verify(move: InternalMove): InternalMove {
        let newBoard = move.mutations(halfDeepCopy(this.board));

        if (this.sideToMove[0].isThreatened(newBoard)) {
            return move;
        }
        return {...move, verified: true};
    }

    private isTakeOrPawnMove(move: Move): boolean {
        const movingPiece = this.board[squareToIx(move.source)].occupant;
        const targetPiece = this.board[squareToIx(move.target)].occupant;
        return movingPiece?.type === 'pawn' || !!targetPiece;
    }

    public get board() {
        return this.position.board;
    }
    public get sideToMove() {
        return this.position.sideToMove;
    }
    public get castlings() {
        return this.position.castlings;
    }
    public get fullMoves() {
        return this.position.fullMoves || 1;
    }
    public get halfMoves() {
        return this.position.halfMoves || 0;
    }
}