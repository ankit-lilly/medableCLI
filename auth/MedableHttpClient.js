import got from 'got';
import { CookieJar } from 'tough-cookie';

import HttpClient from './HttpClient.js';

class MedableHttpClient extends HttpClient {
  constructor(client) {
    super(client);
  }
  static async buildAuthClient({ username, password, org, apiKey }) {
    const cookieJar = new CookieJar();

    const baseURL = `https://api.dev.medable.com/${org}/v2`;
    const request = got.extend({
      cookieJar,
      prefixUrl: baseURL,
      headers: { 'medable-client-key': apiKey },
    });

    const credentials = {
      email: username,
      password: password,
    };

    await request.post(`accounts/login`, {
      json: credentials,
    });

    return new MedableHttpClient(request);
  }

  async createJWT(apiKey, username) {
    const tokenScript = `const Account = org.objects.account; const account_id= Account.find({email:"${username}"}).skipAcl().grant(4).next()._id; return Account.createAuthToken('${apiKey}', account_id, { scope:['*'], skipAcl: true, grant: consts.accessLevels.read})`;

    const data = await this.run(tokenScript);
    if (!data?.data) throw new Error("Couldn't generate access token");

    return data.data;
  }
}

export default MedableHttpClient;
