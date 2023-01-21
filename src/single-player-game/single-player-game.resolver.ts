import { Args, Query, Resolver } from "@nestjs/graphql";
import { TaskType } from "./task.type";
import GameService from "../game/game-service";
import WordConverter from "../word/word.converter";

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
    let task = await this.gameService.generateTask2("A1");
    console.log("--------", task);
    return {
      ...task,
      correctWord: task.correctWord,
      wordOptions: task.wordOptions
    };
  }
}
