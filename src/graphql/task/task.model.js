"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.TaskModel = void 0;
var graphql_1 = require("@nestjs/graphql");
var task_options_model_1 = require("./task-options.model");
//import { Post } from './post';
var TaskModel = /** @class */ (function () {
    function TaskModel() {
    }
    __decorate([
        (0, graphql_1.Field)(function (type) { return graphql_1.Int; })
    ], TaskModel.prototype, "id");
    __decorate([
        (0, graphql_1.Field)({ nullable: false })
    ], TaskModel.prototype, "name");
    __decorate([
        (0, graphql_1.Field)({ nullable: false })
    ], TaskModel.prototype, "correct");
    __decorate([
        (0, graphql_1.Field)(function (type) { return [task_options_model_1.TaskOptionsModel]; })
    ], TaskModel.prototype, "options");
    TaskModel = __decorate([
        (0, graphql_1.ObjectType)()
    ], TaskModel);
    return TaskModel;
}());
exports.TaskModel = TaskModel;
