scoreboard players set @p ausbildung_2 0
clear @p
effect @p[tag=ausbildung:Feuerwehr,r=5] fire_resistance 30 1 true
summon chest_minecart -488 71 147 ~ ~ enter_water Ausbildung_2
fill -486 67 144 -486 67 141 redstone_block
fill -495 74 156 -489 74 146 fire [] replace air
tag @a remove got