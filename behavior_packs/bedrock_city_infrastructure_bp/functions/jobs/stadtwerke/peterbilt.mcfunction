execute as @p[r=5,scores={Coins=250..}] run tag @s add Kaufen
execute as @p [tag=Kaufen] run scoreboard players remove @s Coins 250
execute as @p [tag=Kaufen] run tellraw @s {"rawtext":[{"text":"1 Tag §cLKW §fgemietet "}]}
#execute as @p [tag=Kaufen] run summon peterbilt389:yellow1
execute as @p [tag=Kaufen] run scoreboard players add @e[tag=Stadteinkommen] Coins 250
#execute as @p [tag=Kaufen] run scoreboard players add @e[type=peterbilt389:yellow1,r=1] Timer 10000
execute as @p[r=5,scores={Coins=0..229}] run tellraw @s {"rawtext":[{"text":"§cKauf fehlgeschlagen"}]}
tag @p remove Kaufen