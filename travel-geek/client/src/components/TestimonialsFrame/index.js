import React from 'react';

import './blogs-frame.scss';
import {useState} from "react";
import BlogList from './BlogList/BlogList.component';
import Testimonials from "./testimonials";

export default function BlogsFrame(props) {
    const [activeTab, setActiveTab] = useState('recent');

    return (
        <section id='testimonials-frame' className='blogs-frame'>
            <section className='testimonials-section'>
                <Testimonials/>
            </section>
            <section className='blog-list-section'>
                <BlogList />
            </section>
        </section>
    );
}