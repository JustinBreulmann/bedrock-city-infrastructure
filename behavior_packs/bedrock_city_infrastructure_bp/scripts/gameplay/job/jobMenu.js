import { world, system } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { Moderator } from "./moderator/menu";
import { Polizei } from "./Polizei";
import { Markler } from "../../core/plot/land";
import { Stadtwerke } from "./stadtwerke";
import { Banker } from "./bank/banker";
import { Feuerwehr } from "./feuerwehr";
import { setdispatch } from "./dispatch/setting";
import { jobs1 } from "../../extensions/config";

export let jobName = {
    "Feuerwehr": "Feuerwehr", //Tag, Name
    "Stadtwerke": "Stadtwerke",
    "Moderator": "Moderator",
    "Polizei": "Polizei",
    "Markler": "Markler",
    "Bänker": "Bänker"
}

export function jobMenu(player) {
    let functions = [];

    let actionForm = new ActionFormData();
    actionForm.title(`Jobliste`);

    // Dispatch erstellen button
    actionForm.button("§f§lDispatch erstellen");
    functions.push(() => {
        setdispatch(player);
    });

    // Moderator-Job
    let moderatorStatus = player.getTags().includes("Moderator") ? "§aAktiv" : "§cInaktiv";

    if (player.getTags().includes("offduty:Moderator")) {
        moderatorStatus = "§cInaktiv";
    }
    
    if (moderatorStatus === "§aAktiv") {
        actionForm.button(`§r§l§8Moderator§r\n${moderatorStatus}`);
        functions.push(() => {
            Moderator(player);
        });
    }

    const jobs = player.getTags();

    // Loop through jobName and check if the job should be displayed based on tags
    for (let jobTag in jobName) {
        if (jobTag === "Moderator") {
            continue; // Skip the Moderator job tag
        }

        let jobDisplayName = jobName[jobTag];
        let status = "§cInaktiv";

        if (jobs.includes(jobTag)) {
            status = "§aAktiv";
        } else if (jobs.includes(`ausbildung:${jobTag}`)) {
            status = "§2Ausbildung";
        } else if (jobs.includes(`offduty:${jobTag}`)) {
            status = "§cInaktiv";
        } else {
            continue;
        }

        // Job button
        actionForm.button(`§r§l§8${jobDisplayName}§r\n${status}`);
        functions.push(() => {
            if(status === "§cInaktiv") {
            setActiveJob(player, jobTag, jobs);
            }
            else {
                executeJobAction(player,jobTag)
            }
        });
    }

    actionForm.show(player).then(r => {
        if (r.canceled) return;
        functions[r.selection]();
    });
}

function setActiveJob(player, newJobTag, existingJobs) {
    const allowedTags = ["Feuerwehr", "Stadtwerke", "Markler", "Polizei", "Bänker"]; // Update with allowed job tags
    const jobColor = jobs1[newJobTag]; // Use the jobs1 object to get the color
    const jobTitle = jobName[newJobTag]; // Use the jobName object to get the display name


    // Deactivate all jobs at the top of the list that are allowed and not marked offduty
    for (const jobTag of existingJobs) {
        if (allowedTags.includes(jobTag) && jobTag !== newJobTag && !jobTag.startsWith("offduty:")) {
            player.removeTag(jobTag);
            player.addTag(`offduty:${jobTag}`);
            
            // Check if there are no players with the jobTag
            const playersWithJobTag = world.getAllPlayers().filter(p => p.getTags().includes(jobTag));
            if (playersWithJobTag.length < 1) {
                const offDutyMessage = `${jobs1[jobTag]}${jobName[jobTag]} §a befindet sich nun nicht mehr im Dienst`;
                for (const players of world.getAllPlayers()) {
                players.sendMessage(offDutyMessage);
                }
            }
        }
    }

    // Activate the selected job
    if (world.getAllPlayers().filter(p => p.getTags().includes(newJobTag)).length < 1) {

        player.addTag(newJobTag);
        player.removeTag(`offduty:${newJobTag}`);
        const onDutyMessage = `${jobColor}${jobTitle} §a befindet sich nun im Dienst`;
        for (const players of world.getAllPlayers()) {
        players.sendMessage(onDutyMessage);
        }
    }
}





function executeJobAction(player, jobTag) {
    if (jobName[jobTag] === "Polizei") {
        Polizei(player);
    } else if (jobName[jobTag] === "Markler") {
        Markler(player);
    } else if (jobName[jobTag] === "Bänker") {
        Banker(player);
    } else if (jobName[jobTag] === "Stadtwerke") {
        Stadtwerke(player);
    } else if (jobName[jobTag] === "Feuerwehr") {
        Feuerwehr(player);
    } else {
        player.sendMessage(`§b§lServer §8>> Es wurde keine Aktion für den Job ${jobName[jobTag]} definiert.`);
    }
}
