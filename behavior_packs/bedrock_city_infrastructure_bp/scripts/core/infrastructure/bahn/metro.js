import { world, system, ItemStack, BlockPermutation } from "@minecraft/server";
import { spawnMinecarts, despawnMinecarts } from "./minecarts";
import { runCountdown } from "./countdown";

import {loadHotbar} from "../../../inventory/hotbar/load"
import {saveHotbar} from "../../../inventory/hotbar/save"
import {clearHotbar} from "../../../inventory/hotbar/clear"

export function systemMetro(player) {
    const station = getStationEntities(player);

	despawnMinecarts(player);

    if (station.length > 0) {
        if (!player.isRiding) {spawnMinecarts(player, station)}
    }
}

export function getStationEntities(player) {
    return world.getDimension('overworld').getEntities({
        location: player.location,
        maxDistance: 5,
        type: "armor_stand",
        tags: ["station"]
    });
}

export function drive(player, cart) {
        if (!Array.isArray(cart)) {
            cart = [cart]; // Convert to array with a single element
        }
        cart.forEach(entity => {
    
        const drive = system.runInterval(() => {

	if (!entity.isValid()) {
        system.clearRun(drive)
	}
	else {
	  const x = Math.floor(entity.location.x);
	  const y = Math.floor(entity.location.y - 2);
	  const z = Math.floor(entity.location.z);
  
	  const blockLocation = { x, y, z };
	  const block = entity.dimension.getBlock(blockLocation);
	  const signal = entity.dimension.getBlock({x:blockLocation.x,y:blockLocation.y-1,z:blockLocation.z});
  

	  if (block.typeId === "minecraft:magenta_glazed_terracotta" && signal.typeId !== "minecraft:red_concrete" && signal.typeId !== "minecraft:orange_concrete" && signal.typeId !==  "minecraft:pink_concrete") {
		const permutate = block.permutation;
		const blockStates = permutate.getAllStates();
		const facingDirection = blockStates["facing_direction"];

        const ticks = 20;
        const speed = (Math.sqrt(player.getVelocity().x ** 2 + player.getVelocity().z ** 2) * ticks).toFixed(1);

        player.onScreenDisplay.setActionBar(`${speed * 5} m/s`)

		switch (facingDirection) {
		  case 1:
		  case 0:
		  case 3:
			entity.applyImpulse({ x: 0, y: 0, z: -1 }); // South
			break;
		  case 2:
			entity.applyImpulse({ x: 0, y: 0, z: 1 }); // North
			break;
		  case 4:
			entity.applyImpulse({ x: 1, y: 0, z: 0 }); // East
			break;
		  case 5:
			entity.applyImpulse({ x: -1, y: 0, z: 0 }); // West
			break;
		  default:
			break;
		}
	  }
      if (signal.typeId === "minecraft:pink_concrete") {
        railSwitch(player,entity)
        system.clearRun(drive)
        entity.clearVelocity()
	}	
	  if (signal.typeId === "minecraft:red_concrete" || signal.typeId === "minecraft:orange_concrete") {
		entity.clearVelocity()
		runCountdown(player, entity)
        system.clearRun(drive)
	}	
	}
	}, 5);
});
}

function railSwitch(player,entity) {
    saveHotbar(player) 
    clearHotbar(player)
    const inventory = player.getComponent('minecraft:inventory').container

    const left = new ItemStack("minecraft:arrow");
    left.setLore(["§r§btest"]);
    left.nameTag = `§r§f§lFahre Rechts `;
    inventory.setItem(1, left)    

    const middle = new ItemStack("minecraft:name_tag");
    middle.setLore(["§r§btest"]);
    middle.nameTag = `§r§f§lFahre Geradeaus`;
    inventory.setItem(4, middle)  

    const right = new ItemStack("minecraft:blaze_rod");
    right.setLore(["§r§btest"]);
    right.nameTag = `§r§f§lFahre links`;
    inventory.setItem(7, right)  

    let i = 12
    const railSwitch = system.runInterval(() => {
        entity.clearVelocity()
        if (i >= 2) {
        player.onScreenDisplay.setActionBar("§bWeiche: §fWähle in deinem Inventar die Richtung aus §b" + (i-2))
        }
        const switchEntity = getSwitchEntities(player);
        if(i==2) {
            const desiredDirection = getRoute(player);
            const route = determineRoute(entity, desiredDirection);

            clearHotbar(player)
            loadHotbar(player)

            if (route) {
                setRoute(entity, player, switchEntity[0], route);
            }
            else  {
                world.sendMessage("error: cannot detect direction of player")
            }

            player.dimension.fillBlocks({x: switchEntity[0].location.x-3, y:switchEntity[0].location.y-4, z:switchEntity[0].location.z-3}, {x: switchEntity[0].location.x + 3, y:switchEntity[0].location.y-4, z:switchEntity[0].location.z + 3}, "minecraft:green_concrete");            
        }
        if(i==0) {
            player.dimension.fillBlocks({x: switchEntity[0].location.x-3, y:switchEntity[0].location.y-4, z:switchEntity[0].location.z-3}, {x: switchEntity[0].location.x + 3, y:switchEntity[0].location.y-4, z:switchEntity[0].location.z + 3}, "minecraft:pink_concrete");
            system.clearRun(railSwitch)
        }
    i--
    },20)
    
}

