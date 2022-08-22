"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
var websockets_1 = require("@nestjs/websockets");
var utils_1 = require("./utils");
var MultiSemaphore = require('redis-semaphore').MultiSemaphore;
var Redis = require('ioredis');
var redis = new Redis(6380);
var sem = require('./semaphore').sem;
var GameGatewayWs = /** @class */ (function () {
    function GameGatewayWs(gameService) {
        this.gameService = gameService;
    }
    GameGatewayWs.prototype.afterInit = function (server) {
        return __awaiter(this, void 0, void 0, function () {
            var counter;
            var _this = this;
            return __generator(this, function (_a) {
                counter = 0;
                setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                    var _this = this;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, new Promise(function (resolve) {
                                    sem.take(10, function () {
                                        resolve();
                                    });
                                })];
                            case 1:
                                _a.sent();
                                setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                                    var player1, player2, game;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                if (!true) return [3 /*break*/, 4];
                                                return [4 /*yield*/, new Promise(function (resolve) {
                                                        sem.take(2, function () {
                                                            resolve();
                                                        });
                                                    })];
                                            case 1:
                                                _a.sent();
                                                console.log('found two matching players, loop counter: ', ++counter);
                                                return [4 /*yield*/, redis.lpop("findMatchQueue")];
                                            case 2:
                                                player1 = _a.sent();
                                                return [4 /*yield*/, redis.lpop("findMatchQueue")];
                                            case 3:
                                                player2 = _a.sent();
                                                game = this.gameService.createGame(player1, player2);
                                                console.log('emiting event: ', 'game-found-for-' + player1);
                                                this.server.emit('game-found-for-' + player1, {
                                                    matchFound: true,
                                                    opponentName: player2,
                                                    gameId: game.gameId
                                                });
                                                console.log('emiting event: ', 'game-found-for-' + player2);
                                                this.server.emit('game-found-for-' + player2, {
                                                    matchFound: true,
                                                    opponentName: player1,
                                                    gameId: game.gameId
                                                });
                                                return [3 /*break*/, 0];
                                            case 4: return [2 /*return*/];
                                        }
                                    });
                                }); }, 0);
                                return [2 /*return*/];
                        }
                    });
                }); }, 0);
                return [2 /*return*/];
            });
        });
    };
    GameGatewayWs.prototype.emitNewTask = function (delayMs, gameId) {
        var _this = this;
        var roomName = (0, utils_1.createRoomName)(gameId);
        setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
            var task;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.gameService.generateTask(gameId)];
                    case 1:
                        task = _a.sent();
                        console.log('task: ', task);
                        this.server.to(roomName).emit('newTask', task);
                        return [2 /*return*/];
                }
            });
        }); }, delayMs);
    };
    GameGatewayWs.prototype.startFindGame = function (client, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log(data.playerName + 'started finding a game');
                        return [4 /*yield*/, redis.rpush("findMatchQueue", data.playerName)];
                    case 1:
                        _a.sent();
                        sem.leave();
                        return [2 /*return*/, true];
                }
            });
        });
    };
    GameGatewayWs.prototype.acceptGame = function (client, data) {
        //const roomNameSuffix = [data.playerName, data.opponentName].sort().join('_')
        var gameId = data.gameId, playerName = data.playerName, opponentName = data.opponentName;
        var roomName = (0, utils_1.createRoomName)(gameId);
        console.log('player ' + playerName + ' joins room: ', roomName);
        this.gameService.acceptGame(playerName, gameId);
        client.join(roomName);
        client.join(playerName);
        if (this.gameService.isGameReady(gameId)) {
            console.log('emit gameReady');
            this.server.to(roomName).emit('gameReady');
            this.emitNewTask(3000, gameId);
        }
        return {
            event: 'acceptGame',
            data: true
        };
        //return from([1]).pipe(map(item => ({ event: 'events', data: item })));
    };
    GameGatewayWs.prototype.leaveGame = function (client, data) {
        var roomName = (0, utils_1.createRoomName)(data.gameId);
        console.log('leaving game(room): ', roomName);
        //this.games[roomName] = null;
        this.server.socketsLeave(roomName); // remove all players from room, not only the invoking one
        return {
            event: 'leaveGame',
            data: true
        };
    };
    GameGatewayWs.prototype.sendTaskResultMsg = function (toPlayer, winOrLost, reason, me, opponent) {
        this.server.to(toPlayer).emit(winOrLost, {
            reason: reason,
            gameScore: {
                me: me,
                opponent: opponent
            }
        });
    };
    GameGatewayWs.prototype.solveTask = function (client, data) {
        return __awaiter(this, void 0, void 0, function () {
            function hasOpponentAlreadySolvedThisTask() {
                return !!opponent.solvedWordsIds.find(function (wordId) { return wordId == word.id; });
            }
            var playerName, opponentName, word, solution, gameId, solved, opponent, me, roomName;
            return __generator(this, function (_a) {
                console.log('data: ', data);
                playerName = data.playerName, opponentName = data.opponentName, word = data.word, solution = data.solution, gameId = data.gameId;
                solved = word.lang_english === data.solution;
                opponent = this.gameService.getPlayer(data.gameId, data.opponentName);
                me = this.gameService.getPlayer(data.gameId, data.playerName);
                roomName = (0, utils_1.createRoomName)(data.gameId);
                if (hasOpponentAlreadySolvedThisTask()) {
                    this.sendTaskResultMsg(playerName, 'task-lost!', 'task-solved-by-opponent', me, opponent);
                }
                else {
                    if (solved) {
                        me.solvedWordsIds.push(word.id);
                        me.score += 1;
                        if (this.gameService.isGameFinished(gameId)) {
                            console.log('game is finished');
                            this.sendTaskResultMsg(playerName, 'game-won!', 'limit-achieved', me, opponent);
                            this.sendTaskResultMsg(opponentName, 'game-lost!', 'limit-achieved', opponent, me);
                            return [2 /*return*/];
                        }
                        this.sendTaskResultMsg(playerName, 'task-won!', 'task-solved-by-myself', me, opponent);
                        this.sendTaskResultMsg(opponentName, 'task-lost!', 'task-solved-by-opponent', opponent, me);
                    }
                    else { // wrong answer
                        opponent.score += 1;
                        this.sendTaskResultMsg(playerName, 'task-lost!', 'wrong-solution', me, opponent);
                        this.sendTaskResultMsg(opponentName, 'task-won!', 'opponents-wrong-solution', opponent, me);
                    }
                }
                this.emitNewTask(3000, data.gameId);
                return [2 /*return*/];
            });
        });
    };
    __decorate([
        (0, websockets_1.WebSocketServer)()
    ], GameGatewayWs.prototype, "server");
    __decorate([
        (0, websockets_1.SubscribeMessage)('startFindGame')
    ], GameGatewayWs.prototype, "startFindGame");
    __decorate([
        (0, websockets_1.SubscribeMessage)('acceptGame')
    ], GameGatewayWs.prototype, "acceptGame");
    __decorate([
        (0, websockets_1.SubscribeMessage)('leaveGame')
    ], GameGatewayWs.prototype, "leaveGame");
    __decorate([
        (0, websockets_1.SubscribeMessage)('solveTask')
    ], GameGatewayWs.prototype, "solveTask");
    GameGatewayWs = __decorate([
        (0, websockets_1.WebSocketGateway)(8080, { namespace: 'find-game' })
    ], GameGatewayWs);
    return GameGatewayWs;
}());
exports["default"] = GameGatewayWs;
