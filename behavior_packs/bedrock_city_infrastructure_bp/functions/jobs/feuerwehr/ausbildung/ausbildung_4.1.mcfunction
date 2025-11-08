fill -520 76 159 -522 79 159 air
tellraw @p[tag=ausbildung:Feuerwehr,scores={Tick=1}] {"rawtext":[{"text":"§3Aufgabe: §bSchließe alle drei Aufgaben auf dem Übungsgelände ab"}]}
scoreboard players add @p[tag=ausbildung:Feuerwehr,scores={f_ausbildung=2}] f_ausbildung 1