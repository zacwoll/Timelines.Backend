import dotenv from 'dotenv';
dotenv.config();

const CLIENT_ID = process.env.DISCORD_CLIENT_ID;

import { DiscordClientPayload } from './DiscordClientTypes';

export interface IPCMessage {
  opcode: number;
  payload: IPCMessagePayload;
}

export interface handshakeInterface {
  v: number;
  client_id: string;
}

export interface IPCMessagePayload {
  cmd: string;
  args: Object;
  evt?: string;
  nonce: string;
}

export function encodeIPCHandshake(payload: handshakeInterface): Buffer {
  const payloadBuffer = Buffer.from(JSON.stringify(payload));
  const header = Buffer.alloc(8);
  header.writeInt32LE(0, 0);
  header.writeInt32LE(payloadBuffer.length, 4);
  return Buffer.concat([header, payloadBuffer]);
}

export function encodeIPCMessage(opcode: number, payload: any): Buffer {
  const payloadBuffer = Buffer.from(JSON.stringify(payload));
  const header = Buffer.alloc(8);
  header.writeInt32LE(opcode, 0);
  header.writeInt32LE(payloadBuffer.length, 4);
  return Buffer.concat([header, payloadBuffer]);
}

// I don't yet have a use for this returned opcode, maybe future
// export function decodeIPCMessage(message: Buffer): IPCMessage {
//   const opcode = message.readInt32LE(0);
//   const length = message.readInt32LE(4);
//   const payload = JSON.parse(message.subarray(8, 8 + length).toString());
//   return { opcode, payload };
// }

// DiscordClientCommands have a hardcoded opcode of 1
export function encodeDiscordClientCmd(payload: IPCMessagePayload): Buffer {
  const payloadBuffer = Buffer.from(JSON.stringify(payload));
  const header = Buffer.alloc(8);
  header.writeInt32LE(1, 0);
  header.writeInt32LE(payloadBuffer.length, 4);
  return Buffer.concat([header, payloadBuffer]);
}

export function decodeIPCMessage(message: Buffer): DiscordClientPayload {
  const opcode = message.readInt32LE(0);
  const length = message.readInt32LE(4);
  const payload = JSON.parse(message.subarray(8, 8 + length).toString());
  return payload;
}

export const encodeHandshake = () => {
  const handshakeMessage = {
    v: 1, // IPC version
    client_id: CLIENT_ID,
  };

  // Send handshake message
  const handshakeBuffer = encodeIPCHandshake(handshakeMessage);
  return handshakeBuffer;
}