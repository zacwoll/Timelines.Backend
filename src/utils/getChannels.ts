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

// Host Backend Ports for other applications IE Frontend


if (message.payload.cmd === "GET_GUILDS") {
    let guilds = message.payload.data.guilds;

    for (const guild of guilds) {
      let nonce = uuidv4();
      let getChannelsCmd = {
        nonce,
        args: {
          guild_id: guild.id
        },
        cmd: "GET_CHANNELS"
      };

      const response = await new Promise((resolve) => {
        client.once('data', (data) => {
          const message = decodeIPCMessage(data);
          if (message.payload.nonce === nonce) {
            resolve(message.payload.data);
          }
        });
  
        client.write(encodeIPCMessage(1, getChannelsCmd));
      });

      console.log(response);
    }
  }

  if (message.payload.cmd === "GET_CHANNELS") {
    let channels = message.payload.data.channels;
    channel_count += channels.length;
    console.log(channel_count);
    for (const channel of channels) {
        let nonce = uuidv4();
        let getChannelCmd = {
            nonce,
            args: {
                channel_id: channel.id
            },
            evt: "MESSAGE_CREATE",
            cmd: "SUBSCRIBE"
        }

        const response = await new Promise((resolve) => {
          client.once('data', (data) => {
            const message = decodeIPCMessage(data);
            if (message.payload.nonce === nonce) {
              resolve(message.payload.data);
            }
          });
    
          client.write(encodeIPCMessage(1, getChannelCmd));
        });
        console.log(response);
    }
  }

  if (message.payload.cmd === "SUBSCRIBE") {
    console.log(++subscriber_count);
  }