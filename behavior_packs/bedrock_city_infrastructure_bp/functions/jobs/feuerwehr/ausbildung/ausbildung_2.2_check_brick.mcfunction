scoreboard players set @p[scores={ausbildung_2=!1}] ausbildung_2 2
tellraw @p[tag=ausbildung:Feuerwehr ,tag=!got] {"rawtext":[{"text":" §aBrickblock §2gefunden"}]}
tag @p add got
fill -499 76 145 -504 74 144 air 
fill -499 76 156 -499 74 155 air
function jobs/feuerwehr/ausbildung/ausbildung_3.1_reset
title @p actionbar §6Gehe in den nächsten Raum, um deine Ausbildung fortzusetzen