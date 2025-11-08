import { system, world } from "@minecraft/server";
import {ActionFormData,MessageFormData,ModalFormData,ActionFormResponse,MessageFormResponse,ModalFormResponse} from "@minecraft/server-ui";
import { textToBinary } from "../../extensions/module/Binary";
import {getDim,getMoney,getLands,calculatePrice} from "./functions"
import { checkLand } from "./functions";
import { addMoney } from "../../gameplay/money/animation";

let max = 500;
let price = 100;
let limit = 5;
let land = []
let settings = []

import {max, price, limit, initSettings} from "./functions"
import { exception } from "../../exceptions/error";

export function Markler(player) {
    let actionForm = new ActionFormData()
      .title(`Grundstücke`)
      actionForm.button("§8§lKosten pro Block\n§rKlicke","textures/blocks/grass_side_carried")
      actionForm.button("§8§lEinstellung\n§rder Grundstücke","textures/ui/settings_glyph_color_2x")
      actionForm.button("§8§lGrundstück kaufen\n§rKlicke","textures/ui/icon_spring")
      actionForm.button("§8§lGrundstück verkaufen \n§rKlicke","textures/ui/trade_icon")
	  actionForm.button("§8§lGrundstück Übertragen\n§rKlicke","textures/ui/icon_multiplayer")
      actionForm.button("§8§lGrundstück info\n§rKlicke","textures/ui/invite_base")

    actionForm.show(player).then(actionFormResponse => {
      if (actionFormResponse.canceled) return
      const { selection } = actionFormResponse
    if (selection == 0) {
        costperBlock(player)
      }
	if (selection == 1) {
		setting1(player)
	}
	if (selection == 2) {
		buyland(player)
	}
	if (selection == 3) {
		sellland(player)
	}
	if(selection == 5) {
		landinfo(player)
	}
	if(selection == 4) {
		Übertragen(player)
	}
	}
)}

export function costperBlock(player) {
	let { max, price, limit } = initSettings();
    let form = new ModalFormData();
    form.title(`Grundstück Verwaltung`);
    form.textField("§l      --------------------   §f§r\nDer Preis berechnet sich pro Block.\nSetze den Preis vom Grundstücken auf           ein bestimmten Preis.\n§l      --------------------      §8§lGrund", "Schreibe hier");
    form.slider("§8§lPreis", 100, 1000, 50, price);

    form.show(player).then((response) => {
        if (response.canceled) return;
        let costBefore = {
            limit: limit,
            max: max,
            price: price
        };
        let costSaving = {
            limit: limit,
            max: max,
            price: Math.floor(response.formValues[1])
        };
        player.runCommandAsync("scoreboard players reset \"$setting(" + textToBinary(JSON.stringify(costBefore)) + ")\" database");
        player.runCommandAsync("scoreboard players add \"$setting(" + textToBinary(JSON.stringify(costSaving)) + ")\" database 1");
        player.sendMessage(`§f[§b§li§r] §7 Der Mietpreis wurde aufgrund ${response.formValues[0]} auf ${response.formValues[1]} gesetzt`);
        settings = [];
    });
}

export function setting1(player) {
	let { max, price, limit } = initSettings();
    let form = new ModalFormData();
    form.title(`Grundstück Verwaltung`);
    form.slider("§l      --------------------   §f§r\nDer Preis berechnet sich pro Block.\nSetze den Preis vom Grundstücken auf           ein bestimmten Preis.\n§l      --------------------      §8§lGröße", 100, 10000, 100,max);
    form.slider("§8§lGrundstücke", 1, 10, 1, limit);
    form.show(player).then((response) => {
        if (response.canceled) return;
        let maxBefore = {
            limit: limit,
            max: max,
            price: price
        };
        let maxSaving = {
            limit: limit,
            max: Math.floor(response.formValues[0]),
            price: price
        };
        if (response.formValues[0] !== max) {
            player.runCommandAsync("scoreboard players reset \"$setting(" + textToBinary(JSON.stringify(maxBefore)) + ")\" database");
            player.runCommandAsync("scoreboard players add \"$setting(" + textToBinary(JSON.stringify(maxSaving)) + ")\" database 1");
            player.sendMessage("§f[§b§li§r] §7Einstellungen erfolgreich geändert!");
            settings = [];
        }
        if (response.formValues[1] !== limit) {
            let limitBefore = {
                limit: limit,
                max: max,
                price: price
            };
            let limitSaving = {
                limit: Math.floor(response.formValues[1]),
                max: max,
                price: price
            };
            player.runCommandAsync("scoreboard players reset \"$setting(" + textToBinary(JSON.stringify(limitBefore)) + ")\" database");
            player.runCommandAsync("scoreboard players add \"$setting(" + textToBinary(JSON.stringify(limitSaving)) + ")\" database 1");
            player.sendMessage("§f[§b§li§r] §7Einstellungen erfolgreich geändert!");
            settings = [];
        }
    });
}

