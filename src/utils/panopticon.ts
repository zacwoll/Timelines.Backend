import { DiscordClient } from './DiscordClient';
import { createNewLogger } from './logger';
import { BehaviorSubject, Observable } from 'rxjs';
import { Channel, GetGuildPayload, GuildInitial, GET_GUILD_GUILD } from './DiscordClientTypes';

export interface GuildWithChannels {
    id: string;
    name: string;
    icon_url: string;
    members: [];
    vanity_url_code: string;
    guildObservable: BehaviorSubject<GET_GUILD_GUILD>;
    channelObservables: Map<string, BehaviorSubject<Channel>>;
  }

export class Panopticon {
  // variables for the panopticon class
  // Used for error reporting and general logging
  private logger;

  // Guilds is a BehaviorSubject holding a Map of guild IDs to their respective BehaviorSubject<GuildWithChannels>
  private guilds: BehaviorSubject<Map<string, BehaviorSubject<GuildWithChannels>>>;
  private client: DiscordClient;

  constructor(client: DiscordClient) {
    this.logger = createNewLogger('panopticon');
    this.client = client;
    this.guilds = new BehaviorSubject(new Map());
    this.initialize();
  }

  private async initialize(): Promise<void> {
    // Wait for the client to be authorized before continuing
    await this.client.waitForAuthorization();
    const guilds = await this.client.getGuilds();
    this.logger.info(guilds);
    this.initializeGuilds(guilds);
  }


  private async initializeGuilds(guilds: GuildInitial[]): Promise<void> {
    const guildsMap = new Map<string, BehaviorSubject<GuildWithChannels>>();

    for (const guild of guilds) {
      const guildResponse = await this.client.getGuild(guild.id);
      const guildWithChannels: GuildWithChannels = {
        id: guild.id,
        name: guild.name,
        icon_url: guild.icon_url,
        members: guild.members,
        vanity_url_code: guild.vanity_url_code,
        guildObservable: new BehaviorSubject<GET_GUILD_GUILD>(guildResponse),
        channelObservables: new Map<string, BehaviorSubject<Channel>>(),
      };
      guildsMap.set(guild.id, new BehaviorSubject<GuildWithChannels>(guildWithChannels));
      await this.initializeChannels(guildWithChannels);
    }

    this.guilds.next(guildsMap);
  }
}
