import { createNewLogger } from './logger';
import { encodeIPCCmd, decodeIPCMessage } from './IPC';
import { Socket } from 'net';
import { fromEvent, map, Observable } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { MessagePayload } from 'discord.js';
const { v4: uuidv4 } = require('uuid');
// import { v4: uuidv4 } from 'uuid';
import { DiscordClient } from './DiscordClient';

const dotenv = require('dotenv');
dotenv.config();

const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;

export const setupLog = createNewLogger('setup');

async function setup() {
  try {
    // Create a socket interface for discord
    let client: Socket;
    // Setup client connection
    try {
        client = new DiscordClient();
        client.on('authorized', () => {
            setupLog.info('IPC client connection established successfully');
        });
    } catch (error) {
        setupLog.error('Error while setting up IPC client connection:', error);
    }
    // Continue with the next stage of setup





    // Continue with the next stage of setup
    // ...

  } catch (error) {
    setupLog.error('Setup Error:', error);
  }
}

setup();
