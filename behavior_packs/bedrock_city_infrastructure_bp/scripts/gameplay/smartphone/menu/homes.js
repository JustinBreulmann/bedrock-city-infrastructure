import {world,Player,ItemStack,system,ItemTypes} from "@minecraft/server"
import {ActionFormData,MessageFormData,ModalFormData,ActionFormResponse,MessageFormResponse,ModalFormResponse} from "@minecraft/server-ui";
import { home } from "./home";
import { exception } from "../../../exceptions/error";

export function homes(player) {
    let functions = []
    let actionForm = new ActionFormData()
    actionForm.title(`Wegpunkte`)
	actionForm.body(`§l      --------------------              §rSetze Wegpunkte, um deine \n           Lieblingsorte der Welt \n           immer wieder zufinden \n§l      --------------------      `)
	{
        actionForm.button("§8§lZurück\n§rHauptmenu", "textures/icons_apps/back.png")
        functions.push(r => {
            home(player)
        })
    }
    {
        actionForm.button("Hinzufügen", "textures/ui/plus.png")
        functions.push(r => {
            sethomes(player)
        })
    }
    {
        actionForm.button("Entfernen", "textures/blocks/barrier.png")
        functions.push(r => {
            removehomes(player)
        })
    }
    actionForm.show(player).then(r => {
		if (r.canceled) return
        functions[r.selection]()
    })
}

export function sethomes (player) {
	let form = new ModalFormData()
	const x = Math.floor(player.location.x)
	const y = Math.floor(player.location.y)
	const z = Math.floor(player.location.z)
	form.title("§rWegpunkte - Erstellen§r")
	form.textField("§l      --------------------      §r              Setze einen Wegpunkt \n           bei deiner Position\n§l      --------------------     \nName", "text.type_here")
	form.textField("§lBeschreibung", "text.type_here")
	form.show(player).then((response) => {
			if(response.canceled) return
			if (!response.formValues[1] == "") {

	const home = `homes:${response.formValues[0]},`					
	const message = `message:${response.formValues[1]},`		
	const position = `x:${x},y:${y},z:${z},`
	const homeTag = home + message+ position + `name:${player.name}`
			  player.addTag(homeTag);
			  player.sendMessage(`[§b§li§r] §7 Wegpunkt §6${home.replace("homes:","")}"§7 bei §6${position}§7 gesetzt.`);
			  player.playSound("random.toast")
			}
			if(response.formValues[2] == "") exception('DataInvaild', player, "")
		})
	}

export function removehomes(player) {
	let actionForm = new ActionFormData().title("§rWegpunkte - Entfernen");
  
	const homesNames = player.getTags().filter((t) => t.startsWith("homes:"));

	let name, message, x, y, z, explayer; // Declare the variables here
    let warps = [];
	for (let homes of homesNames) {
	  let tag = homes.split(",");
	  name = tag[0].replace("homes:","");
	  message = tag[1].replace("message:","");
	  x = tag[2];
	  y = tag[3];
	  z = tag[4];
	  explayer = tag[5].replace("name:", "");
  
	  actionForm.button(name + " " + explayer + "\n" + x + "," + y + "," + z);
	  warps.push(tag);
	}
	actionForm.button("§r§cSchließen§r");
	actionForm.show(player).then((response) => {
	  if (response.canceled) return 
	  else {
		new MessageFormData()
		  .title("§rEntfernen - Details")
		  .body(`§rBist du sicher, dass du diesen Wegpunkt löschen willst?§r\nName:${name}\nBeschreibung:${message}\nVon:${explayer}\nPosition:${x} ,${y} ,${z}`)
		  .button1("§4Ablehnen")
		  .button2("§aBestätigen")
		  .show(player)
		  .then((res) => {
			if (response.canceled) return
			if (res.selection == 1) {
  
			  player.removeTag(`homes:${name},message:${message},${x},${y},${z},name:${explayer}`)
			  player.sendMessage(`[§b§li§r] §7 Wegpunkt §6${name}"§7 bei §6${x},${y},${z} §7 entfernt.`);
  
			} else {
			  return
			}
		  });
	  }
	});
  }