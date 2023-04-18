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
    let client: DiscordClient;
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

    try {
        await client.waitForAuthorization();

        // The Get_Guilds command is run
        client.sendCommand('GET_GUILDS', {});
        console.log('Send Get_Guilds');

        client.incomingData.subscribe((data) => {
            // the data packet is decoded from IPC
            const message = decodeIPCMessage(data);

            if (message.payload.cmd === 'GET_GUILDS') {
                let guilds = message.payload.data.guilds;
                for (const guild of guilds) {
                    // console.log(guild.name, guild.id);
                    let args = {
                        guild_id: guild.id
                    }
                    console.log('Send GET_CHANNELS');
                    client.sendCommand('GET_CHANNELS', args)
                }
            }

            if (message.payload.cmd === 'GET_CHANNELS') {
                let channels = message.payload.data.channels;
                for (const channel of channels) {
                    console.log(channel.name, channel.type);
                }
            }
            // the message is logged to the logs/client-log
            setupLog.info(message);
          });
    } catch (error) {
        setupLog.error('Error while setting up the Panopticon');
    }



    // Continue with the next stage of setup
    // ...

  } catch (error) {
    setupLog.error('Setup Error:', error);
  }
}

setup();
