import { world, Player, ItemStack, system, ItemTypes } from "@minecraft/server";
import { ActionFormData, MessageFormData, ModalFormData, ActionFormResponse, MessageFormResponse, ModalFormResponse } from "@minecraft/server-ui";
import { Orientierung } from "../../../extensions/config";

export function maps(player) {
    let form = new ModalFormData();

    let OrientierungValues = Object.keys(Orientierung);
    let OrientierungLabels = Object.values(Orientierung);

    const homesNames = player.getTags().filter((t) => t.startsWith("homes:"));

    let names = "";
    let message = "";
    let x = "";
    let y = "";
    let z = "";

    if (homesNames.length > 0) {
        let tag = homesNames[0].split(",");
        names = tag[0].replace("homes:", "");
        message = tag[1].replace("message:", "");
        x = tag[2].replace("x:", "");
        y = tag[3].replace("y:", "");
        z = tag[4].replace("z:", "");
    }

    form.title(`Maps`);//Orientierungspunkte + description
    form.dropdown("Setze Wegpunkte um dich in der Stadt zu Orientieren. Um eigene Wegpunkte zu setzen, nutze die App in deinem Hauptmenu. \n§l§8Orientierungspunkte", ["Keine", ...OrientierungValues]);
    //homes, wenn gesetzt
    if (homesNames.length > 0) {
        form.dropdown("§l§8Homes", ["Keine", names]);
    }
    //Koordinaten
    form.textField("§l§8Koordinaten", `${Math.round(player.location.x)},${Math.round(player.location.y)},${Math.round(player.location.z)}`);
    //teleport
    if (player.hasTag(`Bürgermeister`)) {
        form.toggle("Teleportieren", true);
    }
// response.selection
form.show(player).then((response) => {
    if (response.canceled) return;

    let orientIndex = response.formValues[0];
    let homesIndex = response.formValues[1];
    let coordsValue = response.formValues[2];
    let teleportValue = response.formValues[3];

    // Hier überprüfen wir, ob homesNames.length > 0 und passen die Indexe an
    if (homesNames.length === 0) {
        coordsValue -= 1;
        homesIndex -= 2;
        teleportValue -= 1
    }

    if (orientIndex >= 0) {
        let orient = OrientierungLabels[orientIndex].split(",");
        x = orient[0];
        y = orient[1];
        z = orient[2];

        if (!teleportValue) {
            player.addTag(`${x}`);
            player.addTag(`${z}`);
        } else {
            if (player.hasTag(`Bürgermeister`) && teleportValue === true) {
                player.teleport({x:x.replace("x:",""),y:y.replace("y:",""),z:z.replace("z:","")});
            }
        }
    }

    if (homesNames.length > 0 && homesIndex >= 0) {
        if (!teleportValue) {
            player.addTag(`x:${x}`);
            player.addTag(`z:${z}`);
        } else {
            if (player.hasTag(`Bürgermeister`) && teleportValue === true) {
                player.teleport({x:x.replace("x:",""),y:y.replace("y:",""),z:z.replace("z:","")});
            }
        }
    }

    if (orientIndex === -1 && homesIndex === -1) {
        if (isNaN(parseFloat(coordsValue))) {
            player.sendMessage(`§cDie Koordinaten müssen Nummern sein!§r`);
        } if (!teleportValue ) {
            let cords = coordsValue.split(",");
            x = parseFloat(cords[0]);
            y = parseFloat(cords[1]);
            z = parseFloat(cords[2]);

            player.addTag(`x:${x}`);
            player.addTag(`z:${z}`);
        }
        else {
            if (player.hasTag(`Bürgermeister`) && teleportValue === true) {
                player.teleport({x:x.replace("x:",""),y:y.replace("y:",""),z:z.replace("z:","")});
            }
        }
    }
});
}
