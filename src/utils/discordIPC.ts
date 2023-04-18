import net, { Socket } from 'net';
import { encodeHandshake } from './IPC';
const { encodeIPCMessage, decodeIPCMessage } = require('./IPC');
const dotenv = require('dotenv');
dotenv.config();

const CLIENT_ID = process.env.DISCORD_CLIENT_ID;

export function connectToIPC() {
  return new Promise((resolve, reject) => {
    let index = 0;
    let client: Socket;

    const tryConnection = () => {
      const pipeName = `\\\\?\\pipe\\discord-ipc-${index}`;
      client = net.createConnection(pipeName, () => {
        console.log('Connected to Discord IPC');

        const handshakeMessage = {
          v: 1, // IPC version
          client_id: CLIENT_ID,
        };

        // Send handshake message
        const handshakeBuffer = encodeIPCMessage(0, handshakeMessage);
        client.write(handshakeBuffer);

        resolve(client);
      });

      client.on('error', (error) => {
        console.error(`Failed to connect to Discord IPC server ${index}:`, error);
        index++;

        if (index < 10) {
          tryConnection();
        } else {
          reject(new Error('Failed to connect to any Discord IPC servers'));
        }
      });
    };

    tryConnection();
  });
}

function tryConnection(pipeName: string, timeout = 5000) {
  return new Promise((resolve, reject) => {
    let timerId = setTimeout(() => {
      client.destroy();
      reject(new Error(`Connection timed out after ${timeout} ms`));
    }, timeout);

    let client = net.createConnection(pipeName, () => {
      clearTimeout(timerId);
      console.log('Connected to Discord IPC');
      let encodedHandshake = encodeHandshake();
      client.write(encodedHandshake);
  
      resolve(client);
    });

    client.on('error', (err) => {
      clearTimeout(timerId);
      reject(err);
    });
  })
}
