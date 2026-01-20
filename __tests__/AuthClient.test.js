"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var AuthClient_1 = require("../src/AuthClient");
var axios_1 = require("axios");
var axios_logger_1 = require("axios-logger");
var uuid_1 = require("uuid");
jest.mock('axios');
jest.mock('axios-logger');
jest.mock('uuid');
var mockedAxios = axios_1.default;
var mockedV4 = uuid_1.v4;
describe('AuthClient', function () {
    var CLIENT_ID = 'test-client-id';
    var CLIENT_SECRET = 'test-client-secret';
    var MOCK_UUID = 'test-uuid-123';
    var MOCK_TOKEN = 'mock-jwt-token';
    var mockAxiosInstance;
    beforeEach(function () {
        jest.clearAllMocks();
        mockedV4.mockReturnValue(MOCK_UUID);
        mockAxiosInstance = {
            post: jest.fn(),
            interceptors: {
                request: { use: jest.fn() },
                response: { use: jest.fn() },
            },
        };
        mockedAxios.create = jest.fn(function () { return mockAxiosInstance; });
    });
    describe('Конструктор', function () {
        it('должен создать экземпляр с дефолтным URL', function () {
            var client = new AuthClient_1.AuthClient(CLIENT_ID, CLIENT_SECRET, { debug: false });
            expect(mockedAxios.create).toHaveBeenCalledWith({
                baseURL: 'https://ngw.devices.sberbank.ru:9443',
            });
            expect(client.client_id).toBe(CLIENT_ID);
            expect(client.client_secret).toBe(CLIENT_SECRET);
        });
        it('должен создать экземпляр с кастомным URL', function () {
            var customUrl = 'https://custom-auth-url.com';
            var client = new AuthClient_1.AuthClient(CLIENT_ID, CLIENT_SECRET, {
                debug: false,
                url: customUrl,
            });
            expect(mockedAxios.create).toHaveBeenCalledWith({
                baseURL: customUrl,
            });
        });
        it('должен включить логирование при debug: true', function () {
            new AuthClient_1.AuthClient(CLIENT_ID, CLIENT_SECRET, { debug: true });
            expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalled();
            expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalled();
            expect(axios_logger_1.requestLogger).toBeDefined();
            expect(axios_logger_1.responseLogger).toBeDefined();
        });
        it('не должен включать логирование при debug: false', function () {
            new AuthClient_1.AuthClient(CLIENT_ID, CLIENT_SECRET, { debug: false });
            expect(mockAxiosInstance.interceptors.request.use).not.toHaveBeenCalled();
            expect(mockAxiosInstance.interceptors.response.use).not.toHaveBeenCalled();
        });
    });
    describe('getToken', function () {
        it('должен успешно получить токен', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockResponse, client, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockResponse = {
                            data: {
                                access_token: MOCK_TOKEN,
                                expires_at: 1234567890,
                            },
                        };
                        mockAxiosInstance.post.mockResolvedValue(mockResponse);
                        client = new AuthClient_1.AuthClient(CLIENT_ID, CLIENT_SECRET, { debug: false });
                        return [4, client.getToken('GIGACHAT_API_PERS')];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual(mockResponse.data);
                        expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v2/oauth', { scope: 'GIGACHAT_API_PERS' }, {
                            headers: {
                                authorization: 'Basic ' + Buffer.from("".concat(CLIENT_ID, ":").concat(CLIENT_SECRET)).toString('base64'),
                                rquid: MOCK_UUID,
                                'Accept': 'application/json',
                                'Content-Type': 'application/x-www-form-urlencoded',
                            },
                        });
                        return [2];
                }
            });
        }); });
        it('должен правильно формировать Basic auth заголовок', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockResponse, client, expectedAuth, callArgs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockResponse = { data: { access_token: MOCK_TOKEN } };
                        mockAxiosInstance.post.mockResolvedValue(mockResponse);
                        client = new AuthClient_1.AuthClient(CLIENT_ID, CLIENT_SECRET, { debug: false });
                        return [4, client.getToken('GIGACHAT_API_PERS')];
                    case 1:
                        _a.sent();
                        expectedAuth = 'Basic ' + Buffer.from("".concat(CLIENT_ID, ":").concat(CLIENT_SECRET)).toString('base64');
                        callArgs = mockAxiosInstance.post.mock.calls[0];
                        expect(callArgs[2].headers.authorization).toBe(expectedAuth);
                        return [2];
                }
            });
        }); });
        it('должен генерировать уникальный rquid для каждого запроса', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockResponse, client;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockResponse = { data: { access_token: MOCK_TOKEN } };
                        mockAxiosInstance.post.mockResolvedValue(mockResponse);
                        client = new AuthClient_1.AuthClient(CLIENT_ID, CLIENT_SECRET, { debug: false });
                        return [4, client.getToken('GIGACHAT_API_PERS')];
                    case 1:
                        _a.sent();
                        expect(mockedV4).toHaveBeenCalled();
                        return [2];
                }
            });
        }); });
        it('должен обрабатывать ошибки при получении токена', function () { return __awaiter(void 0, void 0, void 0, function () {
            var errorMessage, client;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        errorMessage = 'Network Error';
                        mockAxiosInstance.post.mockRejectedValue(new Error(errorMessage));
                        client = new AuthClient_1.AuthClient(CLIENT_ID, CLIENT_SECRET, { debug: false });
                        return [4, expect(client.getToken('GIGACHAT_API_PERS')).rejects.toThrow(errorMessage)];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        }); });
        it('должен обрабатывать ошибки API (4xx, 5xx)', function () { return __awaiter(void 0, void 0, void 0, function () {
            var errorResponse, client;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        errorResponse = {
                            response: {
                                status: 401,
                                data: { error: 'Unauthorized' },
                            },
                        };
                        mockAxiosInstance.post.mockRejectedValue(errorResponse);
                        client = new AuthClient_1.AuthClient(CLIENT_ID, CLIENT_SECRET, { debug: false });
                        return [4, expect(client.getToken('GIGACHAT_API_PERS')).rejects.toEqual(errorResponse)];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        }); });
        it('должен передавать правильный scope в теле запроса', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockResponse, client, scope, callArgs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockResponse = { data: { access_token: MOCK_TOKEN } };
                        mockAxiosInstance.post.mockResolvedValue(mockResponse);
                        client = new AuthClient_1.AuthClient(CLIENT_ID, CLIENT_SECRET, { debug: false });
                        scope = 'CUSTOM_SCOPE';
                        return [4, client.getToken(scope)];
                    case 1:
                        _a.sent();
                        callArgs = mockAxiosInstance.post.mock.calls[0];
                        expect(callArgs[1]).toEqual({ scope: scope });
                        return [2];
                }
            });
        }); });
    });
});
