const roomPrefix = 'gameRoom_';

export function createRoomName(gameId: number) {
  return roomPrefix + gameId;
}
