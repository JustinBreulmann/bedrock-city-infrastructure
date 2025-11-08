execute as @s[scores={Coins=1200..}] run tag @s add Kaufen 
execute as @s[tag=Kaufen] run scoreboard players remove @s Coins 1200
execute as @s[tag=Kaufen] run tellraw @s {"rawtext":[{"text":" §aKauf erfolgreich"}]}
execute as @s[tag=Kaufen] run give @s block:kitchen_counter
execute as @s[tag=Kaufen] run tag @s remove Kaufen
execute as @s[scores={Coins=0..1199}] run tellraw @s {"rawtext":[{"text":" §cDu hast nicht genug Geld"}]}