import {world,Player,ItemStack,system,ItemTypes} from "@minecraft/server"
import {ActionFormData,MessageFormData,ModalFormData,ActionFormResponse,MessageFormResponse,ModalFormResponse} from "@minecraft/server-ui";
import { currency } from "../../../extensions/config";
import { Shop } from "../../../extensions/module/Shop";
import {compareString} from "../../../extensions/module/compareString"
import { getScore } from "../../../extensions/module/getScore";
import { exception } from "../../../exceptions/error";
import { addMoney } from "../../money/animation";

async function ForceOpen(player, form) {
	while (true) {
	  const response = await form.show(player);
	  if (response.cancelationReason !== "userBusy") return response;
	}
  }

export async function shop(player) {
	let itemGroup = await Shop.getGroups()
	let itemData = await Shop.getItem()
	let mainForm = new ActionFormData()
	  .title("Shop")
	  .body("§8Wähle die Kategorie, um Items auszuwählen\n\n")
	itemGroup.forEach(k => mainForm.button(`§l§f${k} §8(§f${Object.keys(itemData[k]).length}§8)`))
  
	let res = await ForceOpen(player, mainForm)
	if (!res.canceled) {
	  let selectedGroup = itemGroup[res.selection]
	  let itemStock = []
	  Object.keys(itemData[selectedGroup]).forEach(name => {
		let data = itemData[selectedGroup][name]
		if (!data.enchantments) data.enchantments = []
		data.displayname = name
		itemStock.push(data)
	  })
	  let shopForm = new ActionFormData()
		.title(`${selectedGroup.toUpperCase()} - Shop`)
		.body(`Shop - Wähle Items`)
	  itemStock.sort((a, b) => compareString(a, b, "displayname"))
	  itemStock.forEach(item => {
		shopForm.button(`§l§8${item.displayname}\n§rPreis : ${item.price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')} ${currency}`)
	  })
	  shopForm.button("§l§cZurück\n§rKategorie")
	  res = await ForceOpen(player, shopForm)
	  if (!res.canceled) {
		let item = itemStock[res.selection]
		if (item == undefined) return shop(player)
		shop_ItemUI(player, item)
	  }
	}
  }
  /**
   * @param {Player} player 
   * @param {Array} item 
   */
  export async function shop_ItemUI(player, item) {
	let canTake = player.getComponent('inventory').container.emptySlotsCount > 0
	if (!canTake) return player.sendMessage("§cDu musst mindestens 1 leeren Inventarplatz haben")
	let itemForm = new ModalFormData()
	  .title(`${item.displayname} Shop`)
	  .slider("Anzahl", 1, new ItemStack(ItemTypes.get(item.id)).maxAmount, 1)
	let res = await ForceOpen(player, itemForm)
	if (!res.canceled) {
	  let [slider] = res.formValues;
	  let amount = slider
	  shop_ConfirmUI(player, item, amount)
	}
  }

  export async function shop_ConfirmUI(player, item, amount) {
    let price = item.price * amount;
    let itemName = item.displayname;

    new MessageFormData()
        .title("§l§eKauf bestätigen")
        .body(`Kaufe ${itemName} für §e${currency}${price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}§r?`)
        .button1("§l§aBestätigen")
        .button2("§l§cAbbrechen")
        .show(player)
		.then((responseNEW) => {

    if (responseNEW.canceled) return
        if (responseNEW.selection == 0) {
            let playerMoney = getScore(player,currency);
            if (price > playerMoney) {	
				exception('NotEnoughMoney', player, price)
            } else {
                let inventory = player.getComponent('inventory').container;
                inventory.addItem(new ItemStack(item.id, amount));
				addMoney(player, -price)
                player.sendMessage(`§eDu hast §ax${amount} ${itemName}§e für §a${currency}${price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')} gekauft!`);
            }
        }
    }
)}
