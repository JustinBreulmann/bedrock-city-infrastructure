execute as @s[scores={Coins=300..}] run tag @s add Kaufen 
execute as @s[tag=Kaufen] run scoreboard players remove @s Coins 300
execute as @s[tag=Kaufen] run tellraw @s {"rawtext":[{"text":" §aKauf erfolgreich"}]}
execute as @s[tag=Kaufen] run give @s block:roteador_wifi
execute as @s[tag=Kaufen] run tag @s remove Kaufen
execute as @s[scores={Coins=0..299}] run tellraw @s {"rawtext":[{"text":" §cDu hast nicht genug Geld"}]}