export function buyland(player) {
	let { max, price, limit } = initSettings();
	const form = new ModalFormData();
  
	let x1, y1, z1, x2, y2, z2;
  
	const pos1 = player
	  .getTags()
	  .filter((t) => t.startsWith("pos1"))
	  .map((t) => t.replace("pos1,", ""));
  
	const pos2 = player
	  .getTags()
	  .filter((t) => t.startsWith("pos2"))
	  .map((t) => t.replace("pos2,", ""));
  
	[x1, y1, z1] = pos1[0].split(",");
	[x2, y2, z2] = pos2[0].split(",");
  
	let bxmin = Math.min(x1, x2);
	let bxmax = Math.max(x1, x2);
	let bzmin = Math.min(z1, z2);
	let bzmax = Math.max(z1, z2);
	let cost = Math.floor(price * (((bxmax + 1) - bxmin) * ((bzmax + 1) - bzmin)));
  
	const playerNameList = Array.from(world.getPlayers(), (plr) => plr.nameTag);
  
	const totalBlocks = (Math.abs(x2 - x1) + 1) * (Math.abs(z2 - z1) + 1);
	form.title(`§5Grundstück kaufen §l(${totalBlocks} Blöcke)§r`);
	form.dropdown(`\n§7Position 1: ${pos1}\nPosition 2: ${pos2}\nGrundstückpreis: ${cost} Coins\n§8§lSpieler`, playerNameList);
	form.textField(`§8§lName`,`Schreibe hier` )
  
	form.show(player).then((response) => {
	  if (response.canceled) return;
	  
	  if (getMoney(player) < cost) {
			exception('NotEnoughMoney', player, "")
	  }
	  let buyData = {
		owner: playerNameList[response.formValues[0]],
		name: response.formValues[1],
		id: response.formValues[1].toLowerCase(),
		access: [],
		dim: player.dimension.id,
		xmin: bxmin,
		xmax: bxmax,
		zmin: bzmin,
		zmax: bzmax,
		x1,
		z1,
		x2,
		z2
	  };
	  player.runCommandAsync("scoreboard players set \"$land(" + textToBinary(JSON.stringify(buyData)) + ")\" database 1");
	  player.sendMessage("§c§lMarkler §7>> Kauf erfolgreich!\n> Name: §e" + buyData.name + "§r\n> ID: §e" + buyData.id + "\n§r> Dimension: " + getDim(buyData.dim));
  
	  let bblocks1 = buyData.xmax - buyData.xmin;
	  let bblocks2 = buyData.zmax - buyData.zmin;
	  player.sendMessage("§f[§b§li§r]§7 Koordinaten: §e(" + buyData.x1 + ", " + buyData.z1 + ") §e(" + buyData.x1 + ", " + buyData.z2 + ") §f(" + bblocks1 + "x" + bblocks2 + " blocks)");
	  addMoney(player, - cost)
	});
  }
  
  export function sellland(player) {
	let { max, price, limit } = initSettings();
	const form = new ModalFormData();
	form.title(`§5Grundstück verkaufen§r`);
  
	const lands = getLands(player);
	const landNames = lands.map((land) => land.name); // Move landNames declaration outside the if-else block
  
	if (lands.length > 0) {
	  form.dropdown(
		`\n§l§8§l      --------------------   §f§r\nWähle das Grundstück aus was du verkaufen willst, der Preis des Grundstücks berechnet sich aus der Anzahl der Blöcke\n§l      --------------------      `,
		[...landNames]
	  );
	} else {
	  exception("NoPlotOwned", player, "")
	  return;
	}
	form.show(player).then((response) => {
	  if (response.canceled) return;
	  if (response.formValues[0] !== null && response.formValues[0] !== undefined) {
		const selectedLand = lands.find((land) => land.name === response.formValues[0]);
  
		const sc = calculatePrice(selectedLand); 
  
		new MessageFormData()
		  .title("§rVerkauf - Details")
		  .body(`§r§lBist du sicher, dass du das Haus verkaufen willst? \nHaus: ${selectedLand.name}\nPreis:${sc}`)
		  .button1("§4Ablehnen")
		  .button2("§aBestätigen")
		  .show(player)
		  .then((res) => {
			if (res.canceled) return;
			if (res.selection == 1) {
			  // Handle the user's response to the message form
			  player.runCommandAsync("scoreboard players reset \"$land(" + textToBinary(JSON.stringify(selectedLand)) + ")\" database");
			  const ind = lands.indexOf(selectedLand);
			  lands.splice(ind, 1);
			  player.sendMessage("§f[§b§li§r] §7Erfolgreich" + selectedLand.id + "!");
			  addMoney(player, Math.floor(sc))
			}
		  });
	  }
  
	  // Other code to handle the form response...
	});
  }
  export function landinfo(player) {
	let pos = {
		x: Math.floor(player.location.x),
		z: Math.floor(player.location.z),
		dim: player.dimension.id
	};
	let lands = checkLand(pos);
	if (lands != undefined) {
	new MessageFormData()
		  .title("§rGrundstück - Info")
		  .body(`Grundstück: §e${lands.name}\n§rBesitzer: §e${lands.owner}\n§rKoordinaten: §e(${lands.x1}, ${lands.z1}) (${lands.x2}, ${lands.z2})`)
		  .show(player)
		  .button1("§4Abbruch")
		  .button2("§aOk")
	}
else {
	exception("NoOwnerKnown", player, "")
}
  }