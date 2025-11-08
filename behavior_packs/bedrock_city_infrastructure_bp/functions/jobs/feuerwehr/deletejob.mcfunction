execute as @s[tag=ausbildung:Feuerwehr ] run tellraw @s[tag=ausbildung:Feuerwehr ] {"rawtext":[{"text":" §cDu hast belegst Ausbildungsgang bereits"}]}
execute as @s[tag=Feuerwehr ] run tellraw @s[tag=ausbildung:Feuerwehr ] {"rawtext":[{"text":" §cDu hast diese Ausbildung bereits abgeschlossen"}]} 
execute as @s[tag=!ausbildung:Feuerwehr ] run tag @s add ausbildung:Feuerwehr 