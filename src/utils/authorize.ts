
import { Socket } from 'net';
const qs = require('qs'); // To convert the data to x-www-form-urlencoded format
import axios from 'axios';
import { encodeIPCMessage, decodeIPCMessage, encodeIPCCmd } from './IPC';
import { serverLog } from '../server';
import { channel } from 'diagnostics_channel';
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');
dotenv.config();

const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;

class ProgrammableSocket extends Socket {
  write_cmd(data: string, callback?: (error: Error | null | undefined) => void): boolean {
    const buffer = Buffer.from(data);
    const opcode = 0x01; // Set the opcode to 0x01 (text data)
    const header = Buffer.alloc(2);
    header.writeUInt8(opcode, 0);
    header.writeUInt8(buffer.length, 1);

    const payload = Buffer.concat([header, buffer]);
    return super.write(payload, callback);
  }
}


export async function authorizeClient(client: Socket) {
  return new Promise(async (resolve, reject) => {
    let subscriber_count = 0;
    let channel_count = 0;
    client.on('data', async (data) => {
      const message = decodeIPCMessage(data);
      serverLog.info(message);
    
      if (message.payload.evt === "READY") {
        const nonce = uuidv4();
        const authorizeCmd = {
          nonce,
          cmd: 'AUTHORIZE',
          args: {
            client_id: CLIENT_ID,
            scopes: ['rpc', 'identify', 'messages.read'],
          },
        };  
        const auth = encodeIPCCmd(authorizeCmd)
        client.write(auth);
  
        console.log('Sent AUTHORIZE command');
      }
    
      if (message.payload.cmd === "AUTHORIZE") {
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
          client.write(auth);
        } catch (error) {
          console.error(error);
        }
      }
  
      if (message.payload.cmd === "AUTHENTICATE") {
        let data = message.payload.data;
        resolve(client);
        // begin harvesting data from account
      }
    
    });
  })
}
