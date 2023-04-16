import dotenv from 'dotenv';
dotenv.config();

const CLIENT_ID = process.env.DISCORD_CLIENT_ID;

interface IPCMessage {
  opcode: number;
  payload: any;
}

export function encodeIPCMessage(opcode: number, payload: any): Buffer {
  const payloadBuffer = Buffer.from(JSON.stringify(payload));
  const header = Buffer.alloc(8);
  header.writeInt32LE(opcode, 0);
  header.writeInt32LE(payloadBuffer.length, 4);
  return Buffer.concat([header, payloadBuffer]);
}

export function decodeIPCMessage(message: Buffer): IPCMessage {
  const opcode = message.readInt32LE(0);
  const length = message.readInt32LE(4);
  const payload = JSON.parse(message.subarray(8, 8 + length).toString());
  return { opcode, payload };
}

// The opcode is a hardcoded 0x01 ahead of time
export function encodeIPCCmd(payload: any): Buffer {
  const payloadBuffer = Buffer.from(JSON.stringify(payload));
  const header = Buffer.alloc(8);
  header.writeInt32LE(1, 0);
  header.writeInt32LE(payloadBuffer.length, 4);
  return Buffer.concat([header, payloadBuffer]);
}

export const encodeHandshake = () => {
  const handshakeMessage = {
    v: 1, // IPC version
    client_id: CLIENT_ID,
  };

  // Send handshake message
  const handshakeBuffer = encodeIPCMessage(0, handshakeMessage);
  return handshakeBuffer;
}