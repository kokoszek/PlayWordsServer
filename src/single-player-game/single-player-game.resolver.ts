import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { TaskType } from "./task.type";
import GameService from "../game/game-service";
import WordConverter from "../word/word.converter";
import { GraphQLBoolean, GraphQLInt } from "graphql";
import { WordType } from "../word/word.type";
import { randomizeElement } from "../game/utils";
import { EncounteredWordEntity } from "./encountered-word.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { LinkEntity } from "../meaning/link.entity";

@Resolver(of => TaskType)
export class SinglePlayerGameResolver {

  constructor(
    private gameService: GameService,
    @InjectRepository(EncounteredWordEntity)
    private encounteredWordEntityRepository: Repository<EncounteredWordEntity>
  ) {
  }

  @Query(returns => TaskType, {
    nullable: true
  })
  async generateTask(
    @Args("level", { type: () => String }) level: string,
    @Args("playerId", { type: () => GraphQLInt }) playerId: string
  ): Promise<TaskType> {
    console.log("level: ", level);
    console.log("playerId: ", playerId);
    const link: LinkEntity = await this.gameService.randomizeLink(
        randomizeElement(level.split(',')),
        'en');
    // const enc: EncounteredWordEntity = await this.encounteredWordEntityRepository
    //   .createQueryBuilder("enc")
    //   .innerJoinAndSelect("enc.link", "link")
    //   .leftJoinAndSelect("link.word", "word")
    //   .leftJoinAndSelect("link.meaning", "meaning")
    //   .leftJoinAndSelect("word.wordParticles", "wordParticles")
    //   .where({
    //     playerId: Number.parseInt(playerId)
    //   })
    //   .getOne();
    // await this.encounteredWordEntityRepository.delete({
    //   playerId: Number.parseInt(playerId),
    //   linkWordId: enc.linkWordId,
    //   linkMeaningId: enc.linkMeaningId
    // });
    let task = await this.gameService.generateTask2(link);
    //let task = await this.gameService.generateTask2(enc.link);
    // const encounteredWord = await this.encounteredWordEntityRepository
    //   .createQueryBuilder("enc")
    //   .where({
    //     playerId: Number.parseInt(playerId),
    //     linkWordId: task.link.wordId,
    //     linkMeaningId: task.link.meaningId
    //   })
    //   .getOne();
    // if (!encounteredWord) {
    //   const encountered = this.encounteredWordEntityRepository.create({
    //     playerId: Number.parseInt(playerId),
    //     link: task.link
    //   });
    //   await this.encounteredWordEntityRepository.save(encountered);
    // }
    console.log("--------", task);
    if (!this.playersTasks[playerId]) {
      this.playersTasks[playerId] = { task: null };
    }
    this.playersTasks[playerId].task = task;
    //console.log("playersTasks: ", this.playersTasks);
    return {
      ...task,
      correctWord: task.correctWord,
      wordOptions: task.wordOptions
    };
  }

  /**
   *
   mutation SubmitTask($playerId: Int!, $meaningId: Int!, $wordIdSolution: Int!) {
        submitTask(playerId: $playerId, meaningId: $meaningId, wordIdSolution: $wordIdSolution)
    }
   */
  @Mutation(returns => WordType, {
    nullable: true
  })
  async submitTask(
    @Args({ name: "playerId", type: () => GraphQLInt }) playerId: number,
    @Args({ name: "meaningId", type: () => GraphQLInt }) meaningId: number,
    @Args({ name: "wordIdSolution", type: () => GraphQLInt }) wordIdSolution: number
  ): Promise<WordType> {

    // let task = this.playersTasks[playerId];
    // console.log("task: ", task);
    const task = this.playersTasks[playerId].task;
    if (task.correctWord.id === wordIdSolution) {
      console.log("good answer");
      return null;
    } else {
      console.log("wrong answer");
      // const encounteredWord = await this.encounteredWordEntityRepository
      //   .createQueryBuilder("enc")
      //   .where({
      //     playerId: playerId,
      //     linkWordId: task.link.wordId,
      //     linkMeaningId: task.link.meaningId
      //   })
      //   .getOne();
      // encounteredWord.misses += 1;
      // await this.encounteredWordEntityRepository.save(encounteredWord);
      return task.correctWord;
    }
    /**
     * TODO: move nativeLang 'pl' to .env
     */

  }

  playersTasks: Record<number, {
    task: TaskType & { link: LinkEntity }
  }> = {};

  public async getCorrectWordInTask(playerId: number, taskId: number): Promise<WordType> {
    const playerTasks = this.playersTasks[playerId];
    // const task: TaskType & { correctWord: WordType } =
    //   this.games[roomName].tasks[this.games[roomName].tasks.length - 1];
    const task = playerTasks.task;
    return task.correctWord;
  }
}
