
type Person = {
    age: number,
    name: string,
    alive: boolean
}

type PersonAge = Person['age'];

let age: PersonAge = 123_000;

type Type1 = Person['age' | 'name'];

let type1: Type1 = '123';

type Type2 = Person[keyof Person];

const obj = {
    name: "josh",
    age: 25
}

type ObjType =