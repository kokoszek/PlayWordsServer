import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { TaskType } from "./task.type";
import GameService from "../game/game-service";
import WordConverter from "../word/word.converter";
import { GraphQLBoolean, GraphQLInt } from "graphql";

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
    //@Args("level", { type: () => String }) lang: string
  ): Promise<TaskType> {
    let task = await this.gameService.generateTask2("C2");
    console.log("--------", task);
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
  @Mutation(returns => GraphQLBoolean)
  async submitTask(
    @Args({ name: "playerId", type: () => GraphQLInt }) playerId: number,
    @Args({ name: "meaningId", type: () => GraphQLInt }) meaningId: number,
    @Args({ name: "wordIdSolution", type: () => GraphQLInt }) wordIdSolution: number
  ): Promise<boolean> {
    /**
     * TODO: move nativeLang 'pl' to .env
     */
    return this.gameService.checkTaskSolution(meaningId, wordIdSolution, "pl");
  }
}
