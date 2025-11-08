import { world, Player, ItemStack, system, ItemTypes } from "@minecraft/server";
import { ActionFormData, MessageFormData, ModalFormData, ActionFormResponse, MessageFormResponse, ModalFormResponse } from "@minecraft/server-ui";
import { getScore } from "../../../extensions/module/getScore";
import { actionbar, currency } from "../../../extensions/config";
import { joblist } from "../menu";
import { jobMenu } from "../jobMenu";
import { addMoney } from "../../money/animation";
  
export function Banker(player) {
    let actionForm = new ActionFormData();
    actionForm.title(`§aBänker`);
    actionForm.button("§cZurück", "textures/icons_apps/back.png");
    actionForm.button("Geldstand Spieler", "textures/ui/village_hero_effect.png");
    actionForm.button("Kredit ausstellen", "textures/items/paper.png");
    actionForm.button("Wertanlagen", "textures/ui/MCoin.png");
    {
        if (player.hasTag("Banker_WSH"))
            actionForm.button("WestSideBanking", "textures/icons_apps/bank.png");
    }
    {
        if (player.hasTag("Bänker"))
            actionForm.button("The Green Bank", "textures/icons_apps/bank.png");
    }
    actionForm.show(player).then(actionFormResponse => {
        if (actionFormResponse.canceled) return;
        const { selection } = actionFormResponse;
        if (selection == 0) {
            jobMenu(player);
        }
        if (selection == 1) {
            displayPlayersMoney(player);
        }
        if (selection == 2) {
            Kredit(player);
        }
        if (selection == 3) {
            Grundstück(player);
        }
        if (selection == 4) {
            Verwaltung(player);
        }
    });
}
function Verwaltung(player) {
    let actionForm = new ActionFormData();
    actionForm.title(`§0Bänker`);
    actionForm.body("§l§8Einstellungen der Bank")
    actionForm.button("Geldstand");
    actionForm.button("Tresor");
    actionForm.button("§cZurück", "textures/icons_apps/back.png");
    actionForm.show(player).then(actionFormResponse => {
        if (actionFormResponse.canceled) return;
        const { selection } = actionFormResponse;
        const bank = world.getDynamicProperty("bank")
        if (bank === undefined) {
            world.setDynamicProperty("bank", "WSH:0,GOK:0:000000")
        }
        const WSH = bank.split(",")[0]
        const GreenOaks = bank.split(",")[1]
        if (selection == 0) {
            if (player.hasTag("Bänker")) {
                player.sendMessage(`[§a§li§r] Der Geldstand beträgt: §a${GreenOaks.split(":")[1]} Coins`)
            }
            if (player.hasTag("Banker_WSH")) {
                player.sendMessage(`[§a§li§r] Der Geldstand beträgt: §a${WSH.split(":")[1]} Coins`)
            }
        }
        if (selection == 1) {
            resetPassword(player)
        }
    })
}


export function Kredit(player) {
    let form = new ModalFormData();
    let playerNameList = Array.from(world.getPlayers(), plr => plr.name);
    form.title(`title.smartphone_bank`);
    form.dropdown("text.players_online", playerNameList);
    form.slider("Coins", 10000, 100000, 10000);
    form.slider("raten", 1000, 10000, 100);
    form.show(player).then((response) => {
        if (response.canceled) return;
        if (playerNameList[response.formValues[0]] == player.name && response.formValues[1] > 0) {
            player.sendMessage(`§cDu kannst dir keinen Kredit ausstellen.`);
        }

        let tags = player.getTags().filter((t) => t.startsWith("kredit:"));
        if (tags.some(tag => !player.hasTag(tag))) {
            player.sendMessage(`§cEin §4Konto§c wird benötigt, um einen Kredit beanspruchen zu können.`);
        } else {

            const selectedPlayerName = playerNameList[response.formValues[0]]
            const selectedPlayer = world.getPlayers().find(player => player.name === selectedPlayerName)

            selectedPlayer.addTag(`"kredit:${response.formValues[1]}, ${response.formValues[2]}"`);
                addMoney(selectedPlayer, response.formValues[1])
                selectedPlayer.sendMessage(`§a §fDu hast einen Kredit von §a${response.formValues[1]} Coins §faufgenommen"`);
        }
    });
}

