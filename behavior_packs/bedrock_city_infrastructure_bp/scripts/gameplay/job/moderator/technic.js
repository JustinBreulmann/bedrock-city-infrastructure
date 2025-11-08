import {world,Player,ItemStack,system,ItemTypes} from "@minecraft/server"
import {ActionFormData,MessageFormData,ModalFormData,ActionFormResponse,MessageFormResponse,ModalFormResponse} from "@minecraft/server-ui";
import { Studio } from "../../../extensions/config";
import { jobMenu } from "../jobMenu";
import { studioFahrstuhlDown, studioFahrstuhlUp } from "../../../core/infrastructure/studio/fahrstuhl";

export function technic(player) {
	let actionForm = new ActionFormData()
	actionForm.title(`Moderator`)
	actionForm.body(`Text`)
	actionForm.button("button.back", "textures/icons_apps/back.png")
	actionForm.button("button.Studio_laden", "textures/items/studio.png")
	actionForm.button("button.Fahrstuhl_hoch", "textures/items/oben.png")
	actionForm.button("button.Fahrstuhl_runter", "textures/items/unten.png")
	actionForm.button("button.Studio_1", "textures/items/1.png")
	actionForm.button("button.Studio_2", "textures/items/2.png")
	actionForm.show(player).then(actionFormResponse => {
		if (actionFormResponse.canceled) return
		const { selection } = actionFormResponse
		if (selection == 0) {
			jobMenu(player)
		}
		if (selection == 1) {
			player.runCommandAsync("clone -205 62 147 -199 65 155 -206 69 137")
		}
		if (selection == 2) {
			studioFahrstuhlUp(player)
		}
		if (selection == 3) {
			studioFahrstuhlDown(player)
		}
		if (selection == 4) {
			player.teleport(Studio["studio1"])
			player.sendMessage("§4§lChannel§f4 §8>>§r§7 Du wurdest ins Studio 1 telepotiert")
		}
		if (selection == 5) {
			player.teleport(Studio["studio2"])
			player.sendMessage("§4§lChannel§f4 §8>>§r§7 Du wurdest ins Studio 2 telepotiert")
		}
	})
  }