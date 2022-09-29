const roomPrefix = "gameRoom_";

export function createRoomName(gameId: number) {
  return roomPrefix + gameId;
}

export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomizeElement<T>(arr: T[]): T | null {
  if (arr.length === 0) {
    return null;
  }
  return arr[getRandomInt(0, arr.length - 1)];
}

export function getRandomIntExcept(min: number, max: number, except: number[]) {
  while (true) {
    min = Math.ceil(min);
    max = Math.floor(max);
    const result = Math.floor(Math.random() * (max - min + 1)) + min;
    if (!except.includes(result)) {
      return result;
    }
  }
}
