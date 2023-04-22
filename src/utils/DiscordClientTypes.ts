import { BehaviorSubject } from "rxjs";
import { GuildWithChannels } from "./panopticon";

export interface DiscordClientPayload {
    cmd: string;
    data: { [key: string]: unknown }
        | { any }
        | GuildMetadata
        | ChannelMetadata
        | { channels: ChannelInitial[] }
        | { guilds: GuildInitial[] };
    evt: string;
    nonce: string;
  }

  export interface GuildInitial {
    id: string,
    name: string,
    icon_url: string,
  }

  export interface GuildMetadata extends GuildInitial {
    id: string,
    name: string,
    icon_url: string,
    members: [],
    vanity_url_code: string
  }


export interface GetGuildsPayload extends DiscordClientPayload {
    cmd: 'GET_GUILDS';
    data: {
      guilds: GuildInitial[];
    };
  }

export interface GetGuildPayload extends DiscordClientPayload {
    cmd: 'GET_GUILD';
    data: GuildMetadata;
  }

export interface ChannelInitial {
  id: string;
  name: string;
  type: [0, 2, 4];
}

export interface ChannelMetadata {
  id: string,
  name: string,
  type: number,
  topic: string,
  bitrate: number,
  user_limit: number,
  guild_id: string,
  position: number,
  voice_states: []
}

export interface ChannelGetChannel {
  id: string,
  name: string,
  type: number,
  topic: string,
  bitrate: number,
  user_limit: number,
  guild_id: string,
  position: number,
  messages: [ Message ],
  voice_states: []
}

export interface Channel {
  id: string;
  name: string;
  type: number;
  topic: string;
  bitrate: number;
  user_limit: number;
  guild_id: string;
  position: number;
  voice_states: [];
  messages: BehaviorSubject<Message[]>;
}

export interface GetChannelPayload extends DiscordClientPayload {
  cmd: 'GET_CHANNEL';
  data: ChannelGetChannel
}
  
  export interface GetChannelsPayload extends DiscordClientPayload {
    cmd: 'GET_CHANNELS';
    data: {
      channels: Channel[];
    };
  }

export interface Message {
  id: string,
  blocked: boolean,
  bot: boolean,
  content: string,
  nick: string,
  author_color: string,
  edited_timestamp: string | null,
  timestamp: string,
  tts: boolean,
  mentions: [],
  mention_everyone: boolean,
  mention_roles: [],
  embeds: [],
  attachments: [ MessageAttachment ],
  author: User,
  pinned: boolean,
  type: number // 0
}

export interface MessageAttachment {
  id: string,
  filename: string,
  size: number,
  url: URL,
  proxy_url: URL,
  width: number,
  height: number,
  content_type: string, //  'image/jpeg' | 'image/png' | 'image/gif'
  spoiler: boolean,
  sensitive: boolean
}

export interface User {
  id: string,
  username: string,
  discriminator: number, // always 4 digits
  avatar: string,
  avatar_decoration: any | null,
  bot: boolean,
  flags: number,
  premium_type: number
}