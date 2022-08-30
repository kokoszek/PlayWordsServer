import { Injectable } from '@nestjs/common';
import { createRoomName } from './utils';
import { InjectRepository } from '@nestjs/typeorm';
import { MeaningEntity } from '../meaning/meaning.entity';
import { Repository } from 'typeorm';
import { WordEntity } from '../word/word.entity';

export type PlayerType = {
  name: string;
  score: number;
  solvedWordsIds: number[];
  gameAccepted: boolean;
};

export type TaskType = {
  word: string;
  word_desc: string;
  options: {
    text: string;
  }[];
};

export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomIntExcept(min: number, max: number, except: number[]) {
  while (true) {
    min = Math.ceil(min);
    max = Math.floor(max);
    const result = Math.floor(Math.random() * (max - min + 1)) + min;
    console.log('randomized: ', result);
    if (!except.includes(result)) {
      return result;
    }
  }
}

@Injectable()
export default class GameService {
  constructor(
    @InjectRepository(WordEntity)
    private wordRepo: Repository<WordEntity>,
  ) {}

  private games: Record<
    string,
    {
      player1?: PlayerType;
      player2?: PlayerType;
    }
  > = {};

  gameId = 1;

  public createGame(player1: string, player2: string) {
    console.log('createGame');
    console.log('inmemory games: ', this.games);
    const gameId = this.gameId++;
    const roomName = createRoomName(gameId);
    const newGame = {
      gameId: gameId,
      player1: {
        name: player1,
        score: 0,
        solvedWordsIds: [],
        gameAccepted: false,
      },
      player2: {
        name: player2,
        score: 0,
        solvedWordsIds: [],
        gameAccepted: false,
      },
    };
    this.games[roomName] = newGame;
    return newGame;
  }

  public acceptGame(playerName: string, gameId: number) {
    if (this.isGameReady(gameId)) {
      return;
    }
    const roomName = createRoomName(gameId);
    if (this.games[roomName].player1.name === playerName) {
      this.games[roomName].player1.gameAccepted = true;
    }
    if (this.games[roomName].player2.name === playerName) {
      this.games[roomName].player2.gameAccepted = true;
    }
  }

  public isGameReady(gameId: number): boolean {
    const roomName = createRoomName(gameId);
    return (
      !!this.games[roomName]?.player1.gameAccepted &&
      !!this.games[roomName]?.player2.gameAccepted
    );
  }

  public getPlayer(gameId: number, playerName: string) {
    const roomName = createRoomName(gameId);
    const game = this.games[roomName];
    if (game.player1.name === playerName) {
      return game.player1;
    }
    if (game.player2.name === playerName) {
      return game.player2;
    }
    return null;
  }

  private taskLimit = 5;

  public isGameFinished(gameId: number) {
    const roomName = createRoomName(gameId);
    if (this.games[roomName].player1.score === this.taskLimit) {
      console.log('game-finished');
      return true;
    }
    if (this.games[roomName].player2.score === this.taskLimit) {
      console.log('game-finished');
      return true;
    }
    return false;
  }

  public async generateTask(forGameId: number): Promise<TaskType> {
    const roomName = createRoomName(forGameId);
    const alreadyPlayedWordIds = this.games[
      roomName
    ].player1.solvedWordsIds.concat(
      this.games[roomName].player2.solvedWordsIds,
    );
    const result = await this.wordRepo
      .createQueryBuilder()
      .select('COUNT(*) as count')
      .getRawOne();
    const count = Number.parseInt(result.count);
    let numberOfWordsToRandomize = 8;
    const randomizedWords: MeaningEntity[] = [];
    while (numberOfWordsToRandomize--) {
      let randomizedWord: MeaningEntity;
      while (true) {
        const randomInt = getRandomInt(0, count - 1);
        randomizedWord = await this.wordRepo
          .createQueryBuilder()
          .orderBy('lang_english', 'ASC')
          .limit(1)
          .offset(randomInt)
          .getOne();
        if (
          !alreadyPlayedWordIds
            .concat(randomizedWords.map((el) => el.id))
            .includes(randomizedWord.id)
        ) {
          break;
        }
      }
      randomizedWords.push(randomizedWord);
    }
    return {
      word: randomizedWords[getRandomInt(0, 7)],
      options: randomizedWords.map((word) => ({
        text: '',
      })),
    };
  }

  public checkTaskSolution(taskId: number, solution: string): boolean {
    //return this.tasks.find(task => task.id === taskId)?.solution === solution;
    return true;
  }
}
