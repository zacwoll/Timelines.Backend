import { connectToIPC } from './discordIPC';
import { authorizeClient } from './authorize';
import { Handler } from './DiscordClient'; 
import { decodeIPCMessage, encodeIPCCmd } from './IPC';
import { createNewLogger } from './logger';
import { fromEvent, map } from 'rxjs';
import { Socket } from 'dgram';
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');
dotenv.config();

const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;


const clientLog = createNewLogger('client');
// WE can add middleware here!
// Run Setup
export async function getClient() {
    let client = await connectToIPC();
    client = await authorizeClient(client);
  

    // Create an Observable for the 'data' event of the Socket
    const dataObservable = fromEvent(client, 'data').pipe(
        map((rawData) => {
        // Transform the raw data from the Socket into your desired data model
            return rawData;
        }
    ));

    dataObservable.subscribe((data) => {
        // the data packet is decoded from IPC
        const message = decodeIPCMessage(data);
        // the message is logged to the logs/client-log
        clientLog.info(message);
      });

    return client;
}

export async function writeClientCmd(client: Socket, cmd, args) {
    const nonce = uuidv4();
    const payload = {
      nonce,
      cmd,
      args
    };
    const encodedPayload = encodeIPCCmd(payload);
    client.write(encodedPayload);
    return nonce;
}