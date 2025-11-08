import {world,Player,ItemStack,system,ItemTypes, ItemType} from "@minecraft/server"
import {ActionFormData,MessageFormData,ModalFormData,ActionFormResponse,MessageFormResponse,ModalFormResponse} from "@minecraft/server-ui";
import {home} from "./home"
import { getScore } from "../../../extensions/module/getScore";
import { currency } from "../../../extensions/config";
import {metricNumbers} from "../../../extensions/module/metric"
import { exception } from "../../../exceptions/error";
import { addMoney } from "../../money/animation";

export function bank(player) {
    let actionForm = new ActionFormData()
    actionForm.title(`Online Banking`)
    actionForm.body(`${player.name}           ${metricNumbers(getScore(player, currency))} Coins\n`)
    actionForm.button("§l§cZurück§r\n Hauptmenu", "textures/icons_apps/back.png")
    actionForm.button("§l§8Überweisungen", "textures/icons_apps/transfer.png")
    actionForm.button("§l§8Check erstellen", "textures/icons_apps/deposite.png")
    actionForm.button("§l§8Einzahlen / Auszahlen", "textures/ui/MCoin")
    actionForm.button("§l§8Auflösen", "textures/ui/settings")
    actionForm.show(player).then(actionFormResponse => {
        if (actionFormResponse.canceled) return
        const { selection } = actionFormResponse
        if (selection == 0) {
            home(player)
        }
        if (selection == 1) {
            transfer(player)
        }
        if (selection == 2) {
            check (player)
        }
        if (selection == 3) {
          Updatekonto(player)
        }
        if (selection == 4) {
          Banksetting(player)
      }
    })
}

export function Banksetting(player) {
  new MessageFormData()
  .title("§rKonto - auflösen")
  .body(`§r§lBist du sicher, dass du dein Konto auflösen willst? Dein Geld von deinem Konto wird dir automatisch ausgezahlt.`)
  .button1("§4Ablehnen")
  .button2("§aBestätigen")
  .show(player)
  .then((res) => {
    if (res.canceled) return;

    if (res.selection === 1) {
      addMoney(player, getScore(player, "konto"))
      world.scoreboard.getObjective("konto").setScore('konto', 0)
      player.removeTag("Konto")
      player.sendMessage("§l§2Bank §a>> §rKontoauflösung erfolgreich!")
    }
  });

}

export function AddItem(target, item) {
  if (typeof item === "string") {
    target.runCommandAsync(`give @s ${item}`);
  } else {
    const inv = target.getComponent("inventory").container;
    inv.addItem(item);
    target.getComponent("inventory").container = inv;
  }
}

export function transfer(player) {
  const form = new ModalFormData();
  const playerNameList = Array.from(world.getPlayers(), (plr) => plr.name);
  
  form.title(`Überweisungen              ${metricNumbers(getScore(player, currency))} Coins`);
  form.dropdown("§8§lSpieler", playerNameList);
  form.textField("§8§lAnzahl", "Schreibe hier");
  form.textField("§8§lGrund", "freiwillig");
  if(player.hasTag('Konto') && getScore(player, 'konto') > 0 ) {
  form.toggle("Konto verwenden",false);
  }

  form.show(player).then((response) => {
    if (response.canceled) return;
    let selected = "Coins"
    if(response.formValues[3] == true) {
       selected  = "konto"

    }

    const transferAmount = parseInt(response.formValues[1]);

    if (transferAmount < 0) {
      exception('PlayerIsTargetPlayer', player, "")
      return;
    }

    if (getScore(player, selected) < transferAmount) {
      exception('NotEnoughMoney', player, transferAmount)
      return;
    }

    const targetPlayer = playerNameList[response.formValues[0]];

    if (targetPlayer === player.name) {
      exception('PlayerIsTargetPlayer', player, "e Überweisung ausstellen")
      return;
    }

    const emptySlotsCount = player.getComponent("inventory").container.emptySlotsCount;
    if (emptySlotsCount === 0) {
      exception('InventoryFull', player, "")
      return;
    }

    player.sendMessage(`§aÜberweisung erfolgreich`);
    world.scoreboard.getObjective('Coins').setScore(player, getScore(player, selected ) - transferAmount);
    world.scoreboard.getObjective('Coins').setScore(targetPlayer, getScore(targetPlayer, 'Coins' ) + transferAmount);

    player.playSound("random.nofication")

    const lore = [
      `§r§eHöhe : §7${transferAmount}`,
      `§r§eAn : §7${targetPlayer}`,
      `§r§eGrund : §7${response.formValues[2]}`,
    ];
    try {
      const receipt = new ItemStack("minecraft:paper");
      receipt.setLore(lore);
    
      receipt.nameTag = `§rQuittung `;
      AddItem(player, receipt);
    } catch (error) {
    }    
  });
}

