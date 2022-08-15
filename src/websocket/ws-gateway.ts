import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(8080)
export default class WsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('event')
  onEvent(client: Socket, data: any): WsResponse<number> {
    console.log('server ws event reached');
    setTimeout(() => {
      this.server.sockets.emit('msgToClient', { id: 40 });
    }, 3000);
    return {
      event: '',
      data: 2
    };
    //return from([1]).pipe(map(item => ({ event: 'events', data: item })));
  }
}
