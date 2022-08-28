function f1(arg: { a: number; b: string }, arg2: string, arg3: string): void {
    console.log('this is f1');
}

type T0 = Parameters<typeof f1>;

function f2(args: T0) {
    console.log(args);
}

f2([{a: 2, b: 'asdfg'}, 'jacek', '2']);