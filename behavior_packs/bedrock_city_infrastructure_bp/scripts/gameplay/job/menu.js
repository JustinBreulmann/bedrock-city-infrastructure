import {world,Player,ItemStack,system,ItemTypes} from "@minecraft/server"
import {ActionFormData,MessageFormData,ModalFormData,ActionFormResponse,MessageFormResponse,ModalFormResponse} from "@minecraft/server-ui";

import { getScore } from "../../extensions/module/getScore";
import { currency } from "../../extensions/config";
import {Banker} from "./bank/banker";
import { Moderator } from "./moderator/menu";
import { Feuerwehr } from "./feuerwehr";
import { Polizei } from "./Polizei";
import { Stadtwerke } from "./stadtwerke";
import {setdispatch} from "./dispatch/setting"
import { Markler } from "../../core/plot/land";


export function joblist(player) {
    let functions = []
    let actionForm = new ActionFormData()
    actionForm.title(`Jobmenu`)
    actionForm.body(`${player.name}              ${getScore(player, currency)} Coins\n`)
    {
        actionForm.button("§f§lDispatch erstellen")
        functions.push(r => {
            setdispatch(player)
        })
    }
    if (player.hasTag("Feuerwehr")) {
        actionForm.button("Feuerwehr", "textures/ui/fire_resistance_effect.png")
        functions.push(r => {
            Feuerwehr(player)
        })
    }
    if (player.hasTag("Polizei")) {
        actionForm.button("Polizei", "textures/ui/resistance_effect.png")
        functions.push(r => {
            Polizei (player)
        })
    }
    if (player.hasTag("Stadtwerke")) {
        actionForm.button("Stadtwerke", "textures/ui/haste_effect.png")
        functions.push(r => {
            Stadtwerke (player)
        })
    }
    if (player.hasTag("Banker_WSH") || player.hasTag("Bänker")) {
        actionForm.button("Bänker", "textures/ui/village_hero_effect.png")
        functions.push(r => {
            Banker (player)
        })
    }
    if (player.hasTag("Moderator")) {
        actionForm.button("Moderator", "textures/items/microfon.png")
        functions.push(r => {
            Moderator (player)
        })
    }
    if (player.hasTag("Markler")) {
        actionForm.button("Markler", "textures/items/paper.png")
        functions.push(r => {
            Markler (player)
        })
    }
    actionForm.show(player).then(r => {
        if(r.canceled) return
        functions[r.selection]()
    })
}