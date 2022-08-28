import React from 'react';
import './blog-card.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {useState} from "react";

export default function BlogCard(props) {
    const { blog } = props;

    const [hovered, setHovered] = useState(false);
    return (
        <article key={blog._id} className='blog-card' onClick={() => {
            console.log(blog);
        }}>
            <div
                onMouseEnter={() => {
                    setHovered(true);
                }}
                onMouseLeave={() => {
                    setHovered(false);
                }}
                className='blog-card-bg-img'
                style={{backgroundImage: "url(\"" + blog.url + "" + "\")"}}
            >
                <div className={'blog-card-content ' + (hovered ? 'hovered' : '')}>
                    <div className={'blog-card-content-inner'}>
                        {
                            blog.title
                        }
                    </div>
                </div>
            </div>
            {/*<header>{blog.title}</header>*/}
            {/*<section>*/}
            {/*    <StarRate avgRate={blog.avgRate} rateCount={blog.rateCount}/>*/}
            {/*</section>*/}
        </article>
    );
}

function StarRate({ avgRate = 0, rateCount}) {

    return (
        <div>
            {
                [...Array(avgRate)].map((_, idx) => <span key={idx + ''} className="fa fa-star checked"></span>)
            }
            {
                [...Array(5 - avgRate)].map((_, idx) => <span key={(idx * -1) + ''} className="fa fa-star"></span>)
            }
            <span key='last' className='rate-count'>({rateCount})</span>
        </div>
    );

}