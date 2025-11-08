import {ActionFormData,ModalFormData,MessageFormData} from "@minecraft/server-ui"
import { system, world } from "@minecraft/server"
import { addElement } from "../../../dynamicDatabase/add"

export function managedispatch(player) {

	let actionForm = new ActionFormData()
	actionForm.title("§r§dVerwalte Aufträge§r")
	
	actionForm.button("§r§ahinzufügen§r")
	if (player.hasTag("Bürgermeister")) {
	actionForm.button("§r§cRemove dispatch§r")
	}

	actionForm.show(player).then(actionFormResponse => {
		const { selection } = actionFormResponse
		if(selection.selection == 0){
			setdispatch(player)
		}})}
		
		
export function setdispatch(player) {
		let form = new ModalFormData()
		const x = Math.floor(player.location.x)
		const y = Math.floor(player.location.y)
		const z = Math.floor(player.location.z)
		const jobs = ["Feuerwehr", "Polizei" ,"Stadtwerke"]
		form.title("§r§8Auftrag - Erstellen§r")
		form.dropdown("\n§l      --------------------      §r  Sende Aufträge an verschiedene \n               Organisationen\n §l      --------------------      §l§8Job", jobs)
		form.textField("§l§8Beschreibung", "text.type_here")
		form.show(player).then((response) => {
			if (response.canceled) return player.sendMessage(`§cMenu geschlossen!`)
				if (!response.formValues[1] == "") {

					const dispatch = {
						rank: jobs[response.formValues[0]],
						msg:response.formValues[1],
						x: x,
						y: y,
						z: z,
						name: player.name
					  };
		const rank = `dispatch:${response.formValues[0]},`					
		const msg = `message:${response.formValues[1]},`
		const position = `x:${x},y:${y},z:${z},`
		const dispatchTag = rank + msg + position + `name:${player.name}`
		addElement("dispatch",dispatch, player)
				  player.addTag(dispatchTag);
				  player.sendMessage(`§f[§b§li§r]§7 Du hast einen Auftrag an §6${rank.replace("dispatch:","")} §7mit der Nachricht §6${msg.replace("message:","")}§7 (${position}) geschickt`);
				  player.playSound("random.toast")
				}
				if(response.formValues[2] == "") return player.sendMessage(`§cFülle alle Angaben aus!`)
			})
		}
export function dispatch (player) {
	const x = Math.floor(player.location.x)
	const y = Math.floor(player.location.y)
	const z = Math.floor(player.location.z)

	const rank = `dispatch:0,`;
	const msg = `message:Feuermelder,`;
	const position = `x:${x},y:${y},z:${z},`;
	const dispatchTag = rank + msg + position + `name:${player.name}`;
	
	player.addTag(dispatchTag);
	player.sendMessage(`§f[§b§li§r]§7Du hast Feuermeldeanlage bei §c${position}§7 ausgelöst`);
	player.playSound("random.toast")
}

export function wanted (player) {
	const x = Math.floor(player.location.x)
	const y = Math.floor(player.location.y)
	const z = Math.floor(player.location.z)

	const rank = `dispatch:1,`;
	const msg = `message:Tresor`;
	const position = `x:${x},y:${y},z:${z},`;
	const dispatchTag = rank + msg + position + `name:${player.name}`;
	player.addTag(dispatchTag);
	player.sendMessage(`§f[§b§li§r]§ DDu hast den Alarm der Bank ausgelöst`);
	player.playSound("random.toast")
}