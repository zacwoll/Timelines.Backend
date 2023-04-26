
import { Client, Events, GatewayIntentBits } from 'discord.js';
import { Worker, isMainThread, parentPort, workerData } from 'worker_threads'
import dotenv from 'dotenv';
dotenv.config();

import { fromEvent, lastValueFrom, Observable, of, Subject } from 'rxjs';
import { concatMap, delay, filter, map, take, throttleTime } from 'rxjs/operators';
import { createNewLogger } from '../utils/logger';
import { Authorization } from './clientAuth';

const clientLog = createNewLogger('client');

const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const CLIENT_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const redirect_uri = 'http://localhost';
const AUTH_SCOPES = ['bot'];

// TODO: Create authorization for DiscordClient. allow bot to join servers and hook up cables to it's data
export class DiscordClient {
    private client: Client;
    private _connected: boolean;
    private messageSubject: Subject;
    private guildSubject: Subject;
    private authorization: Authorization;

  constructor() {
    this.client = new Client({
        intents: [
          GatewayIntentBits.Guilds,
          GatewayIntentBits.GuildMessages,
          GatewayIntentBits.DirectMessages,
          GatewayIntentBits.GuildMessageReactions,
          GatewayIntentBits.DirectMessageReactions,
          GatewayIntentBits.GuildMembers,
          GatewayIntentBits.GuildEmojisAndStickers,
        ]
      });
    this.authorization = new Authorization(CLIENT_ID, CLIENT_SECRET, redirect_uri, AUTH_SCOPES);
    this.messageSubject = new Subject();
    this.guildSubject = new Subject();
    this.registerMessageHandler();
    this.registerGuildHandler();
  }

  async login(botToken: string, code: string, guildId: string) {
    const accessToken = await this.authorization.getAccessToken(code);

    await this.client.login(botToken);
    await this.client.guilds.cache.get(guildId)?.members.fetch();
    await this.client.guilds.cache.get(guildId)?.members.add(this.client.user?.id as string, {
      accessToken,
      roles: [],
    });

    console.log(`Added bot to server ${guildId}`);
  }

  getMessagesObservable() {
    return this.messageSubject.asObservable();
  }

  getGuildsObservable() {
    return this.guildSubject.asObservable();
  }

  async registerGuildHandler() {
    this.client.on(Events.GuildCreate, guild => {
        console.log('Guild Added to Bot');
        this.guildSubject.next(guild);
    })
  }

  async registerMessageHandler() {
    this.client.on(Events.MessageCreate, (message) => {
      // Emit the received message through the messageSubject
      this.messageSubject.next(message);
    });
  }
}