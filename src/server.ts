const express = require('express');
const qs = require('qs'); // To convert the data to x-www-form-urlencoded format
const connectToIPC = require('./utils/discordIPC');
import { getClient } from './utils/DiscordClient';
import axios from 'axios';
import { encodeIPCMessage, decodeIPCMessage } from './utils/IPC';
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');
dotenv.config();

const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;

const app = express();
const port = 3000;


let totalChannels = 0;
// // Run Setup
// let client = getClient();
getClient().then(client => {
    let nonce = uuidv4();
let getGuildsCmd = {
    nonce,
    args: {},
    cmd: "GET_GUILDS"
    }
client.write(encodeIPCMessage(1, getGuildsCmd));

})

// connectToIPC().then(client => {
//     client.on('data', async (data) => {
//         const message = decodeIPCMessage(data);
//         console.log('Received message:', JSON.stringify(message, null, 2));
    
//         if (message.payload.evt === "READY") {
//             const nonce = uuidv4();
//             const authorizeCmd = {
//                 nonce,
//                 cmd: 'AUTHORIZE',
//                 args: {
//                     client_id: CLIENT_ID,
//                     scopes: ['rpc', 'identify', 'messages.read'],
//                 },
//             }; 

//             const auth = encodeIPCMessage(1, authorizeCmd);
//             client.write(auth);

//             console.log('Sent AUTHORIZE command');
//         }
    
//         if (message.payload.cmd === "AUTHORIZE") {
//             // Await getting Authorized
//             try {
//                 const data = {
//                     grant_type: 'authorization_code',
//                     code: message.payload.data.code,
//                     redirect_uri: 'https://localhost',
//                     client_id: CLIENT_ID,
//                     client_secret: CLIENT_SECRET,
//                 };
//                 console.log("Sending for Authorized token");
//                 const response = await axios.post('https://discord.com/api/oauth2/token', qs.stringify(data));

//                 console.log(`Server responded with: ${JSON.stringify(response.data, null, 2)}`);
//                 let OAuth = response.data;

//                 const nonce = uuidv4();
//                 const authenticateCmd = {
//                     nonce,
//                     args: {
//                       access_token: OAuth.access_token
//                     },
//                     cmd: "AUTHENTICATE"
//                 };
//                 const auth = encodeIPCMessage(1, authenticateCmd);
//                 client.write(auth);
//             } catch (error) {
//                 console.error(error);
//             }
//         }

//         if (message.payload.cmd === "AUTHENTICATE") {
//             let data = message.payload.data;
//             // begin harvesting data from account
//             let nonce = uuidv4();
//             let getGuildsCmd = {
//                 nonce,
//                 args: {},
//                 cmd: "GET_GUILDS"
//               }
//             client.write(encodeIPCMessage(1, getGuildsCmd));
//         }

//         // if (message.payload.cmd === "GET_GUILDS") {
//         //     let guilds = message.payload.data.guilds;

//         //     // const ODOT_GUILD_ID = '916351332628201472';
//         //     // let nonce = uuidv4();
//         //     // let getChannelsCmd = {
//         //     //     nonce,
//         //     //     args: {
//         //     //         guild_id: ODOT_GUILD_ID
//         //     //     },
//         //     //     cmd: "GET_CHANNELS"
//         //     // }
//         //     // client.write(encodeIPCMessage(1, getChannelsCmd));

//         //     for (const guild of guilds) {
//         //         let nonce = uuidv4();
//         //         let getChannelsCmd = {
//         //             nonce,
//         //             args: {
//         //                 guild_id: guild.id
//         //             },
//         //             cmd: "GET_CHANNELS"
//         //           }
//         //         client.write(encodeIPCMessage(1, getChannelsCmd));
//         //     }
//         // }

//         // if (message.payload.cmd === "GET_CHANNELS") {
//         //     let channels = message.payload.data.channels;
//         //     totalChannels += channels.length;
//         //     console.log(totalChannels);
//         //     // 
//         //     // for (const channel of channels) {
//         //     //     let nonce = uuidv4();
//         //     //     let getChannelCmd = {
//         //     //         nonce,
//         //     //         args: {
//         //     //             channel_id: channel.id
//         //     //         },
//         //     //         evt: "MESSAGE_CREATE",
//         //     //         cmd: "SUBSCRIBE"
//         //     //     }
//         //     //     client.write(encodeIPCMessage(1, getChannelCmd));
//         //     // }

//         //     // const TVLSI_CHANNEL_ID = '917523739342667897'
//         //     // let nonce = uuidv4();
//         //     // let getChannelCmd = {
//         //     //     nonce,
//         //     //     args: {
//         //     //         channel_id: TVLSI_CHANNEL_ID
//         //     //     },
//         //     //     cmd: "GET_CHANNEL"
//         //     // }
//         //     // client.write(encodeIPCMessage(1, getChannelCmd));

//         //     // // Quick detour
//         //     // let nonce = uuidv4();
//         //     // let getChannelCmd = {
//         //     //     nonce,
//         //     //     args: {},
//         //     //     evt: "MESSAGE_CREATE",
//         //     //     cmd: "SUBSCRIBE"
//         //     // }
//         //     // client.write(encodeIPCMessage(1, getChannelCmd));
//         // }

//     });
// }).catch(err => console.log(err).finally(console.log("exiting")));

// auth =
// {
//     access_token: 'GlwPmwt0UNbRBUKDoymuhtLoWbakR9',
//     expires_in: 604800,
//     refresh_token: 'Pdy30istODoqF1z0tFhJ8j2VOrPy6W',
//     scope: 'identify rpc',
//     token_type: 'Bearer'
//   }
// Host Backend Ports for other applications IE Frontend
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
