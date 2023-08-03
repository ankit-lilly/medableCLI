import jwt from 'jsonwebtoken';
import MedableOauthClient from './auth/MedableOauthClient.js';
import MedableHttpClient from './auth/MedableHttpClient.js';

class MedableClient {
  static isTokenValid(token) {
    if (!token) {
      return false;
    }
    try {
      const decodedToken = jwt.decode(token);
      const expirationTime = decodedToken.exp;
      const currentTime = Math.floor(Date.now() / 1000);
      return currentTime > expirationTime;
    } catch (error) {
      return false;
    }
  }

  static async login({ apiKey, password, username, org }) {
    const httpClient = await MedableHttpClient.buildAuthClient({
      apiKey,
      password,
      username,
      org,
    });

    const accessToken = await httpClient.createJWT(apiKey, username).then((token) => token?.trim());
    localStorage.setItem(org, accessToken);
    localStorage.setItem('activeOrg', org);
    return accessToken;
  }

  static getClient() {
    let org = localStorage.getItem('activeOrg');
    let existingToken = localStorage.getItem(org);

    return new MedableOauthClient(existingToken, org);
  }
}

export default MedableClient;
