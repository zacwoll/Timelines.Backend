
/**
 * DiscordClient is an abstract class designed as a wrapper for the Discord IPC client.
 * It provides a set of methods to manage the connection and authorization process.
 */
export class DiscordClient2 extends Socket {

    private readonly maxRetries: number;
    private retries: number = 0;
    private pipeName: string;
    private _authorized: boolean = false;
  
    protected client: net.Socket;
  
    constructor(maxRetries: number = 10) {
      super();
      this.maxRetries = maxRetries;
      this.pipeName = `\\\\?\\pipe\\discord-ipc-${this.retries}`;
      this.initialize();
    }
  
    private async initialize() {
      console.log('Initializing');
      await this.connect();
      this.client.on('connect', () => {
        console.log('Connected to Discord IPC');
        // this.retries = 0;
        // this.sendHandshake();
        // this.authorize(['rpc', 'identify', 'messages.read']);
      });
      // await this.authorize(['rpc', 'identify', 'messages.read']);
      this._authorized = true;
    }
  
    // async write to client
    protected async sendCommand(cmd: string, args: Record<string, any>): Promise<string> {
      if (!this._authorized) {
        throw new Error('Cannot send command. The Discord IPC client is not connected.');
      }
      const nonce = uuidv4();
      const message = {
        nonce,
        cmd,
        args,
      };
      const buffer = encodeIPCMessage(1, message);
      await this.client.write(buffer);
  
      return nonce;
    }
  
    // connection method for startup
    public connect(): this {
      if (this.retries >= this.maxRetries) {
        throw new Error('Failed to connect after maximum retries');
      }
      // this.pipeName = `\\\\?\\pipe\\discord-ipc-${this.retries}`
      console.log(`Trying to connect to ${this.pipeName} (attempt ${this.retries + 1} of ${this.maxRetries})`);
      this.client = net.createConnection(this.pipeName, () => {
        console.log('Establishing Connection to Discord IPC');
        this.retries = 0;
        this.sendHandshake();
      });
  
  
      this.client.on('data', data => {
        // Connection data listener
        console.log(JSON.stringify(decodeIPCMessage(data)));
      })
      // on error, increase retries
      this.client.on('error', (error: Error) => {
        console.error(`Failed to connect: ${error.message}`);
        this.retries++;
      });
  
      // Add an event listener for the 'close' event
      this.client.on('close', () => {
        console.log('Disconnected from Discord IPC');
        this.retries++;
      });
  
      return this;
    }
  
    private sendHandshake(): void {
      const nonce = uuidv4();
      const cmd = 'HANDSHAKE';
      const args = {
        v: 1,
        client_id: CLIENT_ID
      }
      const message = {
        nonce,
        cmd,
        args
      }
      const buffer = encodeIPCMessage(0, message);
      this.client.write(buffer);
  
      console.log(`Sent handshake with nonce ${nonce}`);
    }
  
      // async write to client
      protected async sendSetupCommand(cmd: string, args: Record<string, any>): Promise<string> {
        if (!this.client) {
          throw new Error('Cannot send command. The Discord IPC client is not connected.');
        }
        const nonce = uuidv4();
        const message = {
          nonce,
          cmd,
          args,
        };
        const buffer = encodeIPCMessage(1, message);
        this.client.write(buffer);
    
        return nonce;
      }
  
    // // A sequence of events that authorizes the client
    // private async authorize(scopes: string[]): Promise<void> {
  
    //   const authorizationPromise = new Promise<void>((resolve, reject) => {
    //     const args = {
    //       client_id: CLIENT_ID,
    //       scopes
    //     }
    //     console.log('starting auth');
    //     const AuthCmd_id = this.sendSetupCommand('AUTHORIZE', args);
  
    //     this.client.on('data', (data) => {
    //       const message = decodeIPCMessage(data);
    //       if (message.payload.nonce === AuthCmd_id) {
    //         if (message.payload.data.code) {
    //           const data = {
    //             grant_type: 'authorization_code',
    //             code: message.payload.data.code,
    //             redirect_uri: 'http://localhost',
    //             client_id: CLIENT_ID,
    //             client_secret: CLIENT_SECRET,
    //           };
    //           axios.post('https://discord.com/api/oauth2/token', qs.stringify(data))
    //             .then((response) => {
    //               const accessToken = response.data.access_token;
    //               this.sendSetupCommand('AUTHENTICATE', { access_token: accessToken });
    //               resolve();
    //             })
    //             .catch((err) => {
    //               console.error(`Error in authorize: ${err}`);
    //               reject(err);
    //             });
    //         } else if (message.payload.data.access_token) {
    //           resolve();
    //         }
    //       }
    //     });
  
    //     this.client.on('error', (error: Error) => {
    //       console.error(`Error in authorize: ${error}`);
    //       reject(error);
    //     });
    //   });
    //   return authorizationPromise;
  
    //   // // Either timeout or authorize
    //   // // Destroy all listeners
    //   // return Promise.race([timeout, authorizationPromise])
    //   //   .finally(() => {    
    //   //     // if (this.client) {
    //   //     //   this.client.removeAllListeners('data');
    //   //     //   this.client.removeAllListeners('error');
    //   //     // }
    //   //   });
    // }
  }