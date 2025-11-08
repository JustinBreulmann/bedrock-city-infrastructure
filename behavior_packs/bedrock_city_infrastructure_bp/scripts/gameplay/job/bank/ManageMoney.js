import { world, Player, ItemStack, system, ItemTypes } from "@minecraft/server";
import { ActionFormData, MessageFormData, ModalFormData, ActionFormResponse, MessageFormResponse, ModalFormResponse } from "@minecraft/server-ui";

import { currency } from "../../../extensions/config";
import { getScore } from "../../../extensions/module/getScore";
import { addMoney } from "../../money/animation";

export function ManageMoney(player, selectedplayer) {
  let form = new ModalFormData();
  form.title(`Verwaltung - Money`);
  form.textField("entfernen", "Schreibe hier");
  form.textField("hinzufügen", "Schreibe hier");
  form.textField("set", "Schreibe hier");
  form.toggle("reset");
  form
    .show(player)
    .then((response) => {
      if(response.canceled) return

      

      if (response.formValues[0] > 0) {

          addMoney(selectedplayer, -response.formValues[0])
        
          selectedplayer.sendMessage(`§cVon deinem Konto wurden §4${response.formValues[1]} ${currency} §centfernt`);
      }
      if (response.formValues[1] > 0) {
        addMoney(selectedplayer, response.formValues[1])

        selectedplayer.sendMessage(`§aAuf deinem Konto wurden §2${response.formValues[1]} ${currency} §ahinzugefügt`)
      
      }
      if (response.formValues[2] > 0 && !response.formValues === NaN) {
          world.scoreboard.getObjective('Coins').setScore(selectedplayer, response.formValues[2]);
          selectedplayer.sendMessage(`§aDein Geldstand wurde auf $2${response.formValues[2]} ${currency} gesetzt`);
      }
      if (response.formValues[3] == true) {
        player.runCommandAsync(
          `scoreboard players reset ${selectedplayer} ${currency}`
        );
      } else {
        player.sendMessage(
          `§b§lServer §8>>§r §7Der Geldstand von ${selectedplayer} wurde auf ${getScore(selectedplayer, currency)} ${currency} korrigiert`
        );
      }
    })
}
