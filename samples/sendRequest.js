const {ApiClient} = require('../dist');
const {JWT} = require('./config');

const proxyUrl = 'https://gigachat-service-proxy.services.mobilon.ru';
const apiClient = new ApiClient(JWT, {debug: true, url: proxyUrl});

const model = 'GigaChat';

const messages = [
  {
   "role": "user",
   "content": "5 причин всего"
  }
]

const start = async () => {
  const data = await apiClient.sendRequest(model, messages);
  console.log('data', data);
}

(start)()


/*
[GigachatApiClient][Request] POST https://gigachat-service-proxy.services.mobilon.ru/api/v1/chat/completions {
 "model": "GigaChat",
 "messages": [
  {
   "role": "user",
   "content": "5 причин всего"
  }
 ]
}
[GigachatApiClient][Response] POST https://gigachat-service-proxy.services.mobilon.ru/api/v1/chat/completions 200:OK {"choices":[{"message":{"content":"Конечно! Вот пять универсальных причин для чего угодно:\n\n1. **Эффективность и результативность**:\n   Причина может заключаться в том, что выполнение задачи или достижение цели позволит сэкономить время, усилия или ресурсы. Это помогает сосредоточиться на главном и избежать лишней суеты.\n\n2. **Личное развитие и самореализация**:\n   Люди часто стремятся к развитию своих навыков, знаний или способностей. Достижение целей может приносить удовлетворение и чувство выполненного долга, а также способствует личностному росту.\n\n3. **Влияние на других**:\n   Достижение успеха в какой-либо области может вдохновить окружающих, показать им пример и даже мотивировать их на собственные достижения.\n\n4. **Финансовая стабильность и улучшение качества жизни**:\n   Заработок денег или экономия средств могут стать весомой причиной для выполнения определённой работы или проекта. Деньги позволяют обеспечить комфортное существование и реализовать мечты.\n\n5. **Причины социального характера**:\n   Взаимодействие с обществом, помощь другим людям, создание чего-то полезного для общества – всё это тоже может быть сильной мотивацией. Такие причины придают смысл нашим действиям и помогают ощущать себя частью чего-то большего.","role":"assistant"},"index":0,"finish_reason":"stop"}],"created":1741261428,"model":"GigaChat:1.0.26.20","object":"chat.completion","usage":{"prompt_tokens":15,"completion_tokens":290,"total_tokens":305,"precached_prompt_tokens":0}}
data {
  choices: [ { message: [Object], index: 0, finish_reason: 'stop' } ],
  created: 1741261428,
  model: 'GigaChat:1.0.26.20',
  object: 'chat.completion',
  usage: {
    prompt_tokens: 15,
    completion_tokens: 290,
    total_tokens: 305,
    precached_prompt_tokens: 0
  }
}

*/
