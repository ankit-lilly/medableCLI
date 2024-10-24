import got from "got";
import HttpClient from "./HttpClient.js";

export default class CortexClient extends HttpClient {
  static #BASE_URL = `https://api.dev.medable.com`;

  constructor(access_token, medable_org) {
    const client = got.extend({
      prefixUrl: `${CortexClient.#BASE_URL}/${medable_org}/v2/`,
      headers: { Authorization: `Bearer ${access_token}` },
    });

    super(client);
  }

  async isTokenValid() {
    const resp = await this.head("/");

    return [401, 403].includes(resp.statusCode);
  }
}
