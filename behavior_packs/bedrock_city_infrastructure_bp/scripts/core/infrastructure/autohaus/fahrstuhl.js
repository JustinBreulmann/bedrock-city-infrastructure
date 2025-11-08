import { world,system } from "@minecraft/server";

export function ahFahrstuhlDown(player) {
	const KoordinatenStart = [-83, 60, 148];
	const KoordinatenEnde = [-85, 57, 152];
	let KoordinatenPaste = [-85, 74, 148];
	setupDown(player)

	const down = system.runInterval(() => {
		player.dimension.fillBlocks({x: -85, y: 76, z: 147}, {x: -83, y: 75, z: 147}, 'minecraft:air');
		player.dimension.fillBlocks({x: -83, y: 76, z: 153}, {x: -85, y: 75, z: 153}, 'minecraft:air');

	  if (KoordinatenPaste[1] > 66) {
		const command = `clone ${KoordinatenStart[0]} ${KoordinatenStart[1]} ${KoordinatenStart[2]} ${KoordinatenEnde[0]} ${KoordinatenEnde[1]} ${KoordinatenEnde[2]} ${KoordinatenPaste[0]} ${KoordinatenPaste[1]} ${KoordinatenPaste[2]}`;
		player.runCommandAsync(command);
		player.playSound("tile.piston.out");
		KoordinatenPaste[1]--;
	  }
	  if (KoordinatenPaste[1] === 66) {
		player.runCommandAsync("setblock -84 69 150 stone_button [\"facing_direction\" : 1]")
		system.clearRun(down)
	  }
	}, 20);
  }

  
  function setupDown(player) {
	player.dimension.fillBlocks({x: -83, y: 76, z: 147}, {x: -85, y: 69, z: 153}, 'minecraft:air');
	player.dimension.fillBlocks({x: -84, y: 74, z: 150}, {x: -84, y: 68, z: 150}, 'polished_basalt');
	const cloneCommand = "/clone -83 59 146 -85 57 154 -85 74 146";
	player.runCommandAsync(cloneCommand);
  }
  
  export function ahFahrstuhlUp(player) {
	const KoordinatenStart = [-85, 55, 148];
	const KoordinatenEnde = [-83, 59, 152];
	let KoordinatenPaste = [-85, 66, 148];

	const up = system.runInterval(() => {
		player.dimension.fillBlocks({x: -85, y: 70, z: 147}, {x: -83, y: 76, z: 153}, 'minecraft:air');
		player.dimension.fillBlocks({x: -82, y: 66, z: 147}, {x: -86, y: 66, z: 153}, 'minecraft:polished_blackstone');

	  if (KoordinatenPaste[1] < 73) {
		const command = `clone ${KoordinatenStart[0]} ${KoordinatenStart[1]} ${KoordinatenStart[2]} ${KoordinatenEnde[0]} ${KoordinatenEnde[1]} ${KoordinatenEnde[2]} ${KoordinatenPaste[0]} ${KoordinatenPaste[1]} ${KoordinatenPaste[2]}`;
		player.runCommandAsync(command);
		player.playSound("tile.piston.out");
		player.runCommandAsync("execute as @e[x=-84,y=68,z=148,dx=4,dy=7,dz=4] run tp @s ~ ~1 ~")
		KoordinatenPaste[1]++;
	  }
	  if (KoordinatenPaste[1] >= 73) {
		const cloneCommand = "/clone -85 58 147 -83 59 153 -85 75 147";
		player.runCommandAsync("/clone -85 61 146 -83 61 154 -85 76 146")
		player.runCommandAsync(cloneCommand);
		player.runCommandAsync("setblock -84 76 150 stone_button [\"facing_direction\" : 1]")
		system.clearRun(up)
	  }
	}, 20);
  }
  
