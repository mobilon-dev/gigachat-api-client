# gigachat-api-client


docs: https://mobilon-dev.github.io/gigachat-api-client/
see ./samples


`````javascript


// get jwt
const authClient = new AuthClient(CLIENT_ID, CLIENT_SECRET, {debug: true});
const data = await authClient.getToken('GIGACHAT_API_PERS');

// use jwt, get files
const apiClient = new ApiClient(JWT, {debug: true});
const data = await apiClient.getFileList();


// use jwt, send requests
const model = 'GigaChat';
const messages = [
  {
   "role": "user",
   "content": "5 причин всего"
  }
]

const data = await apiClient.sendRequest(model, messages);


`````
