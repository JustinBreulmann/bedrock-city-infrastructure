execute as @s[scores={Coins=160..}] run tag @s add Kaufen 
execute as @s[tag=Kaufen] run scoreboard players remove @s Coins 160
execute as @s[tag=Kaufen] run tellraw @s {"rawtext":[{"text":" §aKauf erfolgreich"}]}
execute as @s[tag=Kaufen] run give @s block:mirror
execute as @s[tag=Kaufen] run tag @s remove Kaufen
execute as @s[scores={Coins=0..159}] run tellraw @s {"rawtext":[{"text":" §cDu hast nicht genug Geld"}]}