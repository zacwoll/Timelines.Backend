import axios from 'axios';

export class Authorization {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly redirectUri: string;
  private readonly scopes: string[];

  constructor(clientId: string, clientSecret: string, redirectUri: string, scopes: string[]) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
    this.scopes = scopes;
  }

  async getAccessToken(code: string): Promise<string> {
    const tokenResponse = await axios.post(
      'https://discord.com/api/oauth2/token',
      {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: this.redirectUri,
        scope: this.scopes,
      }
    );

    return tokenResponse.data.access_token;
  }
}
