import net, { Socket } from 'net';
import { v4 as uuidv4 } from 'uuid';
import qs from 'qs';
import axios from 'axios';
import dotenv from 'dotenv';
import { EventEmitter } from 'events';
dotenv.config();
import { encodeIPCMessage, decodeIPCMessage } from './IPC';
import { fromEvent, Observable, of, Subject } from 'rxjs';
import { concatMap, delay, map, throttleTime } from 'rxjs/operators';
import { createNewLogger } from './logger';
import { setupLog } from './setup';

const clientLog = createNewLogger('client');

const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;

export class DiscordClient extends Socket {
  private readonly pipeName: string = `\\\\?\\pipe\\discord-ipc-0`;
  private _authorized: boolean = false;
  protected client: Socket;
  private sendMessageSubject: Subject<Buffer>;
  private throttledObservable: Observable<Buffer>;
  public incomingData: Observable<Buffer>;

  constructor() {
    super();
    this.client = new Socket();
    this.connectIPC(this.pipeName);
    this.sendMessageSubject = new Subject<Buffer>();
    this.setupThrottling();
    this.setupCrier();
  }

  // Create Crier
  private setupCrier(): void {
    this.incomingData = fromEvent(this.client, 'data').pipe(
      map((rawData) => {
        clientLog.info(`Incoming Data: ${decodeIPCMessage(rawData)}`);
      // Transform the raw data from the Socket into your desired data model
          return rawData;
      }
    ));
  }

  // Create Gatekeeper
  // Border Yemma allows incoming traffic to come in at less than 120 times per minute
  // traffic enters an observable queue
  // observable's pipe-through speed becomes throttled by throttleTime

  private setupThrottling(): void {
    this.sendMessageSubject
      .pipe(
        concatMap((data) => {
          // Wait for the specified duration before processing the next message
          return of(data).pipe(delay(600));
        })
      )
      .subscribe((data) => this.processQueue(data));
  }
  

  async addToQueue(payload: Buffer) {
    this.sendMessageSubject.next(payload);
  }
   
  private processQueue(encoded: Buffer) {
    this.client.write(encoded);
  }

  // async write to client
  public async sendCommand(cmd: string, args: Record<string, any>): Promise<string> {
    if (!this._authorized) {
      throw new Error('Cannot send command. The Discord IPC client is not connected.');
    }
    const nonce = uuidv4();
    const message = {
      nonce,
      cmd,
      args,
    };
    clientLog.info(`Adding ${message.cmd} to processQueue`);
    const buffer = encodeIPCMessage(1, message);
    this.addToQueue(buffer);
    return nonce;
  }

  public connectIPC(pipeName: string): this {
  this.client.connect(pipeName, () => {
      console.log('Establishing Connection to Discord IPC');
    });
  
    this.client.on('connect', () => {
      console.log('Connected to Discord IPC');
      this.authorize(['rpc', 'identify', 'messages.read']);
      this.client.removeAllListeners('connect');
    });

    this.client.on('error', (error) => {
      setupLog.error(error);
    });
  
    return this;
  }

  private sendHandshake(): void {
    // Build handshake message
    const handshakeMessage = {
      v: 1, // IPC version
      client_id: CLIENT_ID,
    };

    // Send handshake message
    const handshakeBuffer = encodeIPCMessage(0, handshakeMessage);
    this.client.write(handshakeBuffer);

    // Log The Send
    console.log(`Sent handshake`);
  }

  private async authorize(scopes: string[]) {
    this.sendHandshake();

    this.client.on('data', async (data) => {
      const message = decodeIPCMessage(data);
      // Last time the IPC server information is logged
      // console.log(JSON.stringify(message, null, 2));
    
      if (message.payload.evt === "READY") {
        const nonce = uuidv4();
        const authorizeCmd = {
          nonce,
          cmd: 'AUTHORIZE',
          args: {
            client_id: CLIENT_ID,
            scopes,
          },
        };  
        const auth = encodeIPCMessage(1, authorizeCmd);
        this.client.write(auth);
  
        console.log('Sent AUTHORIZE command');
      }
    
      if (message.payload.cmd === "AUTHORIZE") {
        console.log('Authorized, Waiting for Token');
        // Await getting Authorized
        try {
          const data = {
            grant_type: 'authorization_code',
            code: message.payload.data.code,
            redirect_uri: 'https://localhost',
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
          };
          console.log("Sending for Authorized token");
          const response = await axios.post('https://discord.com/api/oauth2/token', qs.stringify(data));
  
          console.log(`Server responded with: ${JSON.stringify(response.data, null, 2)}`);
          let OAuth = response.data;
  
          const nonce = uuidv4();
          const authenticateCmd = {
            nonce,
            args: {
              access_token: OAuth.access_token
            },
            cmd: "AUTHENTICATE"
          };
          const auth = encodeIPCMessage(1, authenticateCmd);
          this.client.write(auth);
        } catch (error) {
          console.error(error);
        }
      }
  
      // Client is authorized, turn on protected write command
      if (message.payload.cmd === "AUTHENTICATE") {
        let data = message.payload.data;
        this._authorized = true;
        this.client.removeAllListeners('data');
        console.log("Authorized Connection to Discord Client");
        this.client.emit('authorized');
      }
    });
  }

  // Promise waits for custom event, authorized to fire
  // Call this method to ensure your program has waited to use the client
  public waitForAuthorization(): Promise<void> {
    return new Promise((resolve) => {
      if (this._authorized) {
        resolve();
      } else {
        this.client.once('authorized', () => {
          resolve();
        });
      }
    });
  }
}