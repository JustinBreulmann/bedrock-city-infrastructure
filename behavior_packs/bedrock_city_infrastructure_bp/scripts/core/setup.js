import {world, system,ItemStack } from "@minecraft/server";
import { getScore } from "../extensions/module/getScore";

export function introduction() {
    world.afterEvents.playerSpawn.subscribe((data)=>{
        if(!player.hasTag("setup")) setup(data.player)
            data.player.sendMessage(String(data.initialSpawn))

    world.afterEvents.playerSpawn.unsubscribe(data);
})
}


export function setup(player) {
    player.addTag("setup")
    const scoreboard = world.scoreboard;

    addScoreboardObjectives(scoreboard);
    addInitialScoreboardValues(player);
}

const objectives = ["Coins", "database", "Tick", "BahnTimer", "totaltime", "konto","payout", "rent"];

function addScoreboardObjectives(scoreboard) {    
    const displayNames = ["Money", "Database", "tick", "BahnTimer", "totaltime", "Konto", "payout", "rent"];
    system.runInterval(() => {
        for (let i = 0; i < objectives.length; i++) {
            try {
                scoreboard.addObjective(objectives[i], displayNames[i]);
            } catch (error) {
            }
        }
    });
}



export function addInitialScoreboardValues(player) {

    for (const objective of objectives) {
        world.scoreboard.getObjective(objective).setScore(player, getScore(objective) + 0);
    }
}