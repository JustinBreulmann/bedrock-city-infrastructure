import {world,Player,ItemStack,system,ItemTypes} from "@minecraft/server"
import {ActionFormData,MessageFormData,ModalFormData,ActionFormResponse,MessageFormResponse,ModalFormResponse} from "@minecraft/server-ui";
import {joblist} from "./menu"
import { dispatchmenu } from "./dispatch/menu";
import { jobMenu } from "./jobMenu";

export function Feuerwehr(player) {
    let actionForm = new ActionFormData()
    actionForm.title(`Feuerwehr`)
    actionForm.button("§cZurück", "textures/icons_apps/back.png")
	actionForm.button("Aufträge", "textures/ui/icon_trending")
    actionForm.button("Ausrüstung", "textures/ui/mashup_hangar.png")
    actionForm.button("Fahrzeuge", "textures/ui/fire_resistance_effect.png")
    actionForm.button("Funk", "textures/ui/Feedback.png")
    actionForm.show(player).then(actionFormResponse => {
        if(actionFormResponse.canceled) return
        const { selection } = actionFormResponse
        if (selection == 0) {
        jobMenu(player)
        }
        if (selection == 1) {
            dispatchmenu(player)
        }
		if (selection == 2) {
            player.runCommandAsync(`structure load outfit_Feuerwehr ~~1~`)
        }
        if (selection == 3) {
            world.getDimension("overworld").spawnEntity("firetruck:state1", playerLocation);
        }
        if (selection == 4) {
        funk(player, "Feuerwehr", "Feuerwehr")
        }
    })
}
export function funk(player, job, tag) {
    let form = new ModalFormData();
    form.title(`Funk`);
    form.dropdown(`\nAlternativ kannst du auch "@` +tag + `" <Nachricht> nutzen \n\n§l§8Art`, ["Meldung", "Anfrage", "Warnung"]);
    form.textField("§l§8Nachricht", "text.type_here");

    form.show(player).then((response) => {
        if (response.canceled) return;

        for (const player of world.getAllPlayers()) {

        const isFeuerwehr = player.hasTag(tag);

        if (response.formValues[0] == 0) {
            message = "Meldung"
        }
        
        if (response.formValues[0] == 1) {
            message = "Anfrage"
        }
        
        if (response.formValues[0] == 2) {
            message = "Warnung"
        }

            if (isFeuerwehr) {
                player.sendMessage(`§f§l[§b ` +job.charAt(0) + `§f-Funk  §r] Meldung §8>>§r§7 ${response.formValues[1]}`);
            }
        }
    });

}
