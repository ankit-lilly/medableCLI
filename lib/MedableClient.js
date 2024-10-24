import MedableOauthClient from "./auth/MedableOauthClient.js";
import MedableHttpClient from "./auth/MedableHttpClient.js";

export default class MedableClient {
  static async login({ apiKey, password, username, org }) {
    const httpClient = await MedableHttpClient.buildAuthClient({
      apiKey,
      password,
      username,
      org,
    });

    const accessToken = await httpClient.createJWT(apiKey, username).then((
      token,
    ) => token?.trim());
    localStorage.setItem(org, accessToken);
    localStorage.setItem("activeOrg", org);
    return accessToken;
  }

  static getClient() {
    let org = localStorage.getItem("activeOrg");
    let existingToken = localStorage.getItem(org);

    return new MedableOauthClient(existingToken, org);
  }
}
