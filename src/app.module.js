"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppModule = void 0;
var common_1 = require("@nestjs/common");
var app_controller_1 = require("./app.controller");
var app_service_1 = require("./app.service");
var graphql_1 = require("@nestjs/graphql");
var apollo_1 = require("@nestjs/apollo");
var task_module_1 = require("./graphql/task/task.module");
var producer_module_1 = require("./as-producer/producer.module");
var game_service_module_1 = require("./game/game-service.module");
var typeorm_1 = require("@nestjs/typeorm");
var word_module_1 = require("./word/word.module");
var ormconfig = require("../ormconfig");
var meaning_module_1 = require("./meaning/meaning.module");
var path = require('path');
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        (0, common_1.Module)({
            imports: [
                word_module_1.WordModule,
                meaning_module_1.MeaningModule,
                typeorm_1.TypeOrmModule.forRoot(ormconfig),
                task_module_1.TaskModule,
                producer_module_1.ProducerModule,
                game_service_module_1.WsModule,
                graphql_1.GraphQLModule.forRoot({
                    driver: apollo_1.ApolloDriver,
                    autoSchemaFile: path.join(process.cwd(), 'src/graphql/schema.gql'),
                    sortSchema: true,
                    // subscriptions: {
                    //   'graphql-ws': true
                    // },
                    debug: true
                }),
            ],
            controllers: [app_controller_1.AppController],
            providers: [app_service_1.AppService]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
