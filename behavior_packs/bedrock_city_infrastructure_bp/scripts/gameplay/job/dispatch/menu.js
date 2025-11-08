import { world, Player, ItemStack, system, ItemTypes } from "@minecraft/server";
import {
  ActionFormData,
  MessageFormData,
  ModalFormData,
  ActionFormResponse,
  MessageFormResponse,
  ModalFormResponse,
} from "@minecraft/server-ui";

export function dispatchmenu(player) {
  let actionForm = new ActionFormData().title("§rDispatch§r");
  const players = Array.from(world.getPlayers());

  const dispatchNames = players.filter((p) => p.getTags().find((t) => t.startsWith("dispatch:")));
  let warps = [];

  let rank, explayer, x, y, z, message; 

  for (let dispatch of dispatchNames) {
    let tags = dispatch.getTags().filter((t) => t.startsWith("dispatch:"));
    for (let tag of tags) {
      let tagData = tag.split(",");
      rank = tagData[0].replace("dispatch:", "").replace("0", "Feuerwehr").replace("1", "Polizei").replace("2", "Stadtwerke");
      message = tagData[1].replace("message:", "");
      x = tagData[2];
      y = tagData[3];
      z = tagData[4];
      explayer = tagData[5].replace("name:", "");

      actionForm.button(`§l§8${rank} - ${explayer}\n§r${x},${y},${z}`);
      warps.push(tagData);
    }
  }

  actionForm.button("§r§c§lZurück§r\nHauptmenu");

  actionForm.show(player).then((response) => {
    if (response.canceled) return;
    else {
      new MessageFormData()
        .title("§rAuftrag - Details")
        .body(`§r§lBist du sicher, dass du diesen Dispatch annehmen willst?§r\n§8\nAngefordert: ${rank}\nAuftraggeber: ${explayer}\nPosition: ${x},${y},${z}\nBeschreibung: ${message}`)
        .button1("§4Ablehnen")
        .button2("§aBestätigen")
        .show(player)
        .then((res) => {
          if (res.canceled) return;
          if (res.selection == 1) {
            player.addTag(`${x}`);
            player.addTag(`${y}`);
            player.addTag(`${z}`);

            let rerank = rank.replace("Feuerwehr", "0").replace("Polizei", "1").replace("Stadtwerke", "2");

            player.removeTag(`"dispatch:${rerank},message:${message},${x},${y},${z},name:${explayer}"`);
            console.log("Rank:", rank);
          }
        });
    }
  });
}

