import {world,Player,ItemStack,system,ItemTypes} from "@minecraft/server"
import {ActionFormData,MessageFormData,ModalFormData,ActionFormResponse,MessageFormResponse,ModalFormResponse} from "@minecraft/server-ui";

import {settings} from "./settings"
import { DebugSettings } from "../../../core/debug/menu";
import {managedispatch} from "../../job/dispatch/setting"
import {floatingTextMenu} from "../../../core/text";
import {setLore} from "../../../core/setlore"
import { AdminMenu } from "../../../extensions/chestUI/adminItem";
import { playerlist } from "../../../core/playermanagement";

export function Admin(player) {
	let functions = []
	let actionForm = new ActionFormData()
	actionForm.title("Server Verwaltung")
	actionForm.body("")
	{
		actionForm.button("§l§8Zurück§r\nEinstellungen", "textures/icons_apps/back.png")
		functions.push(r => {
			settings(player)
		})
	}
	{
		actionForm.button("§l§8Spielerliste§r\nBearbeite Spieler", "textures/ui/book_edit_default.png")
		functions.push(r => {
			playerlist(player)
		})
	}
	
	{
		actionForm.button("§l§8Debug§r\nVerwaltung der Daten", "textures/ui/hammer_l")
		functions.push(r => {
			DebugSettings(player)
		})
	}	
	{
		actionForm.button("§l§8Text§r\nErstelle  fliegende Texte", "textures/ui/text_color_paintbrush")
		functions.push(r => {
			floatingTextMenu(player);
		})
	}	
	{
		actionForm.button("§l§8Item§r\nBeschrifte Items", "textures/items/name_tag")
		functions.push(r => {
			setLore(player);
		})
	}
	{
		actionForm.button("§l§8Items§r\nAdmin Items", "textures/blocks/barrier")
		functions.push(r => {
			AdminMenu(player);
		})
	}
	actionForm.show(player).then(r => {
		if(r.canceled) return 
		functions[r.selection]()
	})
  }