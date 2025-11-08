import {world,Player,ItemStack,system,ItemTypes} from "@minecraft/server"
import {ActionFormData,MessageFormData,ModalFormData,ActionFormResponse,MessageFormResponse,ModalFormResponse} from "@minecraft/server-ui";
import {joblist} from "./menu"
import { dispatchmenu } from "./dispatch/menu";

export function Polizei (player) {
    let actionForm = new ActionFormData()
    actionForm.title(`Feuerwehr`)
    actionForm.button("zurück", "textures/icons_apps/back.png")
	actionForm.button("Aufträge", "textures/ui/permissions_member_star.png")
    actionForm.button("Ausrüstung", "textures/ui/mashup_hangar.png")
    actionForm.button("Fahrzeuge", "textures/ui/resistance_effect.png")
    actionForm.button("Funk", "textures/ui/Feedback.png")
    actionForm.show(player).then(response => {
        if(response.canceled) return
        const { selection } = response
        if (selection == 0) {
        joblist(player)
        }
        if (selection == 1) {
            dispatchmenu(player)
        }
		if (selection == 2) {
            player.runCommandAsync(`structure load outfit_polizei ~~1~`)
        }
        if (selection == 3) {
            player.runCommandAsync("execute at @s if block ~~-2~ concrete summon impala:9c11")
            player.runCommandAsync("execute at @s unless block ~~-2~ concrete tellraw @s {\"rawtext\":[{\"text\":\"§cDu musst dich auf einer Straße befinden, um ein Fahrzeug anfodern zukönnen\"}]}")
        }
        if (selection == 4) {
            funk(player, "Polizei", "Polizei")
        }
    })
}