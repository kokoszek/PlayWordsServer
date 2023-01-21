import { OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import GameService, { PlayerType } from "./game-service";
import { createRoomName, randomizeElement } from "./utils";
import { WordEntity } from "../word/word.entity";
import PlayerService from "../player/player.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PlayerEntity } from "../player/player.entity";

//const MultiSemaphore = require("redis-semaphore").MultiSemaphore;
//import { redis } from "./redis";

//const { sem } = require("./semaphore");

@WebSocketGateway(Number.parseInt(process.env.WS_PORT), { namespace: "find-game" })
export default class GameGatewayWs implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  gameQueue: Array<string> = [];

  constructor(
    private gameService: GameService,
    private playerService: PlayerService,
    @InjectRepository(PlayerEntity)
    private playerRepo: Repository<PlayerEntity>,
    @InjectRepository(WordEntity)
    private wordRepo: Repository<WordEntity>
  ) {
  }

  async afterInit(server: any): Promise<any> {
    let counter = 0;
    //await redis.del("findMatchQueue");
    setTimeout(async () => {
      // await new Promise<void>((resolve) => {
      //   sem.take(10, function() {
      //     resolve();
      //   });
      // });
      setTimeout(async () => {
        //while (true) {
        // await new Promise<void>((resolve) => {
        //   sem.take(2, function() {
        //     resolve();
        //   });
        // });
        //console.log("found two matching players, loop counter: ", ++counter);
        //}
      }, 2000);
    }, 0);
  }

  private emitNewTask(delayMs: number, gameId: number) {
    const roomName = createRoomName(gameId);
    setTimeout(async () => {
      const task = await this.gameService.generateTask2(randomizeElement(
        process.env.MULTIPLAYER_LEVELS.split(",")
      ));
      this.gameService.addTaskToGame(gameId, task);
      //const task = null;
      console.log("task: ", task);
      this.server.to(roomName).emit("newTask", task);
    }, delayMs);
  }

  @SubscribeMessage("register")
  async register(client: Socket): Promise<number> {
    const player = await this.playerService.createPlayer();
    return player.id;
  }

  @SubscribeMessage("startFindGame")
  async startFindGame(
    client: Socket,
    data: { playerId: number; }
  ) {
    const { playerId } = data;
    console.log(playerId + " started to find a game");
    //let allList: string[] = await redis.lrange("findMatchQueue", 0, -1);
    let allList: string[] = this.gameQueue;
    console.log("this.gameQueeu:", this.gameQueue);

    if (allList.some(el => Number.parseInt(el) === playerId)) {
      console.log("player " + playerId + " already in queue, skipping....");
      return;
    }
    console.log("startFindGame push type: ", typeof playerId);
    await this.gameQueue.push(playerId.toString());
    allList = this.gameQueue;
    console.log("allList after pushing: ", allList);

    if (allList.length >= 2) {
      console.log("allList: ", allList);
      // const player1Str = await redis.lpop("findMatchQueue");
      // const player2Str = await redis.lpop("findMatchQueue");
      const player1Str = this.gameQueue.shift();
      const player2Str = this.gameQueue.shift();

      const player1 = Number.parseInt(player1Str);
      const player2 = Number.parseInt(player2Str);

      const player1Entity = await this.playerRepo.findOne({ where: { id: player1 } });
      const player2Entity = await this.playerRepo.findOne({ where: { id: player2 } });

      // console.log("player1Entity: ", player1Entity);
      // console.log("player2Entity: ", player2Entity);

      console.log("players poped from queue: ", player1, " and ", player2);
      const game = this.gameService.createGame(player1, player2);
      console.log("emiting event: ", "game-found-for-" + player1);

      this.server.emit("game-found-for-" + player1, {
        matchFound: true,
        opponentId: player2,
        opponentName: player2Entity.playerName,
        gameId: game.gameId
      });
      console.log("emiting event: ", "game-found-for-" + player2);
      this.server.emit("game-found-for-" + player2, {
        matchFound: true,
        opponentId: player1,
        opponentName: player1Entity.playerName,
        gameId: game.gameId
      });
    }


    return true;
  }

  @SubscribeMessage("stopFindGame")
  async stopFindGame(
    client: Socket,
    data: { playerId: string; }
  ) {
    const { playerId } = data;
    //await redis.lrem("findMatchQueue", 0, playerId);
    let idx = this.gameQueue.indexOf(playerId);
    this.gameQueue.splice(idx, 1);
    console.log("current Queue: ", this.gameQueue);
    return true;
  }

  private emitBothReady(gameId: number) {
    const roomName = createRoomName(gameId);
    this.server.to(roomName).emit("bothReady");
  }

  private gameCanceled(gameId: number) {
    const roomName = createRoomName(gameId);
    this.server.to(roomName).emit("gameCanceled");
  }

  @SubscribeMessage("joinGameSockets")
  joinGameSockets(
    client: Socket,
    data: {
      gameId: number;
      playerId: number;
    }
  ): WsResponse<boolean> {
    const roomName = createRoomName(data.gameId);
    client.join(roomName);
    client.join(data.playerId.toString());
    console.log("joinGame");
    return {
      event: "joinGame",
      data: true
    };
  }

  @SubscribeMessage("acceptGame")
  acceptGame(
    client: Socket,
    data: {
      gameId: number;
      playerId: number;
    }
  ): WsResponse<boolean> {
    //const roomNameSuffix = [data.playerName, data.opponentName].sort().join('_')
    const { gameId, playerId } = data;
    const roomName = createRoomName(gameId);
    console.log("player " + playerId + " joins room: ", roomName);
    this.gameService.acceptGame(playerId, gameId);
    if (this.gameService.isGameReady(gameId)) {
      console.log("emit gameReady");
      this.server.to(roomName).emit("gameReady");
      this.emitBothReady(gameId);
      this.emitNewTask(3000, gameId);
    }
    return {
      event: "acceptGame",
      data: true
    };
    //return from([1]).pipe(map(item => ({ event: 'events', data: item })));
  }

  @SubscribeMessage("rejectGame")
  rejectGame(client: Socket, data: { gameId: number; playerId: number; }): WsResponse<boolean> {
    const opponent: PlayerType = this.gameService.getOpponentOfPlayer(data.gameId, data.playerId);
    this.server.to(opponent.id.toString()).emit("game-rejected");
    this.leaveGameSockets(data);
    this.gameService.removeGame(data.gameId);
    console.log("sockets left");
    this.gameService.printGames();
    return {
      event: "rejectGame",
      data: true
    };
  }

  @SubscribeMessage("leaveGame")
  leaveGame(client: Socket, data: { gameId: number, playerId: number }): WsResponse<boolean> {
    const opponent: PlayerType = this.gameService.getOpponentOfPlayer(data.gameId, data.playerId);
    console.log("LEAVE GAME: ", opponent.id);
    this.server.to(opponent.id.toString()).emit("player-left");
    this.leaveGameSockets(data);
    this.gameService.removeGame(data.gameId);
    //this.games[roomName] = null;
    return {
      event: "leaveGame",
      data: true
    };
  }

  leaveGameSockets(data: { gameId: number, playerId: number }) {
    const opponent = this.gameService.getOpponentOfPlayer(data.gameId, data.playerId);
    this.server.socketsLeave(opponent.id.toString());
    this.server.socketsLeave(data.playerId.toString());
    const roomName = createRoomName(data.gameId);
    this.server.socketsLeave(roomName);
  }

  private sendTaskResultMsg(
    toPlayerId: number,
    eventType:
      "task-solved!" |
      "task-not-solved!" |
      "game-won!" |
      "game-lost!" |
      "tie!" |
      "opponent-solved-task!" |
      "opponent-failed-task!"
    ,
    me: PlayerType,
    opponent: PlayerType,
    correctWord?: {
      word: string,
      wordId: number
    }
  ) {
    this.server.to(toPlayerId.toString()).emit(eventType, {
      gameScore: {
        me: me,
        opponent: opponent
      },
      correctWord
    });
  }

  @SubscribeMessage("solveTask")
  async solveTask(
    client: Socket,
    data: { gameId: number; meaningId: number; wordIdSolution: number; playerId: number; opponentId: number; }
  ) {
    console.log("data: ", data);
    const { playerId, opponentId, wordIdSolution, gameId } = data;
    const solved = await this.gameService.checkTaskSolution(
      data.meaningId,
      wordIdSolution
    );
    console.log("solved: ", solved);
    const opponent = this.gameService.getPlayer(data.gameId, opponentId);
    const me = this.gameService.getPlayer(data.gameId, playerId);
    const roomName = createRoomName(data.gameId);

    // function hasOpponentAlreadySolvedThisTask() {
    //   return !!opponent.solvedMeaningIds.find(
    //     (meaningId) => meaningId === data.meaningId
    //   );
    // }
    me.numberOfPlayedTasks += 1;

    if (solved) {
      me.score += 1;
      const correctWord = await this.gameService.getCorrectWordInLatestTask(data.gameId);
      this.sendTaskResultMsg(playerId, "task-solved!", me, opponent, {
        word: correctWord.word,
        wordId: wordIdSolution
      });
      this.sendTaskResultMsg(opponentId, "opponent-solved-task!", opponent, me);
    } else {
      // wrong answer
      //opponent.score += 1;
      const correctWord = await this.gameService.getCorrectWordInLatestTask(data.gameId);
      console.log("correct word: ", correctWord);
      this.sendTaskResultMsg(playerId, "task-not-solved!", me, opponent, {
        word: correctWord.word,
        wordId: correctWord.wordId
      });
      this.sendTaskResultMsg(opponentId, "opponent-failed-task!", opponent, me);
    }
    if (this.gameService.isGameFinished(gameId)) {
      const { winner, loser, tie } = this.gameService.getGameResolution(gameId);
      if (tie) {
        this.sendTaskResultMsg(me.id, "tie!", me, opponent);
        this.sendTaskResultMsg(opponent.id, "tie!", opponent, me);
      } else {
        this.sendTaskResultMsg(winner.id, "game-won!", winner, loser);
        await this.playerService.incrementPlayersWonGame(winner.id);
        this.sendTaskResultMsg(loser.id, "game-lost!", loser, winner);
        await this.playerService.incrementPlayersLostGame(loser.id);
      }
    }

    console.log("before IF");
    if (this.gameService.shouldSendNextTask(gameId)) {
      // send new task in 3 seconds
      console.log("EMIT");
      this.emitNewTask(3000, data.gameId);
    } else {
      console.log("SHOULD NOT send next task");
    }
  }
}
