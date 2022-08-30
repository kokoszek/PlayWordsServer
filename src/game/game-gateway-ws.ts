import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
  OnGatewayInit,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server, Socket } from 'socket.io';
import GameService, { PlayerType } from './game-service';
import { createRoomName } from './utils';
import { MeaningEntity } from '../meaning/meaning.entity';
import { Args, Mutation } from '@nestjs/graphql';
import { GraphQLString } from 'graphql';

const MultiSemaphore = require('redis-semaphore').MultiSemaphore;
const Redis = require('ioredis');
const redis = new Redis(6379);

const { sem } = require('./semaphore');

redis.on('error', (err) => {
  console.log('redis error occured: ', err);
});

@WebSocketGateway(8080, { namespace: 'find-game' })
export default class GameGatewayWs implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  constructor(private gameService: GameService) {}

  async afterInit(server: any): Promise<any> {
    let counter = 0;
    setTimeout(async () => {
      await new Promise<void>((resolve) => {
        sem.take(10, function () {
          resolve();
        });
      });
      setTimeout(async () => {
        while (true) {
          await new Promise<void>((resolve) => {
            sem.take(2, function () {
              resolve();
            });
          });
          console.log('found two matching players, loop counter: ', ++counter);
          const player1 = await redis.lpop('findMatchQueue');
          const player2 = await redis.lpop('findMatchQueue');
          const game = this.gameService.createGame(player1, player2);
          console.log('emiting event: ', 'game-found-for-' + player1);
          this.server.emit('game-found-for-' + player1, {
            matchFound: true,
            opponentName: player2,
            gameId: game.gameId,
          });
          console.log('emiting event: ', 'game-found-for-' + player2);
          this.server.emit('game-found-for-' + player2, {
            matchFound: true,
            opponentName: player1,
            gameId: game.gameId,
          });
        }
      }, 5000);
    }, 0);
  }

  private emitNewTask(delayMs: number, gameId: number) {
    const roomName = createRoomName(gameId);
    setTimeout(async () => {
      const task = await this.gameService.generateTask(gameId);
      console.log('task: ', task);
      this.server.to(roomName).emit('newTask', task);
    }, delayMs);
  }

  @SubscribeMessage('startFindGame')
  async startFindGame(
    client: Socket,
    data: {
      playerName: string;
    },
  ) {
    console.log(data.playerName + 'started finding a game');
    await redis.rpush('findMatchQueue', data.playerName);
    sem.leave();
    return true;
  }

  @SubscribeMessage('acceptGame')
  acceptGame(
    client: Socket,
    data: {
      gameId: number;
      playerName: string;
      opponentName: string;
    },
  ): WsResponse<boolean> {
    //const roomNameSuffix = [data.playerName, data.opponentName].sort().join('_')
    const { gameId, playerName, opponentName } = data;
    const roomName = createRoomName(gameId);
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
      data: true,
    };
    //return from([1]).pipe(map(item => ({ event: 'events', data: item })));
  }

  @SubscribeMessage('leaveGame')
  leaveGame(client: Socket, data: { gameId: number }): WsResponse<boolean> {
    const roomName = createRoomName(data.gameId);
    console.log('leaving game(room): ', roomName);
    //this.games[roomName] = null;
    this.server.socketsLeave(roomName); // remove all players from room, not only the invoking one
    return {
      event: 'leaveGame',
      data: true,
    };
  }

  private sendTaskResultMsg(
    toPlayer: string,
    winOrLost: 'task-lost!' | 'task-won!' | 'game-won!' | 'game-lost!',
    reason:
      | 'task-solved-by-opponent'
      | 'task-solved-by-myself'
      | 'wrong-solution'
      | 'opponents-wrong-solution'
      | 'limit-achieved',
    me: PlayerType,
    opponent: PlayerType,
  ) {
    this.server.to(toPlayer).emit(winOrLost, {
      reason: reason,
      gameScore: {
        me: me,
        opponent: opponent,
      },
    });
  }

  @SubscribeMessage('solveTask')
  async solveTask(
    client: Socket,
    data: {
      gameId: number;
      word: MeaningEntity;
      solution: string;
      playerName: string;
      opponentName: string;
    },
  ) {
    console.log('data: ', data);
    const { playerName, opponentName, word, solution, gameId } = data;
    const solved = true;
    const opponent = this.gameService.getPlayer(data.gameId, data.opponentName);
    const me = this.gameService.getPlayer(data.gameId, data.playerName);
    const roomName = createRoomName(data.gameId);

    function hasOpponentAlreadySolvedThisTask() {
      return !!opponent.solvedWordsIds.find((wordId) => wordId == word.id);
    }

    if (hasOpponentAlreadySolvedThisTask()) {
      this.sendTaskResultMsg(
        playerName,
        'task-lost!',
        'task-solved-by-opponent',
        me,
        opponent,
      );
    } else {
      if (solved) {
        me.solvedWordsIds.push(word.id);
        me.score += 1;
        if (this.gameService.isGameFinished(gameId)) {
          console.log('game is finished');
          this.sendTaskResultMsg(
            playerName,
            'game-won!',
            'limit-achieved',
            me,
            opponent,
          );
          this.sendTaskResultMsg(
            opponentName,
            'game-lost!',
            'limit-achieved',
            opponent,
            me,
          );
          return;
        }
        this.sendTaskResultMsg(
          playerName,
          'task-won!',
          'task-solved-by-myself',
          me,
          opponent,
        );
        this.sendTaskResultMsg(
          opponentName,
          'task-lost!',
          'task-solved-by-opponent',
          opponent,
          me,
        );
      } else {
        // wrong answer
        opponent.score += 1;
        this.sendTaskResultMsg(
          playerName,
          'task-lost!',
          'wrong-solution',
          me,
          opponent,
        );
        this.sendTaskResultMsg(
          opponentName,
          'task-won!',
          'opponents-wrong-solution',
          opponent,
          me,
        );
      }
    }
    this.emitNewTask(3000, data.gameId);
  }
}
