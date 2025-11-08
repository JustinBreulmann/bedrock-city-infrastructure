import {world,Player,ItemStack,system,ItemTypes} from "@minecraft/server"
import {ActionFormData,MessageFormData,ModalFormData,ActionFormResponse,MessageFormResponse,ModalFormResponse} from "@minecraft/server-ui";

export function Broadcast(player) {
    let form = new ModalFormData();
    form.title(`Nachrichtenmeldung`);
    form.dropdown(`\n    Alternativ kannst du auch "@news" \n              <Nachricht> nutzen\n\nSender`, ["Verkehrsmeldung", "News", "Eilmeldung","Werbung"]);
    form.textField("text.message", "text.type_here");
    form.show(player).then((response) => {
        if (response.canceled) return;

        for (const player of world.getAllPlayers()) {

        if (response.formValues[0] == 0) {
            player.sendMessage(`§3§lVerkehr §b>> §r${response.formValues[1]}`);
        }
        if (response.formValues[0] == 1) {
            player.sendMessage(`§3§lChannel§f4 §b>> §r ${response.formValues[1]}`);
        }
        if (response.formValues[0] == 2) {
            player.sendMessage(`§3§lEilmeldung §b>> §r ${response.formValues[1]}`);
        }
        if (response.formValues[0] == 3) {
            player.sendMessage(`§3§lWerbung §b>> §r ${response.formValues[1]}`);
            }
        }
    });

}
