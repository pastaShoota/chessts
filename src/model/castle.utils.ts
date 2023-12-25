import { halfDeepCopy, squareEqual, squareToIx } from "./board.utils";
import { Move, InternalMove, Castle, Board } from "./definitions";
import { moveFromString } from "./piece.utils";
import { Position } from "./position";

type PreCastle = Omit<Castle, 'mutations'>;

const PRE_CASTLES: PreCastle[] = [
    {
        id: 'q',
        color: 'black',
        involvedSquares: ['A8', 'E8'],
        move: moveFromString("E8 C8"),
    },
    {
        id: 'k',
        color: 'black',
        involvedSquares: ['H8', 'E8'],
        move: moveFromString("E8 G8"),
    },
    {
        id: 'Q',
        color: 'white',
        involvedSquares: ['A1', 'E1'],
        move: moveFromString("E1 C1"),
    },
    {
        id: 'K',
        color: 'white',
        involvedSquares: ['H1', 'E1'],
        move: moveFromString("E1 G1"),
    },
];

const CASTLES: Castle[] = PRE_CASTLES.map((preCastle) => {
    return {...preCastle, mutations: castleMutations(preCastle)}
});

export function reevaluateCastlings(castlingRights: string, move: Move): string {
    let result = castlingRights;
    // remove castling right if the move involves a square which belongs to a piece of that castle
    CASTLES.filter((castle) => castlingRights.includes(castle.id))
        .forEach((castle) => {
            if ([move.source, move.target].find((moveSquare) => 
                castle.involvedSquares.find((castleSquare) => squareEqual(moveSquare, castleSquare)))) {
                result = result.replace(castle.id, '');
            }
        });
    return result;
}

export function figureCastleMoves(position: Position): InternalMove[] {
    const availableCastles: Castle[] = CASTLES.filter((castle) => position.castlings.includes(castle.id))
    .filter((castle) => castle.color === position.sideToMove[0].color)
    .filter(() => !position.sideToMove[0].isThreatened(position.board))
    .filter((castle) => {
        const minKingIx = Math.min(squareToIx(castle.move.source), squareToIx(castle.move.target));
        const maxKingIx = Math.max(squareToIx(castle.move.source), squareToIx(castle.move.target));
        for (let i = minKingIx; i <= maxKingIx; i++) {
            if (position.sideToMove[0].isThreatened(position.board, position.board[i])) {
                // passing square threatened -> discard
                return false;
            }
        }
        return true;
    })
    .filter((castle) => {
        const minCastleIx = Math.min(...castle.involvedSquares.map(squareToIx));
        const maxCastleIx = Math.max(...castle.involvedSquares.map(squareToIx));
        for(let i = minCastleIx+1; i < maxCastleIx; i++) {
            if(position.board[i].occupant) {
                // piece in the way -> discard
                return false;
            }
        }
        return true;
    });

    return availableCastles.map((castel) => {
        return {
            source: castel.move.source,
            target: castel.move.target,
            mutations: castel.mutations,
            verified: true,
        }
    })
}

function castleMutations(castle: PreCastle): (board: Board) => Board {
    return (board: Board) => {
        const targetBoard = halfDeepCopy(board);
        const rookTargetIx = (squareToIx(castle.move.source) + squareToIx(castle.move.target)) / 2;
        let rookSourceIx = null;
        castle.involvedSquares.forEach((square) => {
            if (targetBoard[squareToIx(square)].occupant?.type === 'rook') {
                rookSourceIx = squareToIx(square);
            }
            delete targetBoard[squareToIx(square)].occupant;
        });
        if (rookSourceIx == null) {
            throw new Error("no rook detected to perform castle mutations");
        }
        targetBoard[squareToIx(castle.move.target)].occupant = board[squareToIx(castle.move.source)].occupant;
        targetBoard[rookTargetIx].occupant = board[rookSourceIx].occupant;
        return targetBoard;
    }
}