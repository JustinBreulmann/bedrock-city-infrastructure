import {world,Player,ItemStack,system,ItemTypes} from "@minecraft/server"
import {ActionFormData,MessageFormData,ModalFormData,ActionFormResponse,MessageFormResponse,ModalFormResponse} from "@minecraft/server-ui";
import { Item } from "../../../extensions/config";
import { home } from "./home";
import { exception } from "../../../exceptions/error";

export function messenger(player) {

    const group = player.getTags().filter((t) => t.startsWith("group:"));
    const groupadmin = player.getTags().filter((t) => t.startsWith("admingroup:"));

    let functions = []
    let actionForm = new ActionFormData()
    actionForm.title(`Messenger`)
    actionForm.body(`§l      --------------------      §r    Sende Nachrichten zu Spielern \n               auf dem Server \n§l      --------------------     `)
    {
        actionForm.button("§l§cZurück\n§rHauptmenu", "textures/icons_apps/back.png")
        functions.push(r => {
            home(player)
        })
    }
    {
        actionForm.button("§l§8Kontakte§r", "textures/ui/icon_steve.png")
        functions.push(r => {
            kontakt(player)
        })
    }
    {
        if(player.hasTag(`${group}`)) { actionForm.button("§l§8Gruppen","textures/ui/multiplayer_glyph_color")
        functions.push(r => {
            groupchat(player)
            })
        }
    }
    {
        actionForm.button("§l§8Gruppen Erstellen","textures/ui/World")
        functions.push(r => {
            creategroup(player)
        })
    }
    {
        if(player.hasTag(`${group}`) || player.hasTag(`${groupadmin}`)) {actionForm.button("§l§8Verwaltung","textures/ui/icon_setting")
        functions.push(r => {
            settings(player)
            })
        }
    }
    actionForm.show(player).then(r => {
        if (r.canceled) return
        functions[r.selection]()
        
    })
}
export function kontakt(player) {
    let form = new ModalFormData()
    let playerNameList = Array.from(world.getPlayers(), plr => plr.name)
    form.title(`Messenger`)
    form.dropdown("Spieler online", playerNameList)
    form.textField("Nachricht", "schreib hier")
    form.show(player).then((response) => {
        if (response.canceled) return
        if (response.formValues[1]) {
            if (playerNameList[response.formValues[0]] == player.name) {
                player.sendMessage(`§cDu kannst dir selber keine Nachrichten senden`)
            }
            if (playerNameList[response.formValues[0]] !== player.name) {

                const selectedPlayerName = playerNameList[response.formValues[0]];
                const selectedPlayer = world.getPlayers().find(player => player.name === selectedPlayerName)

                player.sendMessage(`Nachricht an §a${playerNameList[response.formValues[0]]} §7>> §r§f${response.formValues[1]}`)
                selectedPlayer.sendMessage(`§l§a${player.name} §7>>§r§f ${response.formValues[1]}`)
                player.runCommandAsync(`execute as ${playerNameList[response.formValues[0]]} run playsound random.notification @s[hasitem={item=${Item[Smartphone]}}, tag=want_notific] ~~~ 1 1`)
            }
        }
    })
}

export function groupchat(player) {
    let form = new ModalFormData();
    let GroupNamelist = player.getTags().filter((t) => t.startsWith("group:"));
    const Groups = GroupNamelist.map((group) => group.replace("group:", ""));
    form.title("Messenger");
    form.dropdown("§l      --------------------      §r    Sende Nachrichten in die Gruppe \n           Wähle die Gruppe aus\n§l      --------------------     \n§l§8Gruppe§r", Groups);
    form.textField("Nachricht", "schreib hier");
    form.show(player).then((response) => {
        if (response.canceled) return
      if (response.formValues[1]) {

        for (const players of world.getAllPlayers()) {
            if (players.hasTag(GroupNamelist[response.formValues[0]])) {
        players.sendMessage(
          `§a[${GroupNamelist[response.formValues[0]].replace("group:","")}] §r§7${player.name} : ${response.formValues[1]}`
        );
        player.runCommandAsync(
          `execute as @a[tag="${GroupNamelist[response.formValues[0]]}"] run playsound random.notification @s[hasitem={item:"minecraft:smartphone"},tag=want_notific] ~~~ 1 1`
        
        );
      }}}
    });
  }
  

