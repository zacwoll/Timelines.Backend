import { filter, mergeMap, map, tap, first } from 'rxjs/operators';
import { merge, from } from 'rxjs';

import { DiscordClient } from "../utils/DiscordClient";
import { createGuildsObservable } from './getGuilds';

import { filter, mergeMap, map } from 'rxjs/operators';
import { merge, from } from 'rxjs';

export function createChannelsObservable(client: DiscordClient, guildsObservable) {
  const getChannelsObservables = guildsObservable.pipe(
    mergeMap(guild => {
      const args = { guild_id: guild.id };
      client.sendCommand('GET_CHANNELS', args);
      return client.incomingData.pipe(
        filter(message => message.payload.cmd === 'GET_CHANNELS' && message.payload.data.guild_id === guild.id),
        mergeMap(message => from(message.payload.data.channels)),
        mergeMap(channel => {
          const args = { channel_id: channel.id };
          client.sendCommand('GET_CHANNEL', args);
          return client.incomingData.pipe(
            filter(message => message.payload.cmd === 'GET_CHANNEL' && message.payload.data.channel_id === channel.id),
            map(message => message.payload.data)
          )
        })
      );
    })
  );

  const channelCreateUpdates$ = client.incomingData.pipe(
    filter(message => message.payload.cmd === 'CHANNEL_CREATE'),
    map(message => message.payload.data)
  );

  return merge(getChannelsObservables, channelCreateUpdates$);
}
