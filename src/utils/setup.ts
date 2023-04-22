import { createNewLogger } from './logger';
import { fromEvent, map, Observable } from 'rxjs';
const { v4: uuidv4 } = require('uuid');
// import { v4: uuidv4 } from 'uuid';
import { DiscordClient } from './DiscordClient';
import { Panopticon } from './panopticon';
import { listenerCount } from 'process';


const dotenv = require('dotenv');
dotenv.config();

const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;

export const setupLog = createNewLogger('setup');

async function setup() {
  try {
    // Create a socket interface for discord
    let client: DiscordClient;
    let GuildService: Panopticon;
    // Setup client connection
    try {
        client = new DiscordClient();
        client.on('authorized', () => {
            setupLog.info('IPC client connection established successfully');
        });
        client.removeAllListeners('authorized');
    } catch (error) {
        setupLog.error('Error while setting up IPC client connection:', error);
    }
    // Continue with the next stage of setup

    try {
        GuildService = new Panopticon(client);
        await client.waitForAuthorization();

        // await setupPanopticon(client);
        // The Get_Guilds command is run
        // client.sendCommand('GET_GUILDS', {});

        // let textChannelSubscriberCount = 0;

        // client.incomingData.subscribe((data) => {
        //     // the data packet is decoded from IPC
        //     const message = decodeIPCMessage(data);

        //     if (message.payload.cmd === 'GET_GUILDS') {

        //         // push to guilds observable
        //         let guilds = message.payload.data.guilds;
        //         for (const guild of guilds) {
        //             // console.log(guild.name, guild.id);
        //             let args = {
        //                 guild_id: guild.id
        //             }
        //             client.sendCommand('GET_CHANNELS', args)
        //         }
        //     }

        //     // new observable from piping guilds observable, sending a get_channels command for each guild

        //     if (message.payload.cmd === 'GET_CHANNELS') {
        //         // push to channels observable
        //         let channels = message.payload.data.channels;
        //         for (const channel of channels) {
        //             if (channel.type === 0) {
        //                 let args = {
        //                     channel_id: channel.id
        //                 }
        //                 client.sendCommand('SUBSCRIBE', args, 'MESSAGE_CREATE');
        //             }
        //             // console.log(channel.name, channel.type);
        //         }
        //     }

        //     if (message.payload.cmd === "SUBSCRIBE") {
        //         console.log(textChannelSubscriberCount++);
        //     }
        //     // the message is logged to the logs/client-log
        //     setupLog.info(message);
        //   });
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
