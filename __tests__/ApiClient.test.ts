import { ApiClient } from '../src/ApiClient';
import axios from 'axios';
import { requestLogger, responseLogger } from 'axios-logger';

// Моки
jest.mock('axios');
jest.mock('axios-logger');

const mockedAxios = axios as jest.Mocked<typeof axios>;

// Мок для form-data - глобальный массив для хранения экземпляров
const mockFormDataInstances: any[] = [];

jest.mock('form-data', () => {
  class MockFormData {
    append = jest.fn();
    getHeaders = jest.fn(() => ({
      'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary',
    }));
  }

  const MockFormDataConstructor = function(this: any) {
    const instance = new MockFormData();
    mockFormDataInstances.push(instance);
    return instance;
  } as any;

  MockFormDataConstructor.prototype = MockFormData.prototype;

  return MockFormDataConstructor;
});

describe('ApiClient', () => {
  const JWT_TOKEN = 'test-jwt-token';
  const API_URL = 'https://gigachat.devices.sberbank.ru';
  const CUSTOM_URL = 'https://custom-api-url.com';

  let mockAxiosInstance: any;

  beforeEach(() => {
    jest.clearAllMocks();

    mockAxiosInstance = {
      get: jest.fn(),
      post: jest.fn(),
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() },
      },
    };

    mockedAxios.create = jest.fn(() => mockAxiosInstance);
    mockFormDataInstances.length = 0;
  });

  describe('Конструктор', () => {
    it('должен создать экземпляр с дефолтным URL', () => {
      const client = new ApiClient(JWT_TOKEN, { debug: false });

      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: API_URL,
        headers: {
          'Accept': 'application/json',
          Authorization: `Bearer ${JWT_TOKEN}`,
          'Content-Type': 'application/json',
        },
        timeout: 20000,
      });
      expect(client.token).toBe(JWT_TOKEN);
    });

    it('должен создать экземпляр с кастомным URL', () => {
      const client = new ApiClient(JWT_TOKEN, {
        debug: false,
        url: CUSTOM_URL,
      });

      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: CUSTOM_URL,
        headers: {
          'Accept': 'application/json',
          Authorization: `Bearer ${JWT_TOKEN}`,
          'Content-Type': 'application/json',
        },
        timeout: 20000,
      });
    });

    it('должен установить кастомный timeout', () => {
      const customTimeout = 30000;
      new ApiClient(JWT_TOKEN, {
        debug: false,
        timeout: customTimeout,
      });

      expect(mockedAxios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          timeout: customTimeout,
        })
      );
    });

    it('должен включить логирование при debug: true', () => {
      new ApiClient(JWT_TOKEN, { debug: true });

      expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalled();
      expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalled();
    });

    it('не должен включать логирование при debug: false', () => {
      new ApiClient(JWT_TOKEN, { debug: false });

      expect(mockAxiosInstance.interceptors.request.use).not.toHaveBeenCalled();
      expect(mockAxiosInstance.interceptors.response.use).not.toHaveBeenCalled();
    });
  });

  describe('Files API', () => {
    let client: ApiClient;

    beforeEach(() => {
      client = new ApiClient(JWT_TOKEN, { debug: false });
    });

    describe('getFileList', () => {
      it('должен получить список файлов', async () => {
        const mockResponse = {
          data: {
            data: [
              { id: 'file1', filename: 'test1.txt' },
              { id: 'file2', filename: 'test2.txt' },
            ],
          },
        };

        mockAxiosInstance.get.mockResolvedValue(mockResponse);
        const result = await client.getFileList();

        expect(result).toEqual(mockResponse.data);
        expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/v1/files');
      });

      it('должен обрабатывать ошибки при получении списка файлов', async () => {
        const error = new Error('Network Error');
        mockAxiosInstance.get.mockRejectedValue(error);

        await expect(client.getFileList()).rejects.toThrow('Network Error');
      });
    });

    describe('getFileInfo', () => {
      it('должен получить информацию о файле', async () => {
        const fileId = 'file-123';
        const mockResponse = {
          data: {
            id: fileId,
            filename: 'test.txt',
            bytes: 1024,
            created_at: 1234567890,
          },
        };

        mockAxiosInstance.get.mockResolvedValue(mockResponse);
        const result = await client.getFileInfo(fileId);

        expect(result).toEqual(mockResponse.data);
        expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/api/v1/files/${fileId}`);
      });

      it('должен обрабатывать ошибки при получении информации о файле', async () => {
        const fileId = 'invalid-file-id';
        const error = { response: { status: 404, data: { error: 'File not found' } } };
        mockAxiosInstance.get.mockRejectedValue(error);

        await expect(client.getFileInfo(fileId)).rejects.toEqual(error);
      });
    });

    describe('uploadFile', () => {
      it('должен загрузить файл из Buffer', async () => {
        const fileBuffer = Buffer.from('test content');
        const filename = 'test.txt';
        const mockResponse = {
          data: {
            id: 'file-123',
            filename: filename,
            bytes: fileBuffer.length,
          },
        };

        mockAxiosInstance.post.mockResolvedValue(mockResponse);
        const result = await client.uploadFile(fileBuffer, filename);

        expect(mockFormDataInstances.length).toBeGreaterThan(0);
        const createdFormData = mockFormDataInstances[0];
        expect(createdFormData.append).toHaveBeenCalledWith('file', fileBuffer, filename);
        expect(createdFormData.append).toHaveBeenCalledWith('purpose', 'general');
        expect(mockAxiosInstance.post).toHaveBeenCalledWith(
          '/api/v1/files',
          expect.any(Object),
          {
            headers: expect.any(Object),
          }
        );
        expect(result).toEqual(mockResponse.data);
      });

      it('должен использовать дефолтное имя файла если не указано', async () => {
        const fileBuffer = Buffer.from('test content');
        const mockResponse = { data: { id: 'file-123' } };

        mockAxiosInstance.post.mockResolvedValue(mockResponse);
        await client.uploadFile(fileBuffer);

        expect(mockFormDataInstances.length).toBeGreaterThan(0);
        const createdFormData = mockFormDataInstances[0];
        expect(createdFormData.append).toHaveBeenCalledWith('file', fileBuffer, 'file.txt');
      });

      it('должен обрабатывать File объект', async () => {
        const mockFile = {
          name: 'custom-file.txt',
          size: 100,
        } as any;

        const mockResponse = { data: { id: 'file-123' } };
        mockAxiosInstance.post.mockResolvedValue(mockResponse);
        await client.uploadFile(mockFile);

        expect(mockFormDataInstances.length).toBeGreaterThan(0);
        const createdFormData = mockFormDataInstances[0];
        expect(createdFormData.append).toHaveBeenCalledWith(
          'file',
          mockFile,
          'custom-file.txt'
        );
      });

      it('должен обрабатывать ошибки при загрузке файла', async () => {
        const fileBuffer = Buffer.from('test content');
        const error = { response: { status: 413, data: { error: 'File too large' } } };
        mockAxiosInstance.post.mockRejectedValue(error);

        await expect(client.uploadFile(fileBuffer, 'test.txt')).rejects.toEqual(error);
      });
    });

    describe('downloadFile', () => {
      it('должен скачать файл', async () => {
        const fileId = 'file-123';
        const filename = 'test.txt';
        const created_at = 1234567890;
        const mockResponse = {
          data: Buffer.from('file content'),
        };

        mockAxiosInstance.get.mockResolvedValue(mockResponse);
        const result = await client.downloadFile(fileId, filename, created_at);

        expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/api/v1/files/${fileId}/content`, {
          responseType: 'blob',
        });
        expect(result).toEqual(mockResponse);
      });

      it('должен обрабатывать ошибки при скачивании файла', async () => {
        const fileId = 'invalid-file-id';
        const error = new Error('Download failed');
        mockAxiosInstance.get.mockRejectedValue(error);

        await expect(client.downloadFile(fileId, 'test.txt', 1234567890)).rejects.toThrow(
          'Download failed'
        );
      });
    });

    describe('deleteFile', () => {
      it('должен удалить файл', async () => {
        const fileId = 'file-123';
        const mockResponse = {
          data: {
            id: fileId,
            deleted: true,
          },
        };

        mockAxiosInstance.post.mockResolvedValue(mockResponse);
        const result = await client.deleteFile(fileId);

        expect(result).toEqual(mockResponse.data);
        expect(mockAxiosInstance.post).toHaveBeenCalledWith(`/api/v1/files/${fileId}/delete`);
      });

      it('должен обрабатывать ошибки при удалении файла', async () => {
        const fileId = 'invalid-file-id';
        const error = { response: { status: 404, data: { error: 'File not found' } } };
        mockAxiosInstance.post.mockRejectedValue(error);

        await expect(client.deleteFile(fileId)).rejects.toEqual(error);
      });
    });
  });

  describe('Tokens API', () => {
    let client: ApiClient;

    beforeEach(() => {
      client = new ApiClient(JWT_TOKEN, { debug: false });
    });

    describe('getAvailableTokens', () => {
      it('должен получить доступные токены', async () => {
        const mockResponse = {
          data: {
            available: 1000,
            used: 500,
            total: 1500,
          },
        };

        mockAxiosInstance.get.mockResolvedValue(mockResponse);
        const result = await client.getAvailableTokens();

        expect(result).toEqual(mockResponse.data);
        expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/v1/balance');
      });

      it('должен обрабатывать ошибки при получении токенов', async () => {
        const error = new Error('Network Error');
        mockAxiosInstance.get.mockRejectedValue(error);

        await expect(client.getAvailableTokens()).rejects.toThrow('Network Error');
      });
    });
  });

  describe('Models API', () => {
    let client: ApiClient;

    beforeEach(() => {
      client = new ApiClient(JWT_TOKEN, { debug: false });
    });

    describe('getModels', () => {
      it('должен получить список моделей', async () => {
        const mockResponse = {
          data: {
            data: [
              { id: 'GigaChat', name: 'GigaChat' },
              { id: 'GigaChat-Pro', name: 'GigaChat Pro' },
            ],
          },
        };

        mockAxiosInstance.get.mockResolvedValue(mockResponse);
        const result = await client.getModels();

        expect(result).toEqual(mockResponse.data);
        expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/v1/models');
      });

      it('должен обрабатывать ошибки при получении моделей', async () => {
        const error = { response: { status: 500, data: { error: 'Internal Server Error' } } };
        mockAxiosInstance.get.mockRejectedValue(error);

        await expect(client.getModels()).rejects.toEqual(error);
      });
    });
  });

  describe('Requests API', () => {
    let client: ApiClient;

    beforeEach(() => {
      client = new ApiClient(JWT_TOKEN, { debug: false });
    });

    describe('sendRequest', () => {
      it('должен отправить запрос с моделью и сообщениями', async () => {
        const model = 'GigaChat';
        const messages = [
          { role: 'user', content: 'Привет' },
          { role: 'assistant', content: 'Здравствуйте!' },
        ];

        const mockResponse = {
          data: {
            choices: [
              {
                message: {
                  role: 'assistant',
                  content: 'Ответ от модели',
                },
                index: 0,
                finish_reason: 'stop',
              },
            ],
            model: model,
            usage: {
              prompt_tokens: 10,
              completion_tokens: 20,
              total_tokens: 30,
            },
          },
        };

        mockAxiosInstance.post.mockResolvedValue(mockResponse);
        const result = await client.sendRequest(model, messages);

        expect(result).toEqual(mockResponse.data);
        expect(mockAxiosInstance.post).toHaveBeenCalledWith(
          '/api/v1/chat/completions',
          expect.stringContaining('"model"')
        );

        // Проверяем, что JSON правильно сформирован
        const callArgs = mockAxiosInstance.post.mock.calls[0];
        const requestData = JSON.parse(callArgs[1]);
        expect(requestData.model).toBe(model);
        expect(requestData.messages).toEqual(messages);
      });

      it('должен правильно форматировать JSON с отступами', async () => {
        const model = 'GigaChat';
        const messages = [{ role: 'user', content: 'Test' }];
        const mockResponse = { data: { choices: [] as any[] } };

        mockAxiosInstance.post.mockResolvedValue(mockResponse);
        await client.sendRequest(model, messages);

        const callArgs = mockAxiosInstance.post.mock.calls[0];
        const requestData = JSON.parse(callArgs[1]);
        expect(requestData).toHaveProperty('model');
        expect(requestData).toHaveProperty('messages');
      });

      it('должен обрабатывать ошибки при отправке запроса', async () => {
        const model = 'GigaChat';
        const messages = [{ role: 'user', content: 'Test' }];
        const error = {
          response: {
            status: 400,
            data: { error: 'Invalid request' },
          },
        };

        mockAxiosInstance.post.mockRejectedValue(error);

        await expect(client.sendRequest(model, messages)).rejects.toEqual(error);
      });

      it('должен обрабатывать сетевые ошибки', async () => {
        const model = 'GigaChat';
        const messages = [{ role: 'user', content: 'Test' }];
        const error = new Error('Network timeout');

        mockAxiosInstance.post.mockRejectedValue(error);

        await expect(client.sendRequest(model, messages)).rejects.toThrow('Network timeout');
      });
    });
  });

  describe('Edge Cases', () => {
    let client: ApiClient;

    beforeEach(() => {
      client = new ApiClient(JWT_TOKEN, { debug: false });
    });

    it('должен обрабатывать пустой ответ от API', async () => {
      mockAxiosInstance.get.mockResolvedValue({ data: null });
      const result = await client.getFileList();
      expect(result).toBeNull();
    });

    it('должен обрабатывать timeout ошибки', async () => {
      const timeoutError = {
        code: 'ECONNABORTED',
        message: 'timeout of 20000ms exceeded',
      };
      mockAxiosInstance.get.mockRejectedValue(timeoutError);

      await expect(client.getFileList()).rejects.toEqual(timeoutError);
    });

    it('должен обрабатывать ошибки без response объекта', async () => {
      const error = new Error('Connection refused');
      mockAxiosInstance.post.mockRejectedValue(error);

      await expect(client.sendRequest('GigaChat', [])).rejects.toThrow('Connection refused');
    });
  });
});
