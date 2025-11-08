execute positioned -199 62 143 as @a [r=5,scores={Tick=1..11}] run setblock -199 62 143 air
execute positioned -199 62 143 as @a [r=5,scores={Tick=1..11}] run setblock -199 62 145 stone_button ["facing_direction"=4]
execute positioned -199 62 145 as @a [r=5,scores={Tick=1..11},tag=Moderator] run setblock -197 65 143 redstone_block
execute positioned -199 62 145 as @a [r=5,scores={Tick=1..11},tag=Moderator] run setblock -197 65 145 air
execute positioned -199 62 143 as @a [r=5,scores={Tick=1..11}] run tellraw @s {"rawtext":[{"text":"[§aangemeldet§f] §fModerator"}]}
execute positioned -199 62 143 as @a [r=5,scores={Tick=1..11}] run structure load studio_load -197 49 120
execute positioned -199 62 143 as @a [r=5,scores={Tick=1..11}] run tag @s add Moderator
execute positioned -199 62 143 as @a [r=5,scores={Tick=1..11}] run tag @s remove offdutyModerator