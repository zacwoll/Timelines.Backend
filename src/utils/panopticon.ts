import { create } from 'domain';
import { Socket } from 'net';
import { DiscordClient } from './DiscordClient';
import { createNewLogger } from './logger';
import { decodeIPCMessage } from './IPC';
import { fromEvent, map, Observable } from 'rxjs'
import client from 'undici/types/client';

const PanopticonLog = createNewLogger('panopticon');

export class Panopticon {
    private client: DiscordClient;

    public allData: Observable<Buffer>;
    constructor(client: DiscordClient) {
        this.client = client;
        this.setup();
    }

    private setup() {
   // Create an Observable for the 'data' event of the Socket
        const allData = fromEvent(this.client, 'data').pipe(
            map((rawData) => {
                PanopticonLog.info(decodeIPCMessage(rawData));
            // Transform the raw data from the Socket into your desired data model
                return rawData;
            }
        ));

        // Send a get_guilds command
        

        // Send a get_channels command on each guild id

        // filter results by text channels

        // Attach Subscribe event to each text channel

        // Console.log a counter on increase of each subscription
    }
}