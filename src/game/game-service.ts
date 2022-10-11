import { Injectable, OnModuleInit } from "@nestjs/common";
import { createRoomName, getRandomInt, randomizeElement } from "./utils";
import { InjectRepository } from "@nestjs/typeorm";
import { CategoryType, MeaningEntity, PartOfSpeechType } from "../meaning/meaning.entity";
import { Repository } from "typeorm";
import { WordEntity } from "../word/word.entity";
import WordParticle from "../word/word-particle.entity";
import { LevelType, LinkEntity } from "../meaning/link.entity";

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
    //await this.generateTask2(2, "A1");
  }

  private async randomizePhrasalVerbsWithParticle(
    wordParticle: string,
    amount: number,
    excludeIds: number[]
  ) {
    let result: any = await this.wordRepo
      .createQueryBuilder("word")
      .select("COUNT(DISTINCT word.id) as count")
      .innerJoin("word.wordParticles", "wordParticles", `wordParticles.wordParticle = '${wordParticle}'`)
      .where(`word.isPhrasalVerb = 1`)
      .andWhere(`word.id NOT IN (:excludeIds)`, {
        excludeIds
      })
      .getRawOne();
    const count = Number.parseInt(result.count);
    console.log("COUNT: ", count);
    const counterOrig = Math.min(amount, count);
    let counter = counterOrig;
    const words: WordEntity[] = [];
    let maxLoop = 15;
    while (counter--) {
      while (true) {
        // if (maxLoop-- <= 0) {
        //   break;
        // }
        const randomInt = getRandomInt(0, count - 1);
        let result: any = await this.wordRepo
          .createQueryBuilder("word")
          .select()
          .innerJoin("word.wordParticles", "wordParticles", `wordParticles.wordParticle = '${wordParticle}'`)
          .where(`word.isPhrasalVerb = 1`)
          .andWhere(`word.id NOT IN (:excludeIds)`, {
            excludeIds
          })
          .distinct(true)
          .orderBy("word.id", "ASC")
          .limit(1)
          .offset(randomInt)
          .getOne();
        if (!words.map(word => word.id).concat(excludeIds).includes(result.id)) {
          console.log("adding word: ", result, "to words list");
          words.push(result);
          break;
        } else {
          console.log("word: ", result, " already exists");
        }
      }
    }
    return words;
  }

  private async randomizePhrasalVerbsWithSbdParticle(
    amount: number,
    exclude: WordEntity
  ): Promise<WordEntity[]> {
    return await this.randomizePhrasalVerbsWithParticle("somebody", amount, [exclude.id]);
  }

  private async randomizeRestOfWords(amount: number, excludeWordIds: number[]) {
    console.log("randomizeRestOfWords -> amount: ", amount);
    if (amount <= 0) {
      return [];
    }
    let result: any = await this.wordRepo
      .createQueryBuilder("word")
      .select("COUNT(DISTINCT word.id) as count")
      .where("word.lang = 'en'")
      .getRawOne();
    const allCount = Number.parseInt(result.count);
    const counterOrig = amount;
    let counter = counterOrig;
    const words: WordEntity[] = [];
    while (counter--) {
      while (true) {
        const randomInt = getRandomInt(0, allCount - 1);
        //console.log("randomInt: ", randomInt);
        let result: WordEntity = await this.wordRepo
          .createQueryBuilder("word")
          .select()
          .where("word.lang = 'en'")
          .orderBy("word.id", "ASC")
          .distinct(true)
          .limit(1)
          .offset(randomInt)
          .getOne();
        // console.log("randomInt: ", randomInt);
        //console.log("result: ", result);
        //console.log("words: ", words);
        //console.log("excludeWordIds: ", excludeWordIds);
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

  private async randomizeRestOfPhrasalVerbs(amount: number, excludeWordIds: number[]) {
    console.log("randomizeRestOfPhrasalVerbs -> amount: ", amount);
    console.log("excludeWordIds: ", excludeWordIds);
    if (amount <= 0) {
      return [];
    }
    let result: any = await this.wordRepo
      .createQueryBuilder("word")
      .select("COUNT(DISTINCT word.id) as count")
      .where(`word.isPhrasalVerb = 1`)
      .andWhere("word.lang = 'en'")
      .getRawOne();
    const allCount = Number.parseInt(result.count);
    console.log("allCount: ", allCount);
    const counterOrig = amount;
    let counter = counterOrig;
    const words: WordEntity[] = [];
    while (counter--) {
      while (true) {
        const randomInt = getRandomInt(0, allCount - 1);
        //console.log("randomInt: ", randomInt);
        let result: WordEntity = await this.wordRepo
          .createQueryBuilder("word")
          .select()
          .where(`word.isPhrasalVerb = 1`)
          .andWhere("word.lang = 'en'")
          .orderBy("word.id", "ASC")
          .distinct(true)
          .limit(1)
          .offset(randomInt)
          .getOne();
        // console.log("randomInt: ", randomInt);
        //console.log("result: ", result);
        //console.log("words: ", words);
        //console.log("excludeWordIds: ", excludeWordIds);
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

  private async randomizeLink(level: LevelType, lang: string): Promise<LinkEntity> {
    const resultCount = await this.linkRepo.createQueryBuilder("link")
      .select("COUNT(*) as count")
      .innerJoin("link.word", "word")
      .where("link.level = :level", { level })
      .andWhere("word.lang = :lang", { lang })
      .getRawOne();
    const count = Number.parseInt(resultCount.count);
    let randomInt = getRandomInt(0, count - 1);
    const randomizedLink = await this.linkRepo.createQueryBuilder("link")
      .select()
      .innerJoin("link.word", "word")
      .where("link.level = :level", { level })
      .andWhere("word.lang = :lang", { lang })
      .limit(1)
      .offset(randomInt)
      .getOne();
    const ranomizedLinkWithJoins = (
      await this.linkRepo
        .createQueryBuilder("link")
        .innerJoinAndSelect("link.meaning", "meaning")
        .innerJoinAndSelect("link.word", "word")
        .leftJoinAndSelect("word.wordParticles", "wordParticles")
        .where("meaningId = :meaningId AND wordId = :wordId", {
          meaningId: randomizedLink.meaningId,
          wordId: randomizedLink.wordId
        })
        .getOne()
    );
    return ranomizedLinkWithJoins;
  }

  async randomizeWords(amount: number, category: CategoryType, partOfSpeech: PartOfSpeechType, exclude: WordEntity) {

    let result: any = await this.wordRepo
      .createQueryBuilder("word")
      .select("COUNT(DISTINCT word.id) as count")
      .innerJoin("word.meanings", "links")
      .innerJoin(
        "links.meaning",
        "meaning",
        "meaning.category = :category AND meaning.partOfSpeech = :partOfSpeech", {
          category,
          partOfSpeech
        })
      .where("word.id != :wordId", {
        wordId: exclude.id
      })
      .andWhere("word.lang = 'en'")
      .getRawOne();
    const count = Number.parseInt(result.count);
    const counterOrig = Math.min(amount, count);
    let counter = counterOrig;
    const words: WordEntity[] = [];
    while (counter--) {
      while (true) {
        const randomInt = getRandomInt(0, count - 1);
        let result: any = await this.wordRepo
          .createQueryBuilder("word")
          .select()
          .innerJoin("word.meanings", "links")
          .innerJoin(
            "links.meaning",
            "meaning",
            "meaning.category = :category AND meaning.partOfSpeech = :partOfSpeech", {
              category,
              partOfSpeech
            })
          .where("word.id != :wordId", {
            wordId: exclude.id
          })
          .andWhere("word.lang = 'en'")
          .distinct(true)
          .orderBy("word.id", "ASC")
          .limit(1)
          .offset(randomInt)
          .getOne();
        if (!words.concat([exclude]).map(word => word.id).includes(result.id)) {
          words.push(result);
          break;
        }
      }
    }
    return words;
  }

  public async generateTask2(forGameId: number, level: LevelType): Promise<TaskType> {

    console.log("randomized level: ", level);
    let link: LinkEntity = await this.randomizeLink(level, "en");
    // link = await this.linkRepo
    //   .createQueryBuilder("link")
    //   .select()
    //   .leftJoinAndSelect("link.word", "word")
    //   .leftJoinAndSelect("link.meaning", "meaning")
    //   .leftJoinAndSelect("word.wordParticles", "wordParticles")
    //   .where({
    //     meaningId: 126,
    //     wordId: 250
    //   })
    //   .getOne();
    console.log("link: ", link);
    let wordsToPlay: WordEntity[] = [];
    const totalWordOptions = 8;
    if (link.word.isPhrasalVerb) {
      let wordsWithParticle: WordEntity[] = [];

      // HERE

      function findFirstNonTOParticle(word: WordEntity): string {
        let particles = word.word.split(/ +/);
        const found = particles.find(particle => particle !== "to");
        return found;
      }

      wordsWithParticle =
        await this.randomizePhrasalVerbsWithParticle(
          findFirstNonTOParticle(link.word),
          totalWordOptions - 1,
          [link.word.id]
        );
      console.log("wordsWithParticle: ", wordsWithParticle);
      let rest = await this.randomizeRestOfPhrasalVerbs(
        totalWordOptions - 1 - wordsWithParticle.length,
        [link.word].concat(wordsWithParticle).map(word => word.id)
      );
      console.log("restOfPhrasalVerbs: ", rest);

      function findSomebodyParticle(word: WordEntity) {
        for (let wordParticle of word.wordParticles) {
          if (["someone", "somebody", "sbd"].includes(wordParticle.wordParticle)) {
            return wordParticle.wordParticle;
          }
        }
      }

      if (this.hasSbdParticle(link.word)) {
        rest.forEach((word: WordEntity) => {
          word.word += " " + findSomebodyParticle(link.word);
        });
      }
      wordsToPlay = [link.word, ...rest, ...wordsWithParticle];
    } else {
      let words = await this.randomizeWords(
        totalWordOptions - 1,
        link.meaning.category,
        link.meaning.partOfSpeech,
        link.word
      );
      console.log("WORDS2: ", words);
      let restOfWords = await this.randomizeRestOfWords(
        totalWordOptions - 1 - words.length,
        [link.word].concat(words).map(word => word.id)
      );
      console.log("REST_OF_WORDS2: ", restOfWords);
      wordsToPlay = [link.word, ...words, ...restOfWords];
    }
    const meaning = await this.meaningRepo
      .createQueryBuilder("meaning")
      .leftJoinAndSelect("meaning.words", "links")
      .innerJoinAndSelect("links.word", "word")
      .where({
        id: link.meaning.id
      })
      .getOne();
    const plWord = randomizeElement(
      meaning.words.filter(link => link.word.lang === "pl")
    );

    function shuffle(array) {
      let currentIndex = array.length, randomIndex;
      // While there remain elements to shuffle.
      while (currentIndex != 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
          array[randomIndex], array[currentIndex]];
      }
      return array;
    }

    const ret: TaskType = {
      word: plWord?.word.word,
      word_desc: link.meaning.meaning_lang1_desc,
      meaningId: link.meaning.id,
      wordOptions: shuffle(wordsToPlay.map((word: WordEntity) => {
        return {
          wordId: word.id,
          word: word.word
        };
      }))
    };
    const roomName = createRoomName(forGameId);
    /**
     *
     export type TaskType = {
  word: string;
  word_desc: string;
  meaningId: number;
  wordOptions: {
    wordId: number;
    word: string;
  }[];
};
     */
    this.games[roomName].tasks.push({
      ...ret,
      correctWord: link.word
    });
    return ret;
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
