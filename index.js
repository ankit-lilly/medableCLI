#!/usr/bin/env node

import { LocalStorage } from 'node-localstorage';
import { Command } from 'commander';
import dotenv from 'dotenv';
import { existsSync } from 'node:fs';
import { homedir } from 'os';
import { join } from 'path';
import setupCommands from './lib/commands/index.js';

global.localStorage = new LocalStorage('.tokens');

try {
  const envFilePath = existsSync('.env') ? '.env' : join(homedir(), '.env');

  dotenv.config({ path: envFilePath });

  const program = new Command();
  program.description(`A CLI to interact with Medable Cortex Database\n
     Run 'medable login' to login to your Medable account and get started.
    `);

  program.version('0.0.6');

  setupCommands(program);

  program.parse(process.argv);
} catch (err) {
  console.error(err.message);
}
