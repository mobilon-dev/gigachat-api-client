import axios from 'axios';
import { requestLogger, responseLogger } from 'axios-logger';
// import { fetchEventSource } from '@microsoft/fetch-event-source';

export interface IApiClientOptions {
  debug: boolean;
  url: string;
  timeout: number;
}

const API_URL = 'https://gigachat.devices.sberbank.ru';

export class ApiClient{
  axios: any;
  token: any;
  
  constructor(jwt: string, options: IApiClientOptions) {
    this.token = jwt;
    this.axios = axios.create({
      baseURL: options.url || API_URL, 
      headers: {
        'Accept': 'application/json', 
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      timeout: options.timeout || 20 * 1000,
    });

    if (options.debug) {
      const config = {
        prefixText: 'GigachatApiClient',
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

  /* Files */

  async getFileList(){
    const response = await this.axios.get(`/api/v1/files`);
    return response.data;
  }

  async getFileInfo(fileId: string){
    const response = await this.axios.get(`/api/v1/files/${fileId}`);
    return response.data;
  }

  async uploadFile(file: File){
    const formData = new FormData();
    formData.append('file', file)
    formData.append('purpose','general')
    console.log(formData)
    const response = await this.axios.post(`/api/v1/files`,formData);
    return response.data;
  }

  async downloadFile(fileId: string, filename: string, created_at: number){
    return await this.axios.get(`/api/v1/files/${fileId}/content`, {
      responseType: 'blob',
    })
    /*
      .then(response => {
        const file = new File([response], filename, {lastModified: created_at})
        const a = document.createElement('a')
        const url = URL.createObjectURL(file)
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        setTimeout(() => {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);  
        }, 10)
      })
    */
  }

  async deleteFile(fileId: string){
    const response = await this.axios.post(`/api/v1/files/${fileId}/delete`);
    return response.data;
  }

  /* Tokens */

  async getAvailableTokens(){
    const response = await this.axios.get(`/api/v1/balance`);
    return response.data;
  }

  /* Models */

  async getModels(){
    const response = await this.axios.get(`/api/v1/models`)
    return response.data;
  }

  /* Requests */

  async sendRequest(model: string, messages: object[]){
    const data = JSON.stringify({
      'model' : model,
      'messages' : messages,
    }, null,' ')

    const response = await this.axios.post(`/api/v1/chat/completions`, data)
    return response.data;
  }

  /*
  async sendStreamRequest(model: string, messages: object[], stream: boolean, update_interval: number|null = null){
    
    const data = JSON.stringify({
      'model' : model,
      'messages' : messages,
      'stream' : stream,
      'update_interval': update_interval,
    }, null,' ')

    const pre = '**[ApiClient][Request]** '
    // const url = ' ' + `${import.meta.env.VITE_LOG_API_URL}` + '/chat/completions' + ' '
    // this.logStore.appendLog(pre + 'post' + url + data)

    const logStore = this.logStore
    const logUrl = this.logUrl
    const response = <string[]>[]

    await fetchEventSource(this.url + '/chat/completions',{
      method: "POST",
      headers: {
        'Accept': 'text/event-stream', 
        Authorization: `Bearer ${this.token}`,
      },
      body: data,
      //@ts-ignore
      onopen(response) {
        const pre = '**[ApiClient][Response]** '
        const url = ' ' + logUrl + '/chat/completions' + ' '
        logStore.appendLog(pre + 'post' + url + ' ' + response.status + ': ' + response.statusText)
      },
      async onmessage(ev) {
        const pre = '**[ApiClient][SSE]** '
        if (ev.data != '[DONE]'){
          const data = JSON.parse(ev.data)
          const m = data.choices[0].delta.content as string
          logStore.appendLog(pre + ' ' + ev.data)
          response.push(m)
        }
        else if (ev.data == '[DONE]'){
          logStore.appendLog(pre + ' ' + ev.data)
        }
      },
      onerror(err) {
        console.log("There was an error from server", err);
        return 
      },
    })
    return response
  }
  */
}
