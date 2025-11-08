import { world, system } from "@minecraft/server";
import { getScore } from "../../extensions/module/getScore";

export function addMoney(player, amount) {
    const Coins = getScore(player, "Coins");
    world.sendMessage(Coins.toString())
    if (player.hasTag("want_notific")) {
        let displayAmount = Math.abs(amount); // Betrag für die Animation

        if (displayAmount > 20) {
            let step = Math.floor(displayAmount / 20); // Schritte für die Animation
            let remainder = displayAmount % 20; // Rest für den letzten Schritt

            const intervalId = animate(player, step, amount, Coins);
        }
    }
    // Aktualisierung des Spielerkontostands
    world.scoreboard.getObjective('Coins').setScore(player, Coins + amount);
}

function animate(player, step, amount, Coins) {
    let i = 0;
    const intervalId = system.runInterval(() => {
        let message = "§a" + (Coins + step * i);
        if (amount < 0) {
            message = "§c" + (Coins - step * i);
        }
        player.onScreenDisplay.setActionBar(message);
        i++;
        
        if (i >= 20) {
            system.clearRun(intervalId); // Clear the interval when animation completes
            let finalMessage = "§a+§f " + (amount);
            if (amount < 0) {
                finalMessage = "§c-§f " + (amount * (-1));
            }
            player.onScreenDisplay.setActionBar(finalMessage);
        }
    }, i * 30);

    return intervalId;
}
