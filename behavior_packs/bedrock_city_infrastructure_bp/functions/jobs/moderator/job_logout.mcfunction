execute positioned -199 62 145 as @a [r=5,scores={Tick=1..11},tag=Moderator] run setblock -199 62 143 stone_button ["facing_direction"=4]
execute positioned -199 62 145 as @a [r=5,scores={Tick=1..11},tag=Moderator] run setblock -199 62 145 air
execute positioned -199 62 145 as @a [r=5,scores={Tick=1..11},tag=Moderator] run setblock -197 65 143 air
execute positioned -199 62 145 as @a [r=5,scores={Tick=1..11},tag=Moderator] run setblock -197 65 145 redstone_block
execute positioned -199 62 145 as @a [r=5,scores={Tick=1..11},tag=Moderator] run tellraw @s {"rawtext":[{"text":"[§cabgemeldet§f] Moderator"}]}
execute positioned -199 62 145 as @a [r=5,scores={Tick=1..11},tag=Moderator] run structure load studio_unload -197 49 120
execute positioned -199 62 145 as @a [r=5,scores={Tick=1..11},tag=Moderator] run tag @s add "offduty:Moderator"
execute positioned -199 62 145 as @a [r=5,scores={Tick=1..11},tag=Moderator] run tag @s remove Moderator