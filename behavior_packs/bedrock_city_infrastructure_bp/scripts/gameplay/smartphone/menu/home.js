import {world,Player,ItemStack,system,ItemTypes} from "@minecraft/server"
import {ActionFormData,MessageFormData,ModalFormData,ActionFormResponse,MessageFormResponse,ModalFormResponse} from "@minecraft/server-ui";
import {settings} from "./settings"
import {bank} from "./bank"
import {joblist} from "../../job/menu"
import {dispatchmenu} from "../../job/dispatch/menu"
import {messenger} from "./messenger"
import { music } from "./music";
import { maps } from "./maps"
import { homes } from "./homes"
import { shop } from "../shop/shop";
import { jobMenu } from "../../job/jobMenu";

export function home(player) {
    let functions = []
    let actionForm = new ActionFormData()
    actionForm.title(`Smartphone`)
    {
        actionForm.button("§r§l§8Einstellungen\n§rKlicke", "textures/icons_apps/settings.png")
        functions.push(r => {
            settings(player)
        })
    }
    if(player.hasTag("konto")) {
    {
        actionForm.button("§r§l§8Bank§r\nKlicke", "textures/icons_apps/bank.png")
        functions.push(r => {
            bank(player)
        })
    }
}
    {
        actionForm.button("§r§l§8Job§r\nKlicke", "textures/icons_apps/joblist.png")
        functions.push(r => {
            jobMenu(player)
        })
    }
    {
        actionForm.button("§r§l§8Aufträge§r\nKlicke", "textures/items/book_portfolio")
        functions.push(r => {
            dispatchmenu(player)
        })
    }
    {
        actionForm.button("§r§l§8Messenger§r\nKlicke", "textures/ui/mute_off")
        functions.push(r => {
            messenger(player)
        })
    }
    {
        actionForm.button("§r§l§8Music§r\nKlicke", "textures/icons_apps/music.png")
        functions.push(r => {
            music(player)
        })
    }
    {
        actionForm.button("§r§l§8Maps§r\nKlicke", "textures/ui/icon_map")
        functions.push(r => {
            maps(player)
        })
    }
    {
        actionForm.button("§r§l§8Shop§r\nKlicke", "textures/icons_apps/app_store.png")
        functions.push(r => {
            shop(player)
        })
    }
    {
        actionForm.button("§r§l§8Wegpunkte§r\nKlicke", "textures/icons_apps/store.png")
        functions.push(r => {
            homes(player)
        })
    }
    actionForm.show(player).then(r => {
        if (r.canceled) return
        functions[r.selection]()
    })
}