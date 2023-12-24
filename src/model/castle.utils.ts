import { squareEqual } from "./board.utils";
import { Move, CASTLES } from "./definitions";

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