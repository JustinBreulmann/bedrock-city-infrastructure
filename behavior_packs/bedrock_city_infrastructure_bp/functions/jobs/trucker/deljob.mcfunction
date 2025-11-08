tellraw @s[tag=!Trucker] {"rawtext":[{"text":"Du hast den §aTrucker §fnicht!"}]}
tag @s [scores={job=0..4},tag=Trucker] remove Trucker
execute as @s [tag=!Trucker] run tellraw @s {"rawtext":[{"text":"Du hast den §aTrucker §fangenommen!"}]}