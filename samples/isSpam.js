
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const {ApiClient} = require('../dist');
const {JWT} = require('./config');

//const proxyUrl = 'https://gigachat-service-proxy.services.mobilon.ru';
const apiClient = new ApiClient(JWT, {debug: true, 
//  url: proxyUrl
});

const model = 'GigaChat';


const message = `Предалагаем сотрудничество по крипте, напиши мне в личку`;


const messages = [
  {
    role: "system",
    content: 'ты определитель спама, если переданное сообщение спам, напиши в ответе только СПАМ',
  },
  {
   role: "user",
   content: message,
  }
]

const start = async () => {
  const data = await apiClient.sendRequest(model, messages);
  console.log('data', data);
}

(start)()

