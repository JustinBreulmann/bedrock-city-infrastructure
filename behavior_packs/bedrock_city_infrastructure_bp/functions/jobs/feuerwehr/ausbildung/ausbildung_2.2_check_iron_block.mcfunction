scoreboard players set @p[scores={ausbildung_2=!1}] ausbildung_2 2
tellraw @p[tag=ausbildung:Feuerwehr ,tag=!got] {"rawtext":[{"text":" §aEisenblock §2gefunden"}]}
tag @p add got
fill -499 76 145 -504 74 144 air 
fill -499 76 156 -499 74 155 air
title @p actionbar §6gehe in den nächsten Raum, um deine Ausbildung fortzusetzen
function jobs/feuerwehr/ausbildung/ausbildung_3.1_reset
