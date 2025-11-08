import { world, system } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";

const treeArray = ["oaktree0", "oaktree1", "oaktree2", "oaktree3"]; // Use lowercase keys
const customValues = {
  oaktree0: { index: 3, alias: "Kleiner Baum" },
  oaktree1: { index: 5, alias: "Breiter Baum" },
  oaktree2: { index: 2, alias: "Hoher Baum" },
  oaktree3: { index: 3, alias: "Spitzbaum" }
};

const treeObject = {};
for (let i = 0; i < treeArray.length; i++) {
  const key = treeArray[i];
  if (customValues[key]) {
	treeObject[key] = customValues[key];
  }
  }

export function plantTree(player, block) {
  let selectedTree;

  let tags = player.getTags();
  tags.forEach(tag => {
    if (tag.startsWith("tree:")) {
      selectedTree = tag.replace("tree:", "").toLowerCase(); 
    }
  });

  const { x, y, z } = block.location;


  if (selectedTree === undefined) {
	selectTree(player)
  }
else {
    const tagSelectedTree = selectedTree.toLowerCase(); 

    if (tagSelectedTree) {
      const treeInfo = treeObject[tagSelectedTree];

      if (treeInfo) {
        const index = treeInfo.index;
        const randomRotation = Math.floor(Math.random() * 4) * 90;
        player.dimension.runCommandAsync(`structure load ${tagSelectedTree} ${x - index} ${y} ${z - index} ${randomRotation}_degrees`);
      } 
    }
  }
}

export function selectTree(player) {
    let actionForm = new ActionFormData().title("§u§rBäume§r");
    treeArray.forEach(tree => {
      const alias = treeObject[tree].alias;
      actionForm.button(alias);
    });
    actionForm.show(player).then((response) => {
      if (response.canceled) return;
      else {
        player.getTags()
          .filter((t) => t.startsWith("tree:"))
          .forEach((tag) => player.removeTag(tag));
		  
        player.addTag(`tree:oaktree${response.selection}`); 
		player.sendMessage(`§5§lWorldEdit §r>> §7Du hast den folgenden Baum ausgewählt §a${treeObject[response.selection].alias})`);
        return;
      }
    });
  } 
