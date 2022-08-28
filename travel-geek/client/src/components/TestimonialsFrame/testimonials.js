import React from "react";

export default function Testimonials() {
    return (
        <React.Fragment>
            <article>
                <header>
                    <img src={'/img/customers/customer-1.jpeg'}/>
                </header>
                <p>Inexpensive, healthy and great-tasting meals,
                    without even having to order manually!
                    It feels truly magical.</p>
                <footer>Hannah Smith</footer>
            </article>
            <article>
                <header>
                    <img src={'/img/customers/customer-3.jpeg'}/>
                </header>
                <p>Inexpensive, healthy and great-tasting meals,
                    without even having to order manually!
                    It feels truly magical.</p>
                <footer>Dave Doe</footer>
            </article>
            <article>
                <header>
                    <img src={'/img/customers/customer-2.jpeg'}/>
                </header>
                <p>Inexpensive, healthy and great-tasting meals,
                    without even having to order manually!
                    It feels truly magical.</p>
                <footer>Jack Stone</footer>
            </article>
            <article>
                <header>
                    <img src={'/img/customers/customer-4.jpeg'}/>
                </header>
                <p>Inexpensive, healthy and great-tasting meals,
                    without even having to order manually!
                    It feels truly magical.</p>
                <footer>Jack Stone</footer>
            </article>
        </React.Fragment>
    )
}