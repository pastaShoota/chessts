import { newStartingPos } from "model/position";

var pos = newStartingPos();

// berger
pos = pos.play("E2 E4").play("E7 E5").play("D1 H5").play("B8 C6").play("F1 C4").play("G8 F6").play("H5 F7");

console.log(`ended: ${pos.ended}`);
console.log(`fen: ${pos.toFen()}`);
