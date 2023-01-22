import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { TaskType } from "./task.type";
import GameService from "../game/game-service";
import WordConverter from "../word/word.converter";
import { GraphQLBoolean, GraphQLInt } from "graphql";
import { WordType } from "../word/word.type";
import { randomizeElement } from "../game/utils";

@Resolver(of => TaskType)
export class SinglePlayerGameResolver {

  constructor(
    private gameService: GameService
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
    let task = await this.gameService.generateTask2(randomizeElement(level.split(",")));
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
      console.log("wrond answer");
      return task.correctWord;
    }
    /**
     * TODO: move nativeLang 'pl' to .env
     */

  }

  playersTasks: Record<number, {
    task: TaskType
  }> = {};

  public async getCorrectWordInTask(playerId: number, taskId: number): Promise<WordType> {
    const playerTasks = this.playersTasks[playerId];
    // const task: TaskType & { correctWord: WordType } =
    //   this.games[roomName].tasks[this.games[roomName].tasks.length - 1];
    const task = playerTasks.task;
    return task.correctWord;
  }
}
