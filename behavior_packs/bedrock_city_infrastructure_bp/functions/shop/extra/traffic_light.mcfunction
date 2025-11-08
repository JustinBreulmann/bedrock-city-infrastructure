execute as @s[scores={Coins=1500..}] run tag @s add Kaufen 
execute as @s[tag=Kaufen] run scoreboard players remove @s Coins 1500
execute as @s[tag=Kaufen] run tellraw @s {"rawtext":[{"text":" §aKauf erfolgreich"}]}
execute as @s[tag=Kaufen] run give @s block:traffic_light_0
execute as @s[tag=Kaufen] run tag @s remove Kaufen
execute as @s[scores={Coins=0..1499}] run tellraw @s {"rawtext":[{"text":" §cDu hast nicht genug Geld"}]}