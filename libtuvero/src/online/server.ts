// import axios from "axios";
import defaultConfig from "../config";
import * as _ from "lodash";

type API_Config = {
  baseUrl: string;
  defaultPath: string;
  timeout: number;
};

type API_Options = {
  baseUrl?: string;
  defaultPath?: string;
  timeout?: number;
};

class Server {
  token: string;
  config: API_Config;

  constructor(token: string = "", options?: API_Options) {
    this.token = token;

    this.config = _.extend({}, defaultConfig.online.api, options);
  }

  // /**
  //  * Retrieve an object from the tuvero cloud
  //  *
  //  * @param path The path. Defaults to "/".
  //  * @param timeout Optional. Timeout in milliseconds.
  //  */
  // get(
  //   path: string = "/",
  //   timeout: number = this.config.timeout
  // ): Promise<Object> {
  //   return axios.get(`${this.config.baseUrl}/${path}`, { timeout });
  // }

  // /**
  //  * Update an object in the Tuvero Cloud
  //  *
  //  * @param path The path to the object
  //  * @param data A data object to post to the server.
  //  * @param timeout Optional.
  //  */
  // post(
  //   path: string,
  //   data: Object,
  //   timeout: number = this.config.timeout
  // ): Promise<Object> {
  //   return axios.post(`${this.config.baseUrl}/${path}`, data, { timeout });
  // }

  // /**
  //  * Create an Object in the Tuvero Cloud
  //  *
  //  * @param path The path to the object class (since there's no object reference yet)
  //  * @param data The Object to create on the server
  //  * @param timeout Optional. Timeout in milliseconds.
  //  */
  // put(
  //   path: string,
  //   data: Object,
  //   timeout: number = this.config.timeout
  // ): Promise<Object> {
  //   return axios.put(`${this.config.baseUrl}/${path}`, data, { timeout });
  // }

  // /**
  //  * Delete an Object from the Tuvero Cloud
  //  *
  //  * @param path The path
  //  * @param timeout Optional. Timeout in milliseconds.
  //  */
  // delete(
  //   path: string = "/",
  //   timeout: number = this.config.timeout
  // ): Promise<Object> {
  //   return axios.delete(`${this.config.baseUrl}/${path}`, { timeout });
  // }
}

export default Server;
