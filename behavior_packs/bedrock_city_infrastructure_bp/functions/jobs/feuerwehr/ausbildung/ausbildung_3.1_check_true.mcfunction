tellraw @p[tag=ausbildung:Feuerwehr ] {"rawtext":[{"text":" Gebäude gesichert"}]}
setblock -507 72 155 air
function jobs/feuerwehr/ausbildung/ausbildung_3.1_reset
title @p actionbar Verlasse das Gebäude, begib dich zur Wache
fill -516 74 150 -516 76 151 air
replaceitem entity @p slot.hotbar 8 compass
setworldspawn -518 75 194
fill -520 75 159 -522 78 159 barrier [] replace air