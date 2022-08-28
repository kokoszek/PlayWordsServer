import React from 'react';
import '../_app.scss';
import './header.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas, faGlobeAfrica } from '@fortawesome/free-solid-svg-icons';
import { far, faFontAwesome } from '@fortawesome/free-regular-svg-icons';
import {useContext, useEffect} from "react";
import {AuthContext} from "../../contexts/auth-context";

import axios from '../../axios';

library.add(fas, far, faFontAwesome)

let stickyInvoked = false;

function htmlHeaderHandler() {

    const featuredInSection = document.querySelector('.featured-in-section');
    const headerContainer = document.querySelector('.header-root-container');
    console.log('headerContainer: ', headerContainer);
    const obs = new IntersectionObserver(
        function (entries) {
            const ent = entries[0];
            if (ent.isIntersecting == false) {
                headerContainer.classList.add("sticky");
            }
            if (ent.isIntersecting == true) {
                headerContainer.classList.remove("sticky");
            }
        },
        {
            // In the viewport
            root: null,
            threshold: 0,
            rootMargin: "0px",
        }
    );
    obs.observe(featuredInSection);
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}

export default function Header(props) {

    useEffect(() => {
        if(stickyInvoked) {
            return;
        }
        stickyInvoked = true;
        //htmlHeaderHandler();
    }, []);

    return (
        <div className='header-root-container'>
            <div className='header-logo'>
                <FontAwesomeIcon icon="earth" />
                <span>TravelGeek</span>
            </div>
            <nav className='navigation'>
                <button className='btn-nav' onClick={() => {
                    props.onNavToggle();
                }}>
                    <FontAwesomeIcon icon="fa-solid fa-bars" name='nav-bars'/>
                    <FontAwesomeIcon icon="fa-solid fa-xmark" name='nav-cancel'/>
                </button>
                <ul>
                    <li><a href='#blogs-frame'>Blogs</a></li>
                    <li><a href='#blogs-frame'>Featured in</a></li>
                    <li><a href='#blogs-frame'>Subscribe</a></li>
                    <li><AuthComponent /></li>
                </ul>
            </nav>
        </div>
    );
}

function AuthComponent() {
    useEffect(() => {
        axios.get('/auth/current_user')
            .then(response => {
                console.log('response_: ', response);
                authCtx.setState({
                    user: response.data
                })
            })
    }, []);
    const authCtx = useContext(AuthContext);
    return (
        <div className='auth-container'>
            {
                authCtx.state.user ? (
                    <div className='user-info'>
                        <span>{ authCtx.state.user.googleProfile.displayName }</span>
                        <img src={authCtx.state.user.googleProfile.pictureUrl} />
                    </div>
                ) : <a href='/auth/google'>
                    Sign In
                    <FontAwesomeIcon icon="fa-solid fa-user" />
                </a>
            }
        </div>
    );
}
