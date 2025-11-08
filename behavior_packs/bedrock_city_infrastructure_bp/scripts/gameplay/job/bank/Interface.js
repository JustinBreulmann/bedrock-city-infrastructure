import {world, system } from "@minecraft/server";
import {ActionFormData,MessageFormData,ActionFormResponse,MessageFormResponse,ModalFormResponse, ModalFormData} from "@minecraft/server-ui";
import { exception } from "../../../exceptions/error";
import { getScore } from "../../../extensions/module/getScore";
import { check, transfer, Updatekonto } from "../../smartphone/menu/bank";
import { metricNumbers } from "../../../extensions/module/metric";
import { addMoney } from "../../money/animation";

const konto = 1000

export function bankInterface(player) {
    if(player.hasTag("konto")) {
	let actionForm = new ActionFormData();
    actionForm.title("§i§fBank");
    actionForm.body("Verwalte dein Konto\n-Bargeld: " + metricNumbers(getScore(player,'Coins')) + " Coins \nKonto: " + metricNumbers(getScore(player, 'konto') + " Coins"));
    actionForm.button("Überweisung","textures/blocks/command_block");
    actionForm.button("Check erstellen","textures/blocks/command_block");
    actionForm.button("Einzahlen / Auszahlen","textures/blocks/command_block");
    actionForm.show(player).then((response) => {
        if (response.canceled) return;
    
        const { selection } = response
        if (selection == 0) {
            transfer(player)
        }
        if(selection == 1) {
            check(player)
        }
        if(selection == 2) {
            Updatekonto(player)
    }})
}
    else  {
    let actionForm = new ActionFormData();
    actionForm.title("§i§f§fBank");
    actionForm.body("§0§lWenn du ein Konto eröffnest, hast du die Möglichkeit §r§0 \nGeld zu überweisen, \nin Wertgegenstände zu Investieren,\n einen Kredit aufnehmen.");
    actionForm.button("Konto eröffnen","textures/ui/banknote");
    
	
	actionForm.show(player).then((response) => {
        if (response.canceled) return;
    
        const { selection } = response
        if (selection == 0) {
            if(getScore(player , "Coins") < konto) {
                exception('NotEnoughMoney', player, konto)
            }
            else {
                new MessageFormData()
	    	.title("§rKonto - Info")
		    .body('Bist du sicher, dass du ein Konto für ' + konto + ' Coins erstellen willst?' )
		    .button1("§4Abbruch")
		    .button2("§aOk")
            .show(player)
            .then((res) => {
                if (res.canceled) return;

                if (res.selection === 1) {

                    world.scoreboard.getObjective('konto').setScore(player, 0);
                    player.sendMessage("§2§lBank §a>> §rKontoeröffnung erfolgreich!")
                    player.addTag('konto')
                    addMoney(player, -100)
                }
              });
            }
        }
	})
  }
}