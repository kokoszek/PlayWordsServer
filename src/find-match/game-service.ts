import { Injectable } from '@nestjs/common';


@Injectable()
export default class GameService {

  public generateTask() {
    return {
      id: 1,
      name: 'pies',
      options: [
        {id: 1, name: 'octopus'},
        {id: 2, name: 'cat'},
        {id: 3, name: 'dog'},
      ]
    }
  }

  public createGame() {
    return {
      gameId: 1
    }
  }
}
