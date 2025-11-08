import {ActionFormData} from "@minecraft/server-ui";
import {home} from "./home"
import {Admin} from "./admin"

function removeTags(player) {
	player.removeTag("actionbar_debug")
	player.removeTag("actionbar_mode")
	player.removeTag("actionbar_onlinetimer")
}


export function settings(player) {
	let functions = []
	let actionForm = new ActionFormData()
	actionForm.title("Einstellungen")
	actionForm.body("§l      --------------------      §rVerwalte die Benachtichtungen, die du \n                bekommen wirst\n§l      --------------------      ")
	{
		actionForm.button("§r§l§cZurück§r\nHauptmenu", "textures/icons_apps/back.png")
		functions.push(r => {
			home(player)
		})
	}
	if (!player.hasTag("want_notific")) {
		actionForm.button("§8§lBenachrichtungen §caus\n§rTipps, Benachrichtungen, Fortschritte", "textures/icons_apps/notific_off.png")
		functions.push(r => {
			player.addTag("want_notific")
			settings(player)
		})
	}
	if (player.hasTag("want_notific")) {
		actionForm.button("§8§lBenachrichtigungen §aan\n§rTipps, Benachrichtungen, Fortschritte", "textures/icons_apps/notific_on.png")
		functions.push(r => {
			player.removeTag("want_notific")
			settings(player)
		})
	}
	let tags = player.getTags();
	let filteredTags = tags.filter(t => t.startsWith("group:"));
	
	if (filteredTags.length > 0 && player.hasTag("chat:group")) {
		const groupTags = player.getTags().filter((t) => t.startsWith("group:"));
		const group = groupTags.length > 0 ? groupTags[0].replace("group:", "") : "None";
		actionForm.button(`§l§8Chat §bStandard\n§r${group}`, "textures/ui/mute_off");
		functions.push(() => {
			if (groupTags.length > 2) {
				player.sendMessage("You have more than one group tag.");
			}
			switchToGeneralChat(player);

		});
	
	}
	
	if ((tags.includes("Feuerwehr") || tags.includes("Stadtwerke") || tags.includes("Polizei") || tags.includes("Makler") || tags.includes("Bänker")) && player.hasTag("chat:job")) {
		// Spieler hat Job-Tags
		const tags = player.getTags()
		let jobs = ["Feuerwehr", "Markler", "Polizei", "Stadtwerke", "Bänker"];
		const jobTags = tags.filter(tag => jobs.includes(tag));
		actionForm.button(`§l§8Chat §bJobchat\n§r${jobTags}`, "textures/ui/mute_off");
		functions.push(() => {
			if (filteredTags.length > 0) {
				switchToGroupChat(player);
			} else {
				switchToGeneralChat(player);
			}
		});
	}
	if (player.hasTag("chat:default")) {
		actionForm.button(`§l§8Chat §bStandard\n§r`, "textures/ui/mute_off");
		functions.push(() => {

			 if (tags.includes("Feuerwehr") || tags.includes("Stadtwerke") || tags.includes("Polizei") || tags.includes("Makler") || tags.includes("Bänker")) {
				switchToJobChat(player);
			} else if (filteredTags.length > 0) {
				switchToGroupChat(player);
			} else {
				player.sendMessage("You do not have the ability to switch between chats.");
			}
		});
	}
	
	if (!player.hasTag("actionbar_onlinetimer")) {
		actionForm.button("§l§8Onlinetimer§c aus\n§rSpielzeit", "textures/icons_apps/notific_off.png")
		functions.push(r => {
			removeTags(player)
			player.addTag("actionbar_onlinetimer")
			settings(player)
		})
	}
	if (player.hasTag("actionbar_onlinetimer")) {
		actionForm.button("§l§8Onlinetimer§a §aan\n§rSpielzeit", "textures/icons_apps/notific_on.png")
		functions.push(r => {
			removeTags(player)
			settings(player)
		})
	}	
	if (!player.hasTag("actionbar_debug")) {
		actionForm.button("§l§8Debug §caus\n§rZeigt die Performance des Servers", "textures/icons_apps/notific_off.png")
		functions.push(r => {
			removeTags(player)
			player.addTag("actionbar_debug")
			settings(player)
		})
	}
	if (player.hasTag("actionbar_debug")) {
		actionForm.button("§l§8Debug §aan\n§rZeigt die Performance des Servers", "textures/icons_apps/notific_on.png")
		functions.push(r => {
			removeTags(player)
			settings(player)
		})
	}
	if (!player.hasTag("actionbar_mode")) {
		actionForm.button("§l§8Modus §caus\n§rEffekte, Baumodus, Worldedit", "textures/icons_apps/notific_off.png")
		functions.push(r => {
			removeTags(player)
			player.addTag("actionbar_mode")
			settings(player)
		})
	}
	if (player.hasTag("actionbar_mode")) {
		actionForm.button("§l§8Modus §aan\n§rEffekte, Baumodus, Worldedit", "textures/icons_apps/notific_on.png")
		functions.push(r => {
			removeTags(player)
			settings(player)
		})
	}
	
	if (player.hasTag("Bürgermeister")) {
		actionForm.button("§8§lVerwaltung\n§rNur für Bürgermeister", "textures/icons_apps/settings.png");
		functions.push(() => {
			Admin(player);
		});
	}

	actionForm.show(player).then(r => {
		if (r.canceled) return;
		functions[r.selection]();
	});
}	
	function switchToGroupChat(player) {
		// Deine Implementierung zum Wechseln zum Gruppenchat
		const tagsToRemove = player.getTags().filter(t => t.startsWith("chat:"));
		for (const tag of tagsToRemove) {
			player.removeTag(tag);
		}
		
		
		player.addTag("chat:group");
		settings(player);
	}
	
	function switchToJobChat(player) {
		// Deine Implementierung zum Wechseln zum Job-Chat
		const tagsToRemove = player.getTags().filter(t => t.startsWith("chat:"));
		for (const tag of tagsToRemove) {
			player.removeTag(tag);
		}
		
		
		player.addTag("chat:job");
		settings(player);
	}
	
	function switchToGeneralChat(player) {
		// Deine Implementierung zum Wechseln zum allgemeinen Chat
		const tagsToRemove = player.getTags().filter(t => t.startsWith("chat:"));
		for (const tag of tagsToRemove) {
			player.removeTag(tag);
		}
		
		
		player.addTag("chat:default");
		settings(player);
	}