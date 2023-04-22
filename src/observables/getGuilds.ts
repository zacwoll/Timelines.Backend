import { filter, mergeMap, map, tap, first, concatAll } from 'rxjs/operators';
import { BehaviorSubject, merge } from 'rxjs';
import { DiscordClient } from "../utils/DiscordClient";

// I think maybe it's still busted
// I want to create an observable of the pipe looking for get_guilds and running a number of commands t

// Define the observable network
// export function createGuildsObservable(client: DiscordClient) {
//     // 
//   const getGuilds$ = client.incomingData.pipe(
//     // filter the data for GET_GUILDS
//     filter(message => message.payload.cmd === 'GET_GUILDS'),
//     // flatten the data
//     map(message => message.payload.data),
//     // transform and send downstream
//     mergeMap(data => {
//       const guilds = data.guilds;
//       // a map of guild observables
//       const guildObservables = guilds.map(guild => {
//         const args = { guild_id: guild.id };
//         client.sendCommand('GET_GUILD', args);
//         return client.incomingData.pipe(
//           filter(message => message.payload.cmd === 'GET_GUILD' && message.payload.data.guild_id === guild.id),
//           map(message => message.payload.data)
//         );
//       });
//       return merge(...guildObservables).pipe(concatAll());
//     })
//   );

//   const guildCreateUpdates$ = client.incomingData.pipe(
//     filter(message => message.payload.cmd === 'GUILD_CREATE'),
//     map(message => message.payload.data)
//   );

//   return merge(getGuilds$, guildCreateUpdates$);
// }

function createGuildObservable(guildId) {
    const guildObservable = new BehaviorSubject(/* initial value */);
    guildObservables.set(guildId, guildObservable);
    guildObservables$.next(guildObservables);
    return guildObservable;
  }