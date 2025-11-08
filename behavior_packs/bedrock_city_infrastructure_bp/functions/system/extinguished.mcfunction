execute as @s at @s run fill ~-1 ~-0.5 ~-1 ~1 ~0.5 ~1 air [] replace minecraft:fire
execute as @s at @s run fill ~-1 ~-0.5 ~-1 ~1 ~0.5 ~1 campfire ["extinguished"=true] replace campfire ["extinguished"=false]
execute as @s at @s run particle feuerwehr:fe_hit
execute as @s at @s run effect @e[r=0.4] fire_resistance 2 0 true