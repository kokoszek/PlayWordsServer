import { Injectable } from "@nestjs/common";
import { createRoomName } from "./utils";
import { InjectRepository } from "@nestjs/typeorm";
import { MeaningEntity } from "../meaning/meaning.entity";
import { Repository } from "typeorm";
import { WordEntity } from "../word/word.entity";

export type PlayerType = {
  id: number;
  score: number;
  numberOfPlayedTasks: number;
  gameAccepted: boolean;
};

export type TaskType = {
  word: string;
  word_desc: string;
  meaningId: number;
  wordOptions: {
    wordId: number;
    word: string;
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
    private meaningRepo: Repository<MeaningEntity>
  ) {
  }

  private games: Record<string,
    {
      player1?: PlayerType;
      player2?: PlayerType;
      tasks: Array<TaskType & { correctWord: WordEntity }>;
    }> = {};

  gameId = 1;

  public createGame(player1: number, player2: number) {
    const gameId = this.gameId++;
    const roomName = createRoomName(gameId);
    console.log("createGame with roomName: ", roomName);
    console.log("inmemory games: ", this.games);
    const newGame = {
      gameId: gameId,
      player1: {
        id: player1,
        score: 0,
        numberOfPlayedTasks: 0,
        gameAccepted: false
      },
      player2: {
        id: player2,
        score: 0,
        numberOfPlayedTasks: 0,
        gameAccepted: false
      },
      tasks: []
    };
    this.games[roomName] = newGame;
    return newGame;
  }

  public acceptGame(playerId: number, gameId: number) {
    console.log("acceptGame -> games: ", this.games);
    if (this.isGameReady(gameId)) {
      return;
    }
    const roomName = createRoomName(gameId);
    if (this.games[roomName].player1.id === playerId) {
      this.games[roomName].player1.gameAccepted = true;
    }
    if (this.games[roomName].player2.id === playerId) {
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

  public getPlayer(gameId: number, playerId: number) {
    const roomName = createRoomName(gameId);
    const game = this.games[roomName];
    if (game.player1.id === playerId) {
      return game.player1;
    }
    if (game.player2.id === playerId) {
      return game.player2;
    }
    return null;
  }

  private taskLimit = 3;

  public shouldSendNextTask(gameId: number) {
    const roomName = createRoomName(gameId);
    const game = this.games[roomName];
    return game.tasks.length === game.player1.numberOfPlayedTasks &&
      game.tasks.length === game.player2.numberOfPlayedTasks;
  }

  public getGameResolution(gameId: number): {
    winner: PlayerType,
    loser: PlayerType
  } {
    if (!this.isGameFinished(gameId)) {
      return null;
    }
    const roomName = createRoomName(gameId);
    if (this.games[roomName].player1.score === this.taskLimit) {
      return {
        winner: this.games[roomName].player1,
        loser: this.games[roomName].player2
      };
    } else {
      return {
        winner: this.games[roomName].player2,
        loser: this.games[roomName].player1
      };
    }
  }

  public isGameFinished(gameId: number): boolean {
    const roomName = createRoomName(gameId);
    if (
      (
        this.games[roomName].player1.score === this.taskLimit
        ||
        this.games[roomName].player2.score === this.taskLimit
      )
      &&
      this.games[roomName].player1.numberOfPlayedTasks ===
      this.games[roomName].player2.numberOfPlayedTasks
    ) {
      console.log("game-finished");
      return true;
    } else {
      return false;
    }
  }

  public async generateTask(forGameId: number): Promise<TaskType> {
    const roomName = createRoomName(forGameId);
    const result = await this.meaningRepo
      .createQueryBuilder()
      .select("COUNT(*) as count")
      .getRawOne();
    const count = Number.parseInt(result.count);
    const numberOfWordsToRandomize = 8;
    let counter = numberOfWordsToRandomize;
    const randomizedMeanings: MeaningEntity[] = [];
    while (counter--) {
      let randomizedMeaning: MeaningEntity;
      while (true) {
        const randomInt = getRandomInt(0, count - 1);
        //console.log("randomInt: ", randomInt);
        randomizedMeaning = (
          await this.meaningRepo
            .createQueryBuilder("meaning")
            .leftJoinAndSelect("meaning.words", "words")
            .orderBy("meaning.id", "ASC")
            .skip(randomInt)
            .take(1)
            .getOne()
        );
        // randomizedMeaning = await this.meaningRepo
        //   .createQueryBuilder("meaning")
        //   .leftJoinAndSelect("meaning.words", "words")
        //   .where({ id: randomizedMeaning.id })
        //   .getOne();
        if (
          // haven't been already played
          !this.games[roomName]
            .tasks
            .map(task => task.meaningId)
            .includes(randomizedMeaning.id)
          &&
          // and not in words of randomizedMeanings (not already randomized), so that the randomized word list is unique
          randomizedMeanings
            .flatMap(meaning => meaning.words)
            .map(word => word.id)
            .every(wordId => !randomizedMeaning.words.map(word => word.id).includes(wordId))
        ) {
          break; // break if successfuly picked 'randomizedMeaning' ( conditions present is above 'if' )
        }
      }
      randomizedMeanings.push(randomizedMeaning);
    }
    const randomizedMeaningToPlay =
      randomizedMeanings[getRandomInt(0, numberOfWordsToRandomize - 1)];
    const randomizedPolishWord: WordEntity = randomizeElement(
      randomizedMeaningToPlay.words.filter((el) => el.lang === "pl")
    );

    function randomizeElement<T>(arr: T[]): T | null {
      if (arr.length === 0) {
        return null;
      }
      return arr[getRandomInt(0, arr.length - 1)];
    }

    // const phraseToShow =
    //   randomizedPolishWord?.word || randomizedMeaningToPlay.meaning_lang1_desc;

    let correctWord: WordEntity;
    const ret = {
      word: randomizedPolishWord?.word,
      word_desc: randomizedMeaningToPlay.meaning_lang1_desc,
      meaningId: randomizedMeaningToPlay.id,
      wordOptions: randomizedMeanings.map((meaning) => {
        const randomizedWord: WordEntity = randomizeElement(
          meaning.words.filter((el) => el.lang === "en")
        );
        if (meaning.id === randomizedMeaningToPlay.id) {
          correctWord = randomizedWord;
        }
        return {
          wordId: randomizedWord.id,
          word: randomizedWord.word
        };
      })
    };
    this.games[roomName].tasks.push({
      ...ret,
      correctWord
    });
    return ret;
  }

  public async getCorrectWordInLatestTask(gameId: number): Promise<{ word: string, wordId: number }> {
    const roomName = createRoomName(gameId);
    const task: TaskType & { correctWord: WordEntity } =
      this.games[roomName].tasks[this.games[roomName].tasks.length - 1];
    return {
      word: task.correctWord.word,
      wordId: task.correctWord.id
    };
    // const meaning = await this.meaningRepo.findOne({
    //   where: {
    //     id: task.meaningId
    //   }
    // });
    // let ret = null;
    // task.wordOptions.forEach(wordOption => {
    //   if (meaning.words.map(word => word.id).includes(wordOption.wordId)) {
    //     ret = {
    //       word: wordOption.word,
    //       wordId: wordOption.wordId
    //     };
    //   }
    // });
    // return ret;
  }

  public async checkTaskSolution(
    meaningId: number,
    wordIdSolution: number,
    nativeLang: "pl" | "en" = "pl"
  ): Promise<boolean> {
    const meaning = await this.meaningRepo
      .createQueryBuilder("meaning")
      .innerJoinAndSelect("meaning.words", "words")
      .where({ id: meaningId })
      .getOne();
    return meaning.words
      .filter((word) => word.lang !== nativeLang)
      .some((word) => word.id === wordIdSolution);
  }
}
