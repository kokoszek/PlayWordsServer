import React from 'react';
import './cta.scss';
import { Fragment } from 'react';

export default function CallToAction(props) {
    return (
        <section className='call-to-action'>
            <section className='form container'>
                <form className='cta-form'>
                    <h1>Show off your trip story!</h1>
                    <div className='first-block'>
                        <input type='text' placeholder='Name'/>
                        <input type='text' placeholder='Company Name'/>
                        <input type='text' placeholder='Job Title'/>
                    </div>
                    <div className='second-block'>
                        <input type='text' placeholder='Work Email Address'/>
                        <input type='text' placeholder='Phone Number'/>
                        <div>
                            <button className='submit' type='submit'>Submit</button>
                        </div>
                    </div>
                    <div className='cta-bg'></div>
                </form>
            </section>
        </section>
    )
}