/**
 * moje notatki o generatorach:
 * jak działa next.
 * pierwszy wywołany next() zaczyna na początku funkcji - NIE zaczyna od pierwszego yield, tylko
 * od na samym początku funkcji.
 * pierwszy wywołany next() kończy swoją egzekucję, jak napotka pierwszy yield.
 * Ten sam pierwszy wywyłany next() zwróci to co 'wypluje' pierwszy yield na końcu. czyli reasumując
 *
 * droga pierwszego let a = next()
 * start ------> 1st `let k = yield '1'`. '1' zostanie przypisany do 'a'.
 * następnie wywołujemy drugi next('abc');
 * let k = 1st yield ---  w 'k' mamy string 'abc' ---> 2nd yield
 *
 * wyjaśniając: gdy wywołujemy next('abc') z argumentem 'abc', argument ten
 * jest dostępny przy starcie od pierwszego let k = yield w zmiennej yield.
 *
 * warto zwrócić uwagę, że skoro pierwsze wywołanie next() nie ma żadnego yield ( bo zaczynamy od początku
 * funkcji )
 * więc nie mamy dostępu do zmiennej argumentu tego next('a') - w tym przypadku
 *
 * notatki w 'notable' teź masz.
 */

const gen = function* inc() { // start first next('one')
    console.log('step 1');
    let k = yield '1';
    console.log('k: ', k);
    console.log('step 2');
    const a = yield '2';
    console.log('step 3');
    console.log('a: ', a);
}

let g = gen();

console.log('step a');
const next = g.next('one');
console.log('next1: ', next);
let p = g.next('two');
console.log('step b', p);

console.log('next2: ', g.next());
console.log('next3: ', g.next('c string'));
