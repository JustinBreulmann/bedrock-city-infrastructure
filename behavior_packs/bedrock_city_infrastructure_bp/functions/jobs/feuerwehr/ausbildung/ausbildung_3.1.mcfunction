fill -503 74 144 -503 76 145 stained_glass_pane
setblock -513 74 159 iron_door 
tellraw @p {"rawtext":[{"text":"[§6Günter§f] §7Sichere das Haus vor Bränden, indem du §0Grass entfernst, Zäune austauscht & einen Blitzableiter §7installierst "}]}
fill -516 74 150 -516 76 151 barrier
scoreboard players add @p[tag=ausbildung:Feuerwehr,scores={f_ausbildung=1}] f_ausbildung 1