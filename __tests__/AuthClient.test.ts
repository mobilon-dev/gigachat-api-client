import { AuthClient } from '../src/AuthClient';
import axios from 'axios';
import { requestLogger, responseLogger } from 'axios-logger';
import { v4 } from 'uuid';

// Моки
jest.mock('axios');
jest.mock('axios-logger');
jest.mock('uuid');

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedV4 = v4 as jest.MockedFunction<typeof v4>;

describe('AuthClient', () => {
  const CLIENT_ID = 'test-client-id';
  const CLIENT_SECRET = 'test-client-secret';
  const MOCK_UUID = 'test-uuid-123';
  const MOCK_TOKEN = 'mock-jwt-token';

  let mockAxiosInstance: any;

  beforeEach(() => {
    jest.clearAllMocks();
    (mockedV4 as jest.Mock).mockReturnValue(MOCK_UUID);

    mockAxiosInstance = {
      post: jest.fn(),
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() },
      },
    };

    mockedAxios.create = jest.fn(() => mockAxiosInstance);
  });

  describe('Конструктор', () => {
    it('должен создать экземпляр с дефолтным URL', () => {
      const client = new AuthClient(CLIENT_ID, CLIENT_SECRET, { debug: false });
      
      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: 'https://ngw.devices.sberbank.ru:9443',
      });
      expect(client.client_id).toBe(CLIENT_ID);
      expect(client.client_secret).toBe(CLIENT_SECRET);
    });

    it('должен создать экземпляр с кастомным URL', () => {
      const customUrl = 'https://custom-auth-url.com';
      const client = new AuthClient(CLIENT_ID, CLIENT_SECRET, {
        debug: false,
        url: customUrl,
      });

      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: customUrl,
      });
    });

    it('должен включить логирование при debug: true', () => {
      new AuthClient(CLIENT_ID, CLIENT_SECRET, { debug: true });

      expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalled();
      expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalled();
      expect(requestLogger).toBeDefined();
      expect(responseLogger).toBeDefined();
    });

    it('не должен включать логирование при debug: false', () => {
      new AuthClient(CLIENT_ID, CLIENT_SECRET, { debug: false });

      expect(mockAxiosInstance.interceptors.request.use).not.toHaveBeenCalled();
      expect(mockAxiosInstance.interceptors.response.use).not.toHaveBeenCalled();
    });
  });

  describe('getToken', () => {
    it('должен успешно получить токен', async () => {
      const mockResponse = {
        data: {
          access_token: MOCK_TOKEN,
          expires_at: 1234567890,
        },
      };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const client = new AuthClient(CLIENT_ID, CLIENT_SECRET, { debug: false });
      const result = await client.getToken('GIGACHAT_API_PERS');

      expect(result).toEqual(mockResponse.data);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/api/v2/oauth',
        { scope: 'GIGACHAT_API_PERS' },
        {
          headers: {
            authorization: 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'),
            rquid: MOCK_UUID,
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
    });

    it('должен правильно формировать Basic auth заголовок', async () => {
      const mockResponse = { data: { access_token: MOCK_TOKEN } };
      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const client = new AuthClient(CLIENT_ID, CLIENT_SECRET, { debug: false });
      await client.getToken('GIGACHAT_API_PERS');

      const expectedAuth = 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
      const callArgs = mockAxiosInstance.post.mock.calls[0];
      expect(callArgs[2].headers.authorization).toBe(expectedAuth);
    });

    it('должен генерировать уникальный rquid для каждого запроса', async () => {
      const mockResponse = { data: { access_token: MOCK_TOKEN } };
      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const client = new AuthClient(CLIENT_ID, CLIENT_SECRET, { debug: false });
      
      await client.getToken('GIGACHAT_API_PERS');
      expect(mockedV4).toHaveBeenCalled();
    });

    it('должен обрабатывать ошибки при получении токена', async () => {
      const errorMessage = 'Network Error';
      mockAxiosInstance.post.mockRejectedValue(new Error(errorMessage));

      const client = new AuthClient(CLIENT_ID, CLIENT_SECRET, { debug: false });

      await expect(client.getToken('GIGACHAT_API_PERS')).rejects.toThrow(errorMessage);
    });

    it('должен обрабатывать ошибки API (4xx, 5xx)', async () => {
      const errorResponse = {
        response: {
          status: 401,
          data: { error: 'Unauthorized' },
        },
      };
      mockAxiosInstance.post.mockRejectedValue(errorResponse);

      const client = new AuthClient(CLIENT_ID, CLIENT_SECRET, { debug: false });

      await expect(client.getToken('GIGACHAT_API_PERS')).rejects.toEqual(errorResponse);
    });

    it('должен передавать правильный scope в теле запроса', async () => {
      const mockResponse = { data: { access_token: MOCK_TOKEN } };
      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const client = new AuthClient(CLIENT_ID, CLIENT_SECRET, { debug: false });
      const scope = 'CUSTOM_SCOPE';
      await client.getToken(scope);

      const callArgs = mockAxiosInstance.post.mock.calls[0];
      expect(callArgs[1]).toEqual({ scope });
    });
  });
});
