execute as @s[scores={Coins=450..}] run tag @s add Kaufen 
execute as @s[tag=Kaufen] run scoreboard players remove @s Coins 450
execute as @s[tag=Kaufen] run tellraw @s {"rawtext":[{"text":" §aKauf erfolgreich"}]}
execute as @s[tag=Kaufen] run give @s block:concrete_tv_furniture
execute as @s[tag=Kaufen] run tag @s remove Kaufen
execute as @s[scores={Coins=0..499}] run tellraw @s {"rawtext":[{"text":" §cDu hast nicht genug Geld"}]}