import { Injectable } from "@nestjs/common";
import { TaskModel } from "./task.model";

@Injectable()
export class TaskService {

  private tasks: TaskModel[] = [
    {
      id: 1,
      name: "pies",
      correct: "dog",
      options: [
        { id: 2, name: "dog" },
        { id: 3, name: "cat" },
        { id: 4, name: "mouse" }
      ]
    },
    {
      id: 2,
      name: "dziedzictwo",
      correct: "heritage",
      options: [
        { id: 2, name: "heir" },
        { id: 3, name: "heritage" },
        { id: 4, name: "kingdom" }
      ]
    },
    {
      id: 3,
      name: "ośmornica",
      correct: "octopus",
      options: [
        { id: 2, name: "jelly-fish" },
        { id: 3, name: "tiger" },
        { id: 4, name: "octopus" }
      ]
    }
  ];

  randomizeTask(): Promise<TaskModel> {
    function randomNumber(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    }

    let num = randomNumber(0, 3);
    let task = this.tasks[num];
    console.log("number: ", num);
    console.log("task: ", task);
    return Promise.resolve(task);
  }

  submitTask(taskId: number, answer: string): boolean {
    return !!(this.tasks.find(t => t.id === taskId)?.correct === answer);
  }
}
