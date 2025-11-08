import {world, system } from "@minecraft/server";
import { getTotaltime } from "../entities/nametag";
import { getScore } from "../extensions/module/getScore";
import { payout } from "../gameplay/job/payout";
import { setup } from "./setup";


export function timer() {
    const players = world.getAllPlayers();
    players.forEach(player => {
        if(world.scoreboard.getObjective('totaltime') === undefined ) {
            setup(player)  
            return
        }
        if(world.scoreboard.getObjective('payout') === undefined ) {
            setup(player) 
            return
        }
        if (!player.hasTag("pause")) {

            world.scoreboard.getObjective('totaltime').setScore(player, getScore(player, "totaltime") + 1);
			world.scoreboard.getObjective('payout').setScore(player, getScore(player, "payout") + 1);
        }

        if (player.hasTag("actionbar_debug") || player.hasTag("driving")) return;

        if (player.hasTag("actionbar_onlinetimer")) {
            if (player.hasTag("pause")) {
                player.onScreenDisplay.setActionBar('§g * Timer pausiert * ');
            } else {
                const { days, hours, minutes, seconds } = getTotaltime(player, "totaltime");
                player.onScreenDisplay.setActionBar('§l ' + days + "d " + hours + "h " + minutes + "m " + seconds + "s");
            }
        }
		if(Number(getScore(player,"payout")) >=  3600) {
			world.scoreboard.getObjective('payout').setScore(player, 1)
			payout(player)
		}
    });
}