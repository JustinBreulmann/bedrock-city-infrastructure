import { world } from "@minecraft/server";
import {ActionFormData,MessageFormData,ModalFormData,ActionFormResponse,MessageFormResponse,ModalFormResponse} from "@minecraft/server-ui";


export function particle(player) {
	let form = new ModalFormData();
	form.title(`Effekte`);
	form.slider("Studio", 1, 3, 1); //0
	form.dropdown("Effekt", ["Aufsteigende Flamme", "kleine Explosion", "große Explosion", "Rauch", "(w) Rauch", "(g) Rauch", "(s) Rauch", "Wasserblasen", "Bunte Blasen", "Symbole", "Spirale", "Totem", "Pfeile"]);
	form.toggle("bei Spieler"); //2
  
	form.show(player).then((response) => {
	  if (response.canceled) return;
  
	  const effectNames = [
		"minecraft:mobflame_single",
		"minecraft:large_explosion",
		"minecraft:huge_explosion_emitter",
		"minecraft:knockback_roar_particle",
		"minecraft:egg_destroy_emitter",
		"minecraft:campfire_smoke_particle",
		"minecraft:example_smoke_puff",
		"minecraft:example_highrestitution",
		"minecraft:example_colorcurve",
		"minecraft:example_flipbook",
		"minecraft:example_spiral",
		"minecraft:totem_particle",
		"minecraft:critical_hit_emitter"
	  ];
  
	  const effectName = effectNames[response.formValues[1]];
	  let location;
  
	  if (response.formValues[2] === true) {
		location = player.location;
	  } else {
		switch (response.formValues[0]) {
		  case 1:
			location = {x:-202.65, y:69.00, z:141.55}
			break;
		  case 2:
			location = {x:-205.03,y:69.00, z:164.34};
			break;
		  case 3:
			location = {z:214.70, y:62.06, z:125.44};
			break;
		  default:
			location = {x:0, y:0, z:0}; 
		}
	  }
	  const overworld = world.getDimension('overworld');
	  overworld.spawnParticle(effectName, location);

	});
  }
  