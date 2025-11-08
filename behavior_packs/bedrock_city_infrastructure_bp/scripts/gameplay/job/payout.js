import { world, Player, system } from "@minecraft/server";
import { ActionFormData, MessageFormData, ModalFormData, ActionFormResponse, MessageFormResponse, ModalFormResponse } from "@minecraft/server-ui";

import { getScore } from "../../extensions/module/getScore";
import {job, currency} from "../../extensions/config"
import { addMoney } from "../money/animation";

export function payout(player) {
    let jobs = Object.keys(job);
    let money = Object.values(job);
    let joblist = jobs;
        let playerTags = player.getTags();
        let playerJobs = joblist.filter((job) => playerTags.includes(job));
        let tags = playerTags.filter((t) => t.startsWith("kredit:")).flatMap((t) => t.split(","));
        const offdutyJobs = playerTags.filter((tag) => tag.startsWith("offduty:"));
        let offdutyIncome = 0;
        if (offdutyJobs.length > 0) {
            offdutyIncome = offdutyJobs.reduce((sum, tag) => {
                let jobIndex = joblist.indexOf(tag.replace("offduty:", ""));
                if (jobIndex !== -1) {
                    return sum + 0.25 * parseInt(money[jobIndex]);
                } else {
                    return sum;
                }
            },20 )
        }

        if (playerJobs.length > 0 && tags.length === 0) {
            let jobAndMoney = playerJobs.map((job) => `\n  §f+ ${job}:§a $${parseInt(money[joblist.indexOf(job)])}`);
            let totalMoney = playerJobs.reduce((sum, job) => sum + parseInt(money[joblist.indexOf(job)]), 0) + offdutyIncome;
            player.sendMessage(`§3§lGehalt §r§b>> §fDeine täglichen Einnahmen: ${jobAndMoney.join(", ")}\n  §f+ Offdutyjobs: §a$${parseInt(offdutyIncome)}\n §f§lGesamt: §a$${parseInt(totalMoney)}`);
            addMoney(player, parseInt(totalMoney))

        } else if (playerJobs.length > 0) {
            let moneyTag = parseInt(tags[0].replace("kredit:", ""));
            let raten = parseInt(tags[1]);
            let topay = moneyTag - raten;
            let jobAndMoney = playerJobs.map((job) => `\n  §f+ ${job}:§a $${parseInt(money[joblist.indexOf(job)])}`);
            let totalMoney = playerJobs.reduce((sum, job) => sum + parseInt(money[joblist.indexOf(job)]), 0) + offdutyIncome;
            player.sendMessage(`§3§lGehalt §r§b>> §fDeine täglichen Einnahmen: ${jobAndMoney.join(", ")}\n  §f+ Offdutyjobs: §a$${parseInt(offdutyIncome)}\n §f§lGesamt: §a$${parseInt(totalMoney)}\n§r§l§cKredit §4>> §f \n -$${parseInt(raten)} §lwurden von deinem Kredit bezahlt. Du musst noch ${parseInt(topay)} Coins  bezahlen`);
            addMoney(player, -raten)
            player.removeTag(`kredit:${moneyTag},${raten}`);
            addMoney(player, totalMoney)
            if (topay > 0) {
                player.addTag(`kredit:${parseInt(topay)},${raten}`);
            }
        } else {
            player.sendMessage(`§3§lRegierung §b>>§r §fDu hast §a$250 §r von der §3Regierung §rerhalten.`);
        }
    }

