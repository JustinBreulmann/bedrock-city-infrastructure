execute as @s[scores={Coins=100..}] run tag @s add Kaufen 
execute as @s[tag=Kaufen] run scoreboard players remove @s Coins 100
execute as @s[tag=Kaufen] run tellraw @s {"rawtext":[{"text":" §aKauf erfolgreich"}]}
execute at @s as @s[tag=Kaufen] run effect @e[r=5, family=cars] regeneration 10 10 true
execute at @s as @s[tag=Kaufen] positioned as @e[family=cars,r=5] run particle dust_color_transition
execute as @s[tag=Kaufen] run tag @s remove Kaufen
execute as @s[scores={Coins=0..99}] run tellraw @s {"rawtext":[{"text":" §cDu hast nicht genug Geld"}]}