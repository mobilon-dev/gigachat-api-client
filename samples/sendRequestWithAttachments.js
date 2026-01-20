/**
 * Пример использования attachments в запросах к GigaChat API
 * 
 * Этот пример показывает:
 * 1. Как загрузить файл через uploadFile
 * 2. Как использовать fileId в attachments при отправке запроса
 * 3. Как обработать ответ с учетом attachments
 */

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
  try {
    // Шаг 1: Загружаем файл
    console.log('1. Загружаем файл...');
    const filePath = path.join(__dirname, 'data', 'file.txt');
    const fileBuffer = fs.readFileSync(filePath);
    const uploadResult = await apiClient.uploadFile(fileBuffer, 'file.txt');
    console.log('Файл загружен:', uploadResult);
    
    // Получаем fileId из ответа
    // Формат ответа: { id: "cc113511-ab40-4bdb-ab54-7749a4433afb", ... }
    const fileId = uploadResult.id;
    console.log('File ID:', fileId);

    // Шаг 2: Отправляем запрос с attachments
    console.log('\n2. Отправляем запрос с attachments...');
    const model = 'GigaChat-2';
    
    // Формируем сообщение с attachments
    // attachments - это массив fileId (UUID строки)
    const messages = [
      {
        "role": "user",
        "content": "уточните время работы",
        "attachments": [
          fileId  // Можно добавить несколько fileId: [fileId1, fileId2, ...]
        ]
      }
    ];

    const response = await apiClient.sendRequest(model, messages);
    console.log('\nОтвет от API:');
    console.log(JSON.stringify(response, null, 2));
    
    // Выводим содержимое ответа
    if (response.choices && response.choices.length > 0) {
      console.log('\nОтвет модели:');
      console.log(response.choices[0].message.content);
      
      // Выводим статистику использования токенов
      if (response.usage) {
        console.log('\nИспользование токенов:');
        console.log(`  Prompt tokens: ${response.usage.prompt_tokens}`);
        console.log(`  Completion tokens: ${response.usage.completion_tokens}`);
        console.log(`  Total tokens: ${response.usage.total_tokens}`);
      }
    }

  } catch (error) {
    console.error('Ошибка:', error.message);
    if (error.response) {
      console.error('Детали ошибки:', error.response.data);
      console.error('Status:', error.response.status);
    }
    process.exit(1);
  }
}

(start)()
