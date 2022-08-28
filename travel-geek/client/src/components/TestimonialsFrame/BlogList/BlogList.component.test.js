"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_2 = require("@testing-library/react");
require("@testing-library/jest-dom/extend-expect");
var axios_1 = require("axios");
var BlogList_component_1 = require("./BlogList.component");
var faker_1 = require("@faker-js/faker");
var idCounter = 1;
var NumberDisplay = function (_a) {
    var number = _a.number;
    console.log('idCounter: ', idCounter);
    var id = react_1.useRef(idCounter++); // to ensure we don't remount a different instance
    return (data - testid) = "number-display" > { number: number } < /span>
        < span;
    data - testid;
    "instance-id" > { id: id, : .current } < /span>
        < /div>;
};
function genBlogs() {
    function random(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    var blogs = [
        { url: '/img/blog_images/blog-1.jpeg',
        }, { url: '/img/blog_images/blog-2.jpeg',
        }, { url: '/img/blog_images/blog-3.jpeg',
        }, { url: '/img/blog_images/blog-4.jpeg',
        }, { url: '/img/blog_images/blog-5.jpeg',
        }, { url: '/img/blog_images/blog-6.jpeg',
        }, { url: '/img/blog_images/blog-7.jpeg',
        }, { url: '/img/blog_images/blog-8.jpeg',
        }, { url: '/img/blog_images/blog-9.jpeg',
        }, { url: '/img/blog_images/blog-10.jpeg',
        }, { url: '/img/blog_images/blog-11.jpeg',
        }, { url: '/img/blog_images/blog-12.jpeg',
        }, { url: '/img/blog_images/blog-13.jpeg',
        }, { url: '/img/blog_images/blog-14.jpeg',
        }, { url: '/img/blog_images/blog-15.jpeg',
        }, { url: '/img/blog_images/blog-16.jpeg',
        }
    ];
    var i = 1;
    blogs.forEach(function (blog) {
        blog.title = faker_1.faker.lorem.sentence(3).slice(0, -1);
        blog.content = faker_1.faker.lorem.paragraph(random(2, 3));
        blog.avgRate = random(3, 5);
        blog.rateCount = random(2000, 150000);
        blog._id = ++i + '';
    });
    return blogs;
}
jest.mock('axios', function () {
    //const originalAxios = jest.requireActual('axios');
    return {
        __esModule: true,
        //...originalAxios,
        default: {
            get: jest.fn()
        },
    };
});
test('calling render with the same component on the same container does not remount', function () { return __awaiter(void 0, void 0, void 0, function () {
    var blogs, mocks, _a, rerender, container, blogListContainer, i;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                axios_1.default.get.mockImplementation(function () { return Promise.resolve(['this is mocked value']); });
                blogs = genBlogs();
                mocks = [
                    {
                        request: {
                            query: BlogList_component_1.GET_BLOGS,
                        },
                        result: function () {
                            return {
                                data: {
                                    blogs: blogs
                                }
                            };
                        }
                    }
                ];
                _a = react_2.render(mocks, { mocks: mocks }, addTypename = { false:  } >
                    />
                    < /MockedProvider>), rerender = _a.rerender, container = _a.container;
                blogListContainer = react_2.screen.getByTestId('blog-list');
                i = 0;
                return [4 /*yield*/, react_2.waitFor(function () {
                        expect(blogListContainer.children.length).toBe(blogs.length);
                    })];
            case 1:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); });
