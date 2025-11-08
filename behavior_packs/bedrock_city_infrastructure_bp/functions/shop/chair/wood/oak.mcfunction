execute as @s[scores={Coins=150..}] run tag @s add Kaufen 
execute as @s[tag=Kaufen] run scoreboard players remove @s Coins 150
execute as @s[tag=Kaufen] run tellraw @s {"rawtext":[{"text":" §aKauf erfolgreich"}]}
execute as @s[tag=Kaufen] run give @s block:chair
execute as @s[tag=Kaufen] run tag @s remove Kaufen
execute as @s[scores={Coins=0..149}] run tellraw @s {"rawtext":[{"text":" §cDu hast nicht genug Geld"}]}