function getRoute(player) {
    mainhand = player.getComponent( "inventory" ).container.getItem( player.selectedSlot )

    if (mainhand) {
        switch (mainhand.typeId) {
            case "minecraft:arrow":
                player.sendMessage("§f[§bi§f]§f Fahre nach links!");
                return 2;

            case "minecraft:name_tag":
                player.sendMessage("§f[§bi§f]§f Fahre geradeaus!");
                return 1;

            case "minecraft:blaze_rod":
                player.sendMessage("§f[§bi§f]§f Fahre nach rechts!");
                return 0;

            default:
                player.sendMessage("§f[§bi§f]§f Keine Richtung ausgewählt");
                return 0;
        }
    } else {
        player.sendMessage("§f[§bi§f]§f Kein Gegenstand in der Hand!");
        return 0;
    }
}

function getBlockDirection(entity) {
    const block = entity.dimension.getBlock({x: Math.floor(entity.location.x), y: Math.floor(entity.location.y - 2), z: Math.floor(entity.location.z)});
    if (block.typeId === "minecraft:magenta_glazed_terracotta") {
        const permutate = block.permutation;
        const blockStates = permutate.getAllStates();
        return blockStates["facing_direction"];
    }
    return -1;
}

function getSwitchEntities(player) {
    return world.getDimension('overworld').getEntities({
        location: player.location,
        maxDistance: 7,
        type: "armor_stand",
        tags: ["switch"]
    });
}

function determineRoute(entity, desiredDirection, comingFromDirection) {
    const blockDirection = getBlockDirection(entity);

    if (blockDirection === -1) {
        // Fehler: Kein Leitblock gefunden
        return null;
    }

    const relativeDirection = (blockDirection - desiredDirection + 4) % 4;

    // Definition der Vektoren für die Richtungen
    const straight = { x: 0, z: 1 };
    const right = { x: 1, z: 0 };
    const left = { x: -1, z: 0 };

    const rotateVector = (vector, rotations) => {
        // Funktion zum Drehen des Vektors um 90 Grad im Uhrzeigersinn
        for (let i = 0; i < rotations; i++) {
            const temp = vector.x;
            vector.x = -vector.z;
            vector.z = temp;
        }
        return vector;
    };

    const getFacingDirection = (directionVector) => {
        // Funktion zum Abrufen der facing_direction basierend auf dem Richtungsvektor
        if (directionVector.x === 0 && directionVector.z === 1) {
            return 0; // Geradeaus
        } else if (directionVector.x === 1 && directionVector.z === 0) {
            return 4; // Rechts
        } else if (directionVector.x === -1 && directionVector.z === 0) {
            return 2; // Links
        }
        return -1; // Unerwartete Richtung
    };

    // Anpassen der Richtungen basierend auf der relativen und kommenden Richtung
    const adjustedDirection = rotateVector(straight, relativeDirection);
    const finalDirection = rotateVector(adjustedDirection, comingFromDirection);
    const facingDirection = getFacingDirection(finalDirection);

    return facingDirection;
}



function setRoute(entity, player, switchEntity, route) {
    let cords = [
        { x: switchEntity.location.x - 1, y: switchEntity.location.y - 3, z: switchEntity.location.z - 1 },
        { x: switchEntity.location.x - 1, y: switchEntity.location.y - 3, z: switchEntity.location.z + 1 },
        { x: switchEntity.location.x + 1, y: switchEntity.location.y - 3, z: switchEntity.location.z - 1 },
        { x: switchEntity.location.x + 1, y: switchEntity.location.y - 3, z: switchEntity.location.z + 1 }
    ];

    cords.forEach((block) => {
        const blockState = player.dimension.getBlock({x:block.x, y:block.y, z:block.z});
        if (blockState.typeId === "minecraft:magenta_glazed_terracotta") {
            const permutation = BlockPermutation.resolve(blockState.type.id);
            permutation.withState("facing_direction", route.shift());
            blockState.setPermutation(permutation);
        }
    });
}