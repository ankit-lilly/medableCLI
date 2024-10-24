import MedableClient from "../MedableClient.js";
import handleError from "../utils/errorHandler.js";
import fs from "node:fs/promises";

export function setupScriptCommand(program) {
  program
    .command("scripts download")
    .option(
      "-w, --where <jsonString>",
      "Specify the filter conditions as a JSON string",
    )
    .action((_, cmd) => {
      const client = MedableClient.getClient();
      const { where } = cmd;
      client.downloadScript({ where }).then(JSON.stringify).then(console.log)
        .catch(handleError);
    });

  program.command("run [filename]").action((opts) => {
    const client = MedableClient.getClient();
    const runScript = client.run.bind(client);

    fs.readFile(opts, "utf-8")
      .then(runScript)
      .then((r) => r.data)
      .then(JSON.stringify)
      .then(console.log)
      .catch(handleError);
  });
}
