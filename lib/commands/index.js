import { setupLoginCommand } from "./login.js";
import { setupScriptCommand } from "./scripts.js";
import { setupOrgsCommand } from "./orgs.js";
import { setupObjectCommand } from "./objects.js";

export default function setupCommands(program) {
  setupLoginCommand(program);
  setupScriptCommand(program);
  setupOrgsCommand(program);
  setupObjectCommand(program);
}
