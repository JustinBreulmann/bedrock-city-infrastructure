import { ActionFormData ,MessageFormData } from "@minecraft/server-ui";
import { ItemStack, system, ItemLockMode, world, BlockPermutation } from "@minecraft/server";
import { loadHotbar } from "../../inventory/hotbar/load";
import { saveHotbar } from "../../inventory/hotbar/save";
import { clearHotbar } from "../../inventory/hotbar/clear";

let foundLocations = [];
let foundDummiesCount = 0;

export function challengeMenu (player) {
	const actionForm = new ActionFormData().title("§u§r§1Challenge");
	actionForm.body("Wer ist der beste Feuerwehrmann? Trete gegen andere Feuerwehrmänner an, um deine Erfahrung unter beweis zu stellen.")
	actionForm.button("Feuer löschen")
	actionForm.button("Menschen retten")
	actionForm.button("Hausbrand")
	actionForm.show(player).then(response => {
		if(response.canceled) return
		const { selection } = response
		if (selection === 0) {
			startExercise(player, "Ubung1", { x: -548, y: 83, z: 171 }, "§eLösche das Feuer so schnell wie möglich", "§eZeit", [], "Herzlichen Glückwunsch! Du hast das Feuer in ");
		}
		
		// Challenge 2 starten
		if (selection === 1) {
			const blockLocations = [
				{x:-563,y: 70,z: 162},
				{x:-545,y: 71,z: 161},
				{x:-539,y: 71,z: 158},
				{x:-521,y: 70,z: 171},
				{x:-566,y: 63,z: 188}, 
				{x:-566,y: 64,z: 52},
				{x:-506,y: 64,z: 178}, 
				{x:-485,y: 63,z: 183},
				{x:-552,y: 73,z: 132},
				{x:-537,y: 72,z: 121}
		];
			startExercise(player, "Ubung2", { x: -548, y: 83, z: 171 }, "§eRette die 10 Dummys so schnell wie möglich aus der Kanalisation", `§7Gefundene Menschen §r§a${foundDummiesCount}§r/10\n§eZeit`, blockLocations, "Herzlichen Glückwunsch! Du hast alle Dummies in ");
		}
		if (selection === 2) {
		}

	})
}

function startExercise(player, tag, location, countdownMessage, timeMessage, blockLocations, successMessage) {
    const players = world.getAllPlayers();
    players.forEach(playertest => {
        if (playertest.hasTag(tag)) {
            player.sendMessage('test.isalready.running');
            return;
        }
    });

    player.addTag(tag);
    saveHotbar(player);
    clearHotbar(player);

	const inventory = player.getComponent('minecraft:inventory').container;

			const lock = new ItemStack("feuerwehr:fire_extinguisher")
			lock.lockMode = ItemLockMode.inventory;
			inventory.setItem(1, lock)

			const tool = new ItemStack("minecraft:iron_shovel")
			tool.lockMode = ItemLockMode.inventory;
			inventory.setItem(0, tool)

			const build = new ItemStack("minecraft:scaffolding", 64)
			build.lockMode = ItemLockMode.inventory;
			inventory.setItem(2, build)

			const axe = new ItemStack("minecraft:iron_axe")
			axe.lockMode = ItemLockMode.inventory;
			inventory.setItem(8, axe)

    let countdown = 10;
    let time = 0;

    player.sendMessage(countdownMessage);
	if(player.hasTag("Ubung1")) {
	player.runCommandAsync("structure load feuerwehr_challenge -558 77 161")
	const rightSideLocation = {x:-559, y:77, z:157}
			const leftSideLocation = {x:-541, y:96, z:182}
			player.runCommandAsync("fill -559 77 157 -541 96 182 campfire replace campfire")
			//player.dimension.fillBlocks(rightSideLocation, leftSideLocation, BlockPermutation.resolve("minecraft:campfire").withState("extinguished", false), { matchingBlock: BlockPermutation.resolve("minecraft:campfire") });
	}
    const challenge = system.runInterval(() => {
        if (countdown >= 0) {
            player.onScreenDisplay.setActionBar(`§eDas Spiel startet in §a${countdown} §eSekunden`);
            player.playSound('random.orb');
            countdown--;
        }

		if (countdown < 0) {
            player.onScreenDisplay.setActionBar(`${timeMessage} §a${time} §eSekunden`);
            time++;

			if(player.hasTag("Ubung2")){
            // Code für die gefundenen Orte
            const currentLocation = blockLocations.find(loc => {
                return (
                    loc.x === Math.floor(player.location.x) &&
                    loc.y === Math.floor(player.location.y) &&
                    loc.z === Math.floor(player.location.z)
                );
            });

            if (currentLocation !== undefined) {
                if (!foundLocations.includes(currentLocation)) {
                    foundLocations.push(currentLocation);
                    foundDummiesCount++; // Increment the found dummies count
                    player.sendMessage(`§aOrt gefunden! (${currentLocation.x}, ${currentLocation.y}, ${currentLocation.z})`);
            
                    if (foundLocations.length === blockLocations.length) {
                        player.sendMessage(successMessage + time + " Sekunden gefunden");
                        player.removeTag(tag);
                    }
                } else {
                    player.sendMessage("Du hast diesen Ort bereits gefunden.");
                }
            }
            
        }

		if(player.hasTag("Ubung1")) {
					testBlocks(player, time)

		}

        // Prüfung, ob der Spieler das Übungsgelände verlassen hat
        const originalLocation = { x: -548, y: 83, z: 171 };
        const distance = Math.sqrt(
            Math.pow(player.location.x - originalLocation.x, 2) +
            Math.pow(player.location.y - originalLocation.y, 2) +
            Math.pow(player.location.z - originalLocation.z, 2)
        );

        if (distance > 50) {
            player.removeTag(tag);
            player.sendMessage(`Du hast das Übungsgelände verlassen!`);
        }

        // Prüfung, ob der Spieler nicht mehr markiert ist
        if (!player.hasTag(tag)) {
            loadHotbar(player);
            system.clearRun(challenge);
        }
	}
    }, 20);
}


