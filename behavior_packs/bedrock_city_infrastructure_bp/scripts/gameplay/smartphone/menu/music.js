import {world,Player,ItemStack,system,ItemTypes} from "@minecraft/server"
import {ActionFormData,MessageFormData,ModalFormData,ActionFormResponse,MessageFormResponse,ModalFormResponse} from "@minecraft/server-ui";
import { home } from "./home";

export function music(player) {
    let actionForm = new ActionFormData()
    actionForm.title(`Musik`)
    actionForm.body(`§l      --------------------              §rSpiele Musik und Sounds \n§l      --------------------      `)
    actionForm.button("§l§cZurück\n§rHauptmenu", "textures/icons_apps/back.png")
    actionForm.button("Minecraft Musik\n§fC418, Lena Raine... - Album", "textures/icons_apps/music_app/minecraft_volume_alpha.png")
    actionForm.button("Minecraft Mobs\n§fCreeper, Dragon... - Sounds", "textures/blocks/skull_pottery_pattern.png")
    actionForm.button("Custom Musik\n§fKlingel, Gong... - Musik", "textures/ui/icon_bell.png")
    actionForm.show(player).then(actionFormResponse => {
        if (actionFormResponse.canceled) return
        const { selection } = actionFormResponse
        if (selection == 0) {
            home(player)
        }
        if (selection == 1) {
            MinecraftMusik(player)
        }
        if (selection == 2) {
            Mobsounds(player)
        }
    })
}
export function MinecraftMusik(player) {
    let actionForm = new ActionFormData();
      actionForm.title(`Musik - Minecraft`)
      actionForm.button("§l§cZurück\n§rMusik", "textures/icons_apps/back.png")
      actionForm.button("§l§aStop Musik\n§rEntferne alle Sounds", "textures/icons_apps/cancel.png")
      actionForm.button("Pigstep\n§fLena Raine", "textures/items/record_pigstep.png")
      actionForm.button("Thirteen (Disc 13)\n§fC418", "textures/items/record_13.png")
      actionForm.button("Cat\n§fC418", "textures/items/record_cat.png")
      actionForm.button("Blocks\n§fC418", "textures/items/record_blocks.png")
      actionForm.button("Chirp\n§fC418", "textures/items/record_chirp.png")
      actionForm.button("Far\n§fC418", "textures/items/record_far.png")
      actionForm.button("Mall\n§fC418", "textures/items/record_mall.png")
      actionForm.button("Mellohi\n§fC418", "textures/items/record_mellohi.png")
      actionForm.button("Stal\n§fC418", "textures/items/record_stal.png")
      actionForm.button("Strad\n§fC418", "textures/items/record_strad.png")
      actionForm.button("Ward\n§fC418", "textures/items/record_ward.png")
      actionForm.button("Wait\n§fC418", "textures/items/record_wait.png")
      actionForm.button("Otherside\n§fLena Raine", "textures/items/record_otherside.png")
	  actionForm.button("Five\n§fSamuel Åberg ", "textures/items/record_5.png")
	  actionForm.button("Relic\n§fAaron Cherof ", "textures/items/record_relic.png")
      actionForm.show(player).then(actionFormResponse => {
        if (actionFormResponse.canceled) return
          const { selection } = actionFormResponse
          if (selection == 0) {
              music (player)
          }
          if (selection == 1) {
              player.runCommandAsync("stopsound @s")
          }
          if (selection == 2) {
              player.runCommandAsync("stopsound @s")
              player.runCommandAsync("playsound record.pigstep @s")
          }
          if (selection == 3) {
              player.runCommandAsync("stopsound @s")
              player.runCommandAsync("playsound record.13 @s")
          }
          if (selection == 4) {
              player.runCommandAsync("stopsound @s")
              player.runCommandAsync("playsound record.cat @s")
          }
          if (selection == 5) {
              player.runCommandAsync("stopsound @s")
              player.runCommandAsync("playsound record.blocks @s")
          }
          if (selection == 6) {
              player.runCommandAsync("stopsound @s")
              player.runCommandAsync("playsound record.chirp @s")
          }
          if (selection == 7) {
              player.runCommandAsync("stopsound @s")
              player.runCommandAsync("playsound record.far @s")
          }
          if (selection == 8) {
              player.runCommandAsync("stopsound @s")
              player.runCommandAsync("playsound record.mall @s")
          }
          if (selection == 9) {
              player.runCommandAsync("stopsound @s")
              player.runCommandAsync("playsound record.mellohi @s")
          }
          if (selection == 10) {
              player.runCommandAsync("stopsound @s")
              player.runCommandAsync("playsound record.stal @s")
          }
          if (selection == 11) {
              player.runCommandAsync("stopsound @s")
              player.runCommandAsync("playsound record.strad @s")
          }
          if (selection == 12) {
              player.runCommandAsync("stopsound @s")
              player.runCommandAsync("playsound record.ward @s")
          }
          if (selection == 13) {
              player.runCommandAsync("stopsound @s")
              player.runCommandAsync("playsound record.wait @s")
          }
          if (selection == 14) {
              player.runCommandAsync("stopsound @s")
              player.runCommandAsync("playsound record.otherside @s")
          }
		  if (selection == 15) {
			player.runCommandAsync("stopsound @s")
			player.runCommandAsync("playsound record.5 @s")
		  }
		  if (selection == 16) {
			player.runCommandAsync("stopsound @s")
			player.runCommandAsync("playsound record.relic @s")
		  }
      })
  }

  export function Mobsounds(player) {
    let actionForm = new ActionFormData();
      actionForm.title(`Musik - Mobs`)
      actionForm.button("§l§cZurück\n§rMusik", "textures/icons_apps/back.png")
      actionForm.button("§l§aStop Musik\n§rEntferne alle Sounds", "textures/icons_apps/cancel.png")
      actionForm.button("Zombie\n§fattack", "textures/items/record_pigstep.png")
      actionForm.button("Creeper\n§fattack", "textures/items/record_13.png")
      actionForm.button("Dragon\n§fattack", "textures/items/record_cat.png")
      actionForm.button("Wither\n§fattack", "textures/items/record_blocks.png")
      actionForm.button("Warden\n§fattack", "textures/items/record_chirp.png")
      actionForm.show(player).then(actionFormResponse => {
        if (actionFormResponse.canceled) return
          const { selection } = actionFormResponse
          if (selection == 0) {
              music (player)
          }
          if (selection == 1) {
              player.runCommandAsync("stopsound @s")
          }
          if (selection == 2) {
              player.runCommandAsync("stopsound @s")
              player.runCommandAsync("playsound record.pigstep @s")
          }
          if (selection == 3) {
              player.runCommandAsync("stopsound @s")
              player.runCommandAsync("playsound record.13 @s")
          }
          if (selection == 4) {
              player.runCommandAsync("stopsound @s")
              player.runCommandAsync("playsound record.cat @s")
          }
          if (selection == 5) {
              player.runCommandAsync("stopsound @s")
              player.runCommandAsync("playsound record.blocks @s")
          }
          if (selection == 6) {
              player.runCommandAsync("stopsound @s")
              player.runCommandAsync("playsound record.chirp @s")
          }
          if (selection == 7) {
              player.runCommandAsync("stopsound @s")
              player.runCommandAsync("playsound record.far @s")
          }
          if (selection == 8) {
              player.runCommandAsync("stopsound @s")
              player.runCommandAsync("playsound record.mall @s")
          }
          if (selection == 9) {
              player.runCommandAsync("stopsound @s")
              player.runCommandAsync("playsound record.mellohi @s")
          }
          if (selection == 10) {
              player.runCommandAsync("stopsound @s")
              player.runCommandAsync("playsound record.stal @s")
          }
          if (selection == 11) {
              player.runCommandAsync("stopsound @s")
              player.runCommandAsync("playsound record.strad @s")
          }
          if (selection == 12) {
              player.runCommandAsync("stopsound @s")
              player.runCommandAsync("playsound record.ward @s")
          }
          if (selection == 13) {
              player.runCommandAsync("stopsound @s")
              player.runCommandAsync("playsound record.wait @s")
          }
          if (selection == 14) {
              player.runCommandAsync("stopsound @s")
              player.runCommandAsync("playsound record.otherside @s")
          }
		  if (selection == 15) {
			player.runCommandAsync("stopsound @s")
			player.runCommandAsync("playsound record.5 @s")
		  }
		  if (selection == 16) {
			player.runCommandAsync("stopsound @s")
			player.runCommandAsync("playsound record.relic @s")
		  }
      })
  }