import { studioFahrstuhlDown, studioFahrstuhlUp } from "../core/infrastructure/studio/fahrstuhl";
import { vault } from "./vault";
import {ahFahrstuhlDown, ahFahrstuhlUp} from "../core/infrastructure/autohaus/fahrstuhl"


export function dedicatedTeleport(player, blockLocation)  {
		
	if (blockLocation.x === -84 && blockLocation.y === 76 && blockLocation.z === 150 && block.type.id === "minecraft:stone_button") {
		system.run(() => {
			ahFahrstuhlDown(player)
		})
	}
	if (blockLocation.x === -84 && blockLocation.y === 69 && blockLocation.z === 150 && block.type.id === "minecraft:stone_button")  {
		system.run(() => {
			ahFahrstuhlUp(player)
		})
	}
	if ((blockLocation.x === -207 && blockLocation.y === 70 && blockLocation.z === 141) && block.type.id === "minecraft:stone_button") {
		system.run(() => {
			studioFahrstuhlDown(player)
		})
	}
	//-203 62 141
	if (blockLocation.x === -203 && blockLocation.y === 62 && blockLocation.z === 141 && block.type.id === "minecraft:stone_button")  {
		system.run(() => {
			studioFahrstuhlUp(player)
		})
	}

	if ((blockLocation.x === -210 && blockLocation.y === 80 && blockLocation.z === -6) && block.type.id === "minecraft:wooden_button") {
		system.run(() => {
			vault(player)
		})
	}
	if ((blockLocation.x === -210 && blockLocation.y === 80 && blockLocation.z === -6) && block.type.id === "minecraft:stone_button") {
		system.run(() => {
			player.runCommandAsync("clone -207 57 19 -204 60 26 -212 79 -11")
		})
	}
}