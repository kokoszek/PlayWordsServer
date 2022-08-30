import { Injectable } from '@nestjs/common';
import { createRoomName } from './utils';
import { InjectRepository } from '@nestjs/typeorm';
import { MeaningEntity } from '../meaning/meaning.entity';
import { Repository } from 'typeorm';
import { WordEntity } from '../word/word.entity';

export type PlayerType = {
  name: string;
  score: number;
  solvedMeaningIds: number[];
  gameAccepted: boolean;
};

export type TaskType = {
  word: string;
  word_desc: string;
  meaningId: number;
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
    @InjectRepository(MeaningEntity)
    private meaningRepo: Repository<MeaningEntity>,
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
        solvedMeaningIds: [],
        gameAccepted: false,
      },
      player2: {
        name: player2,
        score: 0,
        solvedMeaningIds: [],
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
    const alreadyPlayedMeaningIds = this.games[
      roomName
    ].player1.solvedMeaningIds.concat(
      this.games[roomName].player2.solvedMeaningIds,
    );
    console.log();
    const result = await this.meaningRepo
      .createQueryBuilder()
      .select('COUNT(*) as count')
      .getRawOne();
    const count = Number.parseInt(result.count);
    console.log('total meaning count : ', count);
    const numberOfWordsToRandomize = 2;
    let counter = numberOfWordsToRandomize;
    const randomizedMeanings: MeaningEntity[] = [];
    while (counter--) {
      let randomizedMeaning: MeaningEntity;
      while (true) {
        const randomInt = getRandomInt(0, count - 1);
        console.log('randomInt: ', randomInt);
        randomizedMeaning = (
          await this.meaningRepo
            .createQueryBuilder('meaning')
            .orderBy('meaning.id', 'ASC')
            .leftJoinAndSelect('meaning.words', 'words')
            .skip(randomInt)
            .take(1)
            .getMany()
        )[0];
        console.log('rand meaning: ', JSON.stringify(randomizedMeaning));
        if (
          !alreadyPlayedMeaningIds
            .concat(randomizedMeanings.map((el) => el.id))
            .includes(randomizedMeaning.id)
        ) {
          break;
        }
      }
      randomizedMeanings.push(randomizedMeaning);
    }
    const randomizedMeaningToPlay =
      randomizedMeanings[getRandomInt(0, numberOfWordsToRandomize - 1)];
    const randomizedPolishWord: WordEntity = randomizeElement(
      randomizedMeaningToPlay.words.filter((el) => el.lang === 'pl'),
    );

    function randomizeElement<T>(arr: T[]): T | null {
      if (arr.length === 0) {
        return null;
      }
      return arr[getRandomInt(0, arr.length - 1)];
    }

    // const phraseToShow =
    //   randomizedPolishWord?.word || randomizedMeaningToPlay.meaning_lang1_desc;
    console.log('randomizedMeanings: ', randomizedMeanings);

    const ret = {
      word:
        randomizedPolishWord?.word ||
        randomizedMeaningToPlay.meaning_lang1_desc,
      word_desc: randomizedMeaningToPlay.meaning_lang1_desc,
      meaningId: randomizedMeaningToPlay.id,
      options: randomizedMeanings.map((meaning) => ({
        text: randomizeElement(meaning.words.filter((el) => el.lang === 'en'))
          .word,
      })),
    };
    console.log('ret: ', ret);
    return ret;
  }

  public checkTaskSolution(taskId: number, solution: string): boolean {
    //return this.tasks.find(task => task.id === taskId)?.solution === solution;
    return true;
  }
}
