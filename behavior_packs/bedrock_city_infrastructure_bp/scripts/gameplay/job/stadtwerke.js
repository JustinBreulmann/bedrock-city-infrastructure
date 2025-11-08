import {world,Player,ItemStack,system,ItemTypes} from "@minecraft/server"
import {ActionFormData,MessageFormData,ModalFormData,ActionFormResponse,MessageFormResponse,ModalFormResponse} from "@minecraft/server-ui";
import { joblist } from "./menu";
import { getScore } from "../../extensions/module/getScore";
import { Broadcast } from "./moderator/broadcast";
import { currency } from "../../extensions/config";
import {AddItem} from "../../gameplay/smartphone/menu/bank"
import { jobMenu } from "./jobMenu";
import { metricNumbers } from "../../extensions/module/metric";
import { exception } from "../../exceptions/error";
import { addMoney } from "../money/animation";

export function Stadtwerke (player) {
    let actionForm = new ActionFormData()
    actionForm.title(`Stadtwerke`)
    actionForm.button("zurück", "textures/icons_apps/back.png")
    actionForm.button("Nutzfahrzeuge","textures/ui/accessibility_glyph_color")
    actionForm.button("Ausrüstung","textures/ui/icon_recipe_construction")
    actionForm.button("Rechnung","textures/ui/trade_icon")
    actionForm.button("Verkehrsmeldung","textures/ui/chat_send.png")
    actionForm.show(player).then(actionFormResponse => {
        if(actionFormResponse.canceled) return
        const { selection } = actionFormResponse
        if (selection == 0) {
            jobMenu(player)
        }
        if (selection == 1) {
            Baustellenfahrzeuge(player)
        }
        if (selection == 2) {
            player.runCommandAsync(`give @s block:cone 16`)
            player.runCommandAsync(`give @s Feuerwehr:absperrung 16`)
            player.runCommandAsync(`structure load Straßenschilder ~~1~`)
           }
        if (selection == 3) {
            Rechnung(player)
            }
        if (selection == 4) {
            Broadcast(player)
        }
    })
}
export function Baustellenfahrzeuge(player) {
    let actionForm = new ActionFormData()
    actionForm.title(`§l§8Stadtwerke - Nutzfahrzeuge`)
    actionForm.button("button.back", "textures/invisible.png")
    actionForm.button("button.Fahrzeug2", "textures/invisible.png")
    actionForm.button("button.Fahrzeug3", "textures/invisible.png")
    actionForm.button("button.Fahrzeug4", "textures/invisible.png")
    actionForm.button("button.Fahrzeug5", "textures/invisible.png")
    actionForm.show(player).then(actionFormResponse => {
        if(actionFormResponse.canceled) return
        const { selection } = actionFormResponse
        if (selection == 0) {
            joblist
        }
        if (selection == 1) {
            player.runCommandAsync("function stadtwerke/excavator")
        }
        if (selection == 2) {
            player.runCommandAsync("function stadtwerke/roadroller")
        }
        if (selection == 3) {
            player.runCommandAsync("function stadtwerke/betonmischer")
        }
        if (selection == 4) {
            player.runCommandAsync("function stadtwerke/peterbilt")
        }
    })
}
export function Rechnung(player) {
    const form = new ModalFormData();
    const playerNameList = Array.from(world.getPlayers(), (plr) => plr.name);
  
    form.title(`Rechnung                  ${getScore(player, currency)} Coins`);
    form.dropdown("§8§lSpieler", playerNameList);
    form.textField("§8§lAnzahl", "Schreibe hier");
    form.textField("§8§lGrund", "Verpflichend");
  
    form.show(player).then((response) => {
      if (response.canceled) return;
  
      const transferAmount = parseInt(response.formValues[1]);
  
      if (transferAmount < 0) {
        exception('negativeValue', player, transferAmount)
      }

      const targetPlayer = playerNameList[response.formValues[0]];
  
      if (targetPlayer === player.name) {
        exception('PlayerIsTargetPlayer', player, "e Rechnung senden")
      }
  
      player.sendMessage(`§aRechnung erfolgreich ausgestellt`);
      addMoney(targetPlayer, -transferAmount)
      addMoney(player, transferAmount)
      player.runCommandAsync(`execute as ${targetPlayer} run playsound random.notification @s[hasitem={item=smartphone:black_smartphone}, tag=want_notific] ~~~ 1 1`);
  
      const lore = [
        `§r§eHöhe : §7${transferAmount}`,
        `§r§eVon : §7${player.name}`,
        `§r§eGrund : §7${response.formValues[2]}`,
      ];
      try {
        const receipt = new ItemStack("minecraft:paper");
        receipt.setLore(lore);

        const targetPlayer = playerNameList[response.formValues[0]];

        receipt.nameTag = `§rRechnung `;
        AddItem(player, receipt);
        AddItem(targetPlayer, receipt);
      } catch (error) {
      }    
    });
  }