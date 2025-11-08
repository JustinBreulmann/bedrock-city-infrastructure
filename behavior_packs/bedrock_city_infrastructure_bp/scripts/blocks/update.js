import {world, system } from "@minecraft/server";

export function updateBlock() {
	for (let player of world.getPlayers()) {
        const centerX = Math.floor(player.location.x);
        const centerY = Math.floor(player.location.y);
        const centerZ = Math.floor(player.location.z);
        const radius = 3
    
        for (let x = centerX - radius; x <= centerX + radius; x++) {
            for (let y = centerY - radius; y <= centerY + radius; y++) {
                for (let z = centerZ - radius; z <= centerZ + radius; z++) {
                    const blockLocation = { x, y, z };
                    const block = player.dimension.getBlock(blockLocation);
                    if(block.type.id === "hf:curtain" || block.type.id === "hf:gamingpc") return
                    if (block.type.id.includes("dbc:")) {
                        const permutate = block.permutation;
                        const blockStates = permutate.getAllStates();
                        const state3 = JSON.stringify(blockStates, null, 2)
                        const newCustomBlockName = block.type.id.replace("dbc:", "block:");

                        player.runCommandAsync(`setblock ${x} ${y} ${z} ${newCustomBlockName} `);
                        player.sendMessage(`§7[§61§7.§619§7.§64§7] §7Upgrading Block bei §6${x}, ${y}, ${z} §7zu §6${newCustomBlockName}`);
                    }
                    if (block.type.id.includes("hf:")) {
                        const permutate = block.permutation;
                        const blockStates = permutate.getAllStates();
                        const state3 = JSON.stringify(blockStates, null, 2)
                        const newCustomBlockName = block.type.id.replace("hf:", "block:");

                        player.runCommandAsync(`setblock ${x} ${y} ${z} ${newCustomBlockName}`);
                        player.sendMessage(`§7[§61§7.§619§7.§64§7] §7Upgrading Block bei §6${x}, ${y}, ${z} §7zu §6${newCustomBlockName}`);
                    }
                    if (block.type.id.includes("loled:")) {

                        if(block.type.id === "loled:manhole" || "loled:public_telephone" || "loled:trash_receptacle_full") {
                            player.runCommandAsync(`setblock ${x} ${y} ${z} air `);

                        }

                        const permutate = block.permutation;
                        const blockStates = permutate.getAllStates();
                        const newCustomBlockName = block.type.id.replace("loled:", "block:").replace("setup_","")

                        player.runCommandAsync(`setblock ${x} ${y} ${z} ${newCustomBlockName}`);
                        player.sendMessage(`§7[§61§7.§619§7.§64§7] §7Upgrading Block bei §6${x}, ${y}, ${z} §7zu §6${newCustomBlockName}`);
                    }
                    if (block.type.id.includes("leaves")) {
                        const permutate = block.permutation;
                        const blockStates = permutate.getAllStates();
                    
                        for (let state in blockStates) {
                            let value = blockStates[state];
                    
                            if (state === "persistent_bit" && value === false) {
                                value = true; 
                                block.setPermutation(block.permutation.withState(state, value));
                            }
                            if (state === "update_bit" && value === true) {
                                value = false; 
                                block.setPermutation(block.permutation.withState(state, value));
                            }
                    
                        }
                    }
            }
        }
    }
}
}