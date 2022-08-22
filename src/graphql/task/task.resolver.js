"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
exports.__esModule = true;
exports.TaskResolver = void 0;
var graphql_1 = require("@nestjs/graphql");
var task_model_1 = require("./task.model");
var graphql_2 = require("graphql");
var TaskResolver = /** @class */ (function () {
    function TaskResolver(taskService) {
        this.taskService = taskService;
    }
    TaskResolver.prototype.getTask = function () {
        console.log('randomize task');
        return this.taskService.randomizeTask();
    };
    TaskResolver.prototype.submitTask = function (taskId, answer) {
        console.log('taskId: ', taskId);
        console.log('answer: ', answer);
        return this.taskService.submitTask(taskId, answer);
        //return answer === 'dog';
    };
    __decorate([
        (0, graphql_1.Query)(function () { return task_model_1.TaskModel; })
    ], TaskResolver.prototype, "getTask");
    __decorate([
        (0, graphql_1.Mutation)(function (returns) { return Boolean; }),
        __param(0, (0, graphql_1.Args)({ name: 'taskId', type: function () { return graphql_2.GraphQLInt; } })),
        __param(1, (0, graphql_1.Args)({ name: 'answer', type: function () { return graphql_2.GraphQLString; } }))
    ], TaskResolver.prototype, "submitTask");
    TaskResolver = __decorate([
        (0, graphql_1.Resolver)(function (of) { return task_model_1.TaskModel; })
    ], TaskResolver);
    return TaskResolver;
}());
exports.TaskResolver = TaskResolver;
