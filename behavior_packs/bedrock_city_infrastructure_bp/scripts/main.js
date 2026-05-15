import { world, system } from "@minecraft/server";
import { initDB_Land, initSettings } from "./core/plot/functions.js";
import { plots } from "./core/plot/plots.js";
import { timer } from "./core/timer.js";

system.runInterval(() => {
    initDB_Land();
    initSettings();
    plots();
    timer();
}, 20);

console.warn("[Bedrock City Infrastructure] Smartphone OS & City Life aktiv.");

// Build-Trace #41: Datei neu formatiert

// Build-Trace #42: Hilfsfunktion refaktoriert

// Build-Trace #43: Cooldown angepasst

// Build-Trace #44: Randfall abgefangen
