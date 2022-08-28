
import './subscribe-frame.scss';
import React from "react";
//
// function MyPromise(fn) {
//
//     fn(this.resolve.bind(this), this.reject.bind(this));
// }
//
// MyPromise.prototype.resolve = function(result) {
//     this.result =  result;
//     let thenResult = this.thenFn(result);
//     if(thenResult.constructor && thenResult.constructor.name === 'MyPromise') { // if MyPromise
//
//     } else { // if primitive type
//         let prom
//     }
// }
//
// MyPromise.prototype.reject = function() {
//
// }
//
// MyPromise.prototype.then = function(fn) {
//     this.thenFn = fn;
//     this.nextThenPromiseConstructorFn = (resolve, reject) => {
//
//     };
//     this.nextThenPromise = new MyPromise(this.nextThenPromiseConstructorFn);
//     return this.nextThenPromise;
// }
//
// new MyPromise((resolve, reject) => {
//     setTimeout(() => {
//         resolve('yes');
//     }, 5000);
// }).then(result => {
//     console.log('then: ', result);
//     return 5;
// }).then(result  => {
//     console.log('then2: ', result);
// });
//
export default function SubscribeFrame(props) {
    return (
        <section className={'subscribe-frame'}>
            <header>
                <h1>Travel</h1>
                <h2>and expand your</h2>
                <h2>horizons</h2>
            </header>
            <form autoComplete='off'>
                <input autoComplete='false' name="hidden" type="text" style={{display:"none"}}/>
                <input id='email-input' placeholder='email'/>
                <div className='subscribe-button-wrapper'>
                    <button className='subscribe-button' type='submit'>Subscribe now!</button>
                </div>
            </form>
            <p>Over <span className='highlight-text'>20,000+</span> bloggers publishing their trips !</p>
            <ul>
                <li>
                    <img src='/img/customers/customer-1.jpeg'/>
                    <img src='/img/customers/customer-2.jpeg'/>
                    <img src='/img/customers/customer-3.jpeg'/>
                    <img src='/img/customers/customer-4.jpeg'/>
                    <img src='/img/customers/customer-5.jpeg'/>
                    <img src='/img/customers/customer-6.jpeg'/>
                </li>
            </ul>
        </section>
    );
}