export function check(player) {
    let form = new ModalFormData();
  
    form.title(`Check                        ${metricNumbers(getScore(player, currency))} Coins`);
    form.textField("§l      --------------------      §f§rStelle einen Check aus, den andere Spieler einlösen können. \n§l      --------------------      §8§lAnzahl", "Schreibe hier");
    form.textField("§8§lGrund", "Schreibe hier");
    form.show(player).then((response) => {
      if (response.canceled) return;
      if (response.formValues[0]) {
        if (response.formValues[0] < 0 || response.formValues[0] == NaN) {
          exception('negativeValue', player, response.formValues[0])
        } else {
          if (getScore(player, currency) < response.formValues[0] && response.formValues[0] > 0) {
            exception('NotEnoughMoney', player, response.formValues[0])
          }
          if (
            getScore(player, currency) >= response.formValues[0] &&
            response.formValues[0] > 0 &&
            player.getComponent('inventory').container.emptySlotsCount > 0
          ) {
            player.sendMessage(`§aCheck erfolgreich erstellt`);
            addMoney(player, -response.formValues[0])
  
          
     
    const lore = [
      `§r§eHöhe : §7${response.formValues[0]},`,
      `§r§eVon : §7${player.name},`,
      `§r§eGrund : §7${response.formValues[1]},`,
    ];
    try {
      const receipt = new ItemStack("minecraft:paper");
      receipt.setLore(lore);
    
      receipt.nameTag = `§r§2Bank§aCheck`;
      AddItem(player, receipt);
    } catch (error) {
    }    }}}
  });
}

export function paper(player) {

  // Item Values
  const itemSlot =  player.getComponent( "inventory" ).container.getItem( player.selectedSlot )
  const itemLore = itemSlot.getLore();

  if (itemSlot.typeId === "minecraft:paper") {
    if (itemSlot.nameTag === "§r§2Bank§aCheck") {

      const lore = `${itemLore}`.trim().split(",");
      let Money = lore[0].split(":")[1]
      let PlayerName = lore[2].split(":")[1]
      let Reason = lore[4].split(":")[1]

      if (Money && PlayerName && Reason) {
        player.runCommandAsync(`replaceitem entity @s slot.weapon.mainhand 0 air`);
        addMoney(player, parseFloat(Money.trim().replace("§7","")));


        player.sendMessage(`§2§lBank >>§r§fDu hast den Check von §a${PlayerName}§f in Höhe von §a${Money} Coins §feingelöst`);
      } else {
        exception('DataInvalid', player, "")
      }
    }
  }
}

export function Updatekonto(player) {
  let form = new ModalFormData();
  form.title("Konto - Einzahlen / Auszahlen");
  form.textField("§l      --------------------      §f§r         Zahle Geld ein oder aus. \n\n§l      --------------------      §8§lEinzahlen", metricNumbers(getScore(player, 'Coins'))+ " Coins");
  form.textField("§l§8Auszahlen", metricNumbers(getScore(player, 'konto'))+ " Coins");
  form.show(player).then((response) => {
      if (response.canceled) {
          return;
      }
      if(response.formValues[0] > 0 && getScore(player, 'Coins') >= response.formValues[0]) {
        addMoney(player, - response.formValues[0])
          world.scoreboard.getObjective('konto').setScore(player, getScore(player, 'konto' ) + response.formValues[0]);
      }

      if(response.formValues[1] > 0 && getScore(player, 'konto') >= response.formValues[0]) {
        addMoney(player, + response.formValues[1])
          world.scoreboard.getObjective('konto').setScore(player, getScore(player, 'konto' ) - response.formValues[1]);
      }

      if(response.formValues[1] <= 0 || response.formValues[2] <= 0) {
          exception('negativeValue', player, response.formValues)
      }
  })
}