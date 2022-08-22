"use strict";
exports.__esModule = true;
exports.createRoomName = void 0;
var roomPrefix = 'gameRoom_';
function createRoomName(gameId) {
    return roomPrefix + gameId;
}
exports.createRoomName = createRoomName;
