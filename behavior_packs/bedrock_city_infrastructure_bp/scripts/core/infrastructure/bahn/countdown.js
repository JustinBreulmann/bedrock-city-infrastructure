import { world, system, ItemStack } from "@minecraft/server";
import {drive,getStationEntities} from "./metro"
const countdownStates = {};

export function runCountdown(player, entity) {
    const stationKey = getStationKey(player);
    if (countdownStates[stationKey] && countdownStates[stationKey].running) {
        return;
    }

    let i = 12;
        const station = getStationEntities(player);
        if (!station.length && i >= 2) {
            // If the station is no longer present, stop the countdown
            stopCountdown(player)
            return;
        }

        const stationLocation = station[0].location;
        const rightSideLocation = {
            x: stationLocation.x + 1,
            y: stationLocation.y - 4,
            z: stationLocation.z + 1
        };
        const leftSideLocation = {
            x: stationLocation.x - 1,
            y: stationLocation.y - 4,
            z: stationLocation.z - 1
        };

        let areaX = rightSideLocation
        let areaZ = leftSideLocation

        countdownStates[stationKey] = {
            running: true
        };
        const countdown = system.runInterval(() => {
        if (i == 12) {
            player.dimension.fillBlocks(rightSideLocation, leftSideLocation, "minecraft:yellow_concrete");
        }
        if (i >= 2) {
            player.onScreenDisplay.setActionBar("Station§3 " + station[0].nameTag + "§r - Bahn fährt in§3 " + (i - 2));
        }
        if (i == 2) {
            player.dimension.fillBlocks(rightSideLocation, leftSideLocation, "minecraft:green_concrete");
            if (Array.isArray(entity)) {
                entity.forEach(cart => {
                    drive(player, cart);
                });
            } else {
                drive(player, entity);
            }
            
        }
        if (i == 0) {
            
            player.dimension.fillBlocks( areaX, areaZ , "minecraft:red_concrete");
            stopCountdown(player)
        }
        i--;
    }, 20);

function stopCountdown(player) {
    system.clearRun(countdown);
    countdownStates[stationKey] = { running: false };
}

function getStationKey(player) {
const station = getStationEntities(player);
if (station.length) {
    const stationLocation = station[0].location;
    return `${stationLocation.x}_${stationLocation.y}_${stationLocation.z}`;
}
return null;
    }
}