import React, { useRef } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import BlogsFrame from "../index";
import axios from "axios";

import { GET_BLOGS } from "./BlogList.component";

import { MockedProvider } from "@apollo/client/testing";
import { faker } from "@faker-js/faker";

let idCounter = 1;

const NumberDisplay = ({ number }) => {

  console.log("idCounter: ", idCounter);
  const id = useRef(idCounter++); // to ensure we don't remount a different instance

  return (
    <div>
      <span data-testid="number-display">{number}</span>
      <span data-testid="instance-id">{id.current}</span>
    </div>
  );
};

function genBlogs() {
  function random(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  let blogs = [
    {
      url: "/img/blog_images/blog-1.jpeg"
    }, {
      url: "/img/blog_images/blog-2.jpeg"
    }, {
      url: "/img/blog_images/blog-3.jpeg"
    }, {
      url: "/img/blog_images/blog-4.jpeg"
    }, {
      url: "/img/blog_images/blog-5.jpeg"
    }, {
      url: "/img/blog_images/blog-6.jpeg"
    }, {
      url: "/img/blog_images/blog-7.jpeg"
    }, {
      url: "/img/blog_images/blog-8.jpeg"
    }, {
      url: "/img/blog_images/blog-9.jpeg"
    }, {
      url: "/img/blog_images/blog-10.jpeg"
    }, {
      url: "/img/blog_images/blog-11.jpeg"
    }, {
      url: "/img/blog_images/blog-12.jpeg"
    }, {
      url: "/img/blog_images/blog-13.jpeg"
    }, {
      url: "/img/blog_images/blog-14.jpeg"
    }, {
      url: "/img/blog_images/blog-15.jpeg"
    }, {
      url: "/img/blog_images/blog-16.jpeg"
    }];
  let i = 1;
  blogs.forEach((blog: any) => {
    blog.title = faker.lorem.sentence(3).slice(0, -1);
    blog.content = faker.lorem.paragraph(random(2, 3));
    blog.avgRate = random(3, 5);
    blog.rateCount = random(2000, 150000);
    blog._id = ++i + "";
  });
  return blogs;
}

jest.mock("axios", () => {
  //const originalAxios = jest.requireActual('axios');
  return {
    __esModule: true,
    //...originalAxios,
    default: {
      get: jest.fn()
    }
  };
});

test("calling render with the same component on the same container does not remount", async () => {

  (axios.get as jest.Mock).mockImplementation(() => Promise.resolve(["this is mocked value"]));

  // const help = jest.fn();
  // help.mockReturnValue()

  // jest.spyOn(axios, 'get').mockResolvedValue(
  //     jest.fn().mockResolvedValue({
  //         data: ['some data tralala!']
  //     })
  // );

  let blogs = genBlogs();
  const mocks = [
    {
      request: {
        query: GET_BLOGS
      },
      result: () => {
        return {
          data: {
            blogs
          }
        };
      }
    }
  ];

  const { rerender, container } = render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <BlogsFrame />
    </MockedProvider>
  );
  const blogListContainer = screen.getByTestId("blog-list");
  //const blogListContainer = screen.getByText('BlogList');
  let i = 0;
  await waitFor(() => {
    expect(blogListContainer.children.length).toBe(blogs.length);
  });

  // re-render the same component with different props
  // rerender(<NumberDisplay number={2} />)
  // expect(screen.getByTestId('number-display')).toHaveTextContent('2')
  //
  // expect(screen.getByTestId('instance-id')).toHaveTextContent('1')
});
