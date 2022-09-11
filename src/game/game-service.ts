import { Injectable } from "@nestjs/common";
import { createRoomName } from "./utils";
import { InjectRepository } from "@nestjs/typeorm";
import { MeaningEntity } from "../meaning/meaning.entity";
import { Repository } from "typeorm";
import { WordEntity } from "../word/word.entity";

export type PlayerType = {
  id: number;
  score: number;
  solvedMeaningIds: number[];
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
        solvedMeaningIds: [],
        gameAccepted: false
      },
      player2: {
        id: player2,
        score: 0,
        solvedMeaningIds: [],
        gameAccepted: false
      }
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

  private taskLimit = 5;

  public isGameFinished(gameId: number) {
    const roomName = createRoomName(gameId);
    if (this.games[roomName].player1.score === this.taskLimit) {
      console.log("game-finished");
      return true;
    }
    if (this.games[roomName].player2.score === this.taskLimit) {
      console.log("game-finished");
      return true;
    }
    return false;
  }

  public async generateTask(forGameId: number): Promise<TaskType> {
    const roomName = createRoomName(forGameId);
    const alreadyPlayedMeaningIds = this.games[
      roomName
      ].player1.solvedMeaningIds.concat(
      this.games[roomName].player2.solvedMeaningIds
    );
    console.log();
    const result = await this.meaningRepo
      .createQueryBuilder()
      .select("COUNT(*) as count")
      .getRawOne();
    const count = Number.parseInt(result.count);
    console.log("total meaning count : ", count);
    const numberOfWordsToRandomize = 8;
    let counter = numberOfWordsToRandomize;
    const randomizedMeanings: MeaningEntity[] = [];
    while (counter--) {
      let randomizedMeaning: MeaningEntity;
      while (true) {
        const randomInt = getRandomInt(0, count - 1);
        console.log("randomInt: ", randomInt);
        randomizedMeaning = (
          await this.meaningRepo
            .createQueryBuilder("meaning")
            .orderBy("meaning.id", "ASC")
            .offset(randomInt)
            .limit(1)
            .getMany()
        )[0];
        console.log("rand meaning: ", JSON.stringify(randomizedMeaning));
        console.log(
          "list of meaning ids: ",
          alreadyPlayedMeaningIds.concat(randomizedMeanings.map((el) => el.id))
        );
        if (
          !alreadyPlayedMeaningIds
            .concat(randomizedMeanings.map((el) => el.id))
            .includes(randomizedMeaning.id)
        ) {
          break;
        }
      }
      randomizedMeaning = await this.meaningRepo
        .createQueryBuilder("meaning")
        .leftJoinAndSelect("meaning.words", "words")
        .where({ id: randomizedMeaning.id })
        .getOne();
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

    const ret = {
      word:
        randomizedPolishWord?.word || // if no word in native language found...
        randomizedMeaningToPlay.meaning_lang1_desc, // ...apply meaning description
      word_desc: randomizedMeaningToPlay.meaning_lang1_desc,
      meaningId: randomizedMeaningToPlay.id,
      wordOptions: randomizedMeanings.map((meaning) => {
        const randomizedWord: WordEntity = randomizeElement(
          meaning.words.filter((el) => el.lang === "en")
        );
        return {
          wordId: randomizedWord.id,
          word: randomizedWord.word
        };
      })
    };
    return ret;
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
