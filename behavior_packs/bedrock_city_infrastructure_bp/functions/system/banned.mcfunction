#Anti 
execute as @e[type=ender_dragon] run tellraw @a {"rawtext":[{"text":" §4ender_dragon §cgetötet"}]}
execute as @e[type=ender_dragon] run kill @s
execute as @e[type=wither] run tellraw @a {"rawtext":[{"text":" §4wither §cgetötet"}]}
execute as @e[type=wither] run kill @s
execute as @e[type=command_block_minecart] run tellraw @a {"rawtext":[{"text":" §4command_block_minecart §cgetötet"}]}
execute as @e[type=command_block_minecart] run kill @s
execute as @e[type=tnt_minecart] run tellraw @a {"rawtext":[{"text":" §4tnt_minecart §cgetötet"}]}
execute as @e[type=tnt_minecart] run kill @s
#execute as @e[type=tnt] run tellraw @a {"rawtext":[{"text":" §4tnt §cgetötet"}]}
#execute as @e[type=tnt] run kill @s