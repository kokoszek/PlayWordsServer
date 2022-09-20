import { Injectable, OnModuleInit } from "@nestjs/common";
import { createRoomName } from "./utils";
import { InjectRepository } from "@nestjs/typeorm";
import { MeaningEntity } from "../meaning/meaning.entity";
import { Repository } from "typeorm";
import { WordEntity } from "../word/word.entity";
import WordParticle from "../word/word-particle.entity";
import { LinkEntity } from "../meaning/link.entity";

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
export default class GameService implements OnModuleInit {
  constructor(
    @InjectRepository(WordEntity)
    private wordRepo: Repository<WordEntity>,
    @InjectRepository(MeaningEntity)
    private meaningRepo: Repository<MeaningEntity>,
    @InjectRepository(LinkEntity)
    private linkRepo: Repository<LinkEntity>,
    @InjectRepository(WordParticle)
    private wordParticleRepo: Repository<WordParticle>
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

  public getOpponentOfPlayer(gameId: number, playerId: number): PlayerType {
    const roomName = createRoomName(gameId);
    const game = this.games[roomName];
    if (game.player1.id == playerId) {
      return game.player2;
    }
    if (game.player2.id == playerId) {
      return game.player1;
    }
    return null;
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
    loser: PlayerType,
    tie: boolean
  } {
    if (!this.isGameFinished(gameId)) {
      return null;
    }
    const roomName = createRoomName(gameId);
    if (this.games[roomName].player1.score === this.taskLimit &&
      this.games[roomName].player2.score === this.taskLimit) {
      return {
        winner: null,
        loser: null,
        tie: true
      };
    }
    if (this.games[roomName].player1.score === this.taskLimit) {
      return {
        winner: this.games[roomName].player1,
        loser: this.games[roomName].player2,
        tie: false
      };
    } else {
      return {
        winner: this.games[roomName].player2,
        loser: this.games[roomName].player1,
        tie: false
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

  private hasSbdParticle(word: WordEntity): boolean {
    return word.wordParticles
      .some(wp => ["someone", "somebody", "sbd"].includes(wp.wordParticle));
  }

  async onModuleInit(): Promise<any> {
    // let words = await this.randomizePhrasalVerbsWithSbdParticle(7);
    // let words = await this.randomizeRestOfPhrasalVerbs(4, [12, 24, 25]);
    await this.generateTask2(2, "B1");
  }

  private async randomizePhrasalVerbsWithParticle(
    wordParticle: string,
    amount: number,
    exclude: WordEntity
  ) {

    console.log("wordParticle: ", wordParticle);

    let result = await this.wordRepo
      .createQueryBuilder("word")
      .select("COUNT(*) as count")
      .select()
      .innerJoin("word.meanings", "links")
      .innerJoin("links.meaning", "meaning")
      .innerJoin("word.wordParticles", "wordParticles", `wordParticles.wordParticle = '${wordParticle}'`)
      .where(`meaning.partOfSpeech = 'phrasal verb'`)
      .andWhere("word.id != :wordId", {
        wordId: exclude.id
      })
      .groupBy("word.id")
      .getRawOne();

    console.log("result: ", result);

    const count = Number.parseInt(result.count);
    console.log("count: ", count);

    const counterOrig = Math.min(amount, count);
    let counter = counterOrig;
    const words: WordEntity[] = [];
    while (counter--) {
      while (true) {
        const randomInt = getRandomInt(0, counterOrig - 1);
        console.log("randomInt: ", randomInt);
        let result: any = await this.wordRepo
          .createQueryBuilder("word")
          .select()
          .innerJoin("word.meanings", "links")
          .innerJoin("links.meaning", "meaning")
          .innerJoin("word.wordParticles", "wordParticles", `wordParticles.wordParticle = '${wordParticle}'`)
          .where("meaning.partOfSpeech = 'phrasal verb'")
          .andWhere("word.id != :wordId", {
            wordId: exclude.id
          })
          .groupBy("word.id")
          .orderBy("word.id", "ASC")
          .limit(1)
          .offset(randomInt)
          .getOne();
        // .take(1)
        // .skip(randomInt)
        // .getOne();
        console.log("RESULT: ", result);
        if (!words.concat([exclude]).map(word => word.id).includes(result.id)) {
          words.push(result);
          console.log("break");
          break;
        }
      }
    }
    return words;
  }

  private async randomizePhrasalVerbsWithSbdParticle(
    amount: number,
    exclude: WordEntity
  ): Promise<WordEntity[]> {
    return await this.randomizePhrasalVerbsWithParticle("somebody", amount, exclude);
  }

  private async randomizeRestOfPhrasalVerbs(amount: number, excludeWordIds: number[]) {
    console.log("randomizeRestOfPhrasalVerbs -> amount: ", amount);
    if (amount <= 0) {
      return [];
    }
    let result: any = await this.wordRepo
      .createQueryBuilder("word")
      .select("COUNT(DISTINCT word.id) as count")
      //.select()
      .innerJoin("word.meanings", "links")
      .innerJoin("links.meaning", "meaning")
      .where(`meaning.partOfSpeech = 'phrasal verb'`)
      .andWhere("word.lang = 'en'")
      //.groupBy("word.id, meaning.partOfSpeech")
      //.distinct(true)
      .getRawOne();
    console.log("RESULT: ", result);
    const allCount = Number.parseInt(result.count);
    //const allCount = 1;
    console.log("allCount: ", allCount);

    const counterOrig = amount;
    let counter = counterOrig;
    const words: WordEntity[] = [];
    while (counter--) {
      while (true) {
        const randomInt = getRandomInt(0, allCount - 1);
        console.log("randomInt: ", randomInt);
        let result: WordEntity = await this.wordRepo
          .createQueryBuilder("word")
          .select()
          .innerJoin("word.meanings", "links")
          .innerJoin("links.meaning", "meaning")
          .where("meaning.partOfSpeech = 'phrasal verb'")
          .andWhere("word.lang = 'en'")
          .orderBy("word.id", "ASC")
          .distinct(true)
          .limit(1)
          .offset(randomInt)
          .getOne();
        // console.log("randomInt: ", randomInt);
        console.log("result: ", result);
        console.log("words: ", words);
        console.log("excludeWordIds: ", excludeWordIds);
        // console.log("words: ", words);
        if (
          (!words.map(word => word?.id).includes(result?.id) &&
            !excludeWordIds.includes(result?.id)) ||
          result == null
        ) {
          console.log("break");
          words.push(result);
          break;
        }
      }
    }
    return words;
  }

  private async randomizeLink(level: string, lang: string): Promise<LinkEntity> {
    const result = await this.linkRepo.createQueryBuilder("link")
      .select("COUNT(*) as count")
      .innerJoin("link.word", "word")
      .where("link.level = :level", { level })
      .andWhere("word.lang = :lang", { lang })
      .getRawOne();
    const count = Number.parseInt(result.count);
    let randomInt = getRandomInt(0, count - 1);
    randomInt = 1;
    console.log("count: ", count);
    console.log("randomInt: ", randomInt);
    const randWord = (
      await this.linkRepo
        .createQueryBuilder("link")
        .innerJoinAndSelect("link.meaning", "meaning")
        .innerJoinAndSelect("link.word", "word")
        .leftJoinAndSelect("word.wordParticles", "wordParticles")
        .where("link.level = :level", { level })
        .andWhere("word.lang = :lang", { lang })
        .orderBy("word.id", "ASC")
        .skip(randomInt)
        .take(1)
        .getOne()
    );
    return randWord;
  }

  public async generateTask2(forGameId: number, level: string): Promise<TaskType> {

    let link: LinkEntity = await this.randomizeLink(level, "en");
    console.log("link: ", link);
    let wordsToPlay: WordEntity[] = [];
    const totalWordOptions = 4;
    if (link.meaning.partOfSpeech === "phrasal verb") {
      let wordsWithParticle: WordEntity[] = [];
      if (this.hasSbdParticle(link.word)) {
        wordsWithParticle =
          await this.randomizePhrasalVerbsWithSbdParticle(totalWordOptions - 1, link.word);
      } else {
        wordsWithParticle =
          await this.randomizePhrasalVerbsWithParticle(
            link.word.wordParticles[0].wordParticle,
            totalWordOptions - 1,
            link.word
          );
      }
      console.log("1.wordsWithParticle: ", wordsWithParticle);
      let rest = await this.randomizeRestOfPhrasalVerbs(
        totalWordOptions - 1 - wordsWithParticle.length,
        wordsWithParticle.concat([link.word]).map(w => w.id)
      );
      wordsToPlay = [link.word, ...wordsWithParticle, ...rest];
      console.log("wordsToPlay: ", wordsToPlay);
    } else {
      // let words =
      //   this.randomizeWords(7, link.category, link.partOfSpeech);
      // let restOfWords =
      //   this.randomizeRestOfWords(7 - words.length);
      // wordsToPlay = [word, ...words, ...restOfWords];
    }
    console.log("wordsToPlay: ", wordsToPlay);
    return null;
    // let plWord = this.getPolishWordFromMeaning(link);
    // const ret = {
    //   word: plWord?.word,
    //   word_desc: link.meaning_lang1_desc,
    //   meaningId: link.id,
    //   wordOptions: wordsToPlay.map((word: WordEntity) => {
    //     return {
    //       wordId: word.id,
    //       word: word.word
    //     };
    //   })
    // };
    // const roomName = createRoomName(forGameId);
    // this.games[roomName].tasks.push({
    //   ...ret,
    //   correctWord: word
    // });
    // return ret;
  }

  private randomizeElement<T>(arr: T[]): T | null {
    if (arr.length === 0) {
      return null;
    }
    return arr[getRandomInt(0, arr.length - 1)];
  }

  // public async generateTask(forGameId: number): Promise<TaskType> {
  //   const roomName = createRoomName(forGameId);
  //   const result = await this.meaningRepo
  //     .createQueryBuilder()
  //     .select("COUNT(*) as count")
  //     .getRawOne();
  //   const count = Number.parseInt(result.count);
  //   // const randomInt = getRandomInt(0, count - 1);
  //
  //   const numberOfWordsToRandomize = 8;
  //   let counter = numberOfWordsToRandomize;
  //   const randomizedMeanings: MeaningEntity[] = [];
  //   while (counter--) {
  //     let randomizedMeaning: MeaningEntity;
  //     while (true) {
  //       const randomInt = getRandomInt(0, count - 1);
  //       randomizedMeaning = (
  //         await this.meaningRepo
  //           .createQueryBuilder("meaning")
  //           .leftJoinAndSelect("meaning.words", "words")
  //           .orderBy("meaning.id", "ASC")
  //           .skip(randomInt)
  //           .take(1)
  //           .getOne()
  //       );
  //       if (
  //         // haven't been already played
  //         !this.games[roomName]
  //           .tasks
  //           .map(task => task.meaningId)
  //           .includes(randomizedMeaning.id)
  //         &&
  //         // and not in words of randomizedMeanings (not already randomized), so that the randomized word list is unique
  //         randomizedMeanings
  //           .flatMap(meaning => meaning.words)
  //           .map(word => word.id)
  //           .every(wordId => !randomizedMeaning.words.map(word => word.id).includes(wordId))
  //       ) {
  //         break; // break if successfuly picked 'randomizedMeaning' ( conditions present is above 'if' )
  //       }
  //     }
  //     randomizedMeanings.push(randomizedMeaning);
  //   }
  //   const randomizedMeaningToPlay =
  //     randomizedMeanings[getRandomInt(0, numberOfWordsToRandomize - 1)];
  //   const randomizedPolishWord: WordEntity = this.randomizeElement(
  //     randomizedMeaningToPlay.words.filter((el) => el.lang === "pl")
  //   );
  //
  //
  //   let correctWord: WordEntity;
  //   const ret = {
  //     word: randomizedPolishWord?.word,
  //     word_desc: randomizedMeaningToPlay.meaning_lang1_desc,
  //     meaningId: randomizedMeaningToPlay.id,
  //     wordOptions: randomizedMeanings.map((meaning) => {
  //       const randomizedWord: WordEntity = this.randomizeElement(
  //         meaning.words.filter((el) => el.lang === "en")
  //       );
  //       if (meaning.id === randomizedMeaningToPlay.id) {
  //         correctWord = randomizedWord;
  //       }
  //       return {
  //         wordId: randomizedWord.id,
  //         word: randomizedWord.word
  //       };
  //     })
  //   };
  //   this.games[roomName].tasks.push({
  //     ...ret,
  //     correctWord
  //   });
  //   return ret;
  // }

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
      .innerJoinAndSelect("meaning.words", "links")
      .innerJoinAndSelect("links.word", "word")
      .where({ id: meaningId })
      .getOne();
    return meaning.words
      .filter((link) => link.word.lang !== nativeLang)
      .some((link) => link.word.id === wordIdSolution);
  }
}
