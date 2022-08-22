"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.WsModule = void 0;
var common_1 = require("@nestjs/common");
var game_gateway_ws_1 = require("./game-gateway-ws");
var find_match_resolver_1 = require("./find-match.resolver");
var game_service_1 = require("./game-service");
var typeorm_1 = require("@nestjs/typeorm");
var meaning_entity_1 = require("../meaning/meaning.entity");
var WsModule = /** @class */ (function () {
    function WsModule() {
    }
    WsModule = __decorate([
        (0, common_1.Module)({
            imports: [
                typeorm_1.TypeOrmModule.forFeature([
                    meaning_entity_1.MeaningEntity
                ])
            ],
            providers: [game_gateway_ws_1["default"], find_match_resolver_1.FindMatchResolver, game_service_1["default"]]
        })
    ], WsModule);
    return WsModule;
}());
exports.WsModule = WsModule;
