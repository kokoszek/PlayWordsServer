"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.MeaningEntity = void 0;
var typeorm_1 = require("typeorm");
var word_entity_1 = require("../word/word.entity");
var graphql_1 = require("@nestjs/graphql");
var graphql_2 = require("graphql");
var MeaningEntity = /** @class */ (function () {
    function MeaningEntity() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        (0, graphql_1.Field)(function (type) { return graphql_2.GraphQLInt; })
    ], MeaningEntity.prototype, "id");
    __decorate([
        (0, typeorm_1.Column)(),
        (0, graphql_1.Field)(function (type) { return graphql_2.GraphQLString; })
    ], MeaningEntity.prototype, "meaning");
    __decorate([
        (0, typeorm_1.Column)(),
        (0, graphql_1.Field)(function (type) { return graphql_2.GraphQLString; })
    ], MeaningEntity.prototype, "partOfSpeech");
    __decorate([
        (0, typeorm_1.Column)({
            nullable: false,
            "default": 'common'
        }),
        (0, graphql_1.Field)(function (type) { return graphql_2.GraphQLString; })
    ], MeaningEntity.prototype, "category");
    __decorate([
        (0, typeorm_1.Column)(),
        (0, graphql_1.Field)(function (type) { return graphql_2.GraphQLString; })
    ], MeaningEntity.prototype, "meaning_lang");
    __decorate([
        (0, typeorm_1.Column)({
            nullable: false
        }),
        (0, graphql_1.Field)(function (type) { return graphql_2.GraphQLString; })
    ], MeaningEntity.prototype, "level");
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return word_entity_1.WordEntity; }, function (meaning) { return meaning.meaning; }),
        (0, graphql_1.Field)(function (type) { return [word_entity_1.WordEntity]; })
    ], MeaningEntity.prototype, "words");
    MeaningEntity = __decorate([
        (0, typeorm_1.Entity)(),
        (0, graphql_1.ObjectType)()
    ], MeaningEntity);
    return MeaningEntity;
}());
exports.MeaningEntity = MeaningEntity;
