import { world,system } from "@minecraft/server";

export function studioFahrstuhlDown(player) {
	const KoordinatenStart = [-205, 60, 119];
	const KoordinatenEnde = [-201, 62, 125];
	let KoordinatenPaste = [-205, 67, 138];
	setupDown(player)

	const down = system.runInterval(() => {

	  if (KoordinatenPaste[1] > 58) {
		const command = `clone ${KoordinatenStart[0]} ${KoordinatenStart[1]} ${KoordinatenStart[2]} ${KoordinatenEnde[0]} ${KoordinatenEnde[1]} ${KoordinatenEnde[2]} ${KoordinatenPaste[0]} ${KoordinatenPaste[1]} ${KoordinatenPaste[2]}`;
		player.runCommandAsync(command);
		player.playSound("tile.piston.out");
		KoordinatenPaste[1]--;
	  }
	  if (KoordinatenPaste[1] === 59) {
		system.clearRun(down)
		player.dimension.fillBlocks({x: -206, y: 69, z: 137}, {x: -200, y: 70, z: 145}, 'minecraft:air');
		player.dimension.fillBlocks({x: -205, y: 62, z: 138}, {x: -201, y: 64, z: 144}, 'minecraft:air');
		player.dimension.fillBlocks({x: -206, y: 67, z: 137}, {x: -200, y: 67, z: 145}, 'minecraft:light_gray_stained_glass');
		player.runCommandAsync("setblock -203 62 141 stone_button [\"facing_direction\" : 1]")
	  }
	}, 20);
  }

  
  function setupDown(player) {
	player.dimension.fillBlocks({x: -200, y: 69, z: 145}, {x: -206, y: 72, z: 137}, 'minecraft:air');
	player.runCommandAsync("/clone -206 62 126 -200 63 118 -206 69 137");
	player.runCommandAsync("/clone -201 55 125 -205 61 119 -205 61 138");
  }
  
  export function studioFahrstuhlUp(player) {
	player.dimension.fillBlocks({x: -201, y: 68, z: 144}, {x: -205, y: 62, z: 138}, 'minecraft:air');
	const KoordinatenStart = [-205, 59, 119];
	const KoordinatenEnde = [-201, 62, 125];
	let KoordinatenPaste = [-205, 60, 138];
	const up = system.runInterval(() => {

	  if (KoordinatenPaste[1] < 67) {
		player.runCommandAsync("execute as @e[x=-205,y=62,z=138,dx=4,dy=6,dz=6] run tp @s ~~1~")
		const command = `clone ${KoordinatenStart[0]} ${KoordinatenStart[1]} ${KoordinatenStart[2]} ${KoordinatenEnde[0]} ${KoordinatenEnde[1]} ${KoordinatenEnde[2]} ${KoordinatenPaste[0]} ${KoordinatenPaste[1]} ${KoordinatenPaste[2]}`;
		player.runCommandAsync(command);
		player.playSound("tile.piston.out");
		KoordinatenPaste[1]++;
	  }
	  if (KoordinatenPaste[1] >= 67) {
		const cloneCommand = "/clone -205 60 119 -201 55 125 -205 62 138";
		player.runCommandAsync("/clone -205 62 147 -199 65 155 -206 69 137")
		player.runCommandAsync(cloneCommand);
		player.runCommandAsync("/setblock -207 70 141 stone_button [\"facing_direction\" : 5]")
		system.clearRun(up)
	  }
	}, 20);
  }
  
