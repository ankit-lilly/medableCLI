import { Option } from "commander";
import MedableClient from "../MedableClient.js";
import handleError from "../utils/errorHandler.js";

export function setupLoginCommand(program) {
  program
    .command("login")
    .addOption(
      new Option("-u, --username <string>", "username").env("username"),
    )
    .addOption(
      new Option("-p, --password <string>", "password").env("password"),
    )
    .addOption(
      new Option("-o, --org <string>", "Medable org").preset("c_site_app_demo")
        .env("org"),
    )
    .addOption(
      new Option("-k, --apiKey <string>", "medable_client_dev_key").env(
        "apiKey",
      ),
    )
    .action((opts) => {
      const { username, password, org, apiKey } = opts;
      MedableClient.login({ username, password, org, apiKey }).catch(
        handleError,
      );
    });
}
