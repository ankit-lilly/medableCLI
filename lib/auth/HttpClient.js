import fs from "node:fs/promises";

export default class HttpClient {
  constructor(client) {
    this.client = client;
  }

  _throttle(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async head(endpoint) {
    return this.client.head(endpoint);
  }

  async downloadScript({ path, where }) {
    if (!path) path = "./scripts";
    for await (const script of this.getAllObjects("scripts", { where })) {
      const { type, name, script: content } = script;
      console.log(`Downloading ${type}/${name}`);

      await fs.mkdir(`${path}/${type}`, { recursive: true });
      await fs.writeFile(`${path}/${type}/${name}.js`, content);
    }
  }

  getObject(object, { params = {} } = {}) {
    const searchParams = new URLSearchParams();

    if (params.limit) searchParams.append("limit", params.limit);
    if (params.skip) searchParams.append("skip", params.skip);
    if (params.where) searchParams.append("where", params.where);
    if (params.expand) {
      for (const expand of params.expand.split(",")) {
        searchParams.append("expand[]", expand);
      }
    }

    if (params.include) {
      for (const include of params.include.split(",")) {
        searchParams.append("include[]", include);
      }
    }

    if (params.paths) {
      for (const path of params.paths.split(",")) {
        searchParams.append("paths[]", path);
      }
    }

    return this.client(`${object}`, { searchParams }).json();
  }

  postObject(object, { json, body }) {
    if (json) return this.client.post(`${object}`, { json });

    return this.client.post(`${object}`, { body });
  }

  run(script) {
    const payload = {
      language: "javascript",
      optimize: false,
      specification: "es6",
      script,
    };

    return this.postObject("sys/script_runner", {
      json: payload,
    }).json();
  }

  /*
   * We don't really need generator because got provides has a built in API to handle pagination and we could have
   * simply used a while loop  but I felt like using generators.
   */

  async *getAllObjects(object, searchParams, delay) {
    let hasMore = true;
    let skip = 0;
    let limit = 100;

    do {
      const response = await this.getObject(object, {
        params: {
          limit,
          skip,
          ...searchParams,
        },
      });
      skip = skip + limit;
      limit = 100;
      hasMore = response.hasMore;
      yield* response.data;
      if (delay) await this._throttle(delay);
    } while (hasMore);
  }
}
