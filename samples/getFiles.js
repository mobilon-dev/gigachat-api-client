process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const {ApiClient} = require('../dist');
const {JWT} = require('./config');

// const proxyUrl = 'https://gigachat-service-proxy.services.mobilon.ru';
const apiClient = new ApiClient(JWT, {debug: true, 
  //url: proxyUrl
  });

const start = async () => {
  const data = await apiClient.getFileList();
  console.log('data', data);
}

(start)()
