"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.WordEntity = void 0;
var typeorm_1 = require("typeorm");
var meaning_entity_1 = require("../meaning/meaning.entity");
var WordEntity = /** @class */ (function () {
    function WordEntity() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)()
    ], WordEntity.prototype, "id");
    __decorate([
        (0, typeorm_1.Column)()
    ], WordEntity.prototype, "word");
    __decorate([
        (0, typeorm_1.Column)({
            nullable: true
        })
    ], WordEntity.prototype, "desc");
    __decorate([
        (0, typeorm_1.Column)()
    ], WordEntity.prototype, "lang");
    __decorate([
        (0, typeorm_1.Column)()
    ], WordEntity.prototype, "freq");
    __decorate([
        (0, typeorm_1.Column)({
            nullable: true,
            "default": ''
        })
    ], WordEntity.prototype, "origin");
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return meaning_entity_1.MeaningEntity; }, function (meaning) { return meaning.words; })
    ], WordEntity.prototype, "meaning");
    WordEntity = __decorate([
        (0, typeorm_1.Entity)()
    ], WordEntity);
    return WordEntity;
}());
exports.WordEntity = WordEntity;
