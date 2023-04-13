const connectToIPC = require('./discordIPC');
import { authorizeClient } from './authorize'; 
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');
dotenv.config();

const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;


// WE can add middleware here!
// Run Setup
export async function getClient() {
    let client = await connectToIPC();
    client = await authorizeClient(client);
    return client;
}