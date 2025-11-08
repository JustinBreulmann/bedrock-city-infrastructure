replaceitem entity @p[tag=ausbildung:Feuerwehr ] slot.hotbar 8 compass
tellraw @p[tag=ausbildung:Feuerwehr ] {"rawtext":[{"text":"[§l§b!§r] §7Ausbildung bei der §cFeuerwehr §7begonnen"}]}
tellraw @p[tag=ausbildung:Feuerwehr ] {"rawtext":[{"text":"[§l§b!§r] §7Begib dich zur §cFeuerwache §43 §7um deine Ausbildung zur starten"}]}
tag @p [tag=ausbildung:Feuerwehr] add "x:-508"
tag @p [tag=ausbildung:Feuerwehr] add "y:75"
tag @p [tag=ausbildung:Feuerwehr] add "z:194"