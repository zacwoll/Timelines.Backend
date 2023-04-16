import { createNewLogger } from './logger';
import { getClient } from './DiscordClient';
import { encodeIPCCmd, decodeIPCMessage } from './IPC';
import { Socket } from 'net';
import { fromEvent, map, Observable } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { MessagePayload } from 'discord.js';
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');
dotenv.config();

const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;

export const setupLog = createNewLogger('setup');

async function setup() {
  try {
    // Create a socket interface for discord
    let DiscordClient: Socket;
    // Setup client connection
    try {
        DiscordClient = await getClient();
        setupLog.info('IPC client connection established successfully');
    } catch (error) {
        setupLog.error('Error while setting up IPC client connection:', error);
    }
    // Continue with the next stage of setup

    // Create Gatekeeper
    // Border Yemma allows incoming traffic to come in at less than 120 times per minute
    // traffic enters an observable queue
    // observable's pipe-through speed becomes throttled by throttleTime

    // Attach an observable to the socket and throttle the calls to it
    const observable = new Observable((observer) => {
        DiscordClient.on('data', (data) => {
            observer.next(data);
        });
    });
    const throttledObservable = observable.pipe(throttleTime(60000 / 100));

    // Subscribe to the throttled observable, to write the data
    throttledObservable.subscribe((payload: Buffer) => {
        DiscordClient.write(payload);

        console.log('Data has passed to Discord Client:', payload);
        // Do something with the data, such as write it to a database
    });


    // Continue with the next stage of setup
    // ...

  } catch (error) {
    setupLog.error('Setup Error:', error);
  }
}

setup();
