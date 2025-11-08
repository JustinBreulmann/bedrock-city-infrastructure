		import { ActionFormData ,MessageFormData } from "@minecraft/server-ui";
import { exception } from "../../../exceptions/error";

export function arbeitsamt (player) {
	const actionForm = new ActionFormData().title("§u§r§fArbeit§fsamt");
	actionForm.body("Du kannst mehrere Jobs erlernen, aber nur einen aktiv ausüben. Jobs die keine Ausbildung benötigen haben diese Beschränkung nicht!")
	actionForm.button("Feuerwehr","")
	actionForm.button("Polizei","")
	actionForm.button("Stadtwerke","")
	actionForm.button("Markler","")
	actionForm.button("Bänker","")
	actionForm.show(player).then(response => {
		if(response.canceled) return
		const { selection } = response
		if (selection == 0) {
			if(player.hasTag("Feuerwehr") || player.hasTag("offduty:Feuerwehr")) {
				exception('questFinished', player, "")
			}
			else if(player.hasTag('ausbildung:Feuerwehr')) {
				exception('questInProgress', player, "")
			}
			else {
				player.addTag("ausbildung:Feuerwehr")

				new MessageFormData()
		  			.title("[§l§b!§r] Feuerwehr - Ausbildung")
		  			.body(`§7Herzlichen Glückwunsch und herzlich wilkommen bei der §cFeuerwehr§7. \n\nDu kannst dich entscheiden, ob du die Ausbildung jetzt oder zu einen späteren Zeitpunkt beginnen möchtest.`)
		  			.button1("§4Später")
		  			.button2("§2Jetzt beginnen")
		  			.show(player)
		  			.then((res) => {
				if (res.canceled) return;

				if(res.selection == 0) {

				}

				if (res.selection == 1) {
					player.sendMessage("[§l§b!§r] Begib dich zur Feuerwache, um mit der Ausbildung anzufangen")
						player.addTag("x:-508")
						player.addTag("y:75")
						player.addTag("z:194")
				}})}
			}
		})
	}