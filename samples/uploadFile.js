process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const {ApiClient} = require('../dist');
const {JWT} = require('./config');
const fs = require('fs');
const path = require('path');

// const proxyUrl = 'https://gigachat-service-proxy.services.mobilon.ru';
const apiClient = new ApiClient(JWT, {debug: true, 
  // url: proxyUrl
  });

const start = async () => {
  const filePath = path.join(__dirname, 'data', 'file.txt');
  const fileBuffer = fs.readFileSync(filePath);
  const data = await apiClient.uploadFile(fileBuffer, 'file.txt');
  console.log('data', data);
}

(start)()
