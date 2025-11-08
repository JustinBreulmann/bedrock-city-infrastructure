import { world, system, ItemStack } from "@minecraft/server";
import { runCountdown } from "./countdown";

function getMinecarts(station) {
    return world.getDimension('overworld').getEntities({
        location: station[0].location,
        maxDistance: 5,
        type: "minecart"
    });
}
export function spawnMinecarts(player, station) {
    const minecart = getMinecarts(station);
    let leftOffset = { x: 0, z: 0 };
    let rightOffset = { x: 0, z: 0 };

    if (minecart.length === 0) {
        const direction = station[0].getViewDirection();
        const stationLocation = station[0].location;

        if (direction.x > 0) {
            leftOffset.z = 1;
            rightOffset.z = -1;
        } else if (direction.x < 0) {
            leftOffset.z = -1;
            rightOffset.z = 1;
        } else if (direction.z > 0) {
            leftOffset.x = -1;
            rightOffset.x = 1;
        } else if (direction.z < 0) {
            leftOffset.x = 1;
            rightOffset.x = -1;
        }

        const leftSideLocation = {
            x: stationLocation.x + leftOffset.x,
            y: stationLocation.y,
            z: stationLocation.z + leftOffset.z
        };

        const rightSideLocation = {
            x: stationLocation.x + rightOffset.x,
            y: stationLocation.y,
            z: stationLocation.z + rightOffset.z
        };

        const isLeftBlockValid = station[0].dimension.getBlock({x:leftSideLocation.x,y:leftSideLocation.y-3,z:leftSideLocation.z}).typeId === "minecraft:magenta_glazed_terracotta";
        const isRightBlockValid = station[0].dimension.getBlock({x:rightSideLocation.x,y:rightSideLocation.y-3,z: rightSideLocation.z}).typeId === "minecraft:magenta_glazed_terracotta";
        const cartRight = world.getDimension('overworld').spawnEntity("minecart", rightSideLocation);
        const cartLeft = world.getDimension('overworld').spawnEntity("minecart", leftSideLocation);
        if (isLeftBlockValid) {
            cartLeft
        }

        if (isRightBlockValid) {
            cartRight
        }
        runCountdown(player, [cartRight, cartLeft]);
    }
}

export function despawnMinecarts(player) {
    const minecarts = world.getDimension('overworld').getEntities({
        location: player.location,
        minDistance: 6,
        maxDistance: 20,
        type: "minecart"
    });

    minecarts.forEach(cart => {
        const getRide = (cart) => {
            return cart.getComponent("minecraft:riding")?.entityRidingOn;
        }

        const rider = getRide(cart);

        if (rider !== player) {
            cart.remove();
        }
    });
}