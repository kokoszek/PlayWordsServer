/**
 * key notes of 'keyof'
 *
 * key of takes an interface / type as argument and produces a union based on all keys:
 *
 * e.g. for below Point -> keyof Point produces 'x' | 'y' union.
 */
type Point = {
    x: number,
    y: number
}

type P = keyof Point;

let p: P = 'x';
// let p: P = 'a'; // ERROR