export function creategroup(player) {
    let form = new ModalFormData()
	const GroupNamelist = player.getTags().filter(t => t.startsWith("group:"))
    const playerNameList = Array.from(world.getPlayers(), plr => plr.name)
    form.title(`Messenger - Gruppe erstellen`)
	form.dropdown("Spieler", playerNameList)
    form.textField("Name", "schreib hier")
    form.show(player).then((response) => {
        if (response.canceled) return
            if (GroupNamelist === (response.formValues[1])) {

                exception('duplicate', player, response.formValues[1])
            }
            else{
                player.sendMessage(`Die Gruppe §r${response.formValues[1]} wurde mit folgenden Spielern ${playerNameList[response.formValues[0]]} erstellt`)
                player.addTag(`group:${response.formValues[1]}`)
                player.addTag(`admingroup:${response.formValues[1]}`)

                form.show(playerNameList[response.formValues[0]]).then((response) => {
                    if (response.canceled) return
                    new MessageFormData()
                    .title("§rMessenger - Gruppe beitreten")
                    .body(`§r§lBist du sicher, dass du ${tag} beitreten willst?`)
                    .button1("§4Ablehnen")
                    .button2("§aBestätigen")
                    .show(player)
                    .then((res) => {
                      if (res.selection == 1) {
                        player.addTag(`group:${tag}`);
                      }
                    }
                )
            })
        }
    })
}
export function settings(player) {

    const group = player.getTags().filter((t) => t.startsWith("group:"));
    const groupadmin = player.getTags().filter((t) => t.startsWith("admingroup:"));

    let functions = []
    let actionForm = new ActionFormData()
    actionForm.title(`Messenger - Verwaltung`)
    actionForm.body(`§l      --------------------      §r    Sende Nachrichten zu Spielern \n               auf dem Server \n§l      --------------------     `)
    {
        actionForm.button("§l§cZurück\n§rMessenger", "textures/icons_apps/back.png")
        functions.push(r => {
            messenger(player)
        })
    }
    {
        if(player.hasTag(`${group}`)) { actionForm.button("§l§8Gruppe verlassen§r", "textures/ui/icon_steve.png")
        functions.push(r => {
            leftgroup(player)
        })
        }
    }
    {
        if(player.hasTag(`${groupadmin}`)) {actionForm.button("§l§8Gruppen löschen","textures/ui/multiplayer_glyph_color")
        functions.push(r => {
            delgroup(player)
            })
        }
    }
    {
        if(player.hasTag(`${groupadmin}`)) {actionForm.button("§l§8Spieler einladen","textures/ui/World")
        functions.push(r => {
            listplayer(player)
            })
        }
    }
    actionForm.show(player).then(r => {
        if (r.canceled) return
        functions[r.selection]()
    })
}

export function leftgroup(player) {
    let warps = [];
    let actionForm = new ActionFormData().title("§rMessenger - Gruppe verlassen§r");

    const group = player.getTags().filter((t) => t.startsWith("group:"));
    if (group.length > 0) {
        let tag = group[0].replace("group:", "");
    actionForm.button("§l§8" + tag +"§r\nKlicke um zu verlassen")
    warps.push(tag);
actionForm.button("§r§c§lZurück§r\nMessenger");
actionForm.show(player).then((response) => {
    if (response.canceled) return
    else {
      new MessageFormData()
        .title("§rMessenger - Gruppe verlassen")
        .body(`§r§lBist du sicher, dass du ${tag} verlassen willst?`)
        .button1("§4Ablehnen")
        .button2("§aBestätigen")
        .show(player)
        .then((res) => {
          if (res.selection == 1) {
            player.removeTag(`group:${tag}`);
                        } 
                    })
                }
            }
        )
    }
}

export function delgroup(player) {
    let warps = [];
    let actionForm = new ActionFormData().title("§rMessenger - Gruppe löschen");

    const group = player.getTags().filter((t) => t.startsWith("group:"));
    const groupadmin = player.getTags().filter((t) => t.startsWith("admingroup:"));
    if (groupadmin.length > 0) {
        let tag = groupadmin[0].replace("admingroup:", "");
    actionForm.button("§l§8" + tag +"§r\nKlicke um zu löschen")
    warps.push(tag);
actionForm.button("§r§c§lZurück§r\nMessenger");
actionForm.show(player).then((response) => {
    if (response.canceled) return
    else {
      new MessageFormData()
        .title("§rMessenger - Gruppe löschen")
        .body(`§r§lBist du sicher, dass du ${tag} verlassen willst?`)
        .button1("§4Ablehnen")
        .button2("§aBestätigen")
        .show(player)
        .then((res) => {
          if (res.selection == 1) {
            player.runCommandAsync(`tag @a remove group:${tag}`)
            player.removeTag(`admingroup:${tag}`);
                        } 
                    })
                }
            }
        )
    }
}

export function listplayer(player) {
    let warps = [];
    let form = new ModalFormData()
    form.title("§rMessenger - Spielerverwaltung§r");
    const groupadmin = player.getTags().find((t) => t.startsWith("admingroup:")); // Use find() instead of filter()
    const group = player.getTags().filter((t) => t.startsWith("group:"));
    const add = groupadmin.replace("admingroup:", ""); // Apply replace() on the first element of groupadmin
    const playerNameList = Array.from(world.getPlayers(), (plr) => plr.name);
  
    form.dropdown(`§l§8Gruppe§r`, groupadmin);
  
    for (let i = 0; i < playerNameList.length; i++) {
      form.toggle(`${playerNameList[i]}`, true);
    }
  
    form.show(player).then((response) => {
      if (response.canceled) {
        return;
      } else {
        for (let i = 0; i < playerNameList.length; i++) {
          if (response.formValues[i]) {
            playerNameList[i].addTag(`group:${add}`);
          } else {
            playerNameList[i].removeTag(`group:${add}`);
          }
        }
      }
    });
  }