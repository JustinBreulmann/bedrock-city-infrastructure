import {world, system } from "@minecraft/server";
import { ActionFormData, MessageFormData, ModalFormData, ActionFormResponse, MessageFormResponse, ModalFormResponse } from "@minecraft/server-ui";
import { dispatch } from "../gameplay/job/dispatch/setting";
import { wanted } from "../gameplay/job/dispatch/setting";
import { resetPassword } from "../gameplay/job/bank/banker";


const password = () => {

    let bank = world.getDynamicProperty("bank");

    if(bank == undefined || bank == null) {
        resetPassword(player)
        return;
    }
    else {
    bank.split(",")[1].split(":")[2]
    }
}

 let input = "*".repeat(password.length);

function showKeypad(player, input) {

    let actionForm = new ActionFormData();
    actionForm.title("Keypad");
    actionForm.body(input);
    for(let i = 1; i <= 9; i++) {
        actionForm.button(i.toString());
    }

    actionForm.show(player).then((response) => {
        if (response.canceled) return;

        const userInput = response.selection + 1 
		input = input.replace("*", ""); 
		input += userInput;
            if (!input.includes("*")) {
                checkPassword(player, input);
            } else {
                showKeypad(player, input);
            }
    });
}

function checkPassword(player, input) {
    if (input === password) {
        player.runCommandAsync("clone -204 50 19 -207 53 26 -212 79 -11");
    } else {
        wanted(player);
    }
}


export function vault(player) {
    showKeypad(player, input);
}