import { detectedBlocks } from "../../extensions/config";
async function testBlocks(player, time) {
	let testFailed = false;
  
	detectedBlocks.some(testblock => {
	  let block = world.getDimension("overworld").getBlock(testblock);
	  const blockPerm = block.permutation;
	  const extinguished = blockPerm.getState("extinguished");
  
	  if (extinguished === false) {
		testFailed = true;
	  }
	});
  
	if (!testFailed) {
	  player.sendMessage("Das Feuer auf dem Übungsplatz wurde in " + time + " Sekunden gelöscht!");
	  player.removeTag("Ubung1")
	  //updateRanking(player, time)
	} 
  }

  	
  let first = {x:-524,y: 77, z: 167} // -524 77 167
  let second = {x:-525,y: 77, z: 167}
  let third = {x:-526,y: 77, z: 167}
  let fourth = {x:-527,y: 77, z: 167}
  let fifth = {x:-528,y: 77, z: 167}

  function getRanking(signLocations) {
    let ranking = [];

    for (let i = 0; i < signLocations.length; i++) {
        let block = world.getDimension("overworld").getBlock(signLocations[i]);
        let text = block.getComponent('minecraft:sign').getText();
        ranking.push({ time: parseInt(text[2].substring(2)), index: i });
    }

    return ranking;
}

function updateRanking(player, time) {
    let currentRanking = getRanking([first, second, third, fourth, fifth]);
    updateSigns(currentRanking, [first, second, third, fourth, fifth], player, time);


    // Überprüfen, ob der Spieler bereits auf dem Schild ist
    for (let i = 0; i < currentRanking.length; i++) {
        if (currentRanking[i].name === player.name) {
            // Spieler gefunden, aktualisiere den Wert und sortiere die Rangordnung
            currentRanking[i].time = time;
            currentRanking.sort((a, b) => a.time - b.time);
            updateSigns(currentRanking);
            return;
        }
    }

    // Spieler nicht gefunden, füge ihn zur Rangordnung hinzu
    for (let i = 0; i < currentRanking.length; i++) {
        if (!currentRanking[i].name) {
            currentRanking[i].name = player.name;
            currentRanking[i].time = time;
            currentRanking.sort((a, b) => a.time - b.time);
            updateSigns(currentRanking);
            return;
        }
    }
}

// Funktion zum Aktualisieren der Schilder mit den neuen Daten
function updateSigns(ranking, signLocations, player, time) {
    for (let i = 0; i < ranking.length; i++) {
        let block = world.getDimension("overworld").getBlock(signLocations[i]);
        let text = block.getComponent('minecraft:sign').getText();
        text[1] = '§0' + ranking[i].name;
        text[2] = '§0' + ranking[i].time;
        block.getComponent('minecraft:sign').setText(text);
    }
}