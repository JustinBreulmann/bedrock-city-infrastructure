replaceitem entity @p[tag=ausbildung:Feuerwehr ] slot.hotbar 8 compass
tellraw @p[tag=ausbildung:Feuerwehr ] {"rawtext":[{"text":" §aAusbildung bei der §2Feuerwehr §abegonnen"}]}
title @p[tag=ausbildung:Feuerwehr ] actionbar §6Folge der Kompassnadel, um zum nächsten Ziel zukommen 
setworldspawn -490 70 175
tellraw @p[tag=ausbildung:Feuerwehr ] {"rawtext":[{"text":"§aBegib dich zur §2Feuerwache 3 [-490,79,175] §a um deine Ausbildung zur starten"}]}