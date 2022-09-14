import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
  OnGatewayInit
} from "@nestjs/websockets";
import { from, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Server, Socket } from "socket.io";
import GameService, { PlayerType } from "./game-service";
import { createRoomName } from "./utils";
import { MeaningEntity } from "../meaning/meaning.entity";
import { Args, Mutation } from "@nestjs/graphql";
import { GraphQLString } from "graphql";
import { WordEntity } from "../word/word.entity";
import PlayerService from "../player/player.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PlayerEntity } from "../player/player.entity";

const MultiSemaphore = require("redis-semaphore").MultiSemaphore;
const Redis = require("ioredis");
const redis = new Redis(6379);

const { sem } = require("./semaphore");

redis.on("error", (err) => {
  console.log("redis error occured: ", err);
});

@WebSocketGateway(8080, { namespace: "find-game" })
export default class GameGatewayWs implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

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
    setTimeout(async () => {
      await new Promise<void>((resolve) => {
        sem.take(10, function() {
          resolve();
        });
      });
      setTimeout(async () => {
        while (true) {
          await new Promise<void>((resolve) => {
            sem.take(2, function() {
              resolve();
            });
          });
          console.log("found two matching players, loop counter: ", ++counter);
          let allList = await redis.lrange("findMatchQueue", 0, -1);
          console.log("allList: ", allList);
          const player1Str = await redis.lpop("findMatchQueue");
          const player2Str = await redis.lpop("findMatchQueue");

          const player1 = Number.parseInt(player1Str);
          const player2 = Number.parseInt(player2Str);

          const player1Entity = await this.playerRepo.findOne({ where: { id: player1 } });
          const player2Entity = await this.playerRepo.findOne({ where: { id: player2 } });

          console.log("player1Entity: ", player1Entity);
          console.log("player2Entity: ", player2Entity);

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
      }, 2000);
    }, 0);
  }

  private emitNewTask(delayMs: number, gameId: number) {
    const roomName = createRoomName(gameId);
    setTimeout(async () => {
      const task = await this.gameService.generateTask(gameId);
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
    let allList: string[] = await redis.lrange("findMatchQueue", 0, -1);
    if (allList.some(el => Number.parseInt(el) === playerId)) {
      console.log("player " + playerId + " already in queue, skipping....");
      return;
    }
    console.log("startFindGame push type: ", typeof playerId);
    await redis.rpush("findMatchQueue", playerId);
    allList = await redis.lrange("findMatchQueue", 0, -1);
    console.log("allList after pushing: ", allList);
    sem.leave();
    return true;
  }

  @SubscribeMessage("stopFindGame")
  async stopFindGame(
    client: Socket,
    data: { playerId: string; }
  ) {
    const { playerId } = data;
    await redis.lrem("findMatchQueue", 0, playerId);
    sem.take(1, () => {
    });
    return true;
  }

  private emitBothReady(gameId: number) {
    const roomName = createRoomName(gameId);
    this.server.to(roomName).emit("bothReady");
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
    client.join(roomName);
    client.join(playerId.toString());
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

  @SubscribeMessage("leaveGame")
  leaveGame(client: Socket, data: { gameId: number }): WsResponse<boolean> {
    const roomName = createRoomName(data.gameId);
    console.log("leaving game(room): ", roomName);
    //this.games[roomName] = null;
    this.server.socketsLeave(roomName); // remove all players from room, not only the invoking one
    return {
      event: "leaveGame",
      data: true
    };
  }

  private sendTaskResultMsg(
    toPlayerId: number,
    eventType:
      "task-solved!" |
      "task-not-solved!" |
      "game-won!" |
      "game-lost!" |
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
    data: {
      gameId: number;
      meaningId: number;
      wordIdSolution: number;
      playerId: number;
      opponentId: number;
    }
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
      //me.solvedMeaningIds.push(data.meaningId);
      me.score += 1;
      // console.log("game is finished");
      // this.sendTaskResultMsg(playerId, "game-won!", "limit-achieved", me, opponent);
      // this.sendTaskResultMsg(opponentId, "game-lost!", "limit-achieved", opponent, me);
      // return;
      //const correctWord = await this.wordRepo.findOne({ where: { id: wordIdSolution } });
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
      const gameResolution = this.gameService.getGameResolution(gameId);
      this.sendTaskResultMsg(
        gameResolution.winner.id,
        "game-won!",
        gameResolution.winner,
        gameResolution.loser
      );
      this.sendTaskResultMsg(
        gameResolution.loser.id,
        "game-lost!",
        gameResolution.loser,
        gameResolution.winner
      );
    }

    if (this.gameService.shouldSendNextTask(gameId)) {
      // send new task in 3 seconds
      this.emitNewTask(3000, data.gameId);
    }
  }
}
