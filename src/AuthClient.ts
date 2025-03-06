import axios from 'axios';
import { requestLogger, responseLogger } from 'axios-logger';
import {v4} from 'uuid'

const btoa = (str: string) => {
  return Buffer.from(str).toString('base64');
}

export interface IOptions {
  debug: boolean;
  url: string;
  logger: any;
}

const AUTH_URL = 'https://ngw.devices.sberbank.ru:9443';

export class AuthClient{
  axios: any;
  client_id: string;
  client_secret: string;

  constructor(client_id: string, client_secret: string, options: IOptions){
    this.client_id = client_id;
    this.client_secret = client_secret;

    this.axios = axios.create({
      baseURL: options.url || AUTH_URL,
    })

    if (options.debug) {
      const config = {
        prefixText: 'GigachatAuthClient',
        status: true,
        headers: false,
        params: true,
      };
      this.axios.interceptors.request.use((request: any) => {
        return requestLogger(request, config);
      });
      this.axios.interceptors.response.use((response: any) => {
        return responseLogger(response, config);
      });
    } 
  }

  async getToken(scope: string){
    const headers = {
      authorization: 'Basic ' + btoa(this.client_id + ':' + this.client_secret),
      rquid: v4(),
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    const url = '/api/v2/oauth';

    const response = await this.axios.post(url, {scope}, {headers});
    return response.data;
  }
}
