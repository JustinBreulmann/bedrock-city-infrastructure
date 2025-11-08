import { world, Player, ItemStack, system, ItemTypes, BlockPermutation } from "@minecraft/server";

import { getScore } from "../extensions/module/getScore";

export function sitting(player, block) {
  const originalLocation = block.location; // Speichere die ursprüngliche Position des Blocks
  const x = originalLocation.x + 0.5;
  const y = originalLocation.y + 0.5;
  const z = originalLocation.z + 0.5;

  player.teleport({x: x, y: y, z: z}); // Teleportiere den Spieler in die Mitte des Blocks

  function playSitAnimation() {
     player.playAnimation(`animation.player.sit`, { duration: 30, blendOutTime: 5, stopExpression: "query.is_sneaking"});
     player.onScreenDisplay.setActionBar("§7Du §bsitzt §7nun");
  }

  playSitAnimation(); // Starte die Animation zu Beginn

  const intervalInstance = system.runInterval(() => {
     const playerPosition = player.location; // Aktuelle Position des Spielers
     
     const distance = Math.sqrt(
        Math.pow(playerPosition.x - originalLocation.x, 2) +
        Math.pow(playerPosition.y - originalLocation.y, 2) +
        Math.pow(playerPosition.z - originalLocation.z, 2)
     );

     if (player.isSneaking || distance > 1) {
      player.onScreenDisplay.setActionBar("§7Du sitzt §bnicht §7mehr!");
        system.clearRun(intervalInstance); // Stoppe das Interval, wenn der Spieler sich duckt oder mehr als 2 Blöcke entfernt ist
        player.playAnimation(`animation.player.sneaking`);
     } else {
        playSitAnimation(); // Setze die Animation fort, wenn der Spieler nicht duckt und sich innerhalb des Bereichs befindet
     }
  });
}
