import React, {useEffect} from 'react';
import BlogCard from "./BlogCard";
import {gql, useQuery} from "@apollo/client";
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './BlogList.component.styles.scss';

export const GET_BLOGS = gql`
    query Blogs {
        blogs {
            _id,
            title,
            content,
            url,
            avgRate,
            rateCount
        }
    }
`;

export default function BlogList(props) {
    const result = useQuery(GET_BLOGS);
    //let result = {};
    const swapi = 'https://swapi.dev/api/people';
    useEffect(() => {

    }, []);
    let blogs = (result.data || {}).blogs || [];
    return (
        <div data-testid='blog-list' className='blog-list'>
            {
                blogs.map(blog => {
                    return <BlogCard key={blog._id} blog={blog}/>
                })
            }
        </div>
    );
}