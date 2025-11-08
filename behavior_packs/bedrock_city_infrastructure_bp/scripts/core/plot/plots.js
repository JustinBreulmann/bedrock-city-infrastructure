import {world, system } from "@minecraft/server";

import {checkLand} from "./functions"

export function plots () {

const players = [...world.getPlayers()];
	if (players.length > 0) {
		for (const player of players) {
			if (player.hasTag("actionbar_mode")) {
				let pos = {
					x: Math.floor(player.location.x),
					z: Math.floor(player.location.z),
					dim: player.dimension.id
				};
				let lands = checkLand(pos);
				if (lands != undefined) {
                    player.onScreenDisplay.setActionBar("Grundstück: §e${lands.name}\n§rBesitzer: §e${lands.owner}\n§rKoordinaten: §e(${lands.x1}, ${lands.z1}) (${lands.x2}, ${lands.z2})");
				}
			}
		}
	}
}