

#Timer
# Sekunden erhöhen
scoreboard players add @a[tag=!pause, scores={Tick=1}] Sek 1


# Minuten und Sekunden umrechnen
execute as @a[scores={SekO=60..,Tick=1}, tag=!pause] run scoreboard players add @s MinO 1
execute as @a[scores={SekO=60..,Tick=1},tag=!pause] run scoreboard players remove @s SekO 60
execute as @a[scores={Sek=60..,Tick=1},tag=!pause] run scoreboard players add @s Min 1
execute as @a[scores={Sek=60..,Tick=1},tag=!pause] run scoreboard players remove @s Sek 60
