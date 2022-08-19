import { Injectable } from '@nestjs/common';
import { createRoomName } from './utils';

export type PlayerType = {
  name: string,
  score: number,
  solvedTaskIds: number[]
}

@Injectable()
export default class GameService {

  private tasks = [
    {
      id: 1, name: 'pies', solution: 'dog',
      options: [
        {id: 1, name: 'octopus'},
        {id: 2, name: 'cat'},
        {id: 3, name: 'dog'},
      ]
    },
    {
      id: 2, name: 'dziedzictwo', solution: 'heritage',
      options: [
        {id: 1, name: 'heritage'},
        {id: 2, name: 'kingdom'},
        {id: 3, name: 'heir'},
      ]
    },
    {
      id: 3, name: 'włosy', solution: 'hair',
      options: [
        {id: 1, name: 'hair'},
        {id: 2, name: 'sticks'},
        {id: 3, name: 'lawyers'},
      ]
    },
    {
      id: 4, name: 'kot', solution: 'cat',
      options: [
        {id: 1, name: 'cat'},
        {id: 2, name: 'frog'},
        {id: 3, name: 'tiger'},
      ]
    },
    {
      id: 5, name: 'tron', solution: 'throne',
      options: [
        {id: 1, name: 'throne'},
        {id: 2, name: 'chair'},
        {id: 3, name: 'mug'},
      ]
    },
  ];

  private games: Record<string,
    {
      player1?: PlayerType,
      player2?: PlayerType,
    }> = {};

  public acceptGame(playerName: string, gameId: number) {
    if(this.isGameReady(gameId)) {
      return;
    }
    const roomName = createRoomName(gameId);
    if(!this.games[roomName]) {
      this.games[roomName] = {};
    }
    const initialPlayer = {
      name: playerName,
      score: 0,
      solvedTaskIds: []
    };
    if(this.games[roomName].player1) {
      this.games[roomName].player2 = initialPlayer;
    } else {
      this.games[roomName].player1 = initialPlayer;
    }
  }

  public isGameReady(gameId: number): boolean {
    const roomName = createRoomName(gameId);
    return !!this.games[roomName]?.player1 && !!this.games[roomName]?.player2;
  }

  public getPlayer(gameId: number, playerName: string) {
    const roomName = createRoomName(gameId);
    const game = this.games[roomName];
    if(game.player1.name === playerName) {
      return game.player1;
    }
    if(game.player2.name === playerName) {
      return game.player2;
    }
    return null;
  }

  private taskLimit = 3;

  public isGameFinished(gameId: number) {
    const roomName = createRoomName(gameId);
    if(this.games[roomName].player1.score === this.taskLimit) {
      console.log('game-finished');
      return true;
    }
    if(this.games[roomName].player2.score === this.taskLimit) {
      console.log('game-finished');
      return true;
    }
    return false;
  }

  public generateTask(forGameId: number) {
    const roomName = createRoomName(forGameId);
    const usedTasks = this.games[roomName].player1.solvedTaskIds.concat(
      this.games[roomName].player2.solvedTaskIds
    );
    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    while(true) {
      let newTask = this.tasks[getRandomInt(0, this.tasks.length - 1)];
      if(!usedTasks.includes(newTask.id)) {
        return newTask;
      }
    }
  }

  public checkTaskSolution(taskId: number, solution: string): boolean {
    return this.tasks.find(task => task.id === taskId)?.solution === solution;
  }

  gameId = 1;

  public createGame() {
    return {
      gameId: this.gameId++
    }
  }
}
