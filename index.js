#!/usr/bin/env node

import { LocalStorage } from 'node-localstorage';
import { Command, Option } from 'commander';
import dotenv from 'dotenv';
import { existsSync } from 'node:fs';
import fs from 'node:fs/promises';
import { homedir } from 'os';
import { join } from 'path';
import MedableClient from './MedableClient.js';
import Transformer from './Transformer.js';

const handleError = (err) => {
  process.env.DEBUG && console.error(err);
  console.error(err.message);
  process.exit(1);
};

global.localStorage = new LocalStorage('.tokens');

try {
  const envFilePath = existsSync('.env') ? '.env' : join(homedir(), '.env');

  dotenv.config({ path: envFilePath });

  const program = new Command();
  program.description(`A CLI to interact with Medable Cortex Database\n

     Run 'medable login' to login to your Medable account and get started.

    `);
  program.version('0.0.1');

  program
    .command('login')
    .addOption(new Option('-u, --username <string>', 'username').env('username'))
    .addOption(new Option('-p, --password <string>', 'password').env('password'))
    .addOption(new Option('-o, --org <string>', 'Medable org').env('org'))
    .addOption(new Option('-k, --apiKey <string>', 'medable_client_dev_key').env('apiKey'))
    .action((opts) => {
      const { username, password, org, apiKey } = opts;
      MedableClient.login({ username, password, org, apiKey }).catch(handleError);
    });

  program
    .command('scripts download')
    .option('-w, --where <jsonString>', 'Specify the filter conditions as a JSON string')
    .action((_, cmd) => {
      const client = MedableClient.getClient();
      const { where } = cmd;
      client.downloadScript({ where }).then(JSON.stringify).then(console.log).catch(handleError);
    });

  program.command('select-org [orgname]').action((opt) => {
    console.log(`Selecting ${opt} as default org`);
    localStorage.setItem('activeOrg', opt);
    const orgs = localStorage.getItem('orgs');

    if (!orgs) {
      return localStorage.setItem('orgs', JSON.stringify([opt]));
    }
    const allOrgs = JSON.parse(orgs);
    allOrgs.push(opt);
    localStorage.setItem('orgs', JSON.stringify(allOrgs));
    console.log(`Now using ${opt} as default org`);
  });

  program.command('ls-orgs').action(() => {
    try {
      const orgs = JSON.parse(localStorage.getItem('orgs'));
      console.table(orgs);
    } catch (err) {
      console.error(handleError);
    }
  });
  program.command('use').requiredOption('-o, --org', 'Org to use');

  program
    .command('get [object]')
    .option('-l, --limit <number>')
    .option('-s, --skip <number>')
    .option('-w, --where <jsonString>', 'Specify the filter conditions as a JSON string')
    .option('-e, --expand <string>', 'Comma separated list of fields to expand')
    .option('-i, --include <string>', 'Common separated list of fields to include')
    .option('-p, --paths <string>', 'Comma separated list of paths to include')
    .option('-m, --map <string>', 'Map function')
    .option('-f, --filter <string>', 'Filter function')
    .option('--find <string>', 'Find function')
    .action((opts, cmd) => {
      const { limit, skip, where, expand, include, paths, map, filter, find } = cmd;
      const client = MedableClient.getClient();
      const sheet = new Sheet('1Z8Z.xlsx');
      client
        .getObject(opts, { params: { limit, where, skip, expand, include, paths } })
        .then((res) => {
          let data = res.data;

          if (map) {
            data = Transformer.map(data, map);
          }
          if (filter) {
            data = Transformer.filter(data, filter);
          }
          if (find) {
            data = Transformer.find(data, find);
          }
          return data;
        })
        .then(JSON.stringify)
        .then(console.log)
        .catch(handleError);
    });

  program
    .command('post [object]')
    .requiredOption('-b, --body', 'Body to post')
    .action((opts) => {
      console.log('Options', opts);
      // call post function
    });

  program.command('run [filename]').action((opts) => {
    const client = MedableClient.getClient();
    const runScript = client.run.bind(client);

    fs.readFile(opts, 'utf-8')
      .then(runScript)
      .then((r) => r.data)
      .then(JSON.stringify)
      .then(console.log)
      .catch(handleError);
  });

  program.parse(process.argv);
} catch (err) {
  console.error(err.message);
}