export function resetPassword(player) {
    let form = new ModalFormData();
    form.title(`Passwort ändern`);
    form.textField(`\n§lPasswort`, GreenOaks.split(":")[2]);
    form.show(player).then(response => {
        if (response.canceled) return;
        const newPassword = response.formValues[0];
        if (newPassword.length < 5 || newPassword.length > 10 || !/^[0-9a-zA-Z]+$/.test(newPassword)) {
            player.sendMessage("§a§lBänker §8>> §r§7 Das Passwort muss zwischen 5 und 10 Zeichen lang sein und darf nur Buchstaben und Zahlen enthalten.");
        } else {
            const newBank = `${WSH},${GreenOaks.split(":")[0]}:${GreenOaks.split(":")[1]}:${newPassword}`;
            world.setDynamicProperty("bank", newBank);
            player.sendMessage("§a§lBänker §8>> §r§7 Passwort erfolgreich geändert.");
        }
    })
}

export function displayPlayersMoney() {
    const players = Array.from(world.getPlayers());
	let message = "§a-- §2§lGeldstand §a--";
	for (let i = 0; i < players.length; i++) {
	  let playerName = players[i].name;
      let money = getScore(players[i], currency, players[i]);
      message = message + "\n§r+ " + playerName +  "§a " + money + "$";
	}
	// Send the message to each player
	players.forEach(player => {
	  player.sendMessage(message);
	});
  }

  function Grundstück(player) {
    let form = new ModalFormData();
    let tags = player.getTags();
    let filteredTags = tags.filter(t => t.startsWith("pos1"));
    let filteredTags1 = tags.filter(t => t.startsWith("pos2"));
    let tag = filteredTags.length > 0 ? filteredTags[0].split(",") : [];
    let tag1 = filteredTags1.length > 0 ? filteredTags[0].split(",") : [];
    form.title(`Grundstücke`);
    form.textField(`Erstelle ein Grundstück\n§l§8Position 1 §7(${tag[1]} ${tag[2]} ${tag[3]})`, `${tag[1]} ${tag[2]} ${tag[3]}`)
    form.textField(`§l§8Position 2 §7(${tag1[1]} ${tag1[2]} ${tag1[3]})`, `${tag1[1]} ${tag1[2]} ${tag1[3]}`)
    form.textField("§l§8Name", "text.type_here")
    form.slider("Preis", 1000, 100000, 100);
    form.show(player).then((response) => {
        if (!/^(-?\d{2,3} -?\d{2,3} -?\d{2,3})$/.test(response.formValues[0])) {
        } else if (!/^(-?\d{2,3} -?\d{2,3} -?\d{2,3})$/.test(response.formValues[1])) {
        } else if (!/^[a-zA-Z0-9]{1,10}$/.test(response.formValues[2])) {
            player.sendMessage("§2§lBank§8 >>§r§7 Mehr als 10 Buchstaben oder Sonderzeichen im Namen");
        } else {
            let GS = `${response.formValues[0]},${response.formValues[1]}, ${response.formValues[3]}`;
            const stringify = JSON.stringify(GS);
            player.sendMessage(`§2§lBank§8 >>§r§7Grundstück:${response.formValues[2]}, ${stringify}`);
            world.setDynamicProperty('Grundstück', stringify);

            const res = world.getDynamicProperty('Grundstück');
            if (res) {
                const parse = JSON.parse(res).split(",");
                const Name = parse[0];
                const Koordinaten1 = parse[1];
                const x1 = Koordinaten1.split(" ")[0];
                const y1 = Koordinaten1.split(" ")[1];
                const z1 = Koordinaten1.split(" ")[2];

                const Koordinaten2 = parse[2];
                const x2 = Koordinaten2.split(" ")[0];
                const y2 = Koordinaten2.split(" ")[1];
                const z2 = Koordinaten2.split(" ")[2];

                const Preis = parse[3];

                player.sendMessage(`${parse} is registered`);
                player.sendMessage(`${Name} ${x1}, ${y1}, ${z1}, ${Preis}`);
            }
        }
    });
}