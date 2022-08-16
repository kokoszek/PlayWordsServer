import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
  OnGatewayInit
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server, Socket } from 'socket.io';
import GameService from './game-service';

const MultiSemaphore = require('redis-semaphore').MultiSemaphore
const Redis = require('ioredis')
const redis = new Redis(6380);

const { sem } = require('./semaphore');

@WebSocketGateway(8080, { namespace: 'findMatch'})
export default class WsGateway implements OnGatewayInit {

  @WebSocketServer()
  server: Server;

  constructor(
    private gameService: GameService
  ) {}

  async afterInit(server: any): Promise<any> {
    let counter = 0;
    console.log('after init begin');
    setTimeout(async () => {
      while(true) {
        await new Promise<void>(resolve => {
          sem.take(2, function() {
            resolve();
          })
        });
        console.log('while true: ', ++counter);
        let player1 = await redis.lpop("findMatchQueue");
        let player2 = await redis.lpop("findMatchQueue");
        console.log('player1: ', player1);
        console.log('player2: ', player2);
        const game = this.gameService.createGame();
        this.server.emit('gameFoundFor_' + player1, {
          matchFound: true,
          opponentName: player2,
          gameId: game.gameId
        });
        this.server.emit('gameFoundFor_' + player2, {
          matchFound: true,
          opponentName: player1,
          gameId: game.gameId
        });
      }
    }, 8000);
  }

  private rooms: Record<string, string[]> = {};

  @SubscribeMessage('acceptGame')
  acceptGame(client: Socket, data: any): WsResponse<boolean> {
    const roomNameSuffix = [data.playerName, data.opponentName].sort().join('_')
    const roomName = 'matchRoom_' + roomNameSuffix;
    console.log('player ' + data.playerName + ' joins room: ', roomName);
    client.join(roomName);
    if(this.rooms[roomName]) {
      this.rooms[roomName].push(data.playerName);
      console.log('emit gameReady');
      this.server.to(roomName).emit('gameReady');
      setTimeout(() => {
        const task = this.gameService.generateTask();
        console.log('task: ', task);
        this.server.to(roomName).emit('newTask', task);
      }, 2000);
    } else {
      this.rooms[roomName] = [data.playerName];
    }
    return {
      event: 'matchRoomJoined',
      data: true
    };
    //return from([1]).pipe(map(item => ({ event: 'events', data: item })));
  }
}
