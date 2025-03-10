
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const {ApiClient} = require('../dist');
const {JWT} = require('./config');

const proxyUrl = 'https://gigachat-service-proxy.services.mobilon.ru';
const apiClient = new ApiClient(JWT, {debug: true, 
  url: proxyUrl, //'https://gigachat-preview.devices.sberbank.ru'
});

const model = 'GigaChat';

const message = `Привет! Набираю команду для удаленной занятости, доступно только для совершеннолетних. Адаптируемый график и солидный доход. Напишите + в лс, если хотите обсудить.`;

const message2 = `🔤 Пp͏e͏длa͏гa͏e͏м c͏o͏тp͏y͏дничe͏c͏твo͏ для c͏o͏вмe͏c͏тнo͏гo͏ зa͏p͏a͏бo͏ткa͏ пo͏д кp͏иптy͏.

💲Дo͏x͏o͏д (зa͏виc͏ит o͏т c͏y͏ммы вa͏шиx͏ c͏тa͏p͏тo͏выx͏ влo͏жe͏ний) — o͏т 6͏0͏$ дo͏ 8͏0͏0͏$ e͏жe͏днe͏внo͏.

🔹🔹🔹🔹🔹🔹🔹🔹 :
👍 Пp͏и o͏тc͏y͏тc͏твии o͏пытa͏ o͏бy͏чa͏e͏м c͏o͏вe͏p͏шe͏ннo͏ бe͏c͏плa͏тнo͏. B͏ы лишь бy͏дe͏тe͏ o͏тдa͏вa͏ть нa͏м o͏пp͏e͏дe͏лe͏нный пp͏o͏цe͏нт c͏o͏ c͏вo͏e͏й пp͏ибыли;
👍 B͏a͏ши дe͏ньги бy͏дy͏т нa͏x͏o͏дитьc͏я y͏ вa͏c͏ и тo͏лькo͏ пo͏д вa͏шим кo͏нтp͏o͏лe͏м.

🤨 H͏e͏ пиc͏a͏ть лицa͏м, нe͏ дo͏c͏тигшим 1͏8͏-и лe͏т, пo͏пp͏o͏шa͏йкa͏м, p͏e͏клa͏мщикa͏м и пp͏o͏чим — c͏p͏a͏зy͏ бa͏н!
💬 B͏c͏e͏ o͏c͏тa͏льныe͏, ктo͏ зa͏интe͏p͏e͏c͏o͏вa͏лc͏я, нa͏пишитe͏ мнe͏ c͏юдa͏: @Dmitry_TraffC0in
`;


const messages = [  
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

