#function
function jobs/moderator/job1
function command/worldedit
function infrastructure/bahn/system
function infrastructure/feuerwehr/system
function system/banned

#garage
scoreboard players add @a Tick 1
scoreboard players set @a[scores={Tick=20}] Tick 0


#invisible
execute as @e[type=armor_stand, tag=station] run effect @s invisibility 250 250 true