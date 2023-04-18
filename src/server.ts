const express = require('express');
const qs = require('qs'); // To convert the data to x-www-form-urlencoded format
import { createNewLogger } from './utils/logger';
import { DiscordClient } from './utils/DiscordClient';
import { encodeIPCMessage, decodeIPCMessage } from './utils/IPC';
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');
dotenv.config();

const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;

const app = express();
const port = 3000;

export const serverLog = createNewLogger('server');

let discord = new DiscordClient();
    // Send GET_GUILDS
    // let nonce = uuidv4();
    // let getGuildsCmd = {
    //     nonce,
    //     args: {},
    //     cmd: "GET_GUILDS"
    //     }
    // discord.write(encodeIPCMessage(1, getGuildsCmd));
    // discord.on('data', data => {
    //     const message = decodeIPCMessage(data);
    //     console.log(JSON.stringify(message));
    // })

// getClient();

// // // Run Setup
// // let client = getClient();
// getClient().then(client => {
//     // Set up slurper
    
//     // Send GET_GUILDS
//     let nonce = uuidv4();
//     let getGuildsCmd = {
//         nonce,
//         args: {},
//         cmd: "GET_GUILDS"
//         }
//     client.write(encodeIPCMessage(1, getGuildsCmd));

//     let channel_count = 0;
//     let text_channel_count = 0;
//     let subscriber_count = 0;

//     client.on('data', async (data) => {
        
//         const message = decodeIPCMessage(data);
        
//         serverLog.info(message);

//         if (message.payload.cmd === "GET_GUILDS") {
//             let guilds = message.payload.data.guilds;
        
//             for (const guild of guilds) {
//               let nonce = uuidv4();
//               let getChannelsCmd = {
//                 nonce,
//                 args: {
//                   guild_id: guild.id
//                 },
//                 cmd: "GET_CHANNELS"
//               };
        
//               const response = await new Promise((resolve) => {
//                 client.once('data', (data) => {
//                   const message = decodeIPCMessage(data);
//                   if (message.payload.nonce === nonce) {
//                     resolve(message.payload.data);
//                   }
//                 });
          
//                 client.write(encodeIPCMessage(1, getChannelsCmd));
//               });
        
//             //   logStream.write(response);
//             }
//           }
        
//         // if (message.payload.cmd === "GET_CHANNELS") {
//         //     let channels = message.payload.data.channels;

//         //     for (const channel of channels) {
//         //         if (channel.type != 4) { 
//         //             continue;
//         //         }
//         //         let nonce = uuidv4();
//         //         let getChannelCmd = {
//         //             nonce,
//         //             args: {
//         //                 channel_id: channel.id
//         //             },
//         //             evt: "MESSAGE_CREATE",
//         //             cmd: "SUBSCRIBE"
//         //         }
        
//         //         const response = await new Promise((resolve) => {
//         //           client.once('data', (data) => {
//         //             const message = decodeIPCMessage(data);
//         //             if (message.payload.nonce === nonce) {
//         //               resolve(message.payload.data);
//         //             }
//         //           });
            
//         //           client.write(encodeIPCMessage(1, getChannelCmd));
//         //         });
//         //         // logStream.write(response);
                
//         //         // Add a delay of 1 second (1000 milliseconds) between each iteration
//         //         await new Promise((resolve) => setTimeout(resolve, 10));
//         //     }
//         // }

//         if (message.payload.cmd === "SUBSCRIBE") {

//         }
//     })

// });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
