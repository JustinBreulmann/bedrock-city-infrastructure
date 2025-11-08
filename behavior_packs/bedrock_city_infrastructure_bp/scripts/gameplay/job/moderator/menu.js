import {world,Player,ItemStack,system,ItemTypes} from "@minecraft/server"
import {ActionFormData,MessageFormData,ModalFormData,ActionFormResponse,MessageFormResponse,ModalFormResponse} from "@minecraft/server-ui";
import {technic} from "./technic"
import {particle} from "./particle"
import {Broadcast} from "./broadcast"
import { getScore } from "../../../extensions/module/getScore";
import { currency } from "../../../extensions/config";
import { studioFahrstuhlDown } from "../../../core/infrastructure/studio/fahrstuhl";

export function Microfon(player) {
  let actionForm = new ActionFormData()
  .title(`§i§fModerator - Schnellmenu`)
  .body("Erhalte einen Überblick über die wichtigsten Funktionen eines Moderators")
  actionForm.button("Show beginn","textures/ui/mute_off")
  actionForm.button("Gong","textures/ui/icon_bell")
  actionForm.button("Intro","textures/ui/sound_glyph_color")
  actionForm.button("Fahrstuhl runter","textures/ui/down_tip_Chevron")
  actionForm.show(player).then(actionFormResponse => {
    if (actionFormResponse.canceled) return
    const { selection } = actionFormResponse
  if (selection == 0) {
    for (const players of world.getAllPlayers()) {
      players.sendMessage(`[§4Channel4§f] §f ${player.name} §abeginnt nun seine §2 Show`)
    }
    }
    if (selection == 1) {
      player.runCommandAsync("execute at @p run playsound song.custom1.ui @a[r=30]")
    }
    if (selection == 2) {
      player.runCommandAsync("execute at @p run playsound song.custom2.ui @a[r=30]")
    }
    if(selection == 3) {
     studioFahrstuhlDown(player)
    }
  })
}


export function Moderator(player) {
    let actionForm = new ActionFormData()
      .title(`Moderator - Jobmenu`)
      actionForm.button("Show beginn","textures/ui/mute_off")
      actionForm.button("Meldung","textures/ui/Feedback")
      actionForm.button("Equipment","textures/ui/camera-yo")

      actionForm.button("Gong","textures/ui/icon_bell")
      actionForm.button("Intro","textures/ui/sound_glyph_color")
      actionForm.button("Technik","textures/ui/settings_glyph_color_2x")

      actionForm.button("Effekte","textures/ui/color_picker")

    actionForm.show(player).then(actionFormResponse => {
      if (actionFormResponse.canceled) return
      const { selection } = actionFormResponse
    if (selection == 0) {
        player.runCommandAsync("tellraw @a {\"rawtext\":[{\"text\":\"[§4Channel4] §f\"}, {\"selector\":\"@s\"}, {\"text\":\" §abeginnt nun seine §2 Show\"}]}")
      }
    if (selection == 1) {
        Broadcast(player)
      }
    if (selection == 2) {
      const inv = player.getComponent("inventory").container
      inv.addItem(new ItemStack("block:camera",1))
      inv.addItem(new ItemStack("moderator:microfon",1))
      }

    if (selection == 3) {
      player.runCommandAsync("execute at @p run playsound song.custom1.ui @a[r=30]")
    }
    if (selection == 4) {
      player.runCommandAsync("execute at @p run playsound song.custom2.ui @a[r=30]")
    }
    if (selection == 5) {
      technic(player)
        }
    if (selection == 6) {
      particle(player)
        }
      }  
    )
  }
