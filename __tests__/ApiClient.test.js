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
var ApiClient_1 = require("../src/ApiClient");
var axios_1 = require("axios");
var FormData = require("form-data");
jest.mock('axios');
jest.mock('axios-logger');
jest.mock('form-data');
var mockedAxios = axios_1.default;
var MockedFormData = FormData;
describe('ApiClient', function () {
    var JWT_TOKEN = 'test-jwt-token';
    var API_URL = 'https://gigachat.devices.sberbank.ru';
    var CUSTOM_URL = 'https://custom-api-url.com';
    var mockAxiosInstance;
    var mockFormDataInstance;
    beforeEach(function () {
        jest.clearAllMocks();
        mockAxiosInstance = {
            get: jest.fn(),
            post: jest.fn(),
            interceptors: {
                request: { use: jest.fn() },
                response: { use: jest.fn() },
            },
        };
        mockFormDataInstance = {
            append: jest.fn(),
            getHeaders: jest.fn(function () { return ({
                'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary',
            }); }),
        };
        mockedAxios.create = jest.fn(function () { return mockAxiosInstance; });
        MockedFormData.mockImplementation(function () { return mockFormDataInstance; });
    });
    describe('Конструктор', function () {
        it('должен создать экземпляр с дефолтным URL', function () {
            var client = new ApiClient_1.ApiClient(JWT_TOKEN, { debug: false });
            expect(mockedAxios.create).toHaveBeenCalledWith({
                baseURL: API_URL,
                headers: {
                    'Accept': 'application/json',
                    Authorization: "Bearer ".concat(JWT_TOKEN),
                    'Content-Type': 'application/json',
                },
                timeout: 20000,
            });
            expect(client.token).toBe(JWT_TOKEN);
        });
        it('должен создать экземпляр с кастомным URL', function () {
            var client = new ApiClient_1.ApiClient(JWT_TOKEN, {
                debug: false,
                url: CUSTOM_URL,
            });
            expect(mockedAxios.create).toHaveBeenCalledWith({
                baseURL: CUSTOM_URL,
                headers: {
                    'Accept': 'application/json',
                    Authorization: "Bearer ".concat(JWT_TOKEN),
                    'Content-Type': 'application/json',
                },
                timeout: 20000,
            });
        });
        it('должен установить кастомный timeout', function () {
            var customTimeout = 30000;
            new ApiClient_1.ApiClient(JWT_TOKEN, {
                debug: false,
                timeout: customTimeout,
            });
            expect(mockedAxios.create).toHaveBeenCalledWith(expect.objectContaining({
                timeout: customTimeout,
            }));
        });
        it('должен включить логирование при debug: true', function () {
            new ApiClient_1.ApiClient(JWT_TOKEN, { debug: true });
            expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalled();
            expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalled();
        });
        it('не должен включать логирование при debug: false', function () {
            new ApiClient_1.ApiClient(JWT_TOKEN, { debug: false });
            expect(mockAxiosInstance.interceptors.request.use).not.toHaveBeenCalled();
            expect(mockAxiosInstance.interceptors.response.use).not.toHaveBeenCalled();
        });
    });
    describe('Files API', function () {
        var client;
        beforeEach(function () {
            client = new ApiClient_1.ApiClient(JWT_TOKEN, { debug: false });
        });
        describe('getFileList', function () {
            it('должен получить список файлов', function () { return __awaiter(void 0, void 0, void 0, function () {
                var mockResponse, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            mockResponse = {
                                data: {
                                    data: [
                                        { id: 'file1', filename: 'test1.txt' },
                                        { id: 'file2', filename: 'test2.txt' },
                                    ],
                                },
                            };
                            mockAxiosInstance.get.mockResolvedValue(mockResponse);
                            return [4, client.getFileList()];
                        case 1:
                            result = _a.sent();
                            expect(result).toEqual(mockResponse.data);
                            expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/v1/files');
                            return [2];
                    }
                });
            }); });
            it('должен обрабатывать ошибки при получении списка файлов', function () { return __awaiter(void 0, void 0, void 0, function () {
                var error;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            error = new Error('Network Error');
                            mockAxiosInstance.get.mockRejectedValue(error);
                            return [4, expect(client.getFileList()).rejects.toThrow('Network Error')];
                        case 1:
                            _a.sent();
                            return [2];
                    }
                });
            }); });
        });
        describe('getFileInfo', function () {
            it('должен получить информацию о файле', function () { return __awaiter(void 0, void 0, void 0, function () {
                var fileId, mockResponse, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            fileId = 'file-123';
                            mockResponse = {
                                data: {
                                    id: fileId,
                                    filename: 'test.txt',
                                    bytes: 1024,
                                    created_at: 1234567890,
                                },
                            };
                            mockAxiosInstance.get.mockResolvedValue(mockResponse);
                            return [4, client.getFileInfo(fileId)];
                        case 1:
                            result = _a.sent();
                            expect(result).toEqual(mockResponse.data);
                            expect(mockAxiosInstance.get).toHaveBeenCalledWith("/api/v1/files/".concat(fileId));
                            return [2];
                    }
                });
            }); });
            it('должен обрабатывать ошибки при получении информации о файле', function () { return __awaiter(void 0, void 0, void 0, function () {
                var fileId, error;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            fileId = 'invalid-file-id';
                            error = { response: { status: 404, data: { error: 'File not found' } } };
                            mockAxiosInstance.get.mockRejectedValue(error);
                            return [4, expect(client.getFileInfo(fileId)).rejects.toEqual(error)];
                        case 1:
                            _a.sent();
                            return [2];
                    }
                });
            }); });
        });
        describe('uploadFile', function () {
            it('должен загрузить файл из Buffer', function () { return __awaiter(void 0, void 0, void 0, function () {
                var fileBuffer, filename, mockResponse, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            fileBuffer = Buffer.from('test content');
                            filename = 'test.txt';
                            mockResponse = {
                                data: {
                                    id: 'file-123',
                                    filename: filename,
                                    bytes: fileBuffer.length,
                                },
                            };
                            mockAxiosInstance.post.mockResolvedValue(mockResponse);
                            return [4, client.uploadFile(fileBuffer, filename)];
                        case 1:
                            result = _a.sent();
                            expect(MockedFormData).toHaveBeenCalled();
                            expect(mockFormDataInstance.append).toHaveBeenCalledWith('file', fileBuffer, filename);
                            expect(mockFormDataInstance.append).toHaveBeenCalledWith('purpose', 'general');
                            expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v1/files', mockFormDataInstance, {
                                headers: mockFormDataInstance.getHeaders(),
                            });
                            expect(result).toEqual(mockResponse.data);
                            return [2];
                    }
                });
            }); });
            it('должен использовать дефолтное имя файла если не указано', function () { return __awaiter(void 0, void 0, void 0, function () {
                var fileBuffer, mockResponse;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            fileBuffer = Buffer.from('test content');
                            mockResponse = { data: { id: 'file-123' } };
                            mockAxiosInstance.post.mockResolvedValue(mockResponse);
                            return [4, client.uploadFile(fileBuffer)];
                        case 1:
                            _a.sent();
                            expect(mockFormDataInstance.append).toHaveBeenCalledWith('file', fileBuffer, 'file.txt');
                            return [2];
                    }
                });
            }); });
            it('должен обрабатывать File объект', function () { return __awaiter(void 0, void 0, void 0, function () {
                var mockFile, mockResponse;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            mockFile = {
                                name: 'custom-file.txt',
                                size: 100,
                            };
                            mockResponse = { data: { id: 'file-123' } };
                            mockAxiosInstance.post.mockResolvedValue(mockResponse);
                            return [4, client.uploadFile(mockFile)];
                        case 1:
                            _a.sent();
                            expect(mockFormDataInstance.append).toHaveBeenCalledWith('file', mockFile, 'custom-file.txt');
                            return [2];
                    }
                });
            }); });
            it('должен обрабатывать ошибки при загрузке файла', function () { return __awaiter(void 0, void 0, void 0, function () {
                var fileBuffer, error;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            fileBuffer = Buffer.from('test content');
                            error = { response: { status: 413, data: { error: 'File too large' } } };
                            mockAxiosInstance.post.mockRejectedValue(error);
                            return [4, expect(client.uploadFile(fileBuffer, 'test.txt')).rejects.toEqual(error)];
                        case 1:
                            _a.sent();
                            return [2];
                    }
                });
            }); });
        });
        describe('downloadFile', function () {
            it('должен скачать файл', function () { return __awaiter(void 0, void 0, void 0, function () {
                var fileId, filename, created_at, mockResponse, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            fileId = 'file-123';
                            filename = 'test.txt';
                            created_at = 1234567890;
                            mockResponse = {
                                data: Buffer.from('file content'),
                            };
                            mockAxiosInstance.get.mockResolvedValue(mockResponse);
                            return [4, client.downloadFile(fileId, filename, created_at)];
                        case 1:
                            result = _a.sent();
                            expect(mockAxiosInstance.get).toHaveBeenCalledWith("/api/v1/files/".concat(fileId, "/content"), {
                                responseType: 'blob',
                            });
                            expect(result).toEqual(mockResponse);
                            return [2];
                    }
                });
            }); });
            it('должен обрабатывать ошибки при скачивании файла', function () { return __awaiter(void 0, void 0, void 0, function () {
                var fileId, error;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            fileId = 'invalid-file-id';
                            error = new Error('Download failed');
                            mockAxiosInstance.get.mockRejectedValue(error);
                            return [4, expect(client.downloadFile(fileId, 'test.txt', 1234567890)).rejects.toThrow('Download failed')];
                        case 1:
                            _a.sent();
                            return [2];
                    }
                });
            }); });
        });
        describe('deleteFile', function () {
            it('должен удалить файл', function () { return __awaiter(void 0, void 0, void 0, function () {
                var fileId, mockResponse, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            fileId = 'file-123';
                            mockResponse = {
                                data: {
                                    id: fileId,
                                    deleted: true,
                                },
                            };
                            mockAxiosInstance.post.mockResolvedValue(mockResponse);
                            return [4, client.deleteFile(fileId)];
                        case 1:
                            result = _a.sent();
                            expect(result).toEqual(mockResponse.data);
                            expect(mockAxiosInstance.post).toHaveBeenCalledWith("/api/v1/files/".concat(fileId, "/delete"));
                            return [2];
                    }
                });
            }); });
            it('должен обрабатывать ошибки при удалении файла', function () { return __awaiter(void 0, void 0, void 0, function () {
                var fileId, error;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            fileId = 'invalid-file-id';
                            error = { response: { status: 404, data: { error: 'File not found' } } };
                            mockAxiosInstance.post.mockRejectedValue(error);
                            return [4, expect(client.deleteFile(fileId)).rejects.toEqual(error)];
                        case 1:
                            _a.sent();
                            return [2];
                    }
                });
            }); });
        });
    });
    describe('Tokens API', function () {
        var client;
        beforeEach(function () {
            client = new ApiClient_1.ApiClient(JWT_TOKEN, { debug: false });
        });
        describe('getAvailableTokens', function () {
            it('должен получить доступные токены', function () { return __awaiter(void 0, void 0, void 0, function () {
                var mockResponse, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            mockResponse = {
                                data: {
                                    available: 1000,
                                    used: 500,
                                    total: 1500,
                                },
                            };
                            mockAxiosInstance.get.mockResolvedValue(mockResponse);
                            return [4, client.getAvailableTokens()];
                        case 1:
                            result = _a.sent();
                            expect(result).toEqual(mockResponse.data);
                            expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/v1/balance');
                            return [2];
                    }
                });
            }); });
            it('должен обрабатывать ошибки при получении токенов', function () { return __awaiter(void 0, void 0, void 0, function () {
                var error;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            error = new Error('Network Error');
                            mockAxiosInstance.get.mockRejectedValue(error);
                            return [4, expect(client.getAvailableTokens()).rejects.toThrow('Network Error')];
                        case 1:
                            _a.sent();
                            return [2];
                    }
                });
            }); });
        });
    });
    describe('Models API', function () {
        var client;
        beforeEach(function () {
            client = new ApiClient_1.ApiClient(JWT_TOKEN, { debug: false });
        });
        describe('getModels', function () {
            it('должен получить список моделей', function () { return __awaiter(void 0, void 0, void 0, function () {
                var mockResponse, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            mockResponse = {
                                data: {
                                    data: [
                                        { id: 'GigaChat', name: 'GigaChat' },
                                        { id: 'GigaChat-Pro', name: 'GigaChat Pro' },
                                    ],
                                },
                            };
                            mockAxiosInstance.get.mockResolvedValue(mockResponse);
                            return [4, client.getModels()];
                        case 1:
                            result = _a.sent();
                            expect(result).toEqual(mockResponse.data);
                            expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/v1/models');
                            return [2];
                    }
                });
            }); });
            it('должен обрабатывать ошибки при получении моделей', function () { return __awaiter(void 0, void 0, void 0, function () {
                var error;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            error = { response: { status: 500, data: { error: 'Internal Server Error' } } };
                            mockAxiosInstance.get.mockRejectedValue(error);
                            return [4, expect(client.getModels()).rejects.toEqual(error)];
                        case 1:
                            _a.sent();
                            return [2];
                    }
                });
            }); });
        });
    });
    describe('Requests API', function () {
        var client;
        beforeEach(function () {
            client = new ApiClient_1.ApiClient(JWT_TOKEN, { debug: false });
        });
        describe('sendRequest', function () {
            it('должен отправить запрос с моделью и сообщениями', function () { return __awaiter(void 0, void 0, void 0, function () {
                var model, messages, mockResponse, result, callArgs, requestData;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            model = 'GigaChat';
                            messages = [
                                { role: 'user', content: 'Привет' },
                                { role: 'assistant', content: 'Здравствуйте!' },
                            ];
                            mockResponse = {
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
                            return [4, client.sendRequest(model, messages)];
                        case 1:
                            result = _a.sent();
                            expect(result).toEqual(mockResponse.data);
                            expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v1/chat/completions', expect.stringContaining('"model"'));
                            callArgs = mockAxiosInstance.post.mock.calls[0];
                            requestData = JSON.parse(callArgs[1]);
                            expect(requestData.model).toBe(model);
                            expect(requestData.messages).toEqual(messages);
                            return [2];
                    }
                });
            }); });
            it('должен правильно форматировать JSON с отступами', function () { return __awaiter(void 0, void 0, void 0, function () {
                var model, messages, mockResponse, callArgs, requestData;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            model = 'GigaChat';
                            messages = [{ role: 'user', content: 'Test' }];
                            mockResponse = { data: { choices: [] } };
                            mockAxiosInstance.post.mockResolvedValue(mockResponse);
                            return [4, client.sendRequest(model, messages)];
                        case 1:
                            _a.sent();
                            callArgs = mockAxiosInstance.post.mock.calls[0];
                            requestData = JSON.parse(callArgs[1]);
                            expect(requestData).toHaveProperty('model');
                            expect(requestData).toHaveProperty('messages');
                            return [2];
                    }
                });
            }); });
            it('должен обрабатывать ошибки при отправке запроса', function () { return __awaiter(void 0, void 0, void 0, function () {
                var model, messages, error;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            model = 'GigaChat';
                            messages = [{ role: 'user', content: 'Test' }];
                            error = {
                                response: {
                                    status: 400,
                                    data: { error: 'Invalid request' },
                                },
                            };
                            mockAxiosInstance.post.mockRejectedValue(error);
                            return [4, expect(client.sendRequest(model, messages)).rejects.toEqual(error)];
                        case 1:
                            _a.sent();
                            return [2];
                    }
                });
            }); });
            it('должен обрабатывать сетевые ошибки', function () { return __awaiter(void 0, void 0, void 0, function () {
                var model, messages, error;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            model = 'GigaChat';
                            messages = [{ role: 'user', content: 'Test' }];
                            error = new Error('Network timeout');
                            mockAxiosInstance.post.mockRejectedValue(error);
                            return [4, expect(client.sendRequest(model, messages)).rejects.toThrow('Network timeout')];
                        case 1:
                            _a.sent();
                            return [2];
                    }
                });
            }); });
        });
    });
    describe('Edge Cases', function () {
        var client;
        beforeEach(function () {
            client = new ApiClient_1.ApiClient(JWT_TOKEN, { debug: false });
        });
        it('должен обрабатывать пустой ответ от API', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockAxiosInstance.get.mockResolvedValue({ data: null });
                        return [4, client.getFileList()];
                    case 1:
                        result = _a.sent();
                        expect(result).toBeNull();
                        return [2];
                }
            });
        }); });
        it('должен обрабатывать timeout ошибки', function () { return __awaiter(void 0, void 0, void 0, function () {
            var timeoutError;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        timeoutError = {
                            code: 'ECONNABORTED',
                            message: 'timeout of 20000ms exceeded',
                        };
                        mockAxiosInstance.get.mockRejectedValue(timeoutError);
                        return [4, expect(client.getFileList()).rejects.toEqual(timeoutError)];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        }); });
        it('должен обрабатывать ошибки без response объекта', function () { return __awaiter(void 0, void 0, void 0, function () {
            var error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        error = new Error('Connection refused');
                        mockAxiosInstance.post.mockRejectedValue(error);
                        return [4, expect(client.sendRequest('GigaChat', [])).rejects.toThrow('Connection refused')];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        }); });
    });
});
