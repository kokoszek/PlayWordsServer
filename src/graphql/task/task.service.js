"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.TaskService = void 0;
var common_1 = require("@nestjs/common");
var TaskService = /** @class */ (function () {
    function TaskService() {
        this.tasks = [
            {
                id: 1,
                name: 'pies',
                correct: 'dog',
                options: [
                    { id: 2, name: 'dog' },
                    { id: 3, name: 'cat' },
                    { id: 4, name: 'mouse' },
                ]
            },
            {
                id: 2,
                name: 'dziedzictwo',
                correct: 'heritage',
                options: [
                    { id: 2, name: 'heir' },
                    { id: 3, name: 'heritage' },
                    { id: 4, name: 'kingdom' },
                ]
            },
            {
                id: 3,
                name: 'ośmornica',
                correct: 'octopus',
                options: [
                    { id: 2, name: 'jelly-fish' },
                    { id: 3, name: 'tiger' },
                    { id: 4, name: 'octopus' },
                ]
            },
        ];
    }
    TaskService.prototype.randomizeTask = function () {
        function randomNumber(min, max) {
            return Math.floor(Math.random() * (max - min) + min);
        }
        var num = randomNumber(0, 3);
        var task = this.tasks[num];
        console.log('number: ', num);
        console.log('task: ', task);
        return Promise.resolve(task);
    };
    TaskService.prototype.submitTask = function (taskId, answer) {
        var _a;
        return !!(((_a = this.tasks.find(function (t) { return t.id === taskId; })) === null || _a === void 0 ? void 0 : _a.correct) === answer);
    };
    TaskService = __decorate([
        (0, common_1.Injectable)()
    ], TaskService);
    return TaskService;
}());
exports.TaskService = TaskService;
