type ReadOnly<Type> = {
    +readonly [Property in keyof Type]: Type[Property]
}

type Car = {
    engine: string,
    gears: number
}

type NewType = ReadOnly<Car>;

type Getters<Type> = {
    [Prop in keyof Type as `get${Capitalize<string & Prop>}`]: () => Type[Prop];
}

type Setters<Type> = {
    [Prop in keyof Type as `set${Capitalize<string & Prop>}`]: (obj: Type[Prop]) => void;
}

type GetAndSet<T> = Getters<T> & Setters<T> & T;

class ICar implements GetAndSet<Car> {
    engine: string;
    gears: number;

    constructor() {
        this.engine = '';
        this.gears = 0;
    }

    getEngine(): string {
        return this.engine;
    }

    getGears(): number {
        return this.gears;
    }

    setEngine(str: string): void {
        this.engine = str;
    }

    setGears(gears: number): void {
        this.gears = gears;
    }
}
