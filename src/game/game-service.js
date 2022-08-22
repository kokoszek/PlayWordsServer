"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
exports.__esModule = true;
exports.getRandomIntExcept = exports.getRandomInt = void 0;
var common_1 = require("@nestjs/common");
var utils_1 = require("./utils");
var typeorm_1 = require("@nestjs/typeorm");
var meaning_entity_1 = require("../meaning/meaning.entity");
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
exports.getRandomInt = getRandomInt;
function getRandomIntExcept(min, max, except) {
    while (true) {
        min = Math.ceil(min);
        max = Math.floor(max);
        var result = Math.floor(Math.random() * (max - min + 1)) + min;
        console.log('randomized: ', result);
        if (!except.includes(result)) {
            return result;
        }
    }
}
exports.getRandomIntExcept = getRandomIntExcept;
var GameService = /** @class */ (function () {
    function GameService(wordRepo) {
        this.wordRepo = wordRepo;
        this.games = {};
        this.gameId = 1;
        this.taskLimit = 5;
    }
    GameService.prototype.createGame = function (player1, player2) {
        console.log('createGame');
        console.log('inmemory games: ', this.games);
        var gameId = this.gameId++;
        var roomName = (0, utils_1.createRoomName)(gameId);
        var newGame = {
            gameId: gameId,
            player1: {
                name: player1,
                score: 0,
                solvedWordsIds: [],
                gameAccepted: false
            },
            player2: {
                name: player2,
                score: 0,
                solvedWordsIds: [],
                gameAccepted: false
            }
        };
        this.games[roomName] = newGame;
        return newGame;
    };
    GameService.prototype.acceptGame = function (playerName, gameId) {
        if (this.isGameReady(gameId)) {
            return;
        }
        var roomName = (0, utils_1.createRoomName)(gameId);
        if (this.games[roomName].player1.name === playerName) {
            this.games[roomName].player1.gameAccepted = true;
        }
        if (this.games[roomName].player2.name === playerName) {
            this.games[roomName].player2.gameAccepted = true;
        }
    };
    GameService.prototype.isGameReady = function (gameId) {
        var _a, _b;
        var roomName = (0, utils_1.createRoomName)(gameId);
        return !!((_a = this.games[roomName]) === null || _a === void 0 ? void 0 : _a.player1.gameAccepted) &&
            !!((_b = this.games[roomName]) === null || _b === void 0 ? void 0 : _b.player2.gameAccepted);
    };
    GameService.prototype.getPlayer = function (gameId, playerName) {
        var roomName = (0, utils_1.createRoomName)(gameId);
        var game = this.games[roomName];
        if (game.player1.name === playerName) {
            return game.player1;
        }
        if (game.player2.name === playerName) {
            return game.player2;
        }
        return null;
    };
    GameService.prototype.isGameFinished = function (gameId) {
        var roomName = (0, utils_1.createRoomName)(gameId);
        if (this.games[roomName].player1.score === this.taskLimit) {
            console.log('game-finished');
            return true;
        }
        if (this.games[roomName].player2.score === this.taskLimit) {
            console.log('game-finished');
            return true;
        }
        return false;
    };
    GameService.prototype.generateTask = function (forGameId) {
        return __awaiter(this, void 0, void 0, function () {
            var roomName, alreadyPlayedWordIds, result, count, numberOfWordsToRandomize, randomizedWords, randomizedWord, randomInt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        roomName = (0, utils_1.createRoomName)(forGameId);
                        alreadyPlayedWordIds = this.games[roomName].player1.solvedWordsIds.concat(this.games[roomName].player2.solvedWordsIds);
                        return [4 /*yield*/, this.wordRepo
                                .createQueryBuilder()
                                .select('COUNT(*) as count')
                                .getRawOne()];
                    case 1:
                        result = _a.sent();
                        count = Number.parseInt(result.count);
                        numberOfWordsToRandomize = 8;
                        randomizedWords = [];
                        _a.label = 2;
                    case 2:
                        if (!numberOfWordsToRandomize--) return [3 /*break*/, 6];
                        randomizedWord = void 0;
                        _a.label = 3;
                    case 3:
                        if (!true) return [3 /*break*/, 5];
                        randomInt = getRandomInt(0, count - 1);
                        return [4 /*yield*/, this.wordRepo
                                .createQueryBuilder()
                                .orderBy('lang_english', 'ASC')
                                .limit(1)
                                .offset(randomInt)
                                .getOne()];
                    case 4:
                        randomizedWord = _a.sent();
                        if (!alreadyPlayedWordIds
                            .concat(randomizedWords.map(function (el) { return el.id; }))
                            .includes(randomizedWord.id)) {
                            return [3 /*break*/, 5];
                        }
                        return [3 /*break*/, 3];
                    case 5:
                        randomizedWords.push(randomizedWord);
                        return [3 /*break*/, 2];
                    case 6: return [2 /*return*/, {
                            word: randomizedWords[getRandomInt(0, 7)],
                            options: randomizedWords.map(function (word) { return ({
                                text: word.lang_english
                            }); })
                        }];
                }
            });
        });
    };
    GameService.prototype.checkTaskSolution = function (taskId, solution) {
        //return this.tasks.find(task => task.id === taskId)?.solution === solution;
        return true;
    };
    GameService = __decorate([
        (0, common_1.Injectable)(),
        __param(0, (0, typeorm_1.InjectRepository)(meaning_entity_1.MeaningEntity))
    ], GameService);
    return GameService;
}());
exports["default"] = GameService;
