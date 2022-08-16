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

const MultiSemaphore = require('redis-semaphore').MultiSemaphore
const Redis = require('ioredis')
const redis = new Redis(6380);

const { sem } = require('./semaphore');

@WebSocketGateway(8080, { namespace: 'findMatch'})
export default class WsGateway implements OnGatewayInit {

  @WebSocketServer()
  server: Server;

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
        console.log('white true: ', ++counter);
      }
    }, 8000);
  }

  @SubscribeMessage('event')
  onEvent(client: Socket, data: any): WsResponse<number> {
    console.log('server ws event reached');
    setTimeout(() => {
      console.log('this.server.sockets.emit', this.server.emit);
      this.server.emit('msgToClient', { id: 40 });
    }, 3000);
    return {
      event: '',
      data: 2
    };
    //return from([1]).pipe(map(item => ({ event: 'events', data: item })));
  }
}
