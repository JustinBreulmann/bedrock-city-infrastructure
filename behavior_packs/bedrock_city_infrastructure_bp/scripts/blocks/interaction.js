import { BlockPermutation, Player, system, world } from '@minecraft/server';
import { editingUi, enterPasswordUi, lockingUi } from './password_ui';
import {exception} from "../exceptions/error"
import { lockableBlocks } from '../extensions/config';
import {primaryMenu}  from "../extensions/chestUI/display"
import { dispatch } from "../gameplay/job/dispatch/setting";
import { sitting } from "../core/sitting";
import {plantTree, selectTree} from "./tree"
import {dedicatedTeleport} from "./teleport"

	let blockPosition = {x:0,y:0,z:0}

	world.beforeEvents.playerInteractWithBlock.subscribe((data) => {


		const block = data.block;
		const player = data.player;
		const item = data.itemStack
		const blockLocation = block.location;
		const {x, y, z} = block.location;

		dedicatedTeleport(player, blockLocation)

		if (blockPosition.x === x && blockPosition.y === y && blockPosition.z === z) {
			return;
		} else {
			blockPosition = {x, y, z};
		}

		const itemSlot = player.getComponent('minecraft:inventory').container

        .getItem(player.selectedSlotIndex);

		if(block.type.id === "block:doorbell") {
			for (const target of world.getAllPlayers()) {
				target.playSound("song.custom3.ui")
			}
		}
		if(block.type.id.includes("sofa") || block.type.id.includes("chair")) {
			if(itemSlot && itemSlot.typeId == "minecraft:brush") {
				return				
			}
			system.run(() => {
			sitting(player, block)
			})

		}
		if (block.type.id === "block:notebook") {
			system.run(() => {
			primaryMenu(player)
		})
		}
		if (block.type.id === "feuerwehr:alarm") {
			system.run(() => {
			dispatch(player)
			})
		}
		if(block.type.id === "block:oak_tree") {
			system.run(() => {
				if(player.isSneaking) {
					selectTree(player)
				}
				if(item !== undefined && item !== null && item.typeId === "minecraft:bone_meal") {
				plantTree(player, block)
				}
			})
		}

		if(!lockableBlocks.includes(block.typeId)) return;

		const dimensionName = block.dimension.id.replace('minecraft:', '');
		const lockedBlockId = `${dimensionName}:${x}:${y}:${z}:lockBlock`;
		const blockId = block.typeId.replace('minecraft:', '');
		const blockName = blockId.split('_').map(name => name.charAt(0).toUpperCase() + name.slice(1)).join(' ');
		const itemName = item?.nameTag
		const isTripwire = item?.typeId  === 'minecraft:trial_key';
		const blockData = world.getDynamicProperty(lockedBlockId);
		const blockDirection = block.permutation.getState('minecraft:cardinal_direction');
		const invSize = block.getComponent('inventory')?.container.size;
	
		if(blockData) {
			
			const isUnlockByPlayer = player.getDynamicProperty(lockedBlockId + ':isUnlock');
	
			if(isUnlockByPlayer) return;
			const lockBlockData = JSON.parse(blockData);
			const {password, attemptNotification: hasNotif, restrictEditing : isEditable, owner: ownerId} = lockBlockData;

			if(player.hasTag("Feuerwehr") && block.typeId.includes("door") && item.typeId == "iron_axe") {
				player.sendMessage("[§bi§f] §7Du hast eine gesperrte Tür aufgebrochen")

				world.getAllPlayers().forEach(owner => {
					if(owner.id === ownerId){

				owner.sendMessage("[§bi§f] §7Eine gesperrte Tür wurden von den Rettungskräften aufgebrochen!")
		
					}
				})
				return
			} 
			data.cancel = true;
			system.run(async() => {
				if(item?.typeId === "minecraft:ominous_trial_key" && itemName === '§r§f§lBearbeiten') {
					if(isEditable && player.id !== ownerId) {
						exception('noPermission', player)
						if(!hasNotif) return;
						notifyOwner(player, ownerId, blockName, 'zu bearbeiten');
					}
					else {
						await enterPasswordUi(player, lockedBlockId, blockName, 'Bearbeiten').then(async(isUnlocked) => {
							if(isUnlocked) {
								await editingUi(player, lockedBlockId, blockName).then(hasBeenEdited => {
									if(hasBeenEdited) {
										if(invSize === 54) {
											switch(blockDirection) {
												case 'north': case 'south':
													updateSideChest(block.west());
													updateSideChest(block.east());
												break;
												case 'west': case 'east':
													updateSideChest(block.north());
													updateSideChest(block.south());
												break;
											}
										}
									}
								})
							}
							else {
								exception('wrongPassword',player)
								if(!hasNotif) return;
								notifyOwner(player, ownerId, blockName, 'zu bearbeiten');
							}
						})
					}
				}
				else if(item?.typeId === "minecraft:name_tag" && itemName === '§r§f§lPasswort anzeigen') {
					if(player.id === ownerId || player.hasTag('Bürgermeister')) {
						player.sendMessage(`[§bi§f]§7 Das Passwort von ${blockName} ist §a\"${password}\"`);
					}
					else {
						exception('noPermission',player)
						if(!hasNotif) return;
						notifyOwner(player, ownerId, blockName, 'zu überschreiben');
					}
				}
				else {
					await enterPasswordUi(player, lockedBlockId, blockName, 'Entsperren').then(isUnlocked => {
						if(isUnlocked) {
							player.sendMessage(`[§bi§f]§7 Du hast §a${blockName} §7entsperrt`);
							player.setDynamicProperty(lockedBlockId + ':isUnlock', true);
							system.runTimeout(() => {
								if(!player.isValid()) return;
								if(player.getDynamicProperty(lockedBlockId + ':isUnlock')) {
									player.sendMessage(`[§bi§f] §b${blockName} wurde gesperrt!`);
									player.setDynamicProperty(lockedBlockId + ':isUnlock', undefined);
								}
							}, 100);
						}
						else {
							exception('wrongPassword',player)
							if(!hasNotif) return;
							notifyOwner(player, ownerId, blockName, 'zu entsperren');
						}
					})
				}
			})
		}
		else if(item?.typeId === "minecraft:trial_key" && itemName === '§r§f§lSperren') {
			data.cancel = true;
			system.run(async() => {
				await lockingUi(player, lockedBlockId, blockName).then(hasBeenLocked => {
					if(hasBeenLocked) {
						player.sendMessage(`[§bi§f] §a${blockName} §fwurde erfolgreich gesperrt!`);
						if(invSize === 54) {
							switch(blockDirection) {
								case 'north': case 'south':
									updateSideChest(block.west());
									updateSideChest(block.east());
								break;
								case 'west': case 'east':
									updateSideChest(block.north());
									updateSideChest(block.south());
								break;
							}
						}
					}
				});
			});
		}
	
		function updateSideChest(sideBlock) {
			const {x, y, z} = sideBlock.location;
			const sideLockedBlockId = `${dimensionName}:${x}:${y}:${z}:lockBlock`;
			const sideSize = sideBlock.getComponent('inventory')?.container.size;
			const sideChestDir = block.permutation.getState('minecraft:cardinal_direction');
	
			if(sideSize === 54 && blockDirection === sideChestDir) {
				const newBlockData = world.getDynamicProperty(lockedBlockId);
				world.setDynamicProperty(sideLockedBlockId, newBlockData);
			}
		}
	})
	world.beforeEvents.playerBreakBlock.subscribe((data) => {
		const {block, player} = data;
		const {x, y, z} = block.location;
		const dimensionName = block.dimension.id.replace('minecraft:', '');
		const lockedBlockId = `${dimensionName}:${x}:${y}:${z}:lockBlock`;
		const isLockable = lockableBlocks.includes(block.typeId);
		if(world.getDynamicProperty(lockedBlockId) == null || world.getDynamicProperty(lockedBlockId) == undefined) return;
		const blockData = world.getDynamicProperty(lockedBlockId) || {};
		const {attemptNotification, restrictEditing, owner: ownerId} = JSON.parse(blockData);
		const blockId = block.typeId.replace('minecraft:', '');
		const blockName = blockId.split('_').map(name => name.charAt(0) + name.slice(1)).join(' ');
	
		if(isLockable && blockData && !player.getDynamicProperty(lockedBlockId + ':isUnlock') && !player.isOp()) {
			data.cancel = true;
			player.sendMessage(`§cDu kannst ${blockName} nicht zerstören, da dieser gesperrt ist!`);
	
			if(!attemptNotification) return;
			notifyOwner(player, ownerId, blockName, 'zu zerstören');
		}
		else {
			if(player.id !== ownerId && restrictEditing) {
				data.cancel = true;
				player.sendMessage(`§cDu hast keine Berechtigung ${blockName} Block zu zerstören`)
			}
			else {
				player.setDynamicProperty(lockedBlockId + ':isUnlock', undefined);
				world.setDynamicProperty(lockedBlockId, undefined);
			}
		}
	});
	
	world.beforeEvents.explosion.subscribe((data) => {
		const affectedBlocks = data.getImpactedBlocks().filter(function(block) {
			const {x, y, z} = block.location;
			const dimensionName = block.dimension.id.replace('minecraft:', '');
			const lockedBlockId = `${dimensionName}:${x}:${y}:${z}:lockBlock`;
			return !world.getDynamicProperty(lockedBlockId);
		})
		data.setImpactedBlocks(affectedBlocks);
	});
	
	world.afterEvents.playerPlaceBlock.subscribe((data) => {
		const {block} = data;
		const inventorySize = block.getComponent('inventory')?.container.size;
	
		if(inventorySize !== 54) return;
		const dimensionName = block.dimension.id.replace('minecraft:', '');
		const blockDirection = block.permutation.getState('minecraft:cardinal_direction');
	
		switch(blockDirection) {
			case 'north': case 'south':
				processSideBlock(block.west());
				processSideBlock(block.east());
			break;
			case 'west': case 'east':
				processSideBlock(block.north());
				processSideBlock(block.south());
			break;
		}
	
		function processSideBlock(sideBlock) {
			const {x, y, z} = sideBlock.location;
			const lockedBlockId = `${dimensionName}:${x}:${y}:${z}:lockBlock`;
			const blockData = world.getDynamicProperty(lockedBlockId);
	
			if(blockData) {
				const invSize = sideBlock.getComponent('inventory').container.size;
				const chestDirection = sideBlock.permutation.getState('minecraft:cardinal_direction');
				if(invSize === 54 && blockDirection === chestDirection) {
					const newLockedBlockId = `${dimensionName}:${block.x}:${block.y}:${block.z}:lockBlock`;
					world.setDynamicProperty(newLockedBlockId, blockData);
				}
			}
		}
	});

	
	system.runInterval(() => {
		const worldProperties = world.getDynamicPropertyIds();
		const lockedBlocks = worldProperties.filter(ids => /:lockBlock$/.test(ids));
		for(const id of lockedBlocks) {
			const idData = id.split(':');
			const blockDimension = idData[0];
			const blockLocation = {x: parseInt(idData[1]), y: parseInt(idData[2]), z: parseInt(idData[3])};
			const bottomBlock = world.getDimension(blockDimension).getBlock(blockLocation)?.below();
	
			if(bottomBlock?.typeId === 'minecraft:hopper') {
				const direction = bottomBlock.permutation.getState('facing_direction');
				bottomBlock.setPermutation(BlockPermutation.resolve('minecraft:hopper', {
					'toggle_bit': true, 'facing_direction': direction
				}));
			}
	
			const minecartHopper = world.getDimension(blockDimension).getEntitiesAtBlockLocation({
				x: blockLocation.x,
				y: blockLocation.y - 1,
				z: blockLocation.z
			}).filter(entity => entity.typeId === 'minecraft:hopper_minecart');
	
			minecartHopper.forEach(hopper => {
				hopper.kill();
			});
		}
	});
	
	world.afterEvents.playerSpawn.subscribe(({player}) => {
		const unlockState = player.getDynamicPropertyIds().find((property) => property.includes(':isUnlock'));
		if(unlockState) {
			player.setDynamicProperty(unlockState, undefined);
		}
	});
	
	function notifyOwner(interactor, ownerId, blockName, actionMessage) {
		world.getAllPlayers().forEach(player => {
			if(player.id === ownerId && interactor.id !== ownerId) {
				player.sendMessage(`[§4A§f] §c${player.name} §7hat versucht §7${blockName.toLowerCase()} §c${actionMessage}!`);
			}
		})
	}
