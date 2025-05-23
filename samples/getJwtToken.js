const {AuthClient} = require('../dist');
const {CLIENT_ID, CLIENT_SECRET} = require('./config');


// через прокси
const proxyUrl = 'https://gigachat-auth-proxy.services.mobilon.ru';
const authClient = new AuthClient(CLIENT_ID, CLIENT_SECRET, {debug: true, url: proxyUrl});

const start = async () => {
  const data = await authClient.getToken('GIGACHAT_API_PERS');
  console.log('data', data);
}

(start)()
