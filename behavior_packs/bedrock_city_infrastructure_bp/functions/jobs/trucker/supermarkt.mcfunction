tellraw @p [tag=Trucker] {"rawtext":[{"text":"Auftrag: §eLiefere Beton zur Baustelle"}]}
give @p [tag=Trucker] compass
tag @p[tag=Trucker,r=30] add Auftrag1
#summon peterbilt389:black1 113.84 68.00 -341.43
tellraw @p [tag=Auftrag1] {"rawtext":[{"text":"Info:§eSteige in den Laster, der außerhalb der Lagerhalle für dich bereitgestellt wurde!"}]}