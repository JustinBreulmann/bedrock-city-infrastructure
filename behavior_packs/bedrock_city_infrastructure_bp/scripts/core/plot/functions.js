import {binaryToText} from "../../extensions/module/Binary"


import {world,Player,ItemStack,system,ItemTypes} from "@minecraft/server"
import {ActionFormData,MessageFormData,ModalFormData,ActionFormResponse,MessageFormResponse,ModalFormResponse} from "@minecraft/server-ui";

let max = 500;
let price = 100;
let limit = 5;
let land = []
let settings = []

export function getLands(player) {
	if (land.length > 0) { // This should be "lands.length" instead of "land.length"
		land.forEach((e) => { // This should be "lands.forEach" instead of "land.forEach"
		  if (e.owner === player.name) {
			land.push(e);
		  }
		});
	
		if (land.length > 0) {
		  return land;
		}
	}
	return undefined;
}

export function calculatePrice(selectedLand) {

	const sc = (price * (((selectedLand.xmax + 1) - selectedLand.xmin) * ((selectedLand.zmax + 1) - selectedLand.zmin))) * (70 / 100);
	return sc;
  }

  export function runCommand(command) {
	try {
		return { error: false, ...world.getDimension(`overworld`).runCommandAsync(command) };
	} catch (error) {
		return { error: true };
	}
}

export function initSettings() {
	if(world.scoreboard.getObjective('database') === undefined) return 
	world.scoreboard.getObjective('database').getScores().forEach(i => {
		if (i.participant.displayName.match(/(?<=\$setting\()[0-1\s]+(?=\))/g) != null) {
			let json = JSON.parse(binaryToText(i.participant.displayName.match(/(?<=\$setting\()[0-1\s]+(?=\))/g).join("")));
			if (settings.find((c) => c.max == json.max && c.pref == json.pref && c.limit == json.limit && c.price == c.price) == undefined) {
				settings = [];
				settings.push(json);
				max = settings[0].max;
				price = settings[0].price;
				limit = settings[0].limit;
			}
		}
	});
	return { max, price, limit };
}

export { limit, price, max };

export function initDB_Land() {
	if(world.scoreboard.getObjective('database') == undefined) return
	world.scoreboard.getObjective('database').getScores().forEach(i => {
		if (i.participant.displayName.match(/(?<=\$land\()[0-1\s]+(?=\))/g) != null) {
			let json = JSON.parse(binaryToText(i.participant.displayName.match(/(?<=\$land\()[0-1\s]+(?=\))/g).join("")));
			if (land.find((c) => c.name == json.name && c.owner == json.owner && c.dim == json.dim) == undefined) {
				land.push(json);
			}
		}
	});
}

export function isInLand(pos) {
	for (let i = 0; i < land.length; i++) {
		let xz = land[i];
		if (xz.xmin >= pos.xmin && xz.xmax <= pos.xmax && xz.zmin >= pos.zmin && xz.zmax <= pos.zmax && pos.dim === xz.dim) {
			return true;
		}
	}
	return false;
}

export function isInLand2(pos) {
	for (let i = 0; i < land.length; i++) {
		let xz = land[i];
		if (pos.xmin <= xz.xmax && pos.xmax >= xz.xmin && pos.zmin <= xz.zmax && pos.zmax >= xz.zmin && pos.dim === xz.dim) {
			return true;
		}
	}
	return false;
}

export function checkLand(pos) {
	for (let i = 0; i < land.length; i++) {
		let xz = land[i];
		if (xz.xmin <= pos.x && xz.xmax >= pos.x && xz.zmin <= pos.z && xz.zmax >= pos.z && xz.dim == pos.dim) {
			return land[i];
		}
	}
	return undefined;
}

export function getMoney(player) {
	return world.scoreboard.getObjective('Coins').getScore(player.scoreboardIdentity);
}

export function getDim(dim) {
	switch (dim) {
		case "minecraft:overworld":
			return "§2Overworld";
		case "minecraft:nether":
			return "§cNether";
		case "minecraft:the_end":
			return "§5The End";
		default:
			return "§0Unknown";
	